var nano = require('nano');
var async = require('async');

function upload_sitemap (config, done) {
  if (!done) {
    done = config;
    config = {};
  }

  this.db = nano(config.db || 'http://localhost:5984/docs');
  this.sitemap = config.sitemap || require('../config.json').sitemap;

  var doc = {
    sitemap: sitemap,
    type: 'sitemap',
    _id: 'sitemap',
    tags: []
  };

  db.get('sitemap', function (err, body, headers) {
    if (err) {
      if (err.status_code === 404) {
        db.insert(doc, done);
      } else {
        console.log(err);
        throw err;
      }
    } else {
      for (var key in doc) {
        body[key] = doc[key];
      }
      
      db.insert(body, done);
    }
  });
}

module.exports = upload_sitemap;