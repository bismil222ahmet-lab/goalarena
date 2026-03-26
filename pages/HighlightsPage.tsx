import { useState, useCallback } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppLayout from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/LoadingStates';
import { Play, Search, Video, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import VideoModal from '@/components/highlights/VideoModal';
import VideoCard from '@/components/highlights/VideoCard';
import FeaturedVideo from '@/components/highlights/FeaturedVideo';
import { FeaturedSkeleton, HighlightsGridSkeleton } from '@/components/highlights/HighlightsSkeleton';
import { useHighlights, useHighlightSearch } from '@/hooks/useHighlights';
import BackButton from '@/components/common/BackButton';

const CATEGORIES = [
  { key: 'all', label: '🔥 Today' },
  { key: 'premier-league', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { key: 'champions-league', label: '🇪🇺 Champions League' },
  { key: 'la-liga', label: '🇪🇸 La Liga' },
  { key: 'serie-a', label: '🇮🇹 Serie A' },
  { key: 'bundesliga', label: '🇩🇪 Bundesliga' },
];

export default function HighlightsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [modalVideo, setModalVideo] = useState<{ id: string; title: string } | null>(null);

  const { data: videos = [], isLoading, refetch } = useHighlights(activeCategory);
  const { data: searchResults = [], isLoading: searchLoading } = useHighlightSearch(activeSearch);

  const isSearchMode = !!activeSearch;
  const displayVideos = isSearchMode ? searchResults : videos;
  const loading = isSearchMode ? searchLoading : isLoading;
  const featured = displayVideos[0];
  const gridVideos = displayVideos.slice(1);

  const handlePlay = useCallback((id: string, title: string) => {
    setModalVideo({ id, title });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

  usePageTitle('Football Highlights & Goals');
  return (
    <AppLayout>
      <BackButton />
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Football Highlights</h1>
            <p className="text-sm text-muted-foreground">Watch the best goals, skills, and match highlights</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search highlights... e.g. Barcelona vs Real Madrid"
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading || !searchQuery.trim()}>
          Search
        </Button>
        {isSearchMode && (
          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </form>

      {/* Categories */}
      {!isSearchMode && (
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat.key}
              variant={cat.key === activeCategory ? 'default' : 'outline'}
              className="cursor-pointer px-3.5 py-1.5 text-xs font-medium transition-all hover:bg-primary/80 hover:text-primary-foreground"
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <>
          <FeaturedSkeleton />
          <HighlightsGridSkeleton count={6} />
        </>
      ) : displayVideos.length === 0 ? (
        <EmptyState
          icon={Play}
          title="No highlights found"
          description="Try a different search or category to find football highlights."
        />
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <FeaturedVideo
              id={featured.id}
              title={featured.title}
              thumbnail={featured.thumbnail}
              channel={featured.channel}
              onPlay={handlePlay}
            />
          )}

          {/* Grid */}
          {gridVideos.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-foreground">More Highlights</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gridVideos.map((v, i) => (
                  <VideoCard
                    key={v.id}
                    id={v.id}
                    title={v.title}
                    thumbnail={v.thumbnail}
                    channel={v.channel}
                    index={i}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Video Modal */}
      <VideoModal
        videoId={modalVideo?.id ?? null}
        title={modalVideo?.title}
        onClose={() => setModalVideo(null)}
      />
    </AppLayout>
  );
}
