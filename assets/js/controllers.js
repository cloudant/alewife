angular
.module('controllers', [
  'services'
])
.controller('NavCtrl', [
  '$scope', '$location',
  function ($scope, $location) {
    // update sitemap as docs changes
    $scope.$parent.$watch('docs', function (docs) {
      if (docs) {
        $("#toc").tocify({
          selectors: 'h3,h4,h5,h6'
        }).data('toc-tocify'); 
      }
    });
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
  '$scope', '$location',
  function ($scope, $location) {
    $scope.search = function (query) {
      var search = $location.search();
      search.q = query;
      $location.path('/search').search(search);
    };
  }
])
.controller('SearchCtrl', [
  '$scope', 'docs', '$location',
  function ($scope, docs, $location) {
    var query = $location.search().q;
    
    docs
    .search(query)
    .then(function (res) {
      $scope.docs = docs.to_obj(res);
      $scope.sitemap = res.map(function (doc) {
        return doc._id.replace(/(\/index)?\.md/g, '');
      });
    });
  }
])
.controller('ListCtrl', [
  '$scope', 'docs', 'sitemap', '$location',
  function ($scope, docs, sitemap, $location) {
    sitemap
    .flatten()
    .then(function (ids) {
      $scope.sitemap = ids;
    });

    docs
    .get_as_obj()
    .then(function (res) {
      $scope.docs = res;
    });

    // TODO: scrollto
  }
]);