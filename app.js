var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = {
    _id: '_design/docscloudantcom'
  , rewrites: require('./rewrites.json')
  , views: {}
  , lists: {}
  , shows: {}
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;