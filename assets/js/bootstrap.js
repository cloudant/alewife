angular
.module('bootstrap', ['services'])
.run([
  '$rootScope', 'sitemap', 'docs', 'languages',
  function ($rootScope, sitemap, docs, languages) {
    sitemap
    .flatten()
    .success(function (ids) {
      $rootScope.sitemap = ids;
    });

    docs
    .get_as_obj()
    .success(function (docs) {
      $rootScope.docs = docs;
    });

    languages
    .get()
    .success(function (langs) {
      $rootScope.languages = langs;
      $rootScope.currentLang = langs[0];
    })
  }
]);