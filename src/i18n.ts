import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import en from './locales/en.json';
// import zh from './locales/zh.json';
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: () => import('./locales/en.json') },
    zh: { translation: () => import('./locales/zh.json') },
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'en', // 如果当前语言没有，则使用这个语言
  interpolation: {
    escapeValue: false,
  },
  load: 'languageOnly', // 让 i18next 只加载语言，而不加载语言包的内容(可能会和fallbackLng冲突，导致fallbackLng失效？？？)
});
export default i18n;
