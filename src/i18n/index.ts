import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import id from './locales/id.json';

export type MessageLanguages = keyof typeof en;

export const SUPPORT_LOCALES = ['en', 'id'];

export function setupI18n(options = { locale: 'en' }) {
  const i18n = createI18n({
    legacy: false,
    locale: options.locale,
    fallbackLocale: 'en',
    messages: {
      en,
      id
    }
  });
  return i18n;
}