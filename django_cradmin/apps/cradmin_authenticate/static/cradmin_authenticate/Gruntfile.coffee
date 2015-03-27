module.exports = (grunt) ->

  appfiles = {
    coffeecode: ['src/**/*.coffee', '!src/**/*.spec.coffee']
  }

  vendorfiles = {
    js: [

    ]
  }


  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    delta:
      coffeecode:
        files: appfiles.coffeecode
        tasks: [
          'coffeelint:code', 'coffee:code', 'buildCodeDist']
      gruntfile:
        files: 'Gruntfile.coffee'
        tasks: ['coffeelint:gruntfile']

    coffeelint:
      options:
        max_line_length:
          name: "max_line_length"
          value: 120
          level: "warn"
          limitComments: true
      code: appfiles.coffeecode
      gruntfile: ['Gruntfile.coffee']

    coffee:
      code:
        expand: true
        cwd: '.'
        src: appfiles.coffeecode
        dest: '.'
        ext: '.js'

    concat:
      cradmin:
        src: ['src/**/*.js', '!src/**/*.spec.js']
        dest: 'dist/js/cradmin_authenticate.js'

    uglify:
      options:
        mangle: false
        sourceMap: true
      cradmin:
        files:
          'dist/js/cradmin_authenticate.min.js': ['dist/js/cradmin_authenticate.js']

    copy:
      vendor:
        files: [{
          expand: true
          flatten: true
          src: vendorfiles.js
          dest: 'dist/vendor/js'
        }]
  })

  grunt.registerTask('buildCodeDist', [
    'concat:cradmin'
    'uglify:cradmin'
  ])

  grunt.registerTask('build', [
    'coffeelint'
    'coffee:code'
    'buildCodeDist',
    'copy:vendor'
  ])

  grunt.registerTask('dist', [
    'build'
  ])

  # Rename the watch task to delta, and make a new watch task that runs
  # build on startup
  grunt.renameTask('watch', 'delta')
  grunt.registerTask('watch', [
    'build'
    'delta'
  ])

  grunt.registerTask('default', ['build'])