const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');
const NODE_ENV = process.env.NODE_ENV || 'dev';

const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

console.log(path.resolve(__dirname, `src/.env/${NODE_ENV}.ts`));

module.exports = {
  entry: {
    js: './src/index.ts',
  },
  output: {
    path: outputPath,
    filename: 'script.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      env$: path.resolve(__dirname, `src/.env/${NODE_ENV}.ts`)
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.(js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(sc|c|sa)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
  ],
  devServer: {
    contentBase: outputPath,
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8000
  }
};