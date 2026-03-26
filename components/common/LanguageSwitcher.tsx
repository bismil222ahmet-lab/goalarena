import { useMemo, useRef, useState, useEffect } from 'react';
import { Check, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { languages, type Language } from '@/i18n/languages';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const current = languages.find(l => l.code === language) || languages[0];
  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return languages;
    return languages.filter((lang) =>
      lang.name.toLowerCase().includes(normalized) ||
      lang.nativeName.toLowerCase().includes(normalized) ||
      lang.code.toLowerCase().includes(normalized)
    );
  }, [query]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  const list = (
    <>
      {/* Search */}
      <div className="relative px-3 pb-2 pt-3">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.nav.search}
          className="h-10 w-full rounded-xl border border-border/40 bg-background/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 backdrop-blur-sm"
          aria-label="Search language"
        />
      </div>
      {/* Language list */}
      <div className="max-h-72 overflow-y-auto px-2 pb-2 space-y-0.5">
        {filteredLanguages.map((lang) => {
          const selected = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200',
                selected
                  ? 'bg-primary/15 border border-primary/40 shadow-[0_0_10px_hsl(var(--primary)/0.15)]'
                  : 'border border-transparent text-foreground hover:bg-muted/60'
              )}
            >
              <img
                src={`https://flagcdn.com/w40/${lang.flag}.png`}
                alt={lang.name}
                className="h-5 w-7 rounded object-cover shadow-sm flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className={cn('font-semibold text-sm leading-none', selected && 'text-primary')}>{lang.nativeName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{lang.name}</p>
              </div>
              {selected && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
          );
        })}
        {filteredLanguages.length === 0 && (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">{t.common.noData}</div>
        )}
      </div>
    </>
  );

  if (variant === 'mobile') {
    return (
      <div className="mx-auto w-full max-w-sm rounded-xl border border-border/50 bg-card/80 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <p className="text-sm font-bold">{t.common.language}</p>
          </div>
          <span className="text-xs text-muted-foreground">{current.nativeName}</span>
        </div>
        {list}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={t.common.language}
        aria-expanded={open}
        className="rounded-lg"
      >
        <Globe className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute end-0 top-full z-[100] mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/50 bg-popover/95 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold">{t.common.language}</p>
            </div>
            <span className="text-xs text-muted-foreground">{current.nativeName}</span>
          </div>
          {list}
        </div>
      )}
    </div>
  );
}
