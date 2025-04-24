module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      // 没错 我想显式得配置,否则可以启用注释得这行，启用得话页面内import xx from "@/assets/xxxx"
      // 注意: tsconfig也要配置,否则会报错
      // '@': path.resolve(__dirname, '../src'),
      '@assets': path.resolve(__dirname, '../src/assets'), //import xx from "@assets/xxxx"
      '@components': path.resolve(__dirname, '../src/components'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@constants': path.resolve(__dirname, '../src/constants'),
      '@locales': path.resolve(__dirname, '../src/locales'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@router': path.resolve(__dirname, '../src/router'),
      '@api': path.resolve(__dirname, '../src/api'),
      '@context': path.resolve(__dirname, '../src/context'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@layouts': path.resolve(__dirname, '../src/layouts'),
      '@store': path.resolve(__dirname, '../src/store'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
