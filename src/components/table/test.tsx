import React from 'react';
import { Button } from 'antd';
import SearchableTable from './SearchableTable';
export default function test() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const pagination = {
    current: 1,
    pageSize: 10,
  }
  const getProjects = (page: number, pageSize: number, search: Record<string, any> | string) => {
    const searchString = typeof search === 'object' ? JSON.stringify(search) : search; // 这里可以根据你的需求处理搜索条件
    // 这里写你的请求
    return Promise.resolve({
      rows: [],
      count: 0,
    });
  } 
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '项目描述',
      dataIndex: 'description',
      key: 'description',
    },
  ]
  return (
    <SearchableTable
      columns={columns}
      request={(pagination: { current: number; pageSize: number }, search: Record<string, any>) =>
        getProjects(pagination.current, pagination.pageSize, search)
      }
      formItems={[
        {
          name: 'name',
          label: '项目名称',
          type: 'input',
          placeholder: '请输入名称',
        },
        // 你可以加更多字段
      ]}
      extraButtons={
        <Button onClick={() => setIsModalVisible(true)}>新增</Button>
      }
    />
  );
}
