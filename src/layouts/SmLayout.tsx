import React, { useState, useEffect } from 'react';
import {
  GroupOutlined,
  FieldStringOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Divider, Avatar, Dropdown, Flex, Card, Spin } from 'antd';
import Logo from '@assets/logo.png';
import UserInfo from '@components/user/UserInfo';
import UpdatePassword from '@components/user/UpdatePassword';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '@api/user';
import { generate } from '@ant-design/colors';
import { usePermissions } from '../context/PermissionContext'
const { Header, Content, Footer, Sider } = Layout;
const Logout: React.FC = () => {
  const handlerLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/#/user/login';
    logout()
  }
  return <div onClick={handlerLogout}>退出登录</div>;
}

const items = [
  {
    key: 'setting',
    icon: React.createElement(UserOutlined),
    label: <UserInfo />,
  },
  {
    key: 'updatePassword',
    icon: React.createElement(SettingOutlined),
    label: <UpdatePassword />,
  },
  {
    key: 'logout',
    icon: React.createElement(PoweroffOutlined),
    label: <Logout />,
  },
];
const menuItems = [
  {
    key: '/projects',
    icon: <GroupOutlined />,
    label: 'Projects',
    // label: (
    //   <Link to="/projects">
    //   Projects
    //   </Link>
    // ),
  },
  {
    key: '/languages',
    icon: <FieldStringOutlined />,
    label: 'Languages'
    // (
    //   <Link to="/projects/1/keys">
    //   Languages
    //   </Link>
    // ),
  },
]
const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();
  // const lightColor = generate(colorBgContainer)[9]; // 生成更浅的颜色
  const location = useLocation() // 获取当前路径
  const navigate = useNavigate()
  const { loading } = usePermissions();
  // const getSelectedKey = () => {
  //   const hashPath = window.location.hash.replace('#', '')
  //   console.log(location.pathname, hashPath)
  //   // return items.find(item => hashPath.startsWith(item.key))?.key || '/user'
  //   return location.pathname || '/404'
  // }

  const [selectedKey, setSelectedKey] = useState(location.pathname)

  // useEffect(() => {
  //   const handleHashChange = () => {
  //     console.log(location.pathname, 'location.pathname', location)
  //     setSelectedKey(location.pathname)
  //   }
  //   window.addEventListener('hashchange', handleHashChange)
  //   return () => window.removeEventListener('hashchange', handleHashChange)
  // }, [])

  useEffect(() => {
    console.log(location.pathname, 'location.pathname', location);
    setSelectedKey(location.pathname);
  }, [location.pathname]); // 依赖 pathname，变化时触发

  console.log(selectedKey, 'selectedKey')

  return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          // collapsed
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          collapsible
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            background: colorBgLayout,
            // '& .ant-menu-item': {
            //   width: '100%',
            // },
            borderRight: '1px solid var(--ant-color-split)',
            // '& .ant-menu-item': {
            //   width: '100%',
            // },
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 64,
              // borderBottom: '1px solid var(--ant-color-split)',
            }}
          >
            <img src={Logo} alt="logo" />
          </div>
          {/* <Divider /> */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => {
              setSelectedKey(e.key)
              navigate(e.key)
            }}
            // defaultSelectedKeys={[location.pathname]}
            style={{
              background: colorBgLayout,
              borderRight: 'none',
            }}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgLayout, borderBottom: '1px solid var(--ant-color-split)'}}>
            <Flex justify='flex-end' align='center' style={{ height: '100%', paddingRight: 24 }}>
              <Divider type="vertical" style={{ height: '80%', padding: '0 8px' }} />
              <Dropdown menu={{ items }} placement="bottomRight">
                {/* <Avatar size={40} src={<img src={Logo} alt="avatar" style={{ cursor: 'pointer' }} />} /> */}
                <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} />
              </Dropdown>
            </Flex>
          </Header>
          <Content style={{ background: colorBgContainer}}>
            <div
              style={{
                // margin: 16,
                // minHeight: 360,
                height: '100%',
                // background: 'red',
                // borderRadius: borderRadiusLG,
                boxSizing: 'border-box',
                padding: 8,
              }}
            >
              {/* <div
                style={{
                  // flex: 1,
                  background: colorBgContainer
                  // minHeight: 360,
                  // height: 'calc(100% -32px)',
                  // background: colorBgContainer,
                  // borderRadius: borderRadiusLG,
                  // overflow: 'hidden',
                }}
              > */}
              {
                loading ? (
                  <Spin size="large"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} />  // 页面级别显示加载指示器
                ) : <Outlet />
              }
              {/* </div> */}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', borderTop: '1px solid var(--ant-color-split)'}}>
            Simgic ©{new Date().getFullYear()} Created by Chris
          </Footer>
        </Layout>
      </Layout>
  );
};

export default App;
