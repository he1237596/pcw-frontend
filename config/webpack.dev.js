const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ReactRefreshWebpackPlugin(),
  ],
};
