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
      vendor: {
        // the files to concatenate, in order
        src: [
          'lib/angular/angular.js',
          'lib/angular-*/*.js',
          'lib/showdown/showdown.js',
          'lib/jquery/jquery.js',
          'lib/bootstrap/bootstrap.js'
        ],
        // the location of the resulting JS file
        dest: 'dist/js/vendor.js'
      },
      app: {
        src: [
          'assets/js/*.js'
        ],
        dest: 'dist/js/bundle.js'
      }
    },
    uglify: {
      build: {
        files: {
          'dist/js/vendor.js': ['dist/js/vendor.js'],
          'dist/js/bundle.js': ['dist/js/bundle.js']
        }
      }
    },
    copy: {
      app: {
        files: [
          {
            expand: true,
            src: ['*.html'],
            cwd: 'assets/html/',
            dest: 'dist'
          }
        ]
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
    'show-sitemap': {
      app: {
        sitemap: config.sitemap
      }
    },
    'flat-sitemap': {
      app: {
        sitemap: config.sitemap
      }
    },
    sitemap: {
      app: {
        sitemap: config.sitemap,
        db: config.deploy_to
      }
    },
    bower: {
      app: {
        // it just works :D
      }
    },
    watch: {
      app: {
        files: ['assets/**', 'couchapp/*', 'docs/**'],
        tasks: ['deploy'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  // Custom Tasks
  grunt.registerTask('build', [
    'bower',
    'jshint',
    'concat',
    // 'uglify',
    'copy'
  ]);

  grunt.registerTask('sync', [
    'couchapp',
    // 'sync-docs' // enable if alewife is your authoritative docs source
  ]);

  grunt.registerTask('sync-docs', [
    'upload',
    'sitemap'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'sync'
  ]);

};