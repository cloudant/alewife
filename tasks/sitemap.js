var nano = require('nano');
var async = require('async');

module.exports = function (grunt) {
  grunt.registerMultiTask('sitemap', 'Uploads the sitemap', function () {
    var db = nano(this.data.db);
    var sitemap = this.data.sitemap;
    var done = this.async();

    db.head('sitemap', function (err, body, headers) {
      var doc = {
        sitemap: sitemap,
        _id: 'sitemap'
      };

      if (err) {
        if (err.status_code === 404) {
          db.insert(doc, done);
        } else {
          console.log(err);
          throw err;
        }
      } else {
        doc._rev = headers.etag.replace(/"/g, '');
        
        db.insert(doc, done);
      }
    });
  });
};