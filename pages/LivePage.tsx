import { useState, useMemo, useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useLiveFeed } from '@/hooks/useFootballData';
import { useTranslation } from '@/hooks/useTranslation';
import MatchCard from '@/components/live/MatchCard';
import { MatchCardSkeleton, EmptyState } from '@/components/common/LoadingStates';
import AppLayout from '@/components/layout/AppLayout';
import { AlertTriangle, CalendarDays, RefreshCw, Sparkles, Trophy, Zap, Clock, CalendarCheck } from 'lucide-react';
import BackButton from '@/components/common/BackButton';
import { filterAndSortMatches } from '@/lib/match-filter';
import { Fixture } from '@/types/football';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type TabKey = 'live' | 'today' | 'tomorrow' | 'upcoming' | 'results';

type LeagueGroup = {
  key: string;
  leagueName: string;
  leagueCountry: string;
  leagueLogo: string;
  fixtures: Fixture[];
};

type DateGroup = {
  dateLabel: string;
  dateKey: string;
  leagues: LeagueGroup[];
  count: number;
};

function groupByLeague(fixtures: Fixture[]): LeagueGroup[] {
  const map = new Map<string, LeagueGroup>();
  fixtures.forEach((f) => {
    const key = `${f.league.id}-${f.league.name}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        leagueName: f.league.name,
        leagueCountry: f.league.country,
        leagueLogo: f.league.logo,
        fixtures: [],
      });
    }
    map.get(key)!.fixtures.push(f);
  });
  
  return Array.from(map.values())
    .map((g) => ({ ...g, fixtures: g.fixtures.sort((a, b) => a.fixture.timestamp - b.fixture.timestamp) }))
    .sort((a, b) => a.leagueName.localeCompare(b.leagueName));
}

function groupByDate(fixtures: Fixture[]): DateGroup[] {
  const map = new Map<string, Fixture[]>();
  fixtures.forEach((f) => {
    const dateKey = new Date(f.fixture.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(f);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, fxs]) => {
      const d = new Date(dateKey + 'T00:00:00');
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let dateLabel: string;
      if (d.toDateString() === today.toDateString()) dateLabel = 'Today';
      else if (d.toDateString() === tomorrow.toDateString()) dateLabel = 'Tomorrow';
      else if (d.toDateString() === yesterday.toDateString()) dateLabel = 'Yesterday';
      else dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      return {
        dateLabel,
        dateKey,
        leagues: groupByLeague(fxs),
        count: fxs.length,
      };
    });
}

export default function LivePage() {
  const { data, isLoading, isFetching, error } = useLiveFeed();
  const [activeTab, setActiveTab] = useState<TabKey>('live');
  const { t } = useTranslation();
  usePageTitle(t.live.title);

  const TABS: { key: TabKey; label: string; icon: typeof Zap }[] = [
    { key: 'live', label: t.live.live, icon: Zap },
    { key: 'today', label: t.live.today, icon: CalendarDays },
    { key: 'tomorrow', label: t.live.tomorrow, icon: CalendarCheck },
    { key: 'upcoming', label: t.live.upcoming, icon: Clock },
    { key: 'results', label: t.live.results, icon: Trophy },
  ];
  const rawBuckets = data?.buckets;
  const buckets = {
    all: rawBuckets?.all ?? [],
    live: rawBuckets?.live ?? [],
    upcoming: rawBuckets?.upcoming ?? [],
    finished: rawBuckets?.finished ?? [],
    tomorrow: rawBuckets?.tomorrow ?? [],
    yesterday: rawBuckets?.yesterday ?? [],
  };

  // Smart fallback: auto-switch to tab with data
  useEffect(() => {
    if (!data) return;
    if (activeTab === 'live' && buckets.live.length === 0) {
      if (buckets.upcoming.length > 0 || buckets.finished.length > 0) {
        setActiveTab('today');
      } else if (buckets.tomorrow.length > 0) {
        setActiveTab('tomorrow');
      } else if (buckets.yesterday.length > 0) {
        setActiveTab('results');
      }
    }
  }, [data, activeTab, buckets]);

  const tabFixtures = useMemo(() => {
    switch (activeTab) {
      case 'live': return buckets.live;
      case 'today': return [...buckets.live, ...buckets.upcoming, ...buckets.finished];
      case 'tomorrow': return buckets.tomorrow;
      case 'upcoming': return [...buckets.upcoming, ...buckets.tomorrow];
      case 'results': return [...buckets.finished, ...buckets.yesterday];
      default: return buckets.all;
    }
  }, [activeTab, buckets]);

  const dateGroups = useMemo(() => groupByDate(tabFixtures), [tabFixtures]);

  const tabCounts: Record<TabKey, number> = {
    live: buckets.live.length,
    today: buckets.live.length + buckets.upcoming.length + buckets.finished.length,
    tomorrow: buckets.tomorrow.length,
    upcoming: buckets.upcoming.length + buckets.tomorrow.length,
    results: buckets.finished.length + buckets.yesterday.length,
  };

  const emptyMessages: Record<TabKey, string> = {
    live: 'No live matches currently',
    today: 'No matches scheduled for today',
    tomorrow: 'No matches scheduled for tomorrow',
    upcoming: 'No upcoming matches available',
    results: 'No recent results available',
  };

  const errorMessage = error instanceof Error ? error.message : 'Live data feed is currently unavailable.';

  return (
    <AppLayout>
      <BackButton />
      <div className="mb-5 space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">Live Scores</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Real-time football matches • Auto-refresh every 60s</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <RefreshCw className={cn('h-3 w-3', isFetching && 'animate-spin text-primary')} />
            {isFetching ? 'Refreshing...' : 'Up to date'}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const count = tabCounts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', tab.key === 'live' && isActive && 'animate-pulse')} />
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {count}
                  </span>
                )}
                {tab.key === 'live' && count > 0 && (
                  <span className="h-2 w-2 rounded-full bg-live animate-pulse-live" />
                )}
              </button>
            );
          })}
        </div>

        {data?.meta.fallbackApplied && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Showing fallback fixtures (yesterday/tomorrow)
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <MatchCardSkeleton key={i} />)}
        </div>
      ) : error && tabFixtures.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="Unable to load live scores" description={errorMessage} />
      ) : tabFixtures.length === 0 ? (
        <EmptyState icon={CalendarDays} title={emptyMessages[activeTab]} description="Check back soon for updates." />
      ) : (
        <div className="space-y-5">
          {(data?.warnings?.length ?? 0) > 0 ? (
            <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
              <p>{data.warnings[0]}</p>
            </div>
          ) : null}

          {dateGroups.map((dateGroup) => (
            <div key={dateGroup.dateKey}>
              {/* Date Header */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{dateGroup.dateLabel}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{dateGroup.count}</Badge>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* League Groups */}
              <div className="space-y-4">
                {dateGroup.leagues.map((group) => (
                  <div key={`${dateGroup.dateKey}-${group.key}`} className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* League Header */}
                    <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                      {group.leagueLogo && (
                        <img src={group.leagueLogo} alt={group.leagueName} className="h-5 w-5 object-contain" />
                      )}
                      <h3 className="text-sm font-bold text-foreground">{group.leagueName}</h3>
                      <span className="text-xs text-muted-foreground">• {group.leagueCountry}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {group.fixtures.length} match{group.fixtures.length !== 1 ? 'es' : ''}
                      </span>
                    </div>

                    {/* Match List */}
                    <div className="divide-y divide-border">
                      {group.fixtures.map((fixture) => (
                        <MatchCard key={fixture.fixture.id} fixture={fixture} inline />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
