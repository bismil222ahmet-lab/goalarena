import { useParams, Link } from 'react-router-dom';
import { useStandings } from '@/hooks/useFootballData';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2, ArrowLeft, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const LEAGUE_META: Record<number, { name: string; flag: string }> = {
  39: { name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  140: { name: 'La Liga', flag: '🇪🇸' },
  78: { name: 'Bundesliga', flag: '🇩🇪' },
  135: { name: 'Serie A', flag: '🇮🇹' },
  61: { name: 'Ligue 1', flag: '🇫🇷' },
  2: { name: 'Champions League', flag: '🇪🇺' },
  3: { name: 'Europa League', flag: '🇪🇺' },
  848: { name: 'Conference League', flag: '🇪🇺' },
  94: { name: 'Primeira Liga', flag: '🇵🇹' },
  88: { name: 'Eredivisie', flag: '🇳🇱' },
  253: { name: 'MLS', flag: '🇺🇸' },
  307: { name: 'Saudi Pro League', flag: '🇸🇦' },
};

export default function LeagueDetailPage() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const id = Number(leagueId);
  const { data, isLoading, isError } = useStandings(id);
  const meta = LEAGUE_META[id];

  const standings = data?.standings || [];
  const season = data?.season;
  const leagueName = data?.leagueName || meta?.name || 'League';

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <Link to="/leagues" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" /> All Leagues
        </Link>
        <div className="flex items-center gap-3">
          {meta?.flag && <span className="text-3xl">{meta.flag}</span>}
          <div>
            <h1 className="font-display text-2xl font-bold">{leagueName}</h1>
            {season && <p className="text-sm text-muted-foreground">Season {season}/{season + 1}</p>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError || standings.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-10 text-center">
          <Trophy className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="font-semibold text-foreground">Standings not available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Standings data for this league is currently unavailable. This may be due to the API plan or season availability.
          </p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground w-8">#</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Team</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">P</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">W</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">D</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">L</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground hidden sm:table-cell">GF</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground hidden sm:table-cell">GA</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">GD</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s: any, i: number) => (
                  <motion.tr
                    key={s.team.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-xs text-muted-foreground font-medium">{s.rank}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img src={s.team.logo} alt={s.team.name} className="h-5 w-5 object-contain" loading="lazy" />
                        <span className="font-medium text-foreground truncate max-w-[180px]">{s.team.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{s.all.played}</td>
                    <td className="px-3 py-2.5 text-center font-medium text-green-500">{s.all.win}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">{s.all.draw}</td>
                    <td className="px-3 py-2.5 text-center text-red-400">{s.all.lose}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{s.all.goals.for}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{s.all.goals.against}</td>
                    <td className={cn('px-3 py-2.5 text-center font-medium', s.goalsDiff > 0 ? 'text-green-500' : s.goalsDiff < 0 ? 'text-red-400' : 'text-muted-foreground')}>
                      {s.goalsDiff > 0 ? `+${s.goalsDiff}` : s.goalsDiff}
                    </td>
                    <td className="px-3 py-2.5 text-center font-bold text-primary">{s.points}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AppLayout>
  );
}
