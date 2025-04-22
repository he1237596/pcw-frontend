import { useState } from 'react';
import { Form } from 'antd';

export function useEditableTable<T extends { key: string }>(originData: T[]) {
  const [form] = Form.useForm();
  const [data, setData] = useState<T[]>(originData);
  const [editingKey, setEditingKey] = useState<string>('');

  const isEditing = (record: T) => record.key === editingKey;

  const edit = (record: T) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey('');

  const save = async (key: string, onSave?: (record: T) => void) => {
    try {
      const row = (await form.validateFields()) as T;
      const newData = [...data];
      const index = newData.findIndex((item) => item.key === key);
      if (index > -1) {
        const item = newData[index];
        const updated = { ...item, ...row };
        newData.splice(index, 1, updated);
        setData(newData);
        setEditingKey('');
        onSave?.(updated);
      }
    } catch (err) {
      console.error('Validate Failed:', err);
    }
  };

  // 用于扩展 columns
  const getMergedColumns = (
    columns: {
      dataIndex: keyof T;
      title: string;
      editable?: boolean;
      inputType?: 'number' | 'text';
      [key: string]: any;
    }[],
  ) =>
    columns.map((col) =>
      col.editable
        ? {
            ...col,
            onCell: (record: T) => ({
              record,
              inputType: col.inputType || 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
            }),
          }
        : col,
    );

  return {
    form,
    data,
    setData,
    editingKey,
    isEditing,
    edit,
    cancel,
    save,
    getMergedColumns,
  };
}
