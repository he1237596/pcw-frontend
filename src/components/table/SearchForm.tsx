import React, { useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { Form, Input, Select, Button, FormInstance } from 'antd'

type FieldType = 'input' | 'select'

export interface SearchFormItem {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { label: string; value: string | number }[] // for select
  readOnly?: boolean
  disabled?: boolean
  rules?: any[]
  [key: string]: any // 其他属性
}

interface SearchFormProps {
  form: FormInstance
  items: SearchFormItem[]
  onSearch: () => void
  onReset: () => void
  initialValues?: Record<string, any> // 新增
}
export interface SearchFormRef {
  getHeight: () => string
}
// React.FC<SearchFormProps> 
// const SearchForm = forwardRef<HTMLDivElement, SearchFormProps>(({ form, items, onSearch, onReset, initialValues }) => {
const SearchForm = forwardRef<SearchFormRef, SearchFormProps>(({ form, items, onSearch, onReset, initialValues }, ref) => {
  
  const wrapperRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getHeight: () => {
      const height = wrapperRef.current?.offsetHeight ?? 0
      return `${height}px`
    },
  }))

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [initialValues])
  return (
    <div ref={wrapperRef}>
      <Form form={form} initialValues={initialValues} layout="inline" onFinish={onSearch}>
        {items.map(({ name, label, type, placeholder, options, readOnly, disabled }) => (
          <Form.Item key={name} name={name} label={label} style={{ minWidth: 160 }}>
            {type === 'input' ? (
              <Input placeholder={placeholder} readOnly={readOnly} disabled={disabled} />
            ) : (
              readOnly?<Select placeholder={placeholder} options={options} open={!readOnly} onClick={(e) => e.preventDefault()} disabled ={disabled} />:
              <Select placeholder={placeholder} options={options} disabled ={disabled} />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
    </div>
  )
})

export default SearchForm
