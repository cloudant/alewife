// Upload markdown files to server
// update any that have changed
// NB: No parsing. Only text. Leave that to the views.

var nano = require('nano'),
    dive = require('dive'),
    path = require('path'),
    async = require('async'),
    fs = require('fs');

function chunk (list, size) {
  var i,
      j,
      temparray,
      results = [];
  
  for (i = 0, j = list.length; i < j; i += size) {
      temparray = list.slice(i, i + size);
      results.push(temparray);
  }

  return results;
}

function Uploader(opts){
  var db = nano(opts.db),
      docs_dir = path.join(process.cwd(), opts.folder);

  var getLocalDocs = function (cb) {
    var files = [];
    dive(docs_dir,
      function (err, file) {
        if (err) {
          console.log(err);
        } else {
          files.push(file);
        }
      },
      function () {
        async.map(files, function (filename, done) {
          async.waterfall([
            fs.readFile.bind(fs, filename),
            function (buffer, done) {
              var id = filename.slice(docs_dir.length + 1);
              done(null, {
                _id: id,
                title: id.replace('.md', ''),
                text: buffer.toString(),
                published: true,
                type: 'post',
                category: 'documentation',
                tags: id.replace('.md', '').split(path.sep)
              });
            }
          ], done);
        }, cb);
      });
  };

  var putRemoteDocs = function(files, cb){
    var chunked_files = chunk(files, 100);
    async.map(chunked_files, function (files, done) {
      db.bulk({
        docs: files
      }, done);
    }, function (err, res_list) {
      var results = [].concat.apply([], res_list);

      cb(err, results);
    });
  };

  var getConflicts = function(docs){
    var result = docs.filter(function(doc){
      return doc.error;
    }).map(function(doc){
      return doc.id;
    });

    return result;
  };

  var updateRevs = function(docs, conflicts, cb){
    async.map(chunk(conflicts, 10), function (conflicts, done) {
      db.list({
        keys: conflicts,
      }, done);
    }, function (err, res_list) {
      if (err) {
        cb(err);
      } else {
        var rows = [].concat.apply([], res_list.map(function (res) {
          return res.rows;
        }));

        revs = {};

        rows.forEach(function(row){
          revs[row.id] = row.value.rev;
        });

        docs = docs.filter(function (doc) {
          return revs[doc._id];
        }).map(function (doc) {
          doc._rev = revs[doc._id];
          return doc;
        });

        cb(null, docs);
      }
    });
  };

  var main = function (cb) {
    cb = cb || function(){};
    var files;
    
    async.waterfall([
      getLocalDocs,
      function (_files, done) {
        files = _files;
        done(null, files);
      },
      putRemoteDocs,
      function (res, done) {
        var conflicts = getConflicts(res);
        console.log("Uploaded "+(res.length - conflicts.length)+" documents.");
        done(null, conflicts);
      },
      function (conflicts, done) {
        updateRevs(files, conflicts, done);
      },
      putRemoteDocs
    ], function (err, res) {
      if (err) {
        cb(err);
      } else {
        console.log("Updated "+res.length+" documents.");
        cb();
      }
    });
  };

  return main;
}

module.exports = function (config, done) {
  if (!done) {
    done = config;
    config = {};
  }

  config.db = config.db || 'http://localhost:5984/docs';
  config.folder = config.folder || 'docs';

  Uploader(config)(done);
};
