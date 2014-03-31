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
          hash: id.replace(/\s/g, '+').replace(/\//g, '_'),
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
            var path = parent ? [parent, elem].join('/') : elem;
            if (i === 0) {
              parent = path;
              results.push(parent);
            }
          } else {
            results = results.concat(_flatten(elem, parent));
          }
        });

        return results;
      }

      return {
        body: JSON.stringify(_flatten(doc.sitemap).map(_format)),
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