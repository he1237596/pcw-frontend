import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Space } from 'antd';
import { getProjects, deleteProject, exportProjects } from '../api/projects';
import { PlusOutlined } from '@ant-design/icons';
// import { downloadFile } from '@utils/index';
import ProjectForm from './ProjectForm';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom'
import PermissionButton from '@components/PermissionButton'
// import { useEditableTable } from '../hooks'
// import {EditableTable, EditableTableColumn} from '@/components/temp/EditableCell'
// import { ConfigProvider } from 'antd';

// const { getPrefixCls } = ConfigProvider;
// const antCls = getPrefixCls(); // 获取 Ant Design 组件前缀
interface Project {
  id: string | number;
  name: string;
  description: string;
  createdAt: Date;
  dataIndex: keyof Project;
  [key: string]: any;
}
const useStyle = createStyles(({ css, token }) => {
  const antCls = '.ant';
  // scrollbar-color: #eaeaea transparent;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-gutter: stable;
          }
          ${antCls}-table-body{
            height: calc(100vh - 360px)
          }
        }
      }
    `
  };
});
const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [editingProject, setEditingProject] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { styles } = useStyle();
  const navigate = useNavigate();
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects(currentPage, pageSize);
      setProjects(data.rows);
      setTotal(data.count);
    } catch (error) {
      // message.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      message.error('Failed to delete project');
    }
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsModalVisible(true);
  };

  const handleExport = async (id: number | string, filename: string) => {
    try {
      exportProjects(id, filename);
      // downloadFile(`/api/projects/${id}/export`, filename);
    } catch (error) {
      message.error('Failed to export project');
    }
  }

  const handleModalClose = () => {
    setEditingProject(null);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'CreatedTime',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: any) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <>
          <Space>
            <Button size='small' type="link" onClick={()=>navigate(`/languages?projectId=${record.id}`)}>
              查看
            </Button>
            <Button size='small' onClick={() => handleEdit(record)}>编辑</Button>
            <Button size='small' onClick={() => handleExport(record.id, record.name)}>
              导出
            </Button>
            <PermissionButton permission='admin' size='small' danger onClick={() => handleDelete(record.id)}>
              删除
            </PermissionButton>
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ flexShrink: 0, paddingBottom: 8 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size='small'
        >
          新增
        </Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Table
              scroll={{ y: 'calc(100vh - 368px)' }} // 动态计算
              className={styles.customTable}
              columns={columns}
              dataSource={projects}
              loading={loading}
              rowKey="id"
              size="small"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
              }}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </div>
      {isModalVisible && (
        <Modal
          title={editingProject ? 'Edit Project' : 'Create Project'}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <ProjectForm
            project={editingProject}
            onSuccess={() => {
              handleModalClose();
              fetchProjects();
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default ProjectList;
