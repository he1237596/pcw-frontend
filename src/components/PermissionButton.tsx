import React from 'react';
// import { usePermissions } from '../context/PermissionContext';
import { Button, ButtonProps } from 'antd'; // 使用Ant Design的Button组件
import { useUserStore } from '../store/userUserStore';

interface PermissionButtonProps extends ButtonProps {
  permission?: string;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission = '',
  children,
  ...props
}) => {
  const { permissions, checkHasRole } = useUserStore();
  // todo: 玩呢
  if (!permission || permissions.some((p: any) => p.code === 'Sadmin')) {
    return <Button {...props}>{children}</Button>;
  }

  // if (loading) {
  //   return <Button loading>Loading...</Button>;  // 在按钮上显示加载状态
  // }

  if (!checkHasRole(permission)) {
    // 省事为了Sadmin
    return null; // 如果没有权限，返回 null，不显示按钮
  }

  return <Button {...props}>{children}</Button>; // 如果有权限，显示按钮
};

export default PermissionButton;
