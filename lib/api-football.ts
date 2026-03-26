import { supabase } from '@/integrations/supabase/client';
import { Fixture } from '@/types/football';

type FootballApiResponse<T> = {
  response?: T;
  errors?: Record<string, string>;
  message?: string;
  results?: number;
  meta?: Record<string, unknown>;
};

type LiveFeedBuckets = {
  all?: Fixture[];
  live?: Fixture[];
  upcoming?: Fixture[];
  finished?: Fixture[];
  tomorrow?: Fixture[];
  yesterday?: Fixture[];
};

export type LiveFeedData = {
  buckets: {
    all: Fixture[];
    live: Fixture[];
    upcoming: Fixture[];
    finished: Fixture[];
    tomorrow: Fixture[];
    yesterday: Fixture[];
  };
  meta: {
    refreshedAt: string | null;
    cacheTtlSeconds: number;
    fallbackApplied: boolean;
    sources: Record<string, string>;
  };
  warnings: string[];
};

async function callEdgeFunction<T>(name: string, params: Record<string, unknown> = {}): Promise<FootballApiResponse<T>> {
  const { data, error } = await supabase.functions.invoke(name, {
    body: params,
  });

  if (error) {
    throw new Error(error.message || 'Unable to reach football data service.');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response from football data service.');
  }

  const parsed = data as FootballApiResponse<T>;

  // Surface provider errors clearly when no usable payload is returned.
  if (parsed.errors && Object.keys(parsed.errors).length > 0) {
    const hasResponse = Array.isArray(parsed.response)
      ? parsed.response.length > 0
      : parsed.response !== undefined && parsed.response !== null;

    if (!hasResponse) {
      throw new Error(Object.values(parsed.errors).join(', '));
    }

    console.warn('Football data provider returned warnings:', parsed.errors);
  }

  return parsed;
}

function getArrayResponse<T>(data: FootballApiResponse<T[]>, _fallbackMessage: string): T[] {
  if (!Array.isArray(data.response)) {
    return [];
  }
  return data.response;
}

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toFixtureArray(data: unknown): Fixture[] {
  return Array.isArray(data) ? data as Fixture[] : [];
}

function toSourcesMap(input: unknown): Record<string, string> {
  if (!input || typeof input !== 'object') return {};

  const entries = Object.entries(input as Record<string, unknown>)
    .filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => [key, String(value)]);

  return Object.fromEntries(entries);
}

function parseLiveFeedMeta(meta: FootballApiResponse<LiveFeedBuckets>['meta']): LiveFeedData['meta'] {
  const refreshedAt = typeof meta?.refreshedAt === 'string' ? meta.refreshedAt : null;
  const cacheTtlSeconds = typeof meta?.cacheTtlSeconds === 'number' ? meta.cacheTtlSeconds : 60;
  const fallbackApplied = Boolean(meta?.fallbackApplied);
  const sources = toSourcesMap(meta?.sources);

  return {
    refreshedAt,
    cacheTtlSeconds,
    fallbackApplied,
    sources,
  };
}

export async function fetchLiveScores(): Promise<Fixture[]> {
  const data = await callEdgeFunction<Fixture[]>('football-api', {
    endpoint: 'fixtures',
    params: { live: 'all' },
  });
  return getArrayResponse(data, 'Failed to load live fixtures.');
}

export async function fetchTodayFixtures(): Promise<Fixture[]> {
  const data = await callEdgeFunction<Fixture[]>('football-api', {
    endpoint: 'fixtures',
    params: { date: 'today' },
  });
  return getArrayResponse(data, 'Failed to load today fixtures.');
}

export async function fetchLiveFeed(): Promise<LiveFeedData> {
  const data = await callEdgeFunction<LiveFeedBuckets>('football-api', {
    endpoint: 'fixtures/live-feed',
  });

  const response = data.response ?? {};
  const buckets = {
    all: toFixtureArray(response.all),
    live: toFixtureArray(response.live),
    upcoming: toFixtureArray(response.upcoming),
    finished: toFixtureArray(response.finished),
    tomorrow: toFixtureArray(response.tomorrow),
    yesterday: toFixtureArray(response.yesterday),
  };

  const warnings = data.errors ? Object.values(data.errors) : [];

  // If provider reports an error and no fixtures were returned (even after backend fallback),
  // expose a clear error instead of showing a misleading empty state.
  if (warnings.length > 0 && buckets.all.length === 0) {
    throw new Error(warnings[0]);
  }

  return {
    buckets,
    meta: parseLiveFeedMeta(data.meta),
    warnings,
  };
}

export async function fetchFixtureDetails(fixtureId: number): Promise<Fixture | null> {
  const data = await callEdgeFunction<Fixture[]>('football-api', {
    endpoint: 'fixtures',
    params: { id: fixtureId.toString() },
  });
  return getArrayResponse(data, 'Failed to load match details.')[0] || null;
}

export async function fetchFixtureEvents(fixtureId: number) {
  const data = await callEdgeFunction<any[]>('football-api', {
    endpoint: 'fixtures/events',
    params: { fixture: fixtureId.toString() },
  });
  return getArrayResponse(data, 'Failed to load match events.');
}

export async function fetchFixtureLineups(fixtureId: number) {
  const data = await callEdgeFunction<any[]>('football-api', {
    endpoint: 'fixtures/lineups',
    params: { fixture: fixtureId.toString() },
  });
  return getArrayResponse(data, 'Failed to load lineups.');
}

export async function fetchFixtureStats(fixtureId: number) {
  const data = await callEdgeFunction<any[]>('football-api', {
    endpoint: 'fixtures/statistics',
    params: { fixture: fixtureId.toString() },
  });
  return getArrayResponse(data, 'Failed to load match statistics.');
}

export async function fetchStandings(leagueId: number, season?: number) {
  // Try requested season first, then fall back through recent seasons
  const currentYear = new Date().getFullYear();
  const seasonsToTry = season
    ? [season]
    : [currentYear, currentYear - 1, currentYear - 2];

  for (const s of seasonsToTry) {
    try {
      const data = await callEdgeFunction<any[]>('football-api', {
        endpoint: 'standings',
        params: { league: leagueId.toString(), season: s.toString() },
      });
      const response = getArrayResponse(data, 'Failed to load standings.');
      const standings = response[0]?.league?.standings?.[0];
      if (standings && standings.length > 0) {
        return { standings, season: s, leagueName: response[0]?.league?.name || '' };
      }
    } catch {
      // Try next season
    }
  }
  return { standings: [], season: currentYear, leagueName: '' };
}

export async function fetchLeagues() {
  const data = await callEdgeFunction<any[]>('football-api', {
    endpoint: 'leagues',
    params: { current: 'true' },
  });
  return getArrayResponse(data, 'Failed to load leagues.');
}

export async function fetchH2H(team1: number, team2: number) {
  const data = await callEdgeFunction<any[]>('football-api', {
    endpoint: 'fixtures/headtohead',
    params: { h2h: `${team1}-${team2}`, last: '5' },
  });
  return getArrayResponse(data, 'Failed to load head-to-head fixtures.');
}