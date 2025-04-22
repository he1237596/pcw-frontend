import { useState } from 'react';
import { Form, Input } from 'antd';

interface UseEditableTableProps<T> {
  onCellSave?: (record: T, dataIndex: keyof T, value: any) => void;
}

export const useEditableTable = <T extends { id: string | number }>({
  onCellSave,
}: UseEditableTableProps<T>) => {
  const [editingCell, setEditingCell] = useState<{
    id: T['id'];
    dataIndex: keyof T;
  } | null>(null);
  const [form] = Form.useForm();

  const isEditing = (record: T, dataIndex: keyof T) =>
    editingCell?.id === record.id && editingCell?.dataIndex === dataIndex;

  const startEdit = (record: T, dataIndex: keyof T) => {
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    setEditingCell({ id: record.id, dataIndex });
  };

  const save = async (record: T, dataIndex: keyof T) => {
    try {
      const values = await form.validateFields();
      const value = values[dataIndex];
      form.resetFields();
      setEditingCell(null);
      onCellSave?.(record, dataIndex, value);
    } catch (err) {
      console.error('保存失败:', err);
    }
  };

  const getEditableCell = () => {
    return ({ editing, dataIndex, record, children, ...restProps }: any) => {
      return (
        <td {...restProps} onDoubleClick={() => startEdit(record, dataIndex)}>
          {isEditing(record, dataIndex) ? (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[{ required: true, message: `请输入内容` }]}
            >
              <Input
                autoFocus
                onPressEnter={() => save(record, dataIndex)}
                onBlur={() => save(record, dataIndex)}
              />
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };
  };

  return {
    form,
    getEditableCell,
  };
};
