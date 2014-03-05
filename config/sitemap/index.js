// doc sections are array of arrays
// the first element of any section
// is its title page

var sitemap = [
  'Welcome',
  require('./basics'),
  require('./api_reference'),
  require('./tutorials'),
  require('./client_libs')
];

module.exports = sitemap;