import i18next from 'i18next';

export const changeLang = (lng: string) => {
  i18next.changeLanguage(lng).then(() => {
    // 你可以根据需要在这里做一些额外的操作，例如持久化语言选择
    localStorage.setItem('i18nextLng', lng);
  });
};

/* import React from 'react';
import { Button } from 'antd';
import { changeLang } from './utils/langSwitcher';  // 根据实际路径引入

const LangSwitcher = () => {
  return (
    <div>
      <Button onClick={() => changeLang('en')}>English</Button>
      <Button onClick={() => changeLang('zh')} type="primary">中文</Button>
    </div>
  );
};

export default LangSwitcher; */
