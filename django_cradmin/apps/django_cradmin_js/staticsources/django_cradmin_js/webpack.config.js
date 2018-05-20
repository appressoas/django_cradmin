const path = require('path')
const appconfig = require('./ievv_buildstatic.appconfig.json')
const webpackConfig = require('ievv_jsbase/webpackHelpers/webpackConfig')

const config = new webpackConfig.WebpackConfig(appconfig.destinationfolder)
config.enableBabel()
config.addEntry('django_cradmin_all', [
  path.resolve(__dirname, 'source/django_cradmin_all.js')
])

module.exports = config.generate()
