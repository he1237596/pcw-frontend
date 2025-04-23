import React, { useState, useEffect } from 'react';
import {
  GroupOutlined,
  FieldStringOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  theme,
  Divider,
  Avatar,
  Dropdown,
  Flex,
  Card,
} from 'antd';
import Logo from '@assets/logo.png';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
// import { logout } from '@api/user';
import { generate } from '@ant-design/colors';
const { Header, Content, Footer, Sider } = Layout;
import { useUserStore } from '../../store/userUserStore';
const Logout: React.FC = () => {
  const { logout } = useUserStore();
  const handlerLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/#/user/login';
    logout();
  };
  return <div onClick={handlerLogout}>退出登录</div>;
};
