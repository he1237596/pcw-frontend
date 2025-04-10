import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Select, Space, Flex, Input } from 'antd';
import { getProjectKeys, deleteTranslationKey } from '../api/translationKeys';
import TranslationKeyForm from './TranslationKeyForm';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { createStyles } from 'antd-style';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  [key: string]: any;
}
interface TranslationKeyListProps {
  // projectId: number;
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
const TranslationKeyList: React.FC<TranslationKeyListProps> = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [editingKey, setEditingKey] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState(-1);
  const [formData, setFormData ] = useState({ projectId: -1, key: 'zh-cn', value: '' });
  const location = useLocation();
  const { styles } = useStyle();
  const fetchKeys = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const res = await getProjectKeys(projectId, page, limit);
      const {code, data} = res;
      if (code === 200) {
        setKeys(data.rows);
        setTotal(data.count);
      }
    } catch (error) {
      message.error('Failed to load project keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const useQuery = () => {
      return new URLSearchParams(location.search);
    };
    const query = useQuery();
    const projectId = parseInt(query.get('projectId') || '-1');
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProjects(1, 999);
        setProjectList(
          data.rows.map((item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          })),
        );
        if (projectId > 0) {
          setProjectId(projectId);
        } else{
          setProjectId(data.rows[0].id);
        }
      } catch (error) {
        // message.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId < 0) {
      return;
    }
    fetchKeys(currentPage, pageSize);
  }, [projectId, currentPage, pageSize]);

  const handleDelete = async (keyId: number) => {
    try {
      const res = await deleteTranslationKey(projectId, keyId);
      if (res.code === 200) {
        message.success('Translation key deleted successfully');
        fetchKeys(currentPage, pageSize);
      }
    } catch (error) {
      message.error('Failed to delete translation key');
    }
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    // fetchKeys(pagination.current, pagination.pageSize);
  };

  const handleEdit = (key: any) => {
    setEditingKey(key);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingKey(null);
    setIsModalVisible(false);
  };
  // keyName, en, zh_cn, zh_hant, es, fr, it, ja, kr, description
  const columns: TableColumnsType<DataType> = [
    {
      title: 'no.',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
      width: 60,
      fixed: 'left',
    },
    {
      title: 'Key Name',
      dataIndex: 'keyName',
      key: 'keyName',
      width: 160,
      ellipsis: true,
      
      fixed: 'left',
    },
    {
      title: 'English',
      dataIndex: 'en-US',
      key: 'en-US',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'en-US',
            )?.value

      ),
    },
    {
      title: '中文',
      dataIndex: 'zh-CN',
      key: 'zh-CN',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'zh-CN',
            )?.value

      ),
    },
    {
      title: '繁体',
      dataIndex: 'zh-Hant',
      key: 'zh-Hant',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'zh-Hant',
            )?.value

      ),
    },
    {
      title: 'Spanish',
      dataIndex: 'es',
      key: 'es',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'es',
            )?.value

      ),
    },
    {
      title: 'French',
      dataIndex: 'fr',
      key: 'fr',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'fr',
            )?.value

      ),
    },
    {
      title: 'Italian',
      dataIndex: 'it',
      key: 'it',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'it',
            )?.value

      ),
    },
    {
      title: 'Japanese',
      dataIndex: 'ja',
      key: 'ja',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'ja',
            )?.value

      ),
    },
    {
      title: 'Korean',
      dataIndex: 'kr',
      key: 'kr',
      width: 200,
      ellipsis: true,

      render: (text: any, record: any) => (

            record?.translations?.find(
              (item: { language: string }) => item.language === 'kr',
            )?.value

      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      // hidden: true,
      ellipsis: true,
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
      width: 100,
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button disabled size="small" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const onChange = (value: number) => {
    setProjectId(value);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const handleSelect = (key: string, value: string) => {
    console.log(`selected ${value}`);
    setFormData({ ...formData, key: value });
  }
  console.log(keys)
  return (
    <>
      <Flex justify="space-between" style={{ flexShrink: 0, paddingBottom: 8 }}>
        <Space>
          <span>项目:</span>
          <Select
            showSearch
            placeholder="Select a project"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={projectList}
            value={projectId}
            size="middle"
            style={{ width: 200 }}
          />
          {/* <Space.Compact>
            <Select
              style={{ width: 200 }}
              value={formData.key}
              onChange={value => setFormData({ ...formData, key: value })}
              // allowClear={true}
              options={columns
                .filter((item, index) => index > 0 && index < 10)
                .map((item) => ({ value: item.key, label: item.title }))}
            />
            <Input value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })}  />
          </Space.Compact>
          <Button
            size="small"
            type="primary"
            icon={<SearchOutlined />}
            disabled={projectId > 0 ? false : true}
            onClick={() => setIsModalVisible(true)}
          >
            查询
          </Button> */}
          {/* <Button
          size="small"
          type="primary"
          icon={<SearchOutlined />}
          disabled={projectId>0? false:true}
          onClick={() => setIsModalVisible(true)}
        >
          重置
        </Button> */}
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            disabled={projectId > 0 ? false : true}
            onClick={() => setIsModalVisible(true)}
          >
            新增
          </Button>
        </Space>
      </Flex>
      <div style={{ flex: 1, minHeight: 0 }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Table
              columns={columns}
              dataSource={keys}
              loading={loading}
              className={styles.customTable}
              // scroll={{ x: 'max-content' }}
              rowKey="id"
              size="small"
              scroll={{ y: 'calc(100vh - 360px)', x: 'max-content' }} // 动态计算
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                // onChange: handleTableChange,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showQuickJumper: true,
              }}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </div>
      {isModalVisible && (
        <Modal
          title={editingKey ? 'Edit Key' : 'Create Key'}
          open={true}
          onCancel={handleModalClose}
          footer={null}
        >
          <TranslationKeyForm
            projectId={projectId}
            projectList={projectList}
            translationKey={editingKey}
            onSuccess={() => {
              handleModalClose();
              fetchKeys(currentPage, pageSize);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default TranslationKeyList;
