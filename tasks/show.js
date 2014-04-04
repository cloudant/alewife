var path = require('path');

function prettyprint (list, indent) {
  list = list || require('../config.json').sitemap;
  indent = indent || '';
  var step = '  ';
  var results = [];
  
  list.forEach(function (elem, i) {
    if (typeof(elem) === 'string') {
      // section is a string: log it
      results.push(indent + elem);
    } else if (elem instanceof Array) {
      // section is an array: increment indent and recurse
      results.concat(prettyprint(elem, indent + step));
    } else if (typeof(elem) === 'object') {
      // section is an object: write titles for each key 
      // and recuse parse_sitemap on value
      Object.keys(elem).forEach(function (key) {
        results.push(indent + key);
        if (elem[key]) {
          results = results.concat(prettyprint(elem[key], indent + step));
        }
      });
    } else {
      // else, throw a fit 
      throw elem;
    }
  });

  return results;
}

function flatten (list, parent) {
  list = list || require('../config.json').sitemap;
  var results = [];

  list.forEach(function (elem, i) {
    if (typeof(elem) === 'string') {
      // section is a string: log it
      results.push(parent ? path.join(parent, elem) : elem);
    } else if (elem instanceof Array) {
      // section is an array: recurse
      results.concat(flatten(elem, parent));
    } else if (typeof(elem) === 'object') {
      // section is an object: write titles for each key 
      // and recuse parse_sitemap on value
      Object.keys(elem).forEach(function (key) {
        var _parent = parent ? path.join(parent, key) : key;
        results.push(_parent);
        if (elem[key]) {
          results = results.concat(flatten(elem[key], _parent));
        }
      });
    } else {
      // else, throw a fit 
      throw elem;
    }
  });

  return results;
}

module.exports = {
  flat: function (done) {
    console.log(flatten());
    done();
  },
  pprint: function (done) {
    console.log(prettyprint().join('\n'));
    done();
  }
};