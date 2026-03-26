import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Newspaper, ArrowRightLeft, Play, Trophy, ChevronRight, BarChart3 } from 'lucide-react';
import { useTodayFixtures } from '@/hooks/useFootballData';
import MatchCard from '@/components/live/MatchCard';
import { MatchCardSkeleton } from '@/components/common/LoadingStates';
import AppLayout from '@/components/layout/AppLayout';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useHomepageHighlights } from '@/hooks/useHighlights';
import VideoCard from '@/components/highlights/VideoCard';
import VideoModal from '@/components/highlights/VideoModal';
import { VideoCardSkeleton } from '@/components/highlights/HighlightsSkeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';
import AdBanner from '@/components/ads/AdBanner';
import ContainerAd from '@/components/ads/ContainerAd';
import { filterAndSortMatches } from '@/lib/match-filter';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const leagues = [
  { name: 'Premier League', id: 39, countryCode: 'gb-eng' },
  { name: 'La Liga', id: 140, countryCode: 'es' },
  { name: 'Bundesliga', id: 78, countryCode: 'de' },
  { name: 'Serie A', id: 135, countryCode: 'it' },
  { name: 'Ligue 1', id: 61, countryCode: 'fr' },
  { name: 'Champions League', id: 2, countryCode: 'eu' },
  { name: 'Saudi Pro League', id: 307, countryCode: 'sa' },
  { name: 'MLS', id: 253, countryCode: 'us' },
];

