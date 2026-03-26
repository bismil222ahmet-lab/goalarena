import { Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FeaturedVideoProps {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  onPlay: (id: string, title: string) => void;
}

export default function FeaturedVideo({ id, title, thumbnail, channel, onPlay }: FeaturedVideoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group mb-8"
      onClick={() => onPlay(id, title)}
    >
      {/* Mobile: fixed height, Desktop: aspect ratio */}
      <div className="relative h-[260px] sm:h-auto sm:aspect-[21/9] md:aspect-[3/1]">
        <img
          src={thumbnail}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Stronger gradient for mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] sm:text-xs font-bold text-primary-foreground uppercase tracking-wider w-fit mb-2 sm:mb-3">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
          <h2 className="font-display text-base sm:text-xl md:text-3xl font-bold text-white line-clamp-2 max-w-2xl leading-tight mb-1 sm:mb-2">
            {title}
          </h2>
          {channel && (
            <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-1">{channel}</p>
          )}
          <Button
            size="sm"
            className="w-fit gap-2 rounded-full shadow-lg shadow-primary/30 sm:text-base sm:px-6 sm:py-3"
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
            Watch Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
