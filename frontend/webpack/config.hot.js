const webpack = require('webpack');
const path = require('path');
//const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const rootPath = path.resolve(__dirname, '../');
const aliases = require('./aliases');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(`
     ___________________________________________
()==(                                           (@==()
     '__________________________________________'|
       |                                         |
       |   Let this long package float,          |
       |   Goto private class if short.          |
       |   While protected with debugger case,   |
       |   Continue volatile interface.          |
       |   Instanceof super synchronized throw,  |
       |   Extends final export throws.          |
       |   Try import double enum?               |
       |   - False, boolean, abstract function,  |
       |   Implements typeof transient break!    |
       |   Void static, default do,              |
       |   Switch int native new.                |
       |   Else, delete null public var          |
       |   In return for const, true, char       |
       |   ...Finally catch byte.                |
     __)_________________________________________|
()==(                                           (@==()
     '-------------------------------------------'               
`);

module.exports = {
  context: rootPath,

  entry: ['webpack-hot-middleware/client', './src/index'],

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
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1, localIdentName: '[name]_[local]_[hash:base64:5]' }
          },
          'postcss-loader'
        ]
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
    /*new HappyPack({
      id: 'ts',
      threads: 3,
      loaders: [
        {
          path: 'ts-loader',
          query: { happyPackMode: true }
        }
      ]
    }),*/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.RUNNER_URL': '"http://localhost:8081/transform"',
    }),
    new CopyWebpackPlugin([
      {
        from: '.',
        to: 'vs'
      },
      {
        from: path.join(rootPath, 'node_modules/@mulesoft/anypoint-styles/lib/anypoint-styles.css'),
        to: 'anypoint-styles.css'
      },
      {
        from: path.join(rootPath, 'static/assets'),
        to: 'assets'
      },
      {
        from: path.join(rootPath, 'static/index.html'),
        to: 'index.html'
      }
    ]),
    //
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.npm_package_version': JSON.stringify(require('../package.json').version)
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
