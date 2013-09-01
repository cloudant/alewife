var config = require('./config.json');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/js/app.js'],
      options: {
        browser: true
      , laxcomma: true
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate, in order
        src: [
          'src/js/bower_components/angular/angular.js',
          'src/js/bower_components/showdown/src/showdown.js',
          'src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: 'attachments/js/app.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          'attachments/js/app.min.js': ['attachments/js/app.js']
        }
      }
    },
    cssmin: {
      minify: {
        files: {
          'attachments/css/style.css': ['src/css/*.css']
        }
      }
    },
    jade: {
      html: {
        files: {
          'attachments/': ['src/jade/*.jade']
        },
        options: {
          client: false
        }
      }
    },
    couchapp: {
      app: config.couchapp
    },
    upload: {
      app: config.couchapp
    }
  });

  // Load plugins
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-couchapp');
  grunt.loadTasks('./tasks');

  // Custom Tasks
  grunt.registerTask('build', [
    'jshint'
  , 'concat'
  , 'uglify'
  , 'cssmin'
  ]);

  grunt.registerTask('sync', [
    'couchapp',
    'upload'
  ]);

  grunt.registerTask('default', [
    'build',
    'sync'
  ]);

};