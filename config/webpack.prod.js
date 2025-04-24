const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: process.env.PUBLIC_PAHT,
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
    clean: true,
  },
  devtool: false,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 50 * 1024, // 最小字节数，低于此大小的 chunks 不进行拆分，默认为20000
      maxSize: 0, // 不限制 chunks 的最大大小
      minChunks: 3, // 当某个模块被至少引用 `minChunks` 次时，才拆分
      // maxAsyncRequests: 5, // 异步加载的最大并发数
      maxInitialRequests: 5, // 初始加载的最大请求数
      automaticNameDelimiter: '-', // 拆分时生成的文件名分隔符
      name: false, // 禁用自动生成的名字
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -20,
          // minChunks: 3, // 最少被 1 个 chunk 使用
          enforce: true,
          reuseExistingChunk: true,
        },
        // react: {
        //   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        //   name: 'react',
        //   chunks: 'all',
        //   priority: 10,
        //   reuseExistingChunk: true,
        //   enforce: true,
        // },
        reactVendor: {
          // test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router|zustand|i18next|react-i18next)[\\/]/,
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router)[\\/]/,
          name: 'react-vendor',
          priority: 20,
          enforce: true,
          reuseExistingChunk: true,
          //  reuseExistingChunk: true, // 如果当前 chunk 包含已拆分代码，则使用该拆分代码，而不是重新创建一个新包
        },
      // zustandVendor: {
      //   test: /[\\/]node_modules[\\/]zustand/i,
      //   name: 'zustand-vendor',
      //   chunks: 'all',
      //   priority: 10,
      //   enforce: true,
      //   reuseExistingChunk: true,
      // },
      axiosVendor: {
        test: /[\\/]node_modules[\\/]axios/i,
        name: 'axios-vendor',
        chunks: 'all',
        priority: 10,
        enforce: true,
        reuseExistingChunk: true,
      },
      antdVendor: {
        test: /[\\/]node_modules[\\/]antd/i,
        name: 'antd-vendor',
        chunks: 'all',
        priority: 15,
        enforce: true,
        reuseExistingChunk: true,
      },
      i18nextVendor: {
        test: /[\\/]node_modules[\\/]i18next/i,
        name: 'i18next-vendor',
        chunks: 'all',
        priority: 10,
        enforce: true,
        reuseExistingChunk: true,
      },
      },
    },
    // runtimeChunk: 'single',  // 将运行时代码拆分为单独的文件，避免因更新业务代码而导致缓存失效
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name].[hash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      // favicon: path.resolve(__dirname, '../public/fav.png'),
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true, //把我的fav.png删了，不知道是不是这个原因
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../public/fav.png'), to: 'fav.png' }
      ],
    }),
  ],
});
