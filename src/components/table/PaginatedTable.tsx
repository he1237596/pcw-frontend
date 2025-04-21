import React from 'react'
import { Table, TablePaginationConfig } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface PaginatedTableProps<T> {
  rowKey?: string
  columns: ColumnsType<T>
  data: T[]
  loading: boolean
  pagination: TablePaginationConfig
  scrollHeight?: string | number
  onChange?: (pagination: TablePaginationConfig) => void
}

function PaginatedTable<T extends object>({
  rowKey = 'id',
  columns,
  data,
  loading,
  pagination,
  scrollHeight,
  onChange,
}: PaginatedTableProps<T>) {
  return (
    <Table<T>
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
      scroll={{ y: scrollHeight || 'calc(100vh - 360px)' }}
    />
  )
}

export default PaginatedTable
