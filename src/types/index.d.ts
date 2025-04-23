// 全局变量声明（比如 window 上的扩展）：
interface Window {
  __MY_CUSTOM_GLOBAL__: string;
}

// 自定义类型声明（比如第三方库没有类型定义）：
// declare module 'some-third-party-lib' {
//   export interface SomeType {
//     name: string
//     age: number
//   }
//   export function someFunction(): SomeType
// }
// 全局 namespace（不推荐，但有些老项目会这样）：
// declare namespace App {
//   interface User {
//     id: string
//     name: string
//   }
// }

// 引入其他类型声明文件(一般是不在 tsconfig.json 中 include 或 typeRoots 配置里的目录下，或者希望确保其被全局加载或者写 .d.ts 文件但没有 import / export，需要确保被其他文件识别)
/* /// <reference path="./common.d.ts" /> */

export {};
