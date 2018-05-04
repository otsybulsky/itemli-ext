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
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
  mode: process.env.NODE_ENV
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new dotenv({
      path: './config/prod.env'
    })
  )
} else {
  config.plugins.push(
    new dotenv({
      path: './config/dev.env'
    })
  )
  config.devtool = 'source-map'
}

module.exports = config
