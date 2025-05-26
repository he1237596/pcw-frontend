const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    publicPath: process.env.PUBLIC_PAHT,
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
  },
  stats: {
    colors: true,
    reasons: true,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'), // 新的配置
      // 这里还可以添加其他static相关的配置选项
    },
    hot: true,
    compress: false,
    // watchFiles: {
    //   paths: ['src/**/*'],
    //   options: {
    //     usePolling: true,
    //     interval: 1000,
    //   },
    // },
    // ... 其他Dev Server配置 ...
    // proxy: [
    //   {
    //     context: ['/api'],
    //     target: 'http://192.168.11.146:8888',
    //     changeOrigin: true,
    //     secure: false,
    //     pathRewrite: {
    //         '^/api': '/api'
    //     }
    //   }
    // ]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
        // generator: {
        //   filename: 'static/images/[name]_[hash:10][ext][query]'
        // }
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: 'asset/resource',
        // generator: {
        //   filename: 'static/media/[name]_[hash:10][ext][query]'
        // }
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      // favicon: path.resolve(__dirname, '../public/favicon.ico'),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});
