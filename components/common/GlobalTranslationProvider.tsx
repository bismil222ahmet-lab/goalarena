import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getLanguageConfig } from '@/i18n/languages';

export default function GlobalTranslationProvider() {
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    const config = getLanguageConfig(language);
    document.documentElement.dir = config.dir;
    document.documentElement.lang = config.code;
  }, [language]);

  return null;
}
