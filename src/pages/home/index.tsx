import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Pagination } from 'antd';
import GT1 from '@/assets/images/GT1.png';
const WelcomeComponent = () => {
  const { t } = useTranslation();
  const a = '12345';
  const b = {
    a: 1,
    b: 2,
  };
  const c = 2;
  console.log(t('welcome'), a, b);
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <img src={GT1} alt="GT1" />
      {a}
      <Button type="primary">Button</Button>
      <Pagination defaultCurrent={6} total={500} />;
    </div>
  );
};

export default WelcomeComponent;
