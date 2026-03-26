import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFixtureDetails, useFixtureEvents, useFixtureLineups, useFixtureStats, useH2H } from '@/hooks/useFootballData';
import AppLayout from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/LoadingStates';
import { cn } from '@/lib/utils';
import { Loader2, Clock, MapPin, User, Tv } from 'lucide-react';
import MatchCard from '@/components/live/MatchCard';

type Tab = 'overview' | 'events' | 'lineups' | 'stats' | 'h2h' | 'watch';

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const fixtureId = Number(id);
  const [tab, setTab] = useState<Tab>('overview');

  const { data: fixture, isLoading } = useFixtureDetails(fixtureId);
  const { data: events } = useFixtureEvents(fixtureId);
  const { data: lineups } = useFixtureLineups(fixtureId);
  const { data: stats } = useFixtureStats(fixtureId);

  const team1 = fixture?.teams?.home?.id || 0;
  const team2 = fixture?.teams?.away?.id || 0;
  const { data: h2h } = useH2H(team1, team2);

  if (isLoading) {
    return <AppLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppLayout>;
  }

  if (!fixture) {
    return <AppLayout><EmptyState icon={Clock} title="Match not found" description="This match could not be loaded." /></AppLayout>;
  }

  const { teams, goals, fixture: fix, league } = fixture;
  const live = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(fix.status.short);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'events', label: 'Events' },
    { key: 'lineups', label: 'Lineups' },
    { key: 'stats', label: 'Stats' },
    { key: 'h2h', label: 'H2H' },
    { key: 'watch', label: 'Watch' },
  ];

  return (
    <AppLayout>
      {/* Match Header */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <img src={league.logo} alt={league.name} className="h-4 w-4" />
          <span>{league.name} • {league.round}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={teams.home.logo} alt={teams.home.name} className="h-14 w-14 object-contain" />
            <span className="text-sm font-semibold text-center text-foreground">{teams.home.name}</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-3 font-display text-4xl font-bold text-foreground">
              <span>{goals.home ?? '-'}</span>
              <span className="text-muted-foreground text-2xl">:</span>
              <span>{goals.away ?? '-'}</span>
            </div>
            <span className={cn('text-xs font-medium', live ? 'text-live' : 'text-muted-foreground')}>
              {live && <span className="inline-block h-1.5 w-1.5 rounded-full bg-live animate-pulse-live mr-1" />}
              {fix.status.long} {fix.status.elapsed ? `${fix.status.elapsed}'` : ''}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <img src={teams.away.logo} alt={teams.away.name} className="h-14 w-14 object-contain" />
            <span className="text-sm font-semibold text-center text-foreground">{teams.away.name}</span>
          </div>
        </div>
        {fix.venue && (
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{fix.venue.name}</span>
            {fix.referee && <span className="flex items-center gap-1"><User className="h-3 w-3" />{fix.referee}</span>}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-display font-semibold mb-3">Match Info</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Competition</span><span>{league.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Round</span><span>{league.round}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{new Date(fix.date).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{new Date(fix.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              {fix.venue && <div className="flex justify-between"><span className="text-muted-foreground">Venue</span><span>{fix.venue.name}</span></div>}
              {fix.referee && <div className="flex justify-between"><span className="text-muted-foreground">Referee</span><span>{fix.referee}</span></div>}
            </div>
          </div>
          {events && events.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-display font-semibold mb-3">Key Events</h3>
              <EventsList events={events.filter((e: any) => e.type === 'Goal')} />
            </div>
          )}
        </div>
      )}

      {tab === 'events' && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-display font-semibold mb-3">All Events</h3>
          {events && events.length > 0 ? <EventsList events={events} /> : <p className="text-sm text-muted-foreground">No events recorded yet.</p>}
        </div>
      )}

      {tab === 'lineups' && (
        <div className="grid gap-4 md:grid-cols-2">
          {lineups && lineups.length > 0 ? lineups.map((lineup: any) => (
            <div key={lineup.team.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <img src={lineup.team.logo} alt="" className="h-5 w-5" />
                <h3 className="font-display font-semibold">{lineup.team.name}</h3>
                <span className="text-xs text-muted-foreground">({lineup.formation})</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Coach: {lineup.coach?.name || 'N/A'}</p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Starting XI</p>
                {lineup.startXI?.map((p: any) => (
                  <div key={p.player.id} className="flex items-center gap-2 text-sm">
                    <span className="text-xs text-muted-foreground w-6 text-right">{p.player.number}</span>
                    <span>{p.player.name}</span>
                    <span className="text-xs text-muted-foreground">{p.player.pos}</span>
                  </div>
                ))}
                <p className="text-xs font-semibold text-muted-foreground uppercase mt-3">Substitutes</p>
                {lineup.substitutes?.map((p: any) => (
                  <div key={p.player.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-xs w-6 text-right">{p.player.number}</span>
                    <span>{p.player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">Lineups not available yet.</p>}
        </div>
      )}

      {tab === 'stats' && (
        <div className="rounded-xl border border-border bg-card p-4">
          {stats && stats.length === 2 ? (
            <div className="space-y-3">
              {stats[0].statistics?.map((stat: any, i: number) => {
                const val1 = stat.value ?? 0;
                const val2 = stats[1].statistics?.[i]?.value ?? 0;
                const n1 = typeof val1 === 'string' ? parseFloat(val1) || 0 : val1;
                const n2 = typeof val2 === 'string' ? parseFloat(val2) || 0 : val2;
                const total = n1 + n2 || 1;
                return (
                  <div key={stat.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{val1}</span>
                      <span className="text-muted-foreground text-xs">{stat.type}</span>
                      <span className="font-medium">{val2}</span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                      <div className="rounded-full bg-primary" style={{ width: `${(n1 / total) * 100}%` }} />
                      <div className="rounded-full bg-muted-foreground/30" style={{ width: `${(n2 / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-muted-foreground">Statistics not available yet.</p>}
        </div>
      )}

      {tab === 'h2h' && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold">Head to Head</h3>
          {h2h && h2h.length > 0 ? (
            <div className="grid gap-3">
              {h2h.map((f: any) => <MatchCard key={f.fixture.id} fixture={f} />)}
            </div>
          ) : <p className="text-sm text-muted-foreground">No head-to-head data available.</p>}
        </div>
      )}

      {tab === 'watch' && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Tv className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-display font-semibold text-foreground mb-2">Watch</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No live stream is currently available for this match. Check back closer to kickoff or visit the Highlights section for replays.
          </p>
        </div>
      )}
    </AppLayout>
  );
}

function EventsList({ events }: { events: any[] }) {
  const icons: Record<string, string> = { Goal: '⚽', Card: '🟨', subst: '🔄', Var: '📺' };
  return (
    <div className="space-y-2">
      {events.map((e: any, i: number) => (
        <div key={i} className="flex items-start gap-3 text-sm">
          <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{e.time.elapsed}'</span>
          <span>{e.detail === 'Yellow Card' ? '🟨' : e.detail === 'Red Card' ? '🟥' : icons[e.type] || '•'}</span>
          <div>
            <span className="font-medium">{e.player?.name}</span>
            {e.assist?.name && <span className="text-muted-foreground"> (assist: {e.assist.name})</span>}
            <span className="block text-xs text-muted-foreground">{e.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
