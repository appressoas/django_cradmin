module.exports = (grunt) ->

  appfiles = {
    coffee: ['src/**/*.coffee', '!src/**/*.spec.coffee']
    coffeeunit: ['src/**/*.spec.coffee']
    less: ['less/*.less', 'less/**/*.less']
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

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    watch:
      less:
        tasks: 'less'
        files: appfiles.less
      coffee:
        tasks: 'coffee:devbuild'
        files: appfiles.coffee
    less:
      development:
        options:
          paths: ["less", "bower_components"]
        files:
          "dist/styles.css": "less/styles.less"

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

  grunt.registerTask('default', ['devbuild'])
