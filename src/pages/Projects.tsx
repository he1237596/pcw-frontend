import React from "react";
import ProjectList from "../components/ProjectList";
import { Card } from 'antd';
import { createStyles } from 'antd-style';
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
const ProjectsPage: React.FC = () => {
  const { styles } = useStyle()
  return (
    <Card title='项目列表' style={{ display: "flex", flexDirection: "column", height: '100%' }} className={styles.customCard}>
      {/* <h3>项目列表</h3> */}
      <ProjectList />
    </Card>
  );
};

export default ProjectsPage;
