import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { getUserInfo } from '@/api/user';

// 定义权限数据的类型
interface Permission {
  // 根据你的实际权限结构调整类型
  id?: string;
  name: string;
  code: string;
}

// 定义上下文的类型
interface PermissionContextType {
  permissions: Permission[]; // 权限列表
  loading: boolean; // 权限加载状态
}

// 创建上下文并提供默认值
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context; // 返回权限列表和加载状态
};

interface PermissionProviderProps {
  children: ReactNode; // 子组件
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 添加loading状态

  useEffect(() => {
    // 获取用户权限
    getUserInfo().then((res) => {
      if (res.code === 200) {
        setPermissions([
          {
            // id: res.data.id,
            code: res.data.roleCode,
            name: res.data.roleName
          }
        ]);
      }
      setLoading(false); // 设置加载状态为false
    }).catch((error) => {
      console.error('Error fetching user permissions:', error);
      setLoading(false); // 设置加载状态为false
    })
  }, []);

  return (
    <PermissionContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};
