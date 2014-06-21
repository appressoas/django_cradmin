module.exports = (grunt) ->

  appfiles = {
    coffee: ['src/**/*.coffee', '!src/**/*.spec.coffee']
    coffeeunit: ['src/**/*.spec.coffee']
    less: ['src/less/*.less', 'src/less/**/*.less']
  }

  vendorfiles = [
    'bower_components/fontawesome/fonts/FontAwesome.otf'
    'bower_components/fontawesome/fonts/fontawesome-webfont.eot'
    'bower_components/fontawesome/fonts/fontawesome-webfont.svg'
    'bower_components/fontawesome/fonts/fontawesome-webfont.ttf'
    'bower_components/fontawesome/fonts/fontawesome-webfont.woff'
  ]

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
        tasks: ['coffeelint:code', 'coffee:devbuild']
      gruntfile:
        files: 'Gruntfile.coffee'
        tasks: ['coffeelint:gruntfile']
    less:
      development:
        options:
          paths: ["less", "bower_components"]
        files:
          "dist/styles.css": "src/less/styles.less"

    coffeelint:
      code: appfiles.coffee
      tests: appfiles.coffeeunit
      gruntfile: ['Gruntfile.coffee']

    coffee:
      devbuild:
        expand: true
        flatten: false
        cwd: '.'
        src: appfiles.coffee
        dest: 'devbuild/'
        ext: '.js'

    copy:
      vendor:
        files: [
          {
            expand: true
            flatten: true
            src: vendorfiles
            dest: 'dist/'
          }
        ]
  })

  grunt.registerTask('devbuild', [
    'less'
    'coffee:devbuild'
    'copy:vendor'
  ])

  # Rename the watch task to delta, and make a new watch task that runs
  # devbuild on startup
  grunt.renameTask('watch', 'delta')
  grunt.registerTask('watch', ['devbuild', 'delta'])

  grunt.registerTask('default', ['devbuild'])
