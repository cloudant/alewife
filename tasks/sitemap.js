module.exports = function (grunt) {
  grunt.registerMultiTask('sitemap', 'Prints the sitemap', function () {
    console.log(JSON.stringify(this.data.sitemap, undefined, 2));
  });
};