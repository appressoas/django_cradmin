module.exports = (grunt) ->
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    watch:
      less:
        tasks: 'less'
        files: ['less/*.less', 'less/**/*.less']
    less:
      development:
        options:
          paths: ["less", "bower_components"]
        files:
          "dist/styles.css": "less/styles.less"

    copy:
      vendor:
        files: [
          {
            expand: true
            flatten: true
            src: [
              'bower_components/jquery/dist/jquery.min.js'
              'bower_components/fontawesome/fonts/FontAwesome.otf',
              'bower_components/fontawesome/fonts/fontawesome-webfont.eot',
              'bower_components/fontawesome/fonts/fontawesome-webfont.svg',
              'bower_components/fontawesome/fonts/fontawesome-webfont.ttf',
              'bower_components/fontawesome/fonts/fontawesome-webfont.woff'
            ]
            dest: 'dist/'
          }
        ]
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-copy')

  # grunt.renameTask('watch', 'delta')
  grunt.registerTask('build', ['less', 'copy:vendor'])
  # grunt.registerTask('watch', ['build', 'delta'])
  grunt.registerTask('default', ['build'])
