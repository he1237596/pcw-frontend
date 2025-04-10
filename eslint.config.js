const { defineConfig } = require('eslint-define-config');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginTypescript = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = defineConfig({
  // 使用 flat config 的配置方式
  // languageOptions: {
  //   parser: typescriptEslintParser, // 设置自定义的 TypeScript 解析器为对象
  //   parserOptions: {
  //     ecmaVersion: 2020,
  //     sourceType: 'module',
  //     ecmaFeatures: {
  //       jsx: true, // 支持 JSX 语法
  //     },
  //   },
  // },
  // plugins: {
  //   react: eslintPluginReact,
  //   prettier: eslintPluginPrettier,
  //   '@typescript-eslint': eslintPluginTypescript,
  // },
  // files: ['src/**/*.{js,ts,tsx}'], // 需要 lint 的文件路径
  // rules: {
  //   'prettier/prettier': [
  //     'warn',
  //     {
  //       semi: false, // 可以设置为 true 或 false
  //       singleQuote: false, // 允许使用单引号和双引号
  //       trailingComma: 'none', // 允许对象结尾有逗号
  //       endOfLine: 'auto',
  //     },
  //   ],
  //   'semi': ['off'], // 不强制要求分号
  //   '@typescript-eslint/semi': ['off'], // 不检查 TypeScript 中的分号
  //   'quotes': ['off', 'single', { 'avoidEscape': true }], // 允许单双引号
  //   '@typescript-eslint/quotes': ['off'],
  //   '@typescript-eslint/no-unused-vars': ['off'], // 启用未使用变量检查
  //   'react/react-in-jsx-scope': 'off',
  // },
  // settings: {
  //   react: {
  //     version: 'detect', // 自动检测 React 版本
  //   },
  // },
  // ignores: ['node_modules', 'build'], // 忽略的目录或文件
});
