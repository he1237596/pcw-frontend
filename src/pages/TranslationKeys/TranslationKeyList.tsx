import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Table,
  Button,
  message,
  Modal,
  Select,
  Space,
  Flex,
  Form,
  Popconfirm,
  Input,
} from 'antd';
import type { GetRef, InputRef, TableProps } from 'antd';
import {
  getProjectKeys,
  deleteTranslationKey,
  updateTranslationKeyByLangId,
} from '@api/translationKeys';
import TranslationKeyForm from './TranslationKeyForm';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { getProjects } from '@api/projects';
import { createStyles } from 'antd-style';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useUserStore } from '@store/userUserStore';
import PermissionButton from '@components/PermissionButton';
import SearchForm from '@components/table/SearchForm';
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

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  id: string | number;
  [key: string]: any;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item, item?: any) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    console.log('toggleEdit', dataIndex, record);
    const item = record.translations.find(
      (item: any) => item.language === dataIndex,
    );
    form.setFieldsValue({ [dataIndex]: item?.value });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      const [lngObj] = Object.entries(values);
      const newTrasallations = [...record.translations];
      const index = newTrasallations.findIndex(
        (item: any) => item.language === lngObj[0],
      );
      const newLngInfo = {
        ...newTrasallations[index],
        value: values[dataIndex],
      };
      newTrasallations.splice(index, 1, newLngInfo);
      toggleEdit();
      handleSave({ ...record, translations: newTrasallations }, newLngInfo);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onKeyDown={(e) => {
            e.key === 'Escape' && setEditing(false);
          }}
          onBlur={(e) => {
            setEditing(false);
          }}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

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
          ${antCls}-table-body {
            height: calc(100vh - 360px);
          }
        }
      }
    `,
  };
});
const renderCell = (text: any, record: any, dataIndex: string) =>
  record?.translations?.find(
    (item: { language: string }) => item.language === dataIndex,
  )?.value || '待补充翻译';
interface PaginationParams {
  current: number;
  pageSize: number;
}
const TranslationKeyList: React.FC<TranslationKeyListProps> = () => {
  const [keys, setKeys] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState<PaginationParams>({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [editingKey, setEditingKey] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projectList, setProjectList] = useState<
    { label: string; value: number }[]
  >([]);
  const [projectId, setProjectId] = useState(-1);
  // const [formData, setFormData] = useState({
  //   projectId: -1,
  //   key: 'zh-cn',
  //   value: '',
  // });
  const location = useLocation();
  const { styles } = useStyle();
  const [form] = Form.useForm();
  const formItems = [
    {
      name: 'projectId',
      label: '项目名称',
      type: 'select' as const,
      options: projectList,
      rules: [{ required: true, message: 'Please select a project' }],
      // readOnly: true,
      allowClear: false,
      onChange: (value: number) => {
        setProjectId(value);
      },
    },
    {
      name: 'keyName',
      label: 'keyName',
      type: 'input' as const,
    },
    {
      name: 'language',
      label: '语言',
      type: 'select' as const,
      options: [
        {
          'value': 'en-US',
          'label': 'English',
        },
        {
          'value': 'zh-CN',
          'label': '中文',
        },
        {
          'value': 'zh-Hant',
          'label': '繁体',
        },
        {
          'value': 'es',
          'label': 'Spanish',
        },
        {
          'value': 'fr',
          'label': 'French',
        },
        {
          'value': 'it',
          'label': 'Italian',
        },
        {
          'value': 'ja',
          'label': 'Japanese',
        },
        {
          'value': 'kr',
          'label': 'Korean',
        },
      ],
      rules: [{ required: true, message: 'Please select a project' }],
    },
    {
      name: 'value',
      label: '关键字',
      type: 'input' as const,
    },
  ];
  // const user = useUserStore(state => state.user);
  const fetchKeys = async (pagination: PaginationParams) => {
    setLoading(true);
    const search = form.getFieldsValue();
    const { projectId: _projectId, keyName, language, value } = search;
    // console.log(search, 'search', projectId, _projectId)
    if (projectId < 0) {
      return;
    }
    try {
      const res = await getProjectKeys(_projectId, {
        ...pagination,
        search: { keyName, language, value },
      });
      const { code, data } = res;
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
        const data = await getProjects({
          pageSize: 1000,
          current: 1,
        });
        setProjectList(
          data.rows.map((item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          })),
        );
        if (projectId > 0) {
          setProjectId(projectId);
        } else {
          setProjectId(data.rows[0].id);
        }
        fetchKeys(pagination);
      } catch (error) {
        // message.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    // if (projectId < 0) {
    //   return;
    // }
    // form.setFieldsValue({
    //   projectId,
    // });
    fetchKeys(pagination);
  }, [pagination, projectId]);

  const handleDelete = async (keyId: number) => {
    try {
      const res = await deleteTranslationKey(projectId, keyId);
      if (res.code === 200) {
        message.success('Translation key deleted successfully');
        fetchKeys(pagination);
      }
    } catch (error) {
      message.error('Failed to delete translation key');
    }
  };

  const handleTableChange = (pagination: any) => {
    // setCurrentPage(pagination.current);
    // setPageSize(pagination.pageSize);
    // fetchKeys(pagination.current, pagination.pageSize);
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleEdit = (keyInfo: any) => {
    setEditingKey(keyInfo);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingKey(null);
    setIsModalVisible(false);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  // keyName, en, zh_cn, zh_hant, es, fr, it, ja, kr, description
  // const langType = ['en-US', 'zh-CN', 'zh-Hant', 'es', 'fr', 'it', 'ja', 'kr'];
  const columns = [
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
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'en-US'),
    },
    {
      title: '中文',
      dataIndex: 'zh-CN',
      key: 'zh-CN',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'zh-CN'),
    },
    {
      title: '繁体',
      dataIndex: 'zh-Hant',
      key: 'zh-Hant',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'zh-Hant'),
    },
    {
      title: 'Spanish',
      dataIndex: 'es',
      key: 'es',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'es'),
    },
    {
      title: 'French',
      dataIndex: 'fr',
      key: 'fr',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'fr'),
    },
    {
      title: 'Italian',
      dataIndex: 'it',
      key: 'it',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'it'),
    },
    {
      title: 'Japanese',
      dataIndex: 'ja',
      key: 'ja',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'ja'),
    },
    {
      title: 'Korean',
      dataIndex: 'kr',
      key: 'kr',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (text: any, record: any) => renderCell(text, record, 'kr'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      // hidden: true,
      ellipsis: true,
      editable: true,
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
          <PermissionButton
            permission="admin"
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </PermissionButton>
        </Space>
      ),
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleSave = async (row: DataType, lngInfo: any) => {
    const newData = [...keys];
    const index = newData.findIndex((item) => row.id === (item as any).id);
    const item = newData[index];
    const newItem = {
      ...item,
      ...row,
    };
    newData.splice(index, 1, newItem);
    setKeys(newData);
    // 同步到远程
    try {
      const res = await updateTranslationKeyByLangId(lngInfo.id, lngInfo);
      if (res.code === 200) {
        message.success('保存成功');
      }
    } catch (error) {
      // message.error('保存成功')
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  return (
    <>
      <Flex justify="space-between" style={{ flexShrink: 0, paddingBottom: 8 }}>
        {/* <Space>
          <span>项目:</span>
          <Select
            // showSearch
            placeholder="Select a project"
            // optionFilterProp="label"
            onChange={onChange}
            // onSearch={onSearch}
            options={projectList}
            value={projectId}
            size="middle"
            style={{ width: 200 }}
          />
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            disabled={projectId > 0 ? false : true}
            onClick={() => setIsModalVisible(true)}
          >
            新增
          </Button>
        </Space> */}
        <SearchForm
          form={form}
          items={formItems}
          onSearch={handleSearch}
          onReset={handleReset}
          initialValues={{
            projectId: projectId,
          }}
          extraButtons={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={projectId > 0 ? false : true}
              onClick={() => setIsModalVisible(true)}
            >
              新增
            </Button>
          }
        />
      </Flex>
      <div style={{ flex: 1, minHeight: 0 }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Table
              columns={columns as any}
              dataSource={keys}
              loading={loading}
              className={styles.customTable}
              // scroll={{ x: 'max-content' }}
              rowKey="id"
              size="small"
              scroll={{ y: 'calc(100vh - 360px)', x: 'max-content' }} // 动态计算
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: total,
                // onChange: handleTableChange,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showQuickJumper: true,
              }}
              components={components}
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
            projectId={editingKey?.projectId || projectId}
            projectList={projectList}
            translationKey={editingKey}
            onSuccess={() => {
              handleModalClose();
              fetchKeys(pagination);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default TranslationKeyList;
