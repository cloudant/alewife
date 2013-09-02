// Upload markdown files to server
// update any that have changed
// NB: No parsing. Only text. Leave that to the views.

var nano = require('nano'),
    dive = require('dive'),
    fs = require('fs');

function Uploader(opts){
  var db = nano(opts.db),
      docs_dir = process.cwd() + '/content';

  var getLocalDocs = function(cb){
    var files = [];
    dive(docs_dir,
      function(err, file){
        if(err){
          console.log(err);
        }else{
          files.push(file);
        }
      },
      function(){
        files = files.map(function(filename){
          return {
            _id: filename.slice(docs_dir.length + 1),
            text: fs.readFileSync(filename).toString()
          }
        });
        cb(null, files);
      });
  };

  var putRemoteDocs = function(files, cb){
    db.bulk({docs: files}, function(err, res){
      cb(err, res);
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
    db.list({
      keys: conflicts
    }, function(err, res){
      if(err) throw new Error(err);
      revs = {};

      res.rows.forEach(function(row){
        revs[row.id] = row.value.rev;
      });

      docs = docs.map(function(doc){
        doc._rev = revs[doc._id];
        return doc;
      });

      cb(null, docs);
    });
  };

  var main = function(cb){
    cb = cb || function(){};
    getLocalDocs(function(err, files){
      if(err) throw new Error(err);
      putRemoteDocs(files, function(err, res){
        if(err) throw new Error(err);
        var conflicts = getConflicts(res);
        console.log("Uploaded "+(res.length - conflicts.length)+" documents.");
        if(conflicts.length){
          updateRevs(files, conflicts, function(err, docs){
            putRemoteDocs(docs, function(err, res){
              if(err) throw new Error(err);
              console.log("Updated "+res.length+" documents.");
              cb();
            });
          });
        }else{
          cb();
        }
      });
    });
  }

  return main;
}

module.exports = function(grunt){
  grunt.registerMultiTask('upload', 'Push local docs to remote.', function(){
    var upload = Uploader(this.data),
        done = this.async();

    upload(done);
  });
}