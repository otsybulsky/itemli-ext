const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv-webpack')

const config = {
  entry: {
    popup: './src/index.js'
  },
  output: {
    path: path.join(path.resolve(__dirname), 'extension', 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules']
  },
  mode: process.env.NODE_ENV
}

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'source-map'
}

module.exports = config
