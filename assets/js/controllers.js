angular
.module('controllers', [
  'services'
])
.controller('NavCtrl', [
  '$rootScope', '$scope',
  function ($rootScope, $scope) {
    var results = $rootScope.sitemap.map(function (id) {
      var sections = id.split('/');
      // TODO: actual indents, or better, sub lists
      var indent = Array(sections.length).join().replace(/,/g, '-');
      var name = indent + sections[sections.length - 1];
      return {
        id: id,
        name: name
      };
    });

    $scope.sitemap = results;
  }
])
.controller('LangCtrl', [
  '$rootScope', '$scope', '$location',
  function ($rootScope, $scope, $location) {
    $rootScope.$watch('currentLang', function () {
      $scope.active = ($rootScope.currentLang === $scope.language);
    });

    $scope.setLang = function (language) {
      $rootScope.currentLang = language;
      
      var search = $location.search();
      search.lang = language;
      $location.search(search);
    };
  }
])
.controller('SearchFormCtrl', [
  '$scope', '$location', '$rootScope', 'docs',
  function ($scope, $location, $rootScope, docs) {
    $scope.search = function (query) {
      var search = $location.search();
      search.q = query;
      $location.search(search);
    };

    $rootScope.$on('$locationChangeSuccess', function () {
      var search = $location.search().q;
      if (search) {
        docs
        .search(search)
        .then(function (docs) {
          var results = {};

          docs.forEach(function (doc) {
            var id = doc._id.replace(/(\/index)?\.md/g, '');
            results[id] = doc;
          });

          $rootScope.docs = results;
        })
      } else {
        docs
        .get_as_obj()
        .then(function (docs) {
          $rootScope.docs = docs;
        })
      }
    });
  }
])
.controller('SearchCtrl', [
  '$scope', 'docs', '$location',
  function ($scope, docs, $location) {
  }
]);