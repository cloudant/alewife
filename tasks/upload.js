var async = require('async');
var docs = require('./upload_docs');
var sitemap = require('./upload_sitemap');

function main (config, done) {
  if (!done) {
    done = config;
    config = {};
  }

  config.db = config.db || 'http://localhost:5984/docs';
  config.folder = config.folder || 'docs';
  config.sitemap = config.sitemap || require('../config.json');

  async.parallel([
    docs.bind(null, config),
    sitemap.bind(null, config)
  ], done);
}

module.exports = {
  docs: docs,
  sitemap: sitemap,
  all: main
};