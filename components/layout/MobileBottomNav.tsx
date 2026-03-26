import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Newspaper, Trophy, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playClick } from '@/hooks/useClickSound';
import { useTranslation } from '@/hooks/useTranslation';

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { icon: Home, label: t.nav.home, path: '/' },
    { icon: Zap, label: t.nav.live, path: '/live' },
    { icon: Trophy, label: t.nav.leagues, path: '/leagues' },
    { icon: Newspaper, label: t.nav.news, path: '/news' },
    { icon: Play, label: t.nav.highlights, path: '/highlights' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-nav/95 backdrop-blur-xl md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={playClick}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors rounded-lg min-w-[48px] min-h-[44px] justify-center',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'drop-shadow-sm')} />
              <span>{label}</span>
              {active && <span className="h-0.5 w-4 rounded-full bg-primary mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
