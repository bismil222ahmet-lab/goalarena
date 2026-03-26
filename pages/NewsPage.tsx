import { useEffect, useState, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/LoadingStates';
import { Newspaper, Loader2, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NewsItem } from '@/types/football';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/common/BackButton';

const PAGE_SIZE = 12;
const categories = ['All', 'Latest News', 'Transfer News', 'Player News', 'Match News', 'League News', 'Champions League'];

function NewsCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function NewsPage() {
  usePageTitle('Football News & Updates');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [seeding, setSeeding] = useState(false);

  const fetchNews = useCallback(async (offset = 0, category = 'All') => {
    let query = (supabase.from as any)('news_items')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (category !== 'All') {
      query = query.eq('category', category);
    }

    const { data } = await query;
    return data || [];
  }, []);

  // Initial load + auto-seed if empty
  useEffect(() => {
    async function init() {
      setLoading(true);
      const data = await fetchNews(0, activeCategory);
      
      if (data.length === 0 && activeCategory === 'All') {
        // Try to seed content
        setSeeding(true);
        try {
          await supabase.functions.invoke('generate-news', { body: { action: 'seed' } });
          const seededData = await fetchNews(0, 'All');
          setNews(seededData);
          setHasMore(seededData.length >= PAGE_SIZE);
        } catch (e) {
          console.error('Seed failed:', e);
        }
        setSeeding(false);
      } else {
        setNews(data);
        setHasMore(data.length >= PAGE_SIZE);
      }
      setLoading(false);
    }
    init();
  }, [activeCategory, fetchNews]);

  const loadMore = async () => {
    setLoadingMore(true);
    const data = await fetchNews(news.length, activeCategory);
    setNews(prev => [...prev, ...data]);
    setHasMore(data.length >= PAGE_SIZE);
    setLoadingMore(false);
  };

  const featured = news[0];
  const trending = news.slice(1, 4);
  const rest = news.slice(4);

  return (
    <AppLayout>
      <BackButton />
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Football News</h1>
        <p className="mt-1 text-sm text-muted-foreground">Latest football news, match reports, player updates and transfer rumours</p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setNews([]); }}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium border transition-all whitespace-nowrap',
              activeCategory === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading || seeding ? (
        <div className="space-y-6">
          {seeding && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating fresh football news...
            </div>
          )}
          {/* Featured skeleton */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="md:flex">
              <Skeleton className="md:w-1/2 aspect-video" />
              <div className="p-6 md:w-1/2 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
          {/* Grid skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
        </div>
      ) : news.length === 0 ? (
        <EmptyState icon={Newspaper} title="No news articles" description="News articles will appear here once added. Check back later for the latest football updates." />
      ) : (
        <div className="space-y-8">
          {/* Featured Article */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/news/${featured.slug}`} className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all">
                <div className="md:flex">
                   {featured.image_url ? (
                    <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                      <img src={featured.image_url} alt={featured.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                   ) : (
                    <div className="md:w-1/2 aspect-video md:aspect-auto bg-muted flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                   )}
                  <div className="p-5 md:p-8 md:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">{featured.category}</Badge>
                      <Badge variant="outline" className="border-live/30 bg-live/5 text-live">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-3">{featured.title}</h2>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{featured.summary}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium">{featured.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(featured.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Read Full Story <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Trending Section */}
          {trending.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Stories
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {trending.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/news/${item.slug}`} className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all h-full">
                      <div className="aspect-video bg-muted overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center"><Newspaper className="h-8 w-8 text-muted-foreground/30" /></div>
                        )}
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="text-[10px] mb-2">{item.category}</Badge>
                        <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Articles Grid */}
          {rest.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold mb-4">
                <Newspaper className="h-5 w-5 text-primary" />
                All Articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                    <Link to={`/news/${item.slug}`} className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all h-full">
                      <div className="aspect-video bg-muted overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center"><Newspaper className="h-8 w-8 text-muted-foreground/30" /></div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                          <span className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{item.author}</span>
                          <span className="text-xs font-medium text-primary flex items-center gap-0.5">
                            Read more <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loadingMore ? 'Loading...' : 'Load More Articles'}
              </button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