const NEON_BUTTONS = [
  { icon: Zap, label: 'live', path: '/live', gradient: 'from-emerald-500 to-green-400', shadow: 'shadow-emerald-500/30' },
  { icon: Newspaper, label: 'news', path: '/news', gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/30' },
  { icon: ArrowRightLeft, label: 'transfers', path: '/transfers', gradient: 'from-purple-500 to-violet-400', shadow: 'shadow-purple-500/30' },
  { icon: Play, label: 'highlights', path: '/highlights', gradient: 'from-red-500 to-orange-400', shadow: 'shadow-red-500/30' },
  { icon: Trophy, label: 'leagues', path: '/leagues', gradient: 'from-amber-500 to-yellow-400', shadow: 'shadow-amber-500/30' },
];

const STATS = [
  { value: '1,247', label: 'Live Matches', color: 'text-emerald-400' },
  { value: '52', label: 'Leagues', color: 'text-blue-400' },
  { value: '500+', label: 'Teams', color: 'text-purple-400' },
  { value: '10K+', label: 'Goals', color: 'text-red-400' },
  { value: '2M+', label: 'Users', color: 'text-amber-400' },
];

export default function HomePage() {
  const { data: fixtures, isLoading } = useTodayFixtures();
  const { data: highlights = [], isLoading: highlightsLoading } = useHomepageHighlights();
  const [news, setNews] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [modalVideo, setModalVideo] = useState<{ id: string; title: string } | null>(null);
  const { t } = useTranslation();
  usePageTitle('Live Football Scores, Results & News');

  const handlePlay = useCallback((id: string, title: string) => {
    setModalVideo({ id, title });
  }, []);

  useEffect(() => {
    Promise.all([
      (supabase.from as any)('news_items').select('*').order('created_at', { ascending: false }).limit(4),
      (supabase.from as any)('transfers').select('*').order('created_at', { ascending: false }).limit(4),
    ]).then(([n, tr]: any) => {
      setNews(n.data || []);
      setTransfers(tr.data || []);
    });
  }, []);

  const allFiltered = fixtures ? filterAndSortMatches(fixtures) : [];
  const liveMatches = allFiltered.filter(f =>
    ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(f.fixture.status.short)
  );
  const todayMatches = allFiltered.slice(0, 6);

  return (
    <AppLayout>
      {/* Hero */}
      <motion.section {...fadeUp} className="mb-8">
        <div className="relative rounded-2xl overflow-hidden">
          <img src="/images/hero-stadium.jpg" alt="Football stadium" className="absolute inset-0 w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          <div className="relative z-10 p-6 md:p-10 lg:p-14">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="GoalArena" className="h-10 w-10 rounded-lg object-contain" />
              <span className="font-display text-xl font-bold tracking-tight text-white">GoalArena</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">Live Football Scores,</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Fixtures &amp; Results</span>
            </h1>
            <p className="text-white/80 max-w-xl mb-6 text-sm md:text-base leading-relaxed">
              Stay up-to-date with real-time scores, fixtures, results, and the latest football news from top leagues worldwide.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {NEON_BUTTONS.map(({ icon: Icon, label, path, gradient, shadow }) => (
                <Link key={path} to={path} className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-4 py-2 text-sm font-semibold text-white shadow-lg ${shadow} hover:scale-105 hover:shadow-xl transition-all duration-200`}>
                  <Icon className="h-4 w-4" />
                  {(t.nav as any)[label] || label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Live Now */}
      {liveMatches.length > 0 && (
        <motion.section {...fadeUp} className="mb-8">
          <SectionHeader title={t.home.liveMatches} icon={<span className="h-2 w-2 rounded-full bg-live animate-pulse-live" />} linkTo="/live" viewAllLabel={t.home.viewAll} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.slice(0, 6).map(f => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Ad: Desktop leaderboard / Mobile banner */}
      <div className="my-6">
        <AdBanner adKey="4d4dff23c4dbbc5e8a66916db4d02598" width={728} height={90} className="hidden md:flex" />
        <AdBanner adKey="2bdab1e77b9fa17a5e9358d7e2094c47" width={320} height={50} className="flex md:hidden" />
      </div>

      {/* Today's Matches */}
      <motion.section {...fadeUp} className="mb-8">
        <SectionHeader title={t.home.todayMatches} linkTo="/live" viewAllLabel={t.home.viewAll} />
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        ) : todayMatches.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayMatches.map(f => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Zap className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">{t.home.noMatches}</p>
            <Link to="/leagues" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
              {t.home.popularLeagues} <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </motion.section>

      {/* Top Leagues */}
      <motion.section {...fadeUp} className="mb-8">
        <SectionHeader title={t.home.popularLeagues} linkTo="/leagues" viewAllLabel={t.home.viewAll} />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          {leagues.map(league => (
            <Link key={league.id} to={`/leagues/${league.id}`} className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all group">
              <img src={`https://flagcdn.com/w80/${league.countryCode}.png`} alt={league.name} className="w-8 h-5 rounded object-cover mx-auto shadow-sm" loading="lazy" />
              <p className="mt-2 text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">{league.name}</p>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section {...fadeUp} className="mb-8">
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Stats Overview</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className={`font-display text-2xl md:text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Profitablegatenetwork container ad */}
      <div className="my-6">
        <ContainerAd
          scriptSrc="https://pl28974280.profitablecpmratenetwork.com/0736232a04b2301c8548d9341137bbaa/invoke.js"
          containerId="container-0736232a04b2301c8548d9341137bbaa"
        />
      </div>

      {/* Ad: Medium rectangle */}
      <div className="mb-8">
        <AdBanner adKey="85a996282e463840370f89b6db1fbbd4" width={300} height={250} />
      </div>

      {/* Latest News */}
      {news.length > 0 && (
        <motion.section {...fadeUp} className="mb-8">
          <SectionHeader title={t.home.featuredNews} linkTo="/news" viewAllLabel={t.home.viewAll} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`} className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
                <div className="aspect-video bg-muted overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <Newspaper className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-3.5 flex flex-col flex-1">
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">{item.category}</span>
                  <h3 className="mt-1 font-display font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* Transfers */}
      {transfers.length > 0 && (
        <motion.section {...fadeUp} className="mb-8">
          <SectionHeader title={t.home.latestTransfers} linkTo="/transfers" viewAllLabel={t.home.viewAll} />
          <div className="grid gap-3 sm:grid-cols-2">
            {transfers.map(tr => (
              <div key={tr.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
                {tr.player_image && <img src={tr.player_image} alt={tr.player_name} className="h-10 w-10 rounded-full object-cover bg-muted" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{tr.player_name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="truncate">{tr.from_club}</span>
                    <ArrowRightLeft className="h-3 w-3 flex-shrink-0 text-primary" />
                    <span className="truncate">{tr.to_club}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-foreground">{tr.fee}</p>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                    tr.status === 'completed' ? 'text-primary' : tr.status === 'rumor' ? 'text-warning' : 'text-foreground'
                  }`}>{tr.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Highlights */}
      <motion.section {...fadeUp} className="mb-8">
        <SectionHeader title={t.home.topHighlights} linkTo="/highlights" viewAllLabel={t.home.viewAll} />
        {highlightsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={i} />)}
          </div>
        ) : highlights.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((v, i) => (
              <VideoCard key={v.id} id={v.id} title={v.title} thumbnail={v.thumbnail} channel={v.channel} index={i} onPlay={handlePlay} />
            ))}
          </div>
        ) : null}
      </motion.section>

      {/* Bottom ads */}
      <div className="my-6">
        <ContainerAd
          scriptSrc="https://pl28978213.profitablecpmratenetwork.com/bb6e81d8219c2df7aba65c28fa85bfe4/invoke.js"
          containerId="container-bb6e81d8219c2df7aba65c28fa85bfe4"
        />
      </div>
      <div className="mb-8">
        <AdBanner adKey="c1476356fdec099a6d3b914d8abf211d" width={468} height={60} className="hidden sm:flex" />
        <AdBanner adKey="7f37a003a8dd948ef3fcf956e1a6599e" width={320} height={50} className="flex sm:hidden" />
      </div>

      <VideoModal videoId={modalVideo?.id ?? null} title={modalVideo?.title} onClose={() => setModalVideo(null)} />
    </AppLayout>
  );
}

function SectionHeader({ title, linkTo, icon, viewAllLabel = 'View all' }: { title: string; linkTo: string; icon?: React.ReactNode; viewAllLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display text-lg font-bold flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <Link to={linkTo} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        {viewAllLabel} <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
