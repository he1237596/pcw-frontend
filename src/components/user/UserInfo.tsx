import React, { useEffect, useState } from 'react';
import { updateUserInfo, getUserInfo } from '@api/user';
import type { UserInfo } from '@api/user';
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
import { useUserStore } from '@store/userUserStore';

// import UploadAvatar from './UploadAvatar';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
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
// interface UserInfo {
//   username: string;
//   email: string;
//   phone_number: string;
//   profile_picture: string;
//   [key: string]: any;
// }
const UserInfo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { userInfo: storeUserInfo, refreshUser } = useUserStore();
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({
    username: '',
    email: '',
    phone_number: '',
    profile_picture: '',
  });
  const [loading, setLoading] = useState(false);
  const getBase64 = (
    img: Blob,
    callback: { (url: any): void; (arg0: string | ArrayBuffer | null): any },
  ) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: { type: string; size: number }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      console.log('上传成功:', info.file.response);
      const { code, data } = info.file.response;
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        console.log('url', url);
        setLoading(false);
        setUserInfo({
          ...userInfo,
          profile_picture: data.url,
        });
      });
    }
  };

  useEffect(() => {
    getUserInfo().then((res) => {
      setUserInfo(res.data);
    });
    // if (storeUserInfo) {
    //   setUserInfo(storeUserInfo);
    // }
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const res = await updateUserInfo(userInfo);
    if (res.code === 200) {
      setConfirmLoading(false);
      message.success(res.msg);
      refreshUser();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  console.log('userInfo', userInfo);
  const changePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      phone_number: e.target.value,
    });
  };
  return (
    <>
      <div onClick={showModal}>个人信息</div>
      <Modal
        title="个人信息"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Flex justify="center" style={{ paddingBottom: 24 }}>
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/minio/upload"
            withCredentials
            headers={{
              'Authorization': localStorage.getItem('token') || '',
            }}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <Avatar
              size={100}
              src={
                userInfo?.profile_picture
                  ? `http://192.168.11.146:9000${userInfo.profile_picture}`
                  : ''
              }
              icon={<UserOutlined />}
            />
          </Upload>
        </Flex>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          initialValues={userInfo}
          preserve={false}
        >
          <Form.Item
            // name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            {userInfo?.username}
            {/* <Input readOnly /> */}
          </Form.Item>
          <Form.Item
            // name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            {userInfo?.email}
            {/* <Input readOnly /> */}
          </Form.Item>
          <Form.Item
            // name="phone_number"
            label="Phone"
            // rules={[
            //   {
            //     pattern: /^1[3456789]\d{9}$/,
            //     message: 'Please input your valid phone number!',
            //   },
            // ]}
          >
            {/* <Input addonBefore={prefixSelector} style={{ width: '100%' }} /> */}
            <Input
              value={userInfo.phone_number}
              style={{ width: '100%' }}
              onChange={changePhoneNumber}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserInfo;
