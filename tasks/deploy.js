var couchapp = require('couchapp');
var app = require('../couchapp');

var config = require('../couch');
var dest = config.db;

module.exports = function (done) {
  couchapp.createApp(app, dest, function (app) {
    app.push(done);
  });
};