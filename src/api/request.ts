import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  isAxiosError,
} from 'axios';
// import { message } from 'antd'
import { message } from '@components/Tips';
import {
  handleAuth,
  handleGeneralError,
  handleAuthError,
} from '../utils/requestTools';
interface ListData {
  list: any[];
  total: number;
}

interface ApiResponse<T = any> {
  code: number;
  data: any;
  message: string;
  [key: string]: any;
}

/** 取消重复请求 */
const pendingRequests = new Map<string, AbortController>();

/** 生成请求 Key */
const getRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
};
// const baseUrl = process?.env?.REACT_APP_API_BASE_URL
/** 创建 Axios 实例 */
const service = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  baseURL: 'http://192.168.11.146:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** 请求拦截器 */
service.interceptors.request.use(
  (config) => {
    // 取消重复请求
    const requestKey = getRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort();
    }
    const controller = new AbortController();
    pendingRequests.set(requestKey, controller);
    config.signal = controller.signal;

    handleAuth(config);
    // 添加 token
    // const token = localStorage.getItem('token') || ''
    // if (token) {
    //   config.headers.Authorization = token
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/** 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求成功，删除 pending 请求
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    console.log(response.status, response.data);
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }

    if (response.status !== 200) return Promise.reject(response);

    if (response.data instanceof Blob) {
      return response;
    }

    const { code, msg } = response.data || {};
    // handleGeneralError(response.data.errno, response.data.errmsg)
    // handleAuthError(response.data.errno)

    if (code === 401) {
      // message.warning('未授权，请登录');
      message.error(msg);
      window.location.href = '/#/user/login';
      return response;
    }
    if (code === 402) {
      // message.error('授权过期，请重新登录');
      message.error(msg);
      window.location.href = '/#/user/login';
      return response;
    }
    if (code === 403) {
      // message.warning('无权限访问');
      message.error(msg);
      return response;
    }
    if (code === 404) {
      // message.warning('无权限访问');
      message.error(msg);
      return response;
    }
    if (code === 500) {
      // message.error('服务器错误');
      message.error(msg);
      return response;
    }
    if (code === 429) {
      // message.error('服务器错误');
      message.error(msg);
      return response;
    }
    return response; // ✅
  },
  (error: unknown) => {
    console.log('请求失败:', error);
    if (axios.isCancel(error as Error)) {
      console.warn('请求被取消:', (error as Error).message);
      return Promise.reject(error);
    }

    if (isAxiosError(error)) {
      const status = error.response?.status;
      switch (status) {
        // case 401:
        //   message.error('未授权，请登录')
        // //   // 这里可以触发退出逻辑
        // //   break
        // case 402:
        //   message.error('授权过期，请重新登录')
        //   // // 这里可以触发退出逻辑
        //   const navigate = useNavigate();
        //   navigate('/user/login', { replace: true })
        //   break
        // case 403:
        //   message.error('无权限访问')
        //   break
        case 429:
          message.error('请求过于频繁，请稍后再试');
        case 500:
          message.error('服务器错误');
          break;
        default:
          console.log('请求失败，状态码:', status, '信息：', error.message);
          message.error(error.message);
        // message.error(error.response?.data?.message || '请求失败')
      }
    } else {
      // message.error('请求失败')
    }
    return Promise.reject(error);
  },
);

/** 封装常用请求方法 */
const request = {
  get<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    // return service.get<ApiResponse<T>>(url, { params, ...config }).then((res) => res.data);
    return new Promise((resolve, reject) => {
      service
        .get<ApiResponse<T>>(url, { params, ...config })
        .then((res) => resolve(res.data))
        .catch((err) => {
          // if (err.code) {
          //   resolve({
          //     code: err.code || -1,
          //     data: null,
          //     message: err.message
          //   })
          // }
          resolve({
            code: err?.code || -1,
            data: null,
            message: err.message,
          });
        });
    });
  },
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    // return service.post<ApiResponse<T>>(url, data, config).then((res) => res.data);
    return new Promise((resolve, reject) => {
      service
        .post<ApiResponse<T>>(url, data, config)
        .then((res) => resolve(res.data))
        .catch((err) => {
          if (err.code) {
            resolve({
              code: err.code || -1,
              data: null,
              message: err.message,
            });
          }
        });
    });
  },
  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    // return service.put<ApiResponse<T>>(url, data, config).then((res) => res.data);
    return new Promise((resolve, reject) => {
      service
        .put<ApiResponse<T>>(url, data, config)
        .then((res) => resolve(res.data))
        .catch((err) => {
          if (err.code) {
            resolve({
              code: err.code || -1,
              data: null,
              message: err.message,
            });
          }
        });
    });
  },
  delete<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    // return service.delete<ApiResponse<T>>(url, { params, ...config }).then((res) => res.data);
    return new Promise((resolve, reject) => {
      service
        .delete<ApiResponse<T>>(url, { params, ...config })
        .then((res) => resolve(res.data))
        .catch((err) => {
          if (err.code) {
            resolve({
              code: err.code || -1,
              data: null,
              message: err.message,
            });
          }
        });
    });
  },
  // get带token的下载文件
  // todo: 未测试
  downloadFile<T>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      service
        .get(url, {
          responseType: 'blob',
          params,
          ...config,
        })
        .then((res: AxiosResponse<Blob>) => {
          // resolve(res.data)
          console.log(res);
          // const blob = await res.blob();
          const blob = new Blob([res.data], {
            type: res.headers['content-type'] || 'application/octet-stream',
          });
          const url = window.URL.createObjectURL(blob);
          // 创建下载链接
          const a = document.createElement('a');
          a.href = url;
          const contentDisposition = res.headers['content-disposition'];
          let filename = 'export.csv'; // 默认文件名
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match) {
              filename = decodeURIComponent(match[1]);
            }
          }
          a.download = res.config?.params?.filename || filename; // 这里可以改成 'export.xlsx'
          document.body.appendChild(a);
          a.click();
          // 释放 URL
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          message.success('操作成功');
          resolve();
        })
        .catch((err) => {
          if (err.code) {
            message.error(err.message);
          }
        });
    });
  },
};

export default request;
