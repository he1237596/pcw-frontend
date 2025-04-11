// components/EditableTable.tsx
import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

export interface EditableTableColumn<T> {
  title: string;
  dataIndex: keyof T;
  editable?: boolean;
  width?: string | number;
  render?: (text: any, record: T, index: number) => React.ReactNode;
}

interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof T;
  title: any;
  inputType: 'number' | 'text';
  record: T;
  index: number;
}

const EditableCell = <T extends Record<string, any>>({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: React.PropsWithChildren<EditableCellProps<T>>) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex as string}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps<T> {
  rowKey: keyof T;
  data: T[];
  columns: EditableTableColumn<T>[];
  onSave: (key: string | number, updatedFields: Partial<T>) => void;
  // onSave: (key: string | number, newRow: T) => void;
  loading?: boolean;
  pagination?: TableProps<T>['pagination'];
}

export function EditableTable<T extends { [key: string]: any }>({
  rowKey,
  data,
  columns,
  onSave,
  loading,
  pagination,
}: EditableTableProps<T>) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | number>('');

  const isEditing = (record: T) => record[rowKey] === editingKey;

  const edit = (record: T) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record[rowKey]);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: string | number) => {
    try {
      const updatedFields = (await form.validateFields()) as Partial<T>;
      onSave(key, updatedFields);
      // const row = (await form.validateFields()) as T;
      // onSave(key, row);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const mergedColumns = [
    ...columns.map((col) => {
      if (!col.editable) return col;
      return {
        ...col,
        onCell: (record: T) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }),
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: T) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record[rowKey])} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table<T>
        rowKey={rowKey as string}
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns as any}
        rowClassName="editable-row"
        pagination={{ onChange: cancel, ...pagination }}
        loading={loading}
      />
    </Form>
  );
}
