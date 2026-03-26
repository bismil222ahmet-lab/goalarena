import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-8 overflow-hidden">
      {/* Stadium background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-stadium.jpg"
          alt=""
          className="h-full w-full object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
      </div>

      {/* Glowing divider */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_8px_hsl(var(--primary)/0.3)]" />

      <div className="relative z-10 container py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src={logoImg} alt="GoalArena" className="h-7 w-7" />
              <span className="font-bold text-foreground text-lg tracking-tight font-display">GoalArena</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3 tracking-wide">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/live" className="hover:text-primary transition-colors">{t.nav.live}</Link></li>
              <li><Link to="/news" className="hover:text-primary transition-colors">{t.nav.news}</Link></li>
              <li><Link to="/transfers" className="hover:text-primary transition-colors">{t.nav.transfers}</Link></li>
              <li><Link to="/highlights" className="hover:text-primary transition-colors">{t.nav.highlights}</Link></li>
              <li><Link to="/leagues" className="hover:text-primary transition-colors">{t.nav.leagues}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3 tracking-wide">{t.footer.about}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t.footer.about}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t.footer.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3 tracking-wide">{t.footer.legal}</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{t.footer.terms}</Link></li>
            </ul>
          </div>
        </div>

        {/* Glowing bottom divider */}
        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">© {new Date().getFullYear()} GoalArena. {t.footer.rights}.</p>
          <p className="text-[11px] text-muted-foreground/60">{t.footer.description}</p>
        </div>
      </div>
    </footer>
  );
}
