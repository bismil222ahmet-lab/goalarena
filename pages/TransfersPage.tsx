import { useEffect, useMemo, useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/LoadingStates';
import { ArrowRightLeft, Loader2, TrendingUp, Clock, CheckCircle, AlertCircle, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { playClick } from '@/hooks/useClickSound';
import TransferDetailModal from '@/components/transfers/TransferDetailModal';
import type { TransferItem } from '@/types/football';
import BackButton from '@/components/common/BackButton';

const FILTERS = [
  { key: 'all', label: 'All', icon: ArrowRightLeft },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
  { key: 'official', label: 'Official', icon: TrendingUp },
  { key: 'rumor', label: 'Rumours', icon: AlertCircle },
];

const PAGE_SIZE = 20;

function TransferSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="space-y-2 text-right flex-shrink-0">
        <Skeleton className="h-4 w-14 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}

export default function TransfersPage() {
  usePageTitle('Football Transfer News & Rumours');
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferItem | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase.from as any)('transfers').select('*').order('created_at', { ascending: false });
      setTransfers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? transfers : transfers.filter(t => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.player_name.toLowerCase().includes(q) ||
        t.from_club.toLowerCase().includes(q) ||
        t.to_club.toLowerCase().includes(q)
      );
    }
    return list;
  }, [transfers, filter, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const statusConfig: Record<string, { color: string; label: string }> = {
    completed: { color: 'bg-primary/10 text-primary border-primary/20', label: 'Done' },
    official: { color: 'bg-accent/20 text-accent-foreground border-accent/30', label: 'Official' },
    rumor: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', label: 'Rumour' },
  };

  return (
    <AppLayout>
      <BackButton />
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold">Transfer Centre</h1>
        <p className="mt-1 text-sm text-muted-foreground">Latest football transfers, confirmed deals, and rumours</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
          placeholder="Search player, club..."
          className="pl-9 pr-9 h-10 rounded-xl bg-card border-border"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => {
          const Icon = f.icon;
          const isActive = filter === f.key;
          const count = f.key === 'all' ? transfers.length : transfers.filter(t => t.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => { playClick(); setFilter(f.key); setVisibleCount(PAGE_SIZE); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium border transition-all whitespace-nowrap',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
              {count > 0 && (
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                  isActive ? 'bg-primary-foreground/20' : 'bg-muted'
                )}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <TransferSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ArrowRightLeft} title="No transfers found" description={search ? 'Try a different search term.' : 'Transfer news will appear here.'} />
      ) : (
        <>
          <div className="space-y-2.5">
            {visible.map((t, i) => {
              const config = statusConfig[t.status] || { color: 'bg-muted text-muted-foreground border-border', label: t.status };
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.2) }}>
                  <button
                    onClick={() => { playClick(); setSelectedTransfer(t); }}
                    className="w-full text-left rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all active:scale-[0.99]"
                  >
                    {/* Player */}
                    <div className="flex-shrink-0">
                      {t.player_image ? (
                        <img src={t.player_image} alt={t.player_name} className="h-11 w-11 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-border" />
                      ) : (
                        <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-base sm:text-lg">
                          {t.player_name[0]}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-foreground text-sm sm:text-base truncate">{t.player_name}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <div className="flex items-center gap-1 min-w-0">
                          {t.from_club_logo && <img src={t.from_club_logo} alt="" className="h-3.5 w-3.5 object-contain flex-shrink-0" />}
                          <span className="text-xs text-muted-foreground truncate max-w-[70px] sm:max-w-[120px]">{t.from_club}</span>
                        </div>
                        <ArrowRightLeft className="h-3 w-3 text-primary flex-shrink-0" />
                        <div className="flex items-center gap-1 min-w-0">
                          {t.to_club_logo && <img src={t.to_club_logo} alt="" className="h-3.5 w-3.5 object-contain flex-shrink-0" />}
                          <span className="text-xs text-foreground font-medium truncate max-w-[70px] sm:max-w-[120px]">{t.to_club}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(t.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Fee & Status */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-foreground">{t.fee || '—'}</p>
                      <Badge variant="outline" className={cn('mt-1 text-[9px] sm:text-[10px]', config.color)}>
                        {config.label}
                      </Badge>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => { playClick(); setVisibleCount(c => c + PAGE_SIZE); }}
                className="rounded-full px-6"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      <TransferDetailModal
        transfer={selectedTransfer}
        open={!!selectedTransfer}
        onOpenChange={(open) => { if (!open) setSelectedTransfer(null); }}
      />
    </AppLayout>
  );
}
