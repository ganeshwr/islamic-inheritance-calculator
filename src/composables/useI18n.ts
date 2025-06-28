import { useI18n as useVueI18n } from 'vue-i18n';
import type { MessageLanguages } from '../i18n';

export function useI18n() {
  const { t, locale, availableLocales } = useVueI18n();

  const setLocale = (newLocale: string) => {
    locale.value = newLocale;
    localStorage.setItem('preferred-locale', newLocale);
  };

  const getStoredLocale = (): string => {
    return localStorage.getItem('preferred-locale') || 'en';
  };

  return {
    t,
    locale,
    availableLocales,
    setLocale,
    getStoredLocale
  };
}