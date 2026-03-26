import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, LogOut, Menu, X, Shield, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { playClick } from '@/hooks/useClickSound';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import logoImg from '@/assets/logo.png';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Navbar() {
  const { theme, toggleTheme, setSearchOpen, soundEnabled, toggleSound } = useAppStore();
  const { signOut, isAdmin, user } = useAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const withClick = (fn: () => void) => () => { playClick(); fn(); };

  const links = [
    { label: t.nav.live, path: '/live' },
    { label: t.nav.news, path: '/news' },
    { label: t.nav.transfers, path: '/transfers' },
    { label: t.nav.highlights, path: '/highlights' },
    { label: t.nav.leagues, path: '/leagues' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-nav/90 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" onClick={playClick} className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <img src={logoImg} alt="GoalArena" className="h-8 w-8 rounded-lg object-contain" />
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              GoalArena
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={playClick}
                className={cn(
                  'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
                  pathname === path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
                {pathname === path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={withClick(() => setSearchOpen(true))} aria-label={t.nav.search} className="rounded-lg">
            <Search className="h-4 w-4" />
          </Button>
          <LanguageSwitcher variant="desktop" />
          <Button variant="ghost" size="icon" onClick={withClick(toggleTheme)} aria-label="Toggle theme" className="rounded-lg">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSound} aria-label="Toggle sound" className="rounded-lg">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="icon" aria-label={t.nav.admin} className="rounded-lg">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {user && (
            <Button variant="ghost" size="icon" onClick={withClick(signOut)} aria-label={t.nav.signOut} className="hidden md:flex rounded-lg">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-lg"
            onClick={withClick(() => setMobileMenuOpen(!mobileMenuOpen))}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-nav/95 backdrop-blur-xl p-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => { playClick(); setMobileMenuOpen(false); }}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {label}
              </Link>
            ))}
            <div className="my-2 border-t border-border/40" />
            <LanguageSwitcher variant="mobile" />
            {user && (
              <>
                <div className="my-2 border-t border-border/40" />
                <button onClick={() => { playClick(); signOut(); setMobileMenuOpen(false); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10">
                  {t.nav.signOut}
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
