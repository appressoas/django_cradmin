const path = require('path')
const appconfig = require('./ievv_buildstatic.appconfig.json')

module.exports = {
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, 'source/django_cradmin_all.js')
  ],
  output: {
    filename: 'django_cradmin_all.js',
    path: appconfig.destinationfolder
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'source')]
      }
    ]
  }
}
