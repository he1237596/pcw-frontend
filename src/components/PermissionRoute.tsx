import React from 'react';
import { Navigate } from 'react-router-dom';
// import { usePermissions } from '../context/PermissionContext'; // 假设你有权限上下文
import { useUserStore } from '@store/userUserStore';

interface PermissionRouteProps {
  element: React.ReactNode;
  permission?: string; // 要检查的权限
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({
  element,
  permission = '',
}) => {
  // const { permissions } = usePermissions();
  const { permissions, checkHasRole } = useUserStore();
  // todo: 玩呢
  if (!permission || permissions.some((p) => p.code === 'Sadmin')) {
    return <>{element}</>;
  }
  // 如果没有权限，重定向到登录页面或提示无权限
  if (!checkHasRole(permission)) {
    return <Navigate to="/user/login" replace />;
  }

  return <>{element}</>; // 如果有权限，渲染元素
};

export default PermissionRoute;
