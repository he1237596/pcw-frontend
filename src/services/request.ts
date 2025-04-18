import type {
  AxiosError,
  AxiosInstance,
  AxiosProgressEvent,
  AxiosRequestConfig,
} from 'axios';
import axios from 'axios';
export interface Upload {
  url: string;
  formData: FormData;
  controller?: AbortController;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface UploadStream {
  url: string;
  file: File;
  controller?: AbortController;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface AxiosDownload {
  url: string;
  data?: object;
  fileName?: string; //用于自定义文件名
  otherConfig?: AxiosRequestConfig;
  controller?: AbortController;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface UrlDownload {
  fileUrl: string;
  fileName: string;
  serveBaseUrl?: string;
}
/** 定义axios基础配置 */
export const axiosBaseOptions: AxiosRequestConfig = {
  baseURL: '/jsonrpc',
  timeout: 8000,
};

// function analysisFilename(contentDisposition: string): string {
//   let regex = /filename\*=\S+?''(.+?)(;|$)/
//   if (regex.test(contentDisposition)) {
//     return RegExp.$1
//   }
//   regex = /filename="{0,1}([\S\s]+?)"{0,1}(;|$)/
//   if (regex.test(contentDisposition)) {
//     return RegExp.$1
//   }
//   return '文件名获取异常'
// }

class MyAxios {
  private readonly axiosInstance: AxiosInstance;
  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options);
    this.initInterceptors();
  }

  private initInterceptors() {
    // 请求拦截  上传数据的加密处理在这里配置
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // const token: string | null = localStorage.getItem('token')
        // if (token) {
        //   config.headers['authorization'] = `Bearer ${token}`
        // }
        // console.log(`本次请求的config信息：`, config)
        return config;
      },
      (error) => {
        console.log(`axios请求拦截部分报错，错误信息error`, error);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { data } = response;
        console.log('data', data);
        if (data.rsCode !== 0) {
          alert(`${data.rsCause}`);
          return Promise.reject(data.data);
        }
        if (data instanceof Blob) {
          return response;
        } else {
          return data.data;
        }
      },
      (error: AxiosError) => {
        console.log('axios响应拦截部分发生错误，错误信息为', error);

        //需要对错误进行提示？
        //以下Message是ElementUI库的全局提示组件 当然我们可以更改
        //若ElementUI 需要在头部引入   import { Message } from 'element-ui';
        /*    if(error?.response){
              switch (error.response.status){
                  case 400:
                      Message.error('请求错误');
                      break;
                  case 401:
                      Message.error('未授权访问');
                      break;
                  case 404:
                      Message.error('资源未找到');
                      break;
                  default:
                      Message.error('其他错误信息');
              }
          }*/

        return Promise.reject(error);
      },
    );
  }

  get<T>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.get(url, { params: data });
  }

  post<T>(url: string, data?: object, params?: object): Promise<T> {
    return this.axiosInstance.post(url, data, { params });
  }

  put<T>(url: string, data?: object, params?: object): Promise<T> {
    return this.axiosInstance.put(url, data, { params });
  }

  delete<T>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.delete(url, { params: data });
  }

  upload<T>(data: Upload): Promise<T> {
    const { url, formData, controller, onUploadProgress } = data;
    return this.axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined, //用于文件上传可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824
    });
  }

  async uploadStream<T>(data: UploadStream): Promise<T> {
    const { url, file, controller, onUploadProgress } = data;
    /** generateSHA 生成文件SHA256 hash  用于标识文件唯一性 往往会用上 这里会用到crypto-js库 **/
    // async function generateSHA(file: File): Promise<string> {
    //   const wordArray = CryptoJs.lib.WordArray.create(await file.arrayBuffer())
    //   const sha256 = CryptoJs.SHA256(wordArray)
    //   //转16进制
    //   return sha256.toString()
    // }
    // const Hash = await generateSHA(File)
    const fileArrayBuffer = await file.arrayBuffer();
    return this.axiosInstance.post(url, fileArrayBuffer, {
      headers: { 'Content-Type': 'application/octet-stream' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined, //用于文件上传可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824
    });
  }

  // axiosDownload(params: AxiosDownload): Promise<{ fileName: string }> {
  //   const { url, data, controller, fileName, onDownloadProgress } = params
  //   return new Promise((resolve, reject) => {
  //     this.axiosInstance
  //       .get<Blob>(url, {
  //         params: data,
  //         responseType: 'blob',
  //         onDownloadProgress,
  //         signal: controller ? controller.signal : undefined, //用于文件下载可以取消  只需在外部调用controller.abort()即可。 参考//https://juejin.cn/post/6954919023205154824以及https://axios-http.com/zh/docs/cancellation
  //       })
  //       .then((res) => {
  //         const blob = new Blob([res.data])
  //         const a = document.createElement('a')
  //         a.style.display = 'none'
  //         if (fileName) {
  //           a.download = fileName
  //         } else {
  //           a.download = decodeURIComponent(analysisFilename(res.headers['content-disposition']))
  //         }
  //         a.href = URL.createObjectURL(blob)
  //         document.body.appendChild(a)
  //         const downloadFileName = a.download
  //         a.click()
  //         URL.revokeObjectURL(a.href)
  //         document.body.removeChild(a)
  //         resolve({ fileName: downloadFileName })
  //       })
  //       .catch((err) => {
  //         reject(err)
  //       })
  //   })
  // }

  urlDownload(params: UrlDownload) {
    const { fileName, serveBaseUrl, fileUrl } = params;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = fileName;
    a.href = fileUrl.startsWith('http') ? fileUrl : `${serveBaseUrl}${fileUrl}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href); // 释放URL 对象
    document.body.removeChild(a);
  }
}

export const request = new MyAxios(axiosBaseOptions);
