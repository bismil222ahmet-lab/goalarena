import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden mb-8">
      <Skeleton className="aspect-[21/9] md:aspect-[3/1] w-full" />
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-3.5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function HighlightsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
