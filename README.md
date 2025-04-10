# 项目名称

Simdeck

## 目录

- [项目名称](#项目名称)
  - [目录](#目录)
  - [项目简介](#项目简介)
  - [技术栈](#技术栈)
  - [安装步骤](#安装步骤)
  - [开发指令](#开发指令)
  - [构建指令](#构建指令)
  - [目录结构](#目录结构)

## 项目简介

速控阵项目

## 技术栈

Webpack 5 + React + Typescript + Antd 5 + react-router 6

## 安装步骤

在项目根目录下运行以下命令来安装依赖：

```bash
npm install
```

## 开发指令

```bash
npm run dev
```

## 构建指令

```bash
npm run build
```

## 目录结构

主要目录结构为下，其他目录待定

├── config/ # Webpack 配置文件夹
├── dist/ # 打包后的生产文件
├── public/ # 静态资源文件 (index.html等)
├── src/ # 项目源码
│ ├── assets/ # 静态资源（图片、字体等）
│ ├── components/ # React 组件
│ ├── constants/ # 常量文件
│ ├── hooks/ # 自定义hooks
│ ├── layouts/ # 布局
│ ├── locales/ # 国际化文件夹
│ ├── pages/ # 视图组件
│ ├── router/ # 路由
│ ├── services/ # 服务/接口
│ ├── store/ # 状态管理（待定）
│ ├── utils/ # 工具函数
│ ├── App.tsx # 应用根组件
│ └── index.tsx # 项目入口文件
├── package.json # 项目配置文件
└── README.md # 项目说明文档
