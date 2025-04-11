// App.tsx
import React, { useState } from 'react';
import { EditableTable, EditableTableColumn } from './EditableCell';

interface User {
  key: string;
  name: string;
  age: number;
  address: string;
  id?: string;
}

const columns: EditableTableColumn<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    editable: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    editable: true,
  },
];

const App: React.FC = () => {
  const [data, setData] = useState<User[]>(
    Array.from({ length: 10 }, (_, i) => ({
      key: i.toString(),
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    })),
  );

  // const handleSave = (key: string | number, newRow: User) => {
  //   setData((prev) =>
  //     prev.map((item) => (item.key === key ? { ...item, ...newRow } : item)),
  //   );
  // };
  const handleSave = (key: string | number, updatedFields: Partial<User>) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, ...updatedFields } : item
      )
    );
  };
  return (
    <EditableTable<User>
      rowKey="key"
      data={data}
      columns={columns}
      onSave={handleSave}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default App;
