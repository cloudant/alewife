angular
.module('bootstrap', ['services'])
// attach sitemap, doc, and languages to rootscope
.run([
  '$rootScope', '$location', '$timeout', '$anchorScroll', 'sitemap', 'docs', 'languages',
  function ($rootScope, $location, $timeout, $anchorScroll, sitemap, docs, languages) {
    sitemap
    .flatten()
    .then(function (ids) {
      $rootScope.sitemap = ids;
    });

    docs
    .get_as_obj()
    .then(function (docs) {
      $rootScope.docs = docs;
      $anchorScroll();
    });

    languages
    .get()
    .then(function (langs) {
      $rootScope.languages = langs;
      $rootScope.currentLang = $location.search().lang || langs[0];
    });
  }
]);