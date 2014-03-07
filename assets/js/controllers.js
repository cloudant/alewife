angular
.module('controllers', [
  'services'
])
.controller('LangCtrl', [
  '$rootScope', 'languages',
  function ($rootScope, languages) {
    $scope.setLang = function (language) {
      $rootScope.currentLang = language;
    };
  }
])
.controller('SearchFormCtrl', [
  '$scope', '$location',
  function ($scope, $location) {
    $scope.search = function (query) {
      $location.path('/search').search({q: query});
    }
  }
])
.controller('SearchCtrl', [
  '$scope', 'docs', '$location',
  function ($scope, docs, $location) {
    docs
    .search($location.search().q)
    .success(function (docs) {
      $scope.docs = docs;
    });
  }
]);