import { Link } from 'react-router-dom';
import { Fixture } from '@/types/football';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  fixture: Fixture;
  compact?: boolean;
  inline?: boolean;
}

const LIVE_STATUSES = new Set(['1H', '2H', 'HT', 'ET', 'P', 'LIVE']);
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN']);
const SCHEDULED_STATUSES = new Set(['NS', 'TBD']);

function getKickoffTime(date: string) {
  const kickoff = new Date(date);
  const now = new Date();
  const sameDay = kickoff.toDateString() === now.toDateString();
  const time = kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return time;
  const day = kickoff.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${day} • ${time}`;
}

function getStatusMeta(status: { short: string; long: string; elapsed: number | null }, fixtureDate: string) {
  if (status.short === 'HT') {
    return { badge: 'HT', detail: 'Half Time', isLive: true, isScheduled: false, isFinished: false, isHT: true };
  }
  if (LIVE_STATUSES.has(status.short)) {
    return { badge: 'LIVE', detail: status.elapsed ? `${status.elapsed}'` : 'In Play', isLive: true, isScheduled: false, isFinished: false, isHT: false };
  }
  if (FINISHED_STATUSES.has(status.short)) {
    return { badge: status.short === 'FT' ? 'FT' : status.short, detail: 'Full Time', isLive: false, isScheduled: false, isFinished: true, isHT: false };
  }
  if (SCHEDULED_STATUSES.has(status.short)) {
    return { badge: 'NS', detail: getKickoffTime(fixtureDate), isLive: false, isScheduled: true, isFinished: false, isHT: false };
  }
  if (status.short === 'PST') {
    return { badge: 'PST', detail: 'Postponed', isLive: false, isScheduled: false, isFinished: false, isHT: false };
  }
  if (status.short === 'CANC') {
    return { badge: 'CANC', detail: 'Cancelled', isLive: false, isScheduled: false, isFinished: false, isHT: false };
  }
  return { badge: status.short, detail: status.long, isLive: false, isScheduled: false, isFinished: false, isHT: false };
}

function NeonBadge({ badge, isLive, isHT }: { badge: string; isLive: boolean; isHT: boolean }) {
  if (!isLive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
        {badge}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider overflow-hidden',
        isHT
          ? 'border border-amber-500/50 bg-amber-500/15 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
          : 'border border-red-500/50 bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
      )}
    >
      {/* Animated shine sweep */}
      <span className={cn(
        'absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shine_2s_ease-in-out_infinite]',
        isHT && 'via-white/5'
      )} />
      {/* Pulsing dot */}
      {!isHT && <span className="relative h-2 w-2 rounded-full bg-red-500 animate-pulse-live shadow-[0_0_6px_rgba(239,68,68,0.8)]" />}
      {isHT && <span className="relative h-2 w-2 rounded-full bg-amber-500" />}
      <span className="relative">{badge}</span>
    </span>
  );
}

export default function MatchCard({ fixture, compact, inline }: MatchCardProps) {
  const { teams, goals, fixture: fix, league } = fixture;
  const statusMeta = getStatusMeta(fix.status, fix.date);
  const homeDisplay = statusMeta.isScheduled ? '-' : (goals.home ?? '-');
  const awayDisplay = statusMeta.isScheduled ? '-' : (goals.away ?? '-');

  if (inline) {
    return (
      <Link
        to={`/match/${fix.id}`}
        className={cn(
          'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50',
          statusMeta.isLive && 'bg-live/5'
        )}
      >
        <div className="flex flex-col items-center w-16 flex-shrink-0 gap-1">
          <NeonBadge badge={statusMeta.badge} isLive={statusMeta.isLive} isHT={statusMeta.isHT} />
          <span className="text-[10px] tabular-nums text-muted-foreground">{statusMeta.detail}</span>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <img src={teams.home.logo} alt={teams.home.name} className="h-5 w-5 object-contain flex-shrink-0" />
            <span className={cn('text-sm truncate', teams.home.winner && 'font-bold')}>{teams.home.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={teams.away.logo} alt={teams.away.name} className="h-5 w-5 object-contain flex-shrink-0" />
            <span className={cn('text-sm truncate', teams.away.winner && 'font-bold')}>{teams.away.name}</span>
          </div>
        </div>
        <div className="flex flex-col items-center w-10 flex-shrink-0">
          <span className={cn('text-sm font-bold tabular-nums', statusMeta.isLive ? 'text-foreground' : 'text-muted-foreground')}>{homeDisplay}</span>
          <span className={cn('text-sm font-bold tabular-nums', statusMeta.isLive ? 'text-foreground' : 'text-muted-foreground')}>{awayDisplay}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/match/${fix.id}`}
      className={cn(
        'block rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30',
        statusMeta.isLive && 'border-live/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
      )}
    >
      {!compact && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={league.logo} alt={league.name} className="h-4 w-4 object-contain" />
            <span className="text-xs text-muted-foreground truncate">{league.name}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <NeonBadge badge={statusMeta.badge} isLive={statusMeta.isLive} isHT={statusMeta.isHT} />
            <span className="text-[11px] tabular-nums text-muted-foreground">{statusMeta.detail}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img src={teams.home.logo} alt={teams.home.name} className="h-6 w-6 object-contain flex-shrink-0" />
            <span className={cn('text-sm truncate', teams.home.winner && 'font-bold text-foreground')}>{teams.home.name}</span>
          </div>
          <span className={cn('text-lg font-bold tabular-nums ml-2', statusMeta.isLive ? 'text-foreground' : 'text-muted-foreground')}>{homeDisplay}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img src={teams.away.logo} alt={teams.away.name} className="h-6 w-6 object-contain flex-shrink-0" />
            <span className={cn('text-sm truncate', teams.away.winner && 'font-bold text-foreground')}>{teams.away.name}</span>
          </div>
          <span className={cn('text-lg font-bold tabular-nums ml-2', statusMeta.isLive ? 'text-foreground' : 'text-muted-foreground')}>{awayDisplay}</span>
        </div>
      </div>

      {compact && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <NeonBadge badge={statusMeta.badge} isLive={statusMeta.isLive} isHT={statusMeta.isHT} />
          <span className="text-xs text-muted-foreground tabular-nums">{statusMeta.detail}</span>
        </div>
      )}
    </Link>
  );
}
