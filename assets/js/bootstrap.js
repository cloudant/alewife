angular
.module('bootstrap', ['services'])
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
    });

    languages
    .get()
    .then(function (langs) {
      $rootScope.languages = langs;
      $rootScope.currentLang = $location.search().lang || langs[0];
    });

    $timeout(function () {
      $anchorScroll();
    }, 1000);
  }
]);