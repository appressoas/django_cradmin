const appconfig = require("./ievv_buildstatic.appconfig.json")

// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!source)/, // Files that are not in `source`.
      'source.js': /^source/
    }
  }
}

exports.plugins = {
  babel: {
    presets: [
      'react',
      ['env', {
        targets: {
          browsers: ['last 2 versions']
        }
      }]
    ]
  }
}

exports.paths = {
  public: appconfig.destinationfolder,
  watched: ['source']
}

exports.overrides = {
  production: {
    optimize: true,
    sourceMaps: false,
    plugins: {autoReload: {enabled: false}}
  }
}

exports.modules = {
  wrapper: false
}
