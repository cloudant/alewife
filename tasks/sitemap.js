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

  grunt.registerMultiTask('sitemap', 'Prints the sitemap', function () {
    console.log(prettyprint(this.data.sitemap).join('\n'));
  });
};