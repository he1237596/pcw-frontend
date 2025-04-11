import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Card, Col, Flex, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { getUserInfo, login } from '@api/user';
import { useUserStore } from '../../store/userUserStore'
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
import { message } from 'antd';
// import bcrypt from 'bcryptjs'
// import md5 from 'md5'
import { SHA256 } from 'crypto-js';
// const handleHash = (password: string) => {
//   const salt = bcrypt.genSaltSync(10) // 生成盐值（推荐 10 以上）
//   return bcrypt.hashSync(password, salt) // 生成哈希
// }
// return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
const Logo: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="245"
      height="32"
      viewBox="0 0 245 32"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.3247 6.41406H19.0124L16.3613 12.7109H24.6247L27.3247 6.41406Z"
        fill="#FF0000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.9269 19.0079H13.6146L10.9635 25.3047H19.2269L21.9269 19.0079Z"
        fill="#FF0000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.3613 12.7111H8.09552L5.39795 19.0079H13.6145L16.3613 12.7111Z"
        fill="#FF0000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.69884 25.3047L0 31.6016H8.2178L10.9634 25.3047H2.69884Z"
        fill="#FF0000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.4414 19.0456L32.3846 25.3023L18.7639 25.2791L15.8105 31.6165L31.659 31.6233C35.1545 31.6233 38.2527 29.8197 39.5508 27.0266L41.5427 22.7405C42.5925 20.4839 42.2725 17.9358 40.6889 15.9241C39.1052 13.9125 36.476 12.7109 33.6509 12.7109H24.621L21.669 19.0443L35.4414 19.0456Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.1104 6.41408L52.1286 0L30.2864 0.0561078L27.3247 6.41271L49.1104 6.41408Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M230.123 32H212.946C210.138 32 207.513 30.8094 205.928 28.8142C204.341 26.8203 204.001 24.2859 205.019 22.0334L212.766 4.86441C214.044 2.02755 217.158 0.193787 220.693 0.193787H244.234L241.232 6.53806L219.897 6.52848L211.272 25.6653L233.168 25.6311L230.123 32Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52.3168 31.6668H44.3878L59.0706 0.106812L66.9914 0.121865L52.3168 31.6668Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M74.9403 0.272949L59.5056 31.8794H67.4981L79.4304 7.44243L87.1291 7.44927L75.1982 31.8794H83.1508C83.1508 31.8794 93.2801 11.1852 95.1078 7.45474L102.829 7.46022L90.9088 31.8794H98.8834L114.315 0.275686L74.9403 0.272949Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M178.861 31.7912L155.142 31.9116C152.244 31.9116 149.574 30.6608 148 28.5657C146.427 26.4705 146.198 23.8622 147.389 21.5878L156.37 4.42841C157.743 1.80641 160.784 0.116333 164.125 0.116333H164.157L193.593 0.287393L190.732 6.56051L164.123 6.44829H164.117C163.902 6.44829 163.369 6.4524 163.369 6.4524C163.369 6.4524 163.176 6.84789 163.083 7.02853L154.1 24.1893C153.877 24.6135 153.364 25.5796 153.364 25.5796C153.364 25.5796 154.602 25.5783 155.142 25.5783L173.104 25.566L176.222 19.2915L167.2 19.1683L170.613 12.8815L187.684 13.1128L178.861 31.7912Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M193.436 31.9214L185.49 31.931L200.337 0.376465H208.279L193.436 31.9214Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M134.967 31.8367L124.667 10.383L114.365 31.8367H106.357L121.625 0.373901H127.714L142.976 31.8367H134.967Z"
        fill="white"
      />
    </svg>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser)
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const { username = '', password = '', remember } = values;
    if (remember) {
      localStorage.setItem('remember', remember);
      localStorage.setItem('username', username);
    }

    const params = {
      username,
      password: SHA256(password).toString(),
    };
    // console.log(md5(password), params)
    const res = await login(params);
    console.log(res, 8888);
    if (res.code === 200) {
      message.success('登录成功');
      localStorage.setItem('token', res.data.token);
      getUserInfo().then((res) => {
        if (res.code === 200) {
          // setUserInfo(res.data);
          setUser(res.data)
          console.log(res.data, 9999999999999)
          navigate('/projects');
        }
      });
      
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  // useEffect(() => {
  //   localStorage.clear();
  // }, [])

  return (
    <Layout style={{ height: '100vh' }}>

      <Content>
        {/* <Card> */}
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ height: '100%' }}
          gap={40}
        >
          <Logo />
          <h2>登录</h2>
          <Flex justify="center" align="center">
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{
                remember: localStorage.getItem('remember'),
                username: localStorage.getItem('username') || '',
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}
              >
                {/* <Input prefix={<UserOutlined />} /> */}
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                {/* <Input.Password prefix={<LockOutlined />} /> */}
                <Input.Password />
              </Form.Item>

              <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                label={null}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item label={null}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 88 }}
                >
                  Submit
                </Button>
              </Form.Item>
              <Form.Item label={''} labelAlign='right'>
              没有账号?去<Button variant="link" size="small" type="link" href={`/#/user/register`}>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </Flex>
        </Flex>
        {/* </Card> */}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Simgic ©{new Date().getFullYear()} Created by Chris
      </Footer>
    </Layout>
  );
};

export default App;
