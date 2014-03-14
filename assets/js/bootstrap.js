angular
.module('bootstrap', ['services'])
// languages to rootscope
.run([
  '$rootScope', '$location', 'languages',
  function ($rootScope, $location, languages) {
    languages
    .get()
    .then(function (langs) {
      $rootScope.languages = langs;
      $rootScope.currentLang = $location.search().lang || langs[0];
    });
  }
]);