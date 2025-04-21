import React, { useEffect, useState, useRef } from 'react'
import { Form } from 'antd'
import SearchForm, { SearchFormItem, SearchFormRef } from './SearchForm'
import PaginatedTable from './PaginatedTable'

interface PaginationParams {
  current: number
  pageSize: number
}

interface SearchableTableProps<T> {
  columns: any[] // 可以细化为 ColumnsType<T>
  request: (pagination: PaginationParams, search: Record<string, any>) => Promise<{
    rows: T[]
    count: number
  }>
  formItems: SearchFormItem[]
  extraButtons?: React.ReactNode
  rowKey?: string
  scrollHeight?: string | number
}

function SearchableTable<T extends object>({
  columns,
  request,
  formItems,
  extraButtons,
  rowKey = 'id',
  scrollHeight,
}: SearchableTableProps<T>) {
  const [form] = Form.useForm()
  const [data, setData] = useState<T[]>([])
  const [pagination, setPagination] = useState<PaginationParams>({ current: 1, pageSize: 10 })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<SearchFormRef>(null)
  const fetchData = async () => {
    setLoading(true)
    const search = form.getFieldsValue()
    const res = await request(pagination, search)
    setData(res.rows)
    setTotal(res.count)
    setLoading(false)
  }
  useEffect(() => {
    if (formRef.current) {
      const height = formRef.current.getHeight()
      console.log('SearchForm 高度:', height)
    }
  }, [])
  useEffect(() => {
    fetchData()
  }, [pagination])

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData()
  }

  const handleReset = () => {
    form.resetFields()
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchData()
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <SearchForm
          form={form}
          items={formItems}
          onSearch={handleSearch}
          onReset={handleReset}
          ref={formRef}
        />
        {extraButtons && <div style={{ marginTop: 8 }}>{extraButtons}</div>}
      </div>
      <PaginatedTable<T>
        columns={columns}
        data={data}
        rowKey={rowKey}
        loading={loading}
        scrollHeight={scrollHeight}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          onChange: (current, pageSize) => setPagination({ current, pageSize }),
        }}
      />
    </>
  )
}

export default SearchableTable
