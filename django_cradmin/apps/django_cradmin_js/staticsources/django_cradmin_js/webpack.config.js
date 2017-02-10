const path = require('path');
const webpack = require('webpack');
const appconfig = require("./ievv_buildstatic.appconfig.json");

const webpackConfig = {
  entry: path.resolve(__dirname, 'source/django_cradmin_all.js'),
  output: {
    filename: 'django_cradmin_all.js',
    path: appconfig.destinationfolder,
    target: 'web'
  },
  resolve: {
    root: [path.resolve(__dirname, 'node_modules')],
    extensions: [".js", ".jsx", ""]
  },
  resolveLoader: {
    // We only want loaders to be resolved from node_modules
    // in this directory (not in any of the other packages, and
    // not from other directories).
    root: path.resolve(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "source")],
        query: {
          presets: [
            'babel-preset-es2015',
            'babel-preset-react'
          ].map(require.resolve),
        }
      },
      {
        test: /.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: []
};

if(appconfig.is_in_production_mode) {
  webpackConfig.devtool = 'source-map';
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  );
} else {
  webpackConfig.devtool = 'cheap-module-eval-source-map';
  webpackConfig.output.pathinfo = true;
}


module.exports = webpackConfig;
