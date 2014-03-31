var couchapp = require('couchapp');
var path = require('path');

var ddoc = {
  _id: '_design/alewife',
  rewrites: require('./rewrites.json'),
  views: require('./views'),
  indexes: require('./indexes'),
  lists: {
    objectify: function (head, req) {
      var row;
      var results = {};

      while (row = getRow()) {
        results[row.key] = row.doc;
      }

      send(JSON.stringify(results));
    }
  },
  shows: {
    flatten: function (doc, req) {
      // N.B.: only to be used with the sitemap
      function _format (id) {
        var doc = {
          id: id,
          hash: id.replace(/\s/g, '+').replace(/\//g, '_').toLowerCase(),
          depth: id.split('/').length
        };

        if (id.lastIndexOf('/') === -1) {
          doc.parent = '';
          doc.name = id;
        } else {
          var i = id.lastIndexOf('/');
          doc.parent = id.slice(0, i);
          doc.name = id.slice(i + 1);
        }

        return doc;
      }

      function _flatten (list, parent) {
        var results = [];
        
        list.forEach(function (elem, i) {
          if (typeof(elem) === 'string') {
            // section is a string: log it
            results.push(parent ? [parent, elem].join('/') : elem);
          } else if (elem instanceof Array) {
            // section is an array: recurse
            results.concat(_flatten(elem, parent));
          } else if (typeof(elem) === 'object') {
            // section is an object: write titles for each key 
            // and recuse parse_sitemap on value
            Object.keys(elem).forEach(function (key) {
              var _parent = parent ? [parent, key].join('/') : key;
              results.push(_parent);
              if (elem[key]) {
                results = results.concat(_flatten(elem[key], _parent));
              }
            });
          }
        });

        return results;
      }

      var result = _flatten(doc.sitemap)
                    .filter(function (path) {
                      var should_return = true;
                      
                      for (var i = doc.languages.length - 1; i >= 0; i--) {
                        if (path.indexOf(doc.languages[i]) !== -1) {
                          should_return = false;
                          break;
                        }
                      }

                      return should_return;
                    })
                    .map(_format);
      return {
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json"
        }
      };
    }
  },
  filters: {
    app: function (doc) {
      if (doc._id.indexOf('_design') === 0 ) {
        return true;
      } else {
        return false;
      }
    }
  }
};

couchapp.loadAttachments(ddoc, path.join(process.cwd(), 'dist'));

module.exports = ddoc;