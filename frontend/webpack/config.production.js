const path = require('path');
const webpack = require('webpack');
const rootPath = path.resolve(__dirname, '../');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MetaVersionsPlugin = require('./plugins/MetaVersionsPlugin');
const aliases = require('./aliases');
const pkg = require('../package.json');

module.exports = {
  context: path.resolve(__dirname, '../src'),

  entry: ['./index'],

  resolve: {
    alias: aliases,
    modules: [rootPath, 'node_modules'],
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1, localIdentName: '[name]_[local]_[hash:base64:5]' }
            },
            'postcss-loader'
          ]
        })
      }
    ]
  },

  output: {
    path: path.join(rootPath, 'build'),
    filename: 'bundle.js'
  },

  externals: {
    react: 'var React',
    'react-dom': 'var ReactDOM'
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.RUNNER_URL': '"/transform"',
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(rootPath, 'node_modules/monaco-editor/min/vs'),
        to: 'vs'
      },
      {
        from: path.join(rootPath, 'node_modules/@mulesoft/anypoint-styles/lib/anypoint-styles.css'),
        to: 'anypoint-styles.css'
      },
      {
        from: path.join(rootPath, 'static/assets'),
        to: 'assets'
      }
    ]),
    new MetaVersionsPlugin(),
    new ZipPlugin({
      filename: `dw-playground-0.3.zip`,
      path: path.join(rootPath, 'dist')
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
