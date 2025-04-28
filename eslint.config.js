const { defineConfig } = require('eslint-define-config');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginTypescript = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig({
  // defineConfig导致使用 flat config 的配置方式无效
  languageOptions: {
    parser: require('@typescript-eslint/parser'), // 设置自定义的 TypeScript 解析器为对象
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true, // 支持 JSX 语法
      },
      // project: ['./tsconfig.json'], // 不建议加 unless 你要用更严格的规则
    },
  },
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaVersion: 2020,
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  //   // project: ['./tsconfig.json'], // 不建议加 unless 你要用更严格的规则
  // },
  plugins: {
    react: require('eslint-plugin-react'),
    prettier: require('eslint-plugin-prettier'),
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  },

  files: ['src/**/*.{js,ts,tsx}'], // 需要 lint 的文件路径
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: true, // 允许结尾分号
        singleQuote: true, // 允许使用单引号
        trailingComma: 'all', // all: 允许对象结尾有逗号 none: 不允许
        endOfLine: 'auto',
      },
    ],
    semi: ['off'],
    '@typescript-eslint/semi': 'off',
    quotes: 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/no-unused-vars': 'warn', // 未使用变量警告
    '@typescript-eslint/no-explicit-any': 'off', // 想用 any 的话可以关掉
    'react/react-in-jsx-scope': 'off', // React 17+可以不用 import React
    // 'quotes': ['off', 'single', { 'avoidEscape': true }], // 允许单双引号
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
  },
  ignores: ['node_modules/', 'build/', 'dist/', 'public/'], // 忽略的目录或文件
});
