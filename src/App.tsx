import React, { useEffect, useState } from 'react';
import {
  ConfigProvider,
  Button,
  theme,
  Space,
  ThemeConfig,
  App
} from 'antd';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import useToken from 'antd/es/theme/useToken';
import { HashRouter as Router, useRoutes } from 'react-router-dom';
import { routes } from './router';
import { getCurrentLang } from './antdLocales'
import Tips, { message } from '@components/Tips'
import { PermissionProvider } from './context/PermissionContext'

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
  const currentLang = i18next.language; // 获取当前语言
  const [lang, setLang] = useState(currentLang)
  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
    setLang(lng)
  };
  // const token = useToken();
  // const mode = theme.algorithm ? 'dark' : 'light';
  const [themeData, setThemeData] =
    React.useState<Partial<ThemeConfig>>(darkTheme);
  const changeThemeData = (mode: 'dark' | 'light') => {
    setThemeData(
      mode === 'dark'
        ? darkTheme
        : {
            token: {},
            algorithm: theme.defaultAlgorithm,
            cssVar: true,
            // inherit: false,
            hashed: false,
          },
    );
  };
  console.log(currentLang, getCurrentLang(lang), 88888)
  useEffect((() => {
    message.success('welcome to sigmic i18n manager')
  }), [])
  return (
    <ConfigProvider theme={themeData} locale={getCurrentLang(currentLang)}>
      <PermissionProvider>
      {/* <div>
        语言切换：
        <Space>
          <Button onClick={() => changeLanguage('en')}>English</Button>
          <Button onClick={() => changeLanguage('zh')} type="primary">
            中文
          </Button>
        </Space>
        <hr />
        主题切换：
        <Space>
          <Button onClick={() => changeThemeData('dark')}>dark</Button>
          <Button onClick={() => changeThemeData('light')} type="primary">
            light
          </Button>
        </Space>
      </div> */}
      <Router>
        <AppRoutes />
      </Router>
      <App message={{ maxCount: 1 }} notification={{ placement: 'bottomRight' }}>
        <Tips />
      </App>
      </PermissionProvider>
    </ConfigProvider>
  );
};

export default Index;
