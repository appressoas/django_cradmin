module.exports = (grunt) ->

  appfiles = {
    coffee: ['src/**/*.coffee', '!src/**/*.spec.coffee']
    coffeeunit: ['src/**/*.spec.coffee']
    less: ['src/less/*.less', 'src/less/**/*.less']
  }

  vendorfiles = {
    fonts: [
      'bower_components/fontawesome/fonts/FontAwesome.otf'
      'bower_components/fontawesome/fonts/fontawesome-webfont.eot'
      'bower_components/fontawesome/fonts/fontawesome-webfont.svg'
      'bower_components/fontawesome/fonts/fontawesome-webfont.ttf'
      'bower_components/fontawesome/fonts/fontawesome-webfont.woff'
    ]
    js: [
      'bower_components/angular/angular.min.js'
      # 'bower_components/angular/angular.min.js.map'
      # 'bower_components/angular/angular.js'
      # 'bower_components/angular/angular.js.map'
      'bower_components/angular-bootstrap/ui-bootstrap.min.js'
    ]
    ace_markdown_editor: [
      'bower_components/angular-ui-ace/ui-ace.min.js'
      'bower_components/ace-builds/src-min-noconflict/ace.js'
      'bower_components/ace-builds/src-min-noconflict/mode-markdown.js'
      'bower_components/ace-builds/src-min-noconflict/theme-tomorrow.js'
    ]
  }

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-coffeelint')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    delta:
      less:
        files: appfiles.less
        tasks: 'less'
      coffee:
        files: appfiles.coffee
        tasks: ['coffeelint:code', 'coffee:code']
      gruntfile:
        files: 'Gruntfile.coffee'
        tasks: ['coffeelint:gruntfile']
    less:
      development:
        options:
          paths: ["less", "bower_components"]
        files:
          "dist/css/styles.css": "src/less/styles.less"

    coffeelint:
      code: appfiles.coffee
      tests: appfiles.coffeeunit
      gruntfile: ['Gruntfile.coffee']

    coffee:
      code:
        files:
          'dist/js/cradmin.js': appfiles.coffee

    copy:
      vendor:
        files: [{
          expand: true
          flatten: true
          src: vendorfiles.fonts
          dest: 'dist/vendor/fonts/'
        }, {
          expand: true
          flatten: true
          src: vendorfiles.js
          dest: 'dist/vendor/js/'
        }, {
          expand: true
          flatten: true
          src: vendorfiles.ace_markdown_editor
          dest: 'dist/vendor/js/ace-markdown-editor/'
        }]
  })

  grunt.registerTask('build', [
    'less'
    'coffee:code'
    'copy:vendor'
  ])


  grunt.registerTask('dist', [
    'build'
    # TODO minify
  ])

  # Rename the watch task to delta, and make a new watch task that runs
  # build on startup
  grunt.renameTask('watch', 'delta')
  grunt.registerTask('watch', ['build', 'delta'])

  grunt.registerTask('default', ['build'])
