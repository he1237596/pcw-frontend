// 确保这个文件是模块，防止全局污染
import { TablePaginationConfig } from 'antd';

// ✅ 全局变量扩展（比如 window 上挂的变量）
declare global {
  interface Window {
    // __MY_CUSTOM_GLOBAL__: string;
  }

  // ✅ 全局通用类型（不想每次都 import）
  type Nullable<T> = T | null;
  type ApiResponse<T> = {
    code: number;
    data: T;
    message?: string;
  };

  type PaginationProps = Pick<TablePaginationConfig, 'current' | 'pageSize'> & {
    search?: any;
  };

  // 如果需要：
  type Maybe<T> = T | null | undefined;
}

export {};
