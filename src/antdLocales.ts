import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import frFR from 'antd/locale/fr_FR';
import itIT from 'antd/locale/it_IT';
import jaJP from 'antd/locale/ja_JP';
import koKR from 'antd/locale/ko_KR';
import zhCN from 'antd/locale/zh_CN';
import zhHK from 'antd/locale/zh_HK';
import zhTW from 'antd/locale/zh_TW';
// import { App, Button, Space } from 'antd';
// const { message, modal, notification } = App.useApp();
// message.success('Success!');
export const getCurrentLang = (lang: string) => {
  // return antdLocales[window.localStorage.getItem('locale') || 'en-US']
  const key = lang || window.localStorage.getItem('locale') as keyof typeof antdLocales || 'en-US'
  return antdLocales[key as keyof typeof antdLocales]
};
export const antdLocales = {
  'en': enUS,
  // 'en-US': enUS,
  'es': esES,
  'fr': frFR,
  'it': itIT,
  'ja': jaJP,
  'ko': koKR,
  // 'zh-CN': zhCN,
  'zh': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
}
