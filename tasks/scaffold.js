var fs = require('fs');
var path = require('path');
var async = require('async');

function scaffold (filepath, sitemap, done) {
  function write_title (filepath, done) {
    var filename = path.join(filepath, 'index.md');
    async.series([
      function (done) {
        fs.mkdir(filepath, function (err) {
          if (err && err.code !== 'EEXIST') {
            done(err);
          } else {
            done();
          }
        });
      },
      function (done) {
        fs.stat(filename, function (err, stat) {
          if (!err) {
            // file exists, skip writing
            done(true);
          } else if (err.code === 'ENOENT') {
            // file doesn't exist, write it
            done();
          } else {
            // some other error
            done(err);
          }
        })
      },
      fs.writeFile.bind(fs, filename, 'TODO')
    ], function (err) {
      if (err && err !== true) {
        done(err);
      } else {
        done();
      }
    });
  }

  function write_page (filepath, done) {
    var filename = filepath + '.md';
    async.series([
      function (done) {
        fs.stat(filename, function (err, stat) {
          if (!err) {
            // file exists, skip writing
            done(true);
          } else if (err.code === 'ENOENT') {
            // file doesn't exist, write it
            done();
          } else {
            // some other error
            done(err);
          }
        })
      },
      fs.writeFile.bind(fs, filename, 'TODO')
    ], function (err) {
      if (err && err !== true) {
        done(err);
      } else {
        done();
      }
    });
  }

  if (sitemap[0].forEach) {
    // first element is an array
    // break it down >:D
    async.map(sitemap, scaffold.bind(null, filepath), done);
  } else {
    var tasks = [];

    // first element is a string
    // treat it as the title page
    var title = sitemap[0];
    filepath = path.join(filepath, title);
    var pages = sitemap.slice(1); 

    // write the title
    tasks.push(write_title.bind(null, filepath));
    
    // write the pages
    if (!pages.length) {
      // nothing to do; no pages
    } else if (pages[0].forEach) {
      // pages are an array of arrays
      // break it up!
      tasks = tasks.concat(pages.map(function (page) {
        return scaffold.bind(null, filepath, page);
      }));
    } else {
      // it's an array of strings
      // write them to disk
      tasks = tasks.concat(pages.map(function (page) {
        return write_page.bind(null, path.join(filepath, page));
      }));
    }

    // resolve tasks
    async.series(tasks, done);
  }
}

module.exports = function (grunt) {
  grunt.registerMultiTask('scaffold', 'Scaffold documentation with TODOs', function () {
    var filepath = path.join(process.cwd(), this.data.folder);
    var sitemap = this.data.sitemap;
    var done = this.async();

    scaffold(filepath, sitemap, done);
  });
};
