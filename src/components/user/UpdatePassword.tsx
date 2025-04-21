import React, { useEffect, useState } from 'react';
import { updatePassword } from '@api/user';
import {
  Modal,
  DatePicker,
  Form,
  Input,
  Select,
  Avatar,
  message,
  Upload,
  Flex,
} from 'antd';
import type { FormProps } from 'antd';
import { SHA256 } from 'crypto-js';

// import UploadAvatar from './UploadAvatar';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
type FieldType = {
  oldPassword: string;
  password: string;
  confirm: string;
};
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="86">+86</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
);
// interface IFormData {
//   oldPassword: string;
//   password: string;
//   confirm: string;
// }
const UserInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { oldPassword = '', password = '' } = values;
      const params = {
        password: SHA256(password).toString(),
        oldPassword: SHA256(oldPassword).toString(),
      };
     const res = await updatePassword(params);
      if (res.code === 200) {
        message.success(res.msg);
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <>
      <div onClick={showModal}>修改密码</div>
      <Modal
        title="修改密码"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          // initialValues={{}}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          preserve={false}
        >
          <Form.Item<FieldType>
            name="oldPassword"
            label="Old Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            name="password"
            label="New Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The new password that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserInfo;
