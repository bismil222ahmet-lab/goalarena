import { en } from './translations/en';
import { tr } from './translations/tr';
import { es } from './translations/es';
import { fr } from './translations/fr';
import { de } from './translations/de';
import { it } from './translations/it';
import { pt } from './translations/pt';
import { ru } from './translations/ru';
import { zh } from './translations/zh';
import { ja } from './translations/ja';
import { ko } from './translations/ko';
import type { Language } from './languages';

const translations: Record<Language, typeof en> = { en, tr, es, fr, de, it, pt, ru, zh, ja, ko };

export function getTranslations(lang: Language) {
  return translations[lang] || translations.en;
}

export type Translations = typeof en;
export { languages, type Language, type LanguageConfig, getLanguageConfig, detectBrowserLanguage } from './languages';
