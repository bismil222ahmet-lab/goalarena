import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Trophy, Users, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const quickLinks = [
  { label: 'Premier League', path: '/leagues/39', icon: Trophy },
  { label: 'La Liga', path: '/leagues/140', icon: Trophy },
  { label: 'Champions League', path: '/leagues/2', icon: Trophy },
  { label: 'Live Scores', path: '/live', icon: Zap },
];

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-4 shadow-2xl mx-4">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, leagues, matches..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={() => setSearchOpen(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</p>
          {quickLinks.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => { navigate(path); setSearchOpen(false); }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> to toggle
        </p>
      </div>
    </div>
  );
}
