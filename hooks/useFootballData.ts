import { useQuery } from '@tanstack/react-query';
import { fetchLiveScores, fetchTodayFixtures, fetchFixtureDetails, fetchFixtureEvents, fetchFixtureLineups, fetchFixtureStats, fetchStandings, fetchLeagues, fetchH2H, fetchLiveFeed } from '@/lib/api-football';

// ── Tiered polling & stale times (match backend cache TTLs) ──

export function useLiveScores() {
  return useQuery({
    queryKey: ['live-scores'],
    queryFn: fetchLiveScores,
    refetchInterval: 60_000,
    staleTime: 55_000,
    gcTime: 120_000,
    refetchOnWindowFocus: false,
  });
}

export function useTodayFixtures() {
  return useQuery({
    queryKey: ['today-fixtures'],
    queryFn: fetchTodayFixtures,
    refetchInterval: 60_000,
    staleTime: 55_000,
    gcTime: 120_000,
    refetchOnWindowFocus: false,
  });
}

export function useLiveFeed() {
  return useQuery({
    queryKey: ['live-feed'],
    queryFn: fetchLiveFeed,
    refetchInterval: 60_000,
    staleTime: 55_000,
    gcTime: 300_000,
    refetchOnWindowFocus: false,
  });
}

export function useFixtureDetails(fixtureId: number) {
  return useQuery({
    queryKey: ['fixture', fixtureId],
    queryFn: () => fetchFixtureDetails(fixtureId),
    refetchInterval: 60_000,       // 60s during viewing
    staleTime: 55_000,
    gcTime: 300_000,
    enabled: !!fixtureId,
    refetchOnWindowFocus: false,
  });
}

export function useFixtureEvents(fixtureId: number) {
  return useQuery({
    queryKey: ['fixture-events', fixtureId],
    queryFn: () => fetchFixtureEvents(fixtureId),
    refetchInterval: 60_000,
    staleTime: 55_000,
    enabled: !!fixtureId,
    refetchOnWindowFocus: false,
  });
}

export function useFixtureLineups(fixtureId: number) {
  return useQuery({
    queryKey: ['fixture-lineups', fixtureId],
    queryFn: () => fetchFixtureLineups(fixtureId),
    staleTime: 300_000,            // Lineups rarely change – 5 min
    gcTime: 600_000,
    enabled: !!fixtureId,
    refetchOnWindowFocus: false,
  });
}

export function useFixtureStats(fixtureId: number) {
  return useQuery({
    queryKey: ['fixture-stats', fixtureId],
    queryFn: () => fetchFixtureStats(fixtureId),
    refetchInterval: 60_000,
    staleTime: 55_000,
    enabled: !!fixtureId,
    refetchOnWindowFocus: false,
  });
}

export function useStandings(leagueId: number, season?: number) {
  return useQuery({
    queryKey: ['standings', leagueId, season],
    queryFn: () => fetchStandings(leagueId, season),
    staleTime: 1_800_000,
    gcTime: 3_600_000,
    enabled: !!leagueId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues,
    staleTime: 3_600_000,          // 60 min – leagues almost never change
    gcTime: 7_200_000,
    refetchOnWindowFocus: false,
  });
}

export function useH2H(team1: number, team2: number) {
  return useQuery({
    queryKey: ['h2h', team1, team2],
    queryFn: () => fetchH2H(team1, team2),
    staleTime: 1_800_000,          // 30 min – historical data
    gcTime: 3_600_000,
    enabled: !!team1 && !!team2,
    refetchOnWindowFocus: false,
  });
}
