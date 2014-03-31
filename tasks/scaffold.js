var fs = require('fs');
var path = require('path');
var async = require('async');

function Scaffold (options) {
  this.filepath = options.filepath || 'docs';
  this.sitemap = require(options.sitemap_path || '../config.json').sitemap;
}

Scaffold.prototype.write = parse_sitemap;
Scaffold.prototype.title = write_title;
Scaffold.prototype.page = write_page;

function parse_sitemap (filepath, sitemap, done) {
  // defaults
  if (!done) {
    done = sitemap || filepath;
    
    if (typeof(filepath) === 'object') {
      sitemap = filepath;
    } else {
      sitemap = this.sitemap;
    }

    filepath = this.filepath;
  }

  // provide descendents a sense of selfhood
  var self = this || {
    sitemap: sitemap,
    filepath: filepath
  };

  // handle different section type cases
  // adding them to the tasks array
  var tasks = [];
  var filename;
  sitemap.forEach(function (section) {
    if (typeof(section) === 'string') {
      // section is a string: write a page
      filename = path.join(filepath, section);
      tasks.push(write_page.bind(self, filename));
    } else if (section instanceof Array) {
      // section is an array: recurse parse_sitemap
      tasks.push(parse_sitemap.bind(self, filepath, section));
    } else if (typeof(section) === 'object') {
      // section is an object: write titles for each key 
      // and recuse parse_sitemap on value
      Object.keys(section).forEach(function (key) {
        filename = path.join(filepath, key);
        if (section[key]) {
          tasks.unshift(parse_sitemap.bind(self, filename, section[key])); 
        }
        tasks.unshift(write_title.bind(self, filename));
      });
    } else {
      // else, throw a fit 
      done(section);
    }
  });

  async.series(tasks, done);
}

function write_title (filepath, done) {
  // defaults
  if (!done) {
    done = filepath;
    filepath = this.filepath;
  }

  // create the path to the title file itself
  var filename = path.join(filepath, 'index.md');
  async.series([
    // create the containing folder
    function (done) {
      fs.mkdir(filepath, function (err) {
        if (err && err.code !== 'EEXIST') {
          done(err);
        } else {
          done();
        }
      });
    },
    // see if the file exists, and thus
    // whether we should create it
    fs.exists.bind(fs, filename),
    // create the file if we got this far
    fs.writeFile.bind(fs, filename, 'TODO')
  ], function (err) {
    // throw any unexpected errors
    if (err && err !== true) {
      done(err);
    // or finish without complaint
    } else {
      done();
    }
  });
}

function write_page (filepath, done) {
  // defaults
  if (!done) {
    done = filepath;
    filepath = this.filepath;
  }

  // the filename is just the path with a file extension
  var filename = filepath + '.md';
  async.series([
    // see if it exists, and thus
    // whether we should create it
    fs.exists.bind(fs, filename),
    fs.writeFile.bind(fs, filename, 'TODO')
  ], function (err) {
    if (err && err !== true) {
      done(err);
    } else {
      done();
    }
  });
}

function create_docs (filepath, done) {
  async.series([
    fs.exists.bind(fs, filepath),
    fs.mkdir.bind(fs, filepath)
  ], function (err) {
    if (err && err !== true) {
      done(err);
    } else {
      done();
    }
  });
}

function create_docs_title (filepath, done) {
  var filename = path.join(filepath, 'index.md');
  async.series([
    fs.exists.bind(fs, filename),
    fs.writeFile.bind(fs, filename, 'TODO')
  ], function (err) {
    if (err && err !== true) {
      done(err);
    } else {
      done();
    }
  });
}

function main (done) {
  var argv = process.argv.slice(2);
  var scaffold = new Scaffold({
    filepath: 'docs',
    sitemap_path: '../config.json'
  });

  async.series([
    create_docs.bind(null, scaffold.filepath),
    create_docs_title.bind(null, scaffold.filepath)
  ], function (err) {
    if (err) {
      done(err);
    } else {
      scaffold.write(done);
    }
  });
}

module.exports = {
  main: main,
  scaffold: Scaffold
};