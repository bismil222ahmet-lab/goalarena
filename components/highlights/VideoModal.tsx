import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  videoId: string | null;
  title?: string;
  onClose: () => void;
}

export default function VideoModal({ videoId, title, onClose }: VideoModalProps) {
  return (
    <Dialog open={!!videoId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-black border-border/50 gap-0">
        <div className="relative">
          <div className="absolute top-0 right-0 z-50 flex items-center gap-2 m-3">
            {videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                title="Open on YouTube"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="aspect-video w-full">
            {videoId && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
          {title && (
            <div className="p-4 bg-card">
              <h3 className="font-display font-semibold text-foreground line-clamp-2">{title}</h3>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
