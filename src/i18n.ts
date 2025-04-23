import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'en', // 如果当前语言没有，则使用这个语言
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
