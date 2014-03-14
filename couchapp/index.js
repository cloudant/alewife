var couchapp = require('couchapp');
var path = require('path');

var ddoc = {
  _id: '_design/alewife',
  rewrites: require('./rewrites.json'),
  views: require('./views'),
  indexes: require('./indexes'),
  lists: {},
  shows: {},
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