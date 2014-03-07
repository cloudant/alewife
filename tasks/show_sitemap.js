module.exports = function (grunt) {
  function prettyprint (list, indent) {
    indent = indent || '';
    var step = '  ';
    var results = [];
    
    list.forEach(function (elem, i) {
      if (typeof(elem) === 'string') {
        if (i > 0) {
          // results.push(indent + step + elem);
        } else {
          results.push(indent + elem); 
        }
      } else {
        results = results.concat(prettyprint(elem, indent + step));
      }
    });

    return results;
  }

  grunt.registerMultiTask('show-sitemap', 'Prints the sitemap', function () {
    console.log(prettyprint(this.data.sitemap).join('\n'));
  });

  function flatten (list, parent) {
    var results = [];
    
    list.forEach(function (elem, i) {
      if (typeof(elem) === 'string') {
        if (i === 0) {
          parent = parent ? [parent, elem].join('/') : elem;
          results.push(parent);
        } else {
          var path = parent ? [parent, elem].join('/') : elem;
          results.push(path);
        }
      } else {
        results = results.concat(flatten(elem, parent));
      }
    });

    return results;
  }

  grunt.registerMultiTask('flat-sitemap', 'Prints the sitemap', function () {
    console.log(flatten(this.data.sitemap).join('\n'));
  });
};