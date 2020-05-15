
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const CSSPlugin = new MiniCSSExtractPlugin({
  filename: 'style.[contenthash].css'
})

const HTMLPlugin = new HTMLWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html'
})

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /.js(x)?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /.(sa|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /.(ttf|otf|png|jpg|jpeg|mp4)/,
        use: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  },
  plugins: [HTMLPlugin, CSSPlugin],
  devtool: 'inline-source-map'
}
