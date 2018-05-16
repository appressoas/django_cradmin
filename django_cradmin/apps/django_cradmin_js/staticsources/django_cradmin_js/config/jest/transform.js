let babelJest = require('babel-jest')

module.exports = babelJest.createTransformer({
  presets: [
    'react',
    ['env', {
      'targets': {
        'node': 'current'
      }
    }]
  ]
})
