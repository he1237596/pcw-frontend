import React from 'react';
import TranslationKeyList from './TranslationKeyList';
import { useParams } from 'react-router-dom';
import { Card } from 'antd';
import { createStyles } from 'antd-style';
interface TranslationKeyListProps {
  // projectId: number;
}
const useStyle = createStyles(({ css, token }) => {
  const antCls = '.ant';
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
    customCard: css`
      ${antCls}-card-body {
        padding: 16px 16px 0;
      }
    `,
  };
});
const TranslationKeysPage: React.FC = (props: any) => {
  const { styles } = useStyle();
  // const { projectId } = match.params;
  // const { projectId } = useParams<{ projectId: string }>();
  return (
    <Card
      title="多语言列表"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      className={styles.customCard}
    >
      {/* <h3>多语言列表</h3> */}
      <TranslationKeyList />
    </Card>
  );
};

export default TranslationKeysPage;
