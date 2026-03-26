import { useAppStore } from '@/store/useAppStore';
import { getTranslations, type Translations } from '@/i18n';

export function useTranslation(): { t: Translations; lang: string } {
  const language = useAppStore((s) => s.language);
  return { t: getTranslations(language), lang: language };
}
