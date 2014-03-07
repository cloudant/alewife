var couchapp = require('couchapp');
var path = require('path');

var ddoc = {
  _id: '_design/app',
  rewrites: require('./rewrites.json'),
  views: require('./views'),
  indexes: require('./indexes'),
  lists: {},
  shows: {},
};

couchapp.loadAttachments(ddoc, path.join(process.cwd(), 'dist'));

module.exports = ddoc;