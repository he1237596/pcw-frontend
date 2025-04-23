import React, { useEffect, useState } from 'react';
import { ConfigProvider, Button, theme, Space, ThemeConfig, App } from 'antd';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import useToken from 'antd/es/theme/useToken';
import { HashRouter as Router, useRoutes } from 'react-router-dom';
import { routes } from './router';
import { getCurrentLang } from '@utils/antdLocales';
import Tips, { message } from '@components/Tips';
import { PermissionProvider } from '@context/PermissionContext';
import { useLangSwitcher } from '@hooks/useLangSwitcher'; // 根据实际路径引入
import { ThemeContext, ThemeMode } from '@context/ThemeContext'; // 路径按实际改
const AppRoutes = () => {
  return useRoutes(routes);
};

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#ff0000',
    colorInfo: '#ff0000',
    colorBgContainer: '#131313',
    colorText: '#fffffff2',
    colorTextSecondary: '#ffffffb3',
    colorTextTertiary: '#ffffff80',
    colorTextQuaternary: '#ffffff33',
  },
  cssVar: true,
  hashed: false,
};

const Index: React.FC = () => {
  const { currentLang, changeLanguage } = useLangSwitcher();
  // const { t } = useTranslation()
  // const token = useToken();
  // const mode = theme.algorithm ? 'dark' : 'light';
  const [themeData, setThemeData] =
    React.useState<Partial<ThemeConfig>>(darkTheme);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    setThemeData(
      newMode === 'dark'
        ? darkTheme
        : {
            token: {},
            algorithm: theme.defaultAlgorithm,
            cssVar: true,
            hashed: false,
          },
    );
  };
  useEffect(() => {
    message.success('welcome to sigmic i18n manager');
  }, []);
  return (
    <ThemeContext.Provider value={{ themeData, toggleTheme, themeMode }}>
      {/* locale是antd组件的语言包,注意：时间组件的格式 */}
      <ConfigProvider theme={themeData} locale={getCurrentLang(currentLang)}>
        <PermissionProvider>
          {/* <div onClick={() => changeLanguage(currentLang === 'en'?'zh':'en')}>{t('welcome')}</div> */}
          <Router>
            <AppRoutes />
          </Router>
          <App
            message={{ maxCount: 1 }}
            notification={{ placement: 'bottomRight' }}
          >
            <Tips />
          </App>
        </PermissionProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default Index;
