import React, { useState } from 'react';
import { Upload, Avatar, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
interface IProps {
  url: string;
}
const UploadAvatar: React.FC<IProps> = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(url); // 默认用户图像地址

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
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <div>
      <Upload
        name="file"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/minio/upload"
        headers={{
          'Authorization': localStorage.getItem('token') || '',
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <Avatar size={100} src={imageUrl} icon={<PlusOutlined />} />
      </Upload>
    </div>
  );
};

export default UploadAvatar;
