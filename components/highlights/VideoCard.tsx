import { Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  index?: number;
  onPlay: (id: string, title: string) => void;
}

export default function VideoCard({ id, title, thumbnail, channel, index = 0, onPlay }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group cursor-pointer"
      onClick={() => onPlay(id, title)}
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
              <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
            </div>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            <Clock className="h-2.5 w-2.5" />
            Highlights
          </div>
        </div>
        {/* Info */}
        <div className="p-3.5">
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
            {title}
          </h3>
          {channel && (
            <p className="mt-1.5 text-xs text-muted-foreground truncate">{channel}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
