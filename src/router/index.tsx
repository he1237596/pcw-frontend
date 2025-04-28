import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
// import Home from '@pages/home';
// import Demo from '@pages/demo';
// import Layout from '@layouts/layout';
import SmLayout from '@layouts/SmLayout';
import Projects from '@pages/Projects';
import Login from '@pages/user/Login';
import Register from '@pages/user/Register';
import TranslationKeys from '@pages/TranslationKeys';
// import PermissionRoute from '@components/PermissionRoute';  // 引入权限检查组件
// const Home = React.lazy(() => import('@pages/home'));
// const Demo = React.lazy(() => import('@pages/demo'));
// 创建hash路由
export const mainRoutes = [
  { path: '/', element: <Navigate to="/user/login" replace /> },
  // { path: 'home', element: <Home /> },
  // { path: 'demo', element: <Demo /> },
  { path: 'projects', element: <Projects />, index: true },
  { path: 'languages', element: <TranslationKeys /> },
  // { path: 'projects', element: <PermissionRoute permission="admin" element={<Projects />} />, index: true },
  // { path: 'languages', element: <PermissionRoute permission="user" element={<TranslationKeys />} /> },
  // {
  //   path: '*',
  //   element: <div>404</div>,
  // },
];
export const routes: RouteObject[] = [
  {
    path: '/user',
    element: false,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: '*',
        element: <Navigate to="/user/login" replace />,
      },
    ],
    // errorElement: <div>出错啦</div>,
  },
  {
    path: '/',
    element: <SmLayout />,
    children: mainRoutes,
    errorElement: <div>出错啦</div>,
  },
  { path: '*', element: <div>404</div> },
];
