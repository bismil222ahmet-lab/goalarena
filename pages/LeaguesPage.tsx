import { Link } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import BackButton from '@/components/common/BackButton';

const leagues = [
  { id: 39, name: 'Premier League', country: 'England', countryCode: 'gb-eng', teams: 20 },
  { id: 140, name: 'La Liga', country: 'Spain', countryCode: 'es', teams: 20 },
  { id: 78, name: 'Bundesliga', country: 'Germany', countryCode: 'de', teams: 18 },
  { id: 135, name: 'Serie A', country: 'Italy', countryCode: 'it', teams: 20 },
  { id: 61, name: 'Ligue 1', country: 'France', countryCode: 'fr', teams: 18 },
  { id: 2, name: 'Champions League', country: 'Europe', countryCode: 'eu', teams: 36 },
  { id: 3, name: 'Europa League', country: 'Europe', countryCode: 'eu', teams: 36 },
  { id: 848, name: 'Conference League', country: 'Europe', countryCode: 'eu', teams: 32 },
  { id: 94, name: 'Primeira Liga', country: 'Portugal', countryCode: 'pt', teams: 18 },
  { id: 88, name: 'Eredivisie', country: 'Netherlands', countryCode: 'nl', teams: 18 },
  { id: 253, name: 'MLS', country: 'USA', countryCode: 'us', teams: 29 },
  { id: 307, name: 'Saudi Pro League', country: 'Saudi Arabia', countryCode: 'sa', teams: 18 },
];

export default function LeaguesPage() {
  usePageTitle('Football Leagues & Standings');
  return (
    <AppLayout>
      <BackButton />
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Leagues & Competitions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse standings and fixtures for top football leagues worldwide</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league, i) => (
          <motion.div key={league.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link
              to={`/leagues/${league.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
            >
              <img
                src={`https://flagcdn.com/w80/${league.countryCode}.png`}
                alt={`${league.country} flag`}
                className="w-10 h-7 rounded object-cover shadow-sm flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-foreground group-hover:text-primary transition-colors truncate">{league.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{league.country} · {league.teams} teams</p>
              </div>
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
