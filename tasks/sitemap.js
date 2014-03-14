var nano = require('nano');
var async = require('async');

module.exports = function (grunt) {
  grunt.registerMultiTask('sitemap', 'Uploads the sitemap', function () {
    var db = nano(this.data.db);
    var sitemap = this.data.sitemap;
    var done = this.async();

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
  });
};