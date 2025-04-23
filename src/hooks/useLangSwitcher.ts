import { useState, useEffect } from 'react';
import i18next from 'i18next';

// 获取当前语言
export const useLangSwitcher = () => {
  const [currentLang, setCurrentLang] = useState(i18next.language);
  useEffect(() => {
    // 监听语言变化
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
      localStorage.setItem('lang', lng);
    };

    i18next.on('languageChanged', handleLanguageChange);

    // 清理事件监听
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);

  // 切换语言
  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
  };

  return { currentLang, changeLanguage };
};
