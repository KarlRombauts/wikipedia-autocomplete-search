const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    main: ['./src/js/index.js', './src/scss/main.scss'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.[hash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'group-css-media-queries-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.jsx?/,
        use: ['babel-loader', 'webpack-module-hot-accept'],
      },
    ],
  },
  devServer: {},
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: path.resolve(__dirname, './dist/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash:8].css', //extract css to a file
    }),
  ],
}
