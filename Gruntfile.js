var config = require('./config');
var couchapp = require('./couchapp');

module.exports = function (grunt) {

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
          'src/js/bower_components/jquery/jquery.js',
          'src/js/bower_components/lodash/lodash.js',
          'src/js/bower_components/backbone/backbone.js',
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
      app: {
        app: 'couchapp',
        db: config.deploy_to,
        options: {
          okay_if_exists: true
        }
      }
    },
    upload: {
      app: {
        db: config.deploy_to,
        folder: 'docs'
      }
    },
    scaffold: {
      app: {
        folder: 'docs',
        sitemap: config.sitemap
      }
    },
    sitemap: {
      app: {
        sitemap: config.sitemap
      }
    },
    bower: {
      app: {
        // it just works :D
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  // Custom Tasks
  grunt.registerTask('build', [
    'bower'
  , 'jshint'
  , 'concat'
  , 'uglify'
  , 'cssmin'
  ]);

  grunt.registerTask('sync', [
    'couchapp',
    'upload'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'sync'
  ]);

};