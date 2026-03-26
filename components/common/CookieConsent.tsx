import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConsentChoice = 'accepted' | 'rejected' | 'custom' | null;

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
}

const CONSENT_KEY = 'goalarena_cookie_consent';
const PREFS_KEY = 'goalarena_cookie_prefs';

function getStoredConsent(): ConsentChoice {
  try {
    return localStorage.getItem(CONSENT_KEY) as ConsentChoice;
  } catch {
    return null;
  }
}

function getStoredPrefs(): CookiePreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : { necessary: true, analytics: false, advertising: false };
  } catch {
    return { necessary: true, analytics: false, advertising: false };
  }
}

/** Load AdSense script dynamically only after consent */
function loadAdSenseScript() {
  if (document.querySelector('script[src*="adsbygoogle"]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2416374142499132';
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(getStoredPrefs);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      // small delay so the page loads first
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    // If already accepted advertising, load ads
    if (consent === 'accepted' || (consent === 'custom' && getStoredPrefs().advertising)) {
      loadAdSenseScript();
    }
  }, []);

  const save = useCallback((choice: ConsentChoice, preferences: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, choice!);
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    if (preferences.advertising) loadAdSenseScript();
    setVisible(false);
  }, []);

  const handleAccept = () => save('accepted', { necessary: true, analytics: true, advertising: true });
  const handleReject = () => save('rejected', { necessary: true, analytics: false, advertising: false });
  const handleSavePrefs = () => save('custom', prefs);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-[9999] p-3 md:p-4"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Main banner */}
            {!showPrefs ? (
              <div className="p-5 md:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="shrink-0 mt-0.5 rounded-xl bg-primary/10 p-2.5">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">We value your privacy</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      We use cookies to enhance your experience, serve personalized ads, and analyze traffic.
                      You can choose to accept, reject, or customize your preferences.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <Button onClick={handleAccept} size="sm" className="flex-1 font-medium">
                    Accept All
                  </Button>
                  <Button onClick={handleReject} variant="outline" size="sm" className="flex-1 font-medium">
                    Reject All
                  </Button>
                  <Button onClick={() => setShowPrefs(true)} variant="ghost" size="sm" className="flex-1 font-medium text-muted-foreground">
                    <Shield className="h-4 w-4 mr-1.5" /> Manage
                  </Button>
                </div>
              </div>
            ) : (
              /* Preferences panel */
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Cookie Preferences
                  </h3>
                  <button onClick={() => setShowPrefs(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  <PrefRow
                    label="Necessary"
                    desc="Required for the website to function."
                    checked={true}
                    disabled
                  />
                  <PrefRow
                    label="Analytics"
                    desc="Help us understand how visitors use the site."
                    checked={prefs.analytics}
                    onChange={v => setPrefs(p => ({ ...p, analytics: v }))}
                  />
                  <PrefRow
                    label="Advertising"
                    desc="Used to show relevant ads via Google AdSense."
                    checked={prefs.advertising}
                    onChange={v => setPrefs(p => ({ ...p, advertising: v }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSavePrefs} size="sm" className="flex-1 font-medium">
                    Save Preferences
                  </Button>
                  <Button onClick={handleAccept} variant="outline" size="sm" className="flex-1 font-medium">
                    Accept All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PrefRow({ label, desc, checked, disabled, onChange }: {
  label: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors ${disabled ? 'opacity-70' : 'cursor-pointer hover:bg-accent/40'}`}>
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
          className="sr-only peer"
        />
        <div className="h-6 w-11 rounded-full border border-border bg-muted peer-checked:bg-primary transition-colors" />
        <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
