angular
.module('controllers', [
  'services'
])
.controller('NavCtrl', [
  '$scope', '$location', 'deurlizer',
  function ($scope, $location, deurlizer) {
    function _filter (hash, sitemap) {
      return sitemap.map(function (doc) {
        var active;
        // de-urlize
        hash = deurlizer(hash);
        // get parent of the current hash
        var hash_parent = hash.slice(0, hash.lastIndexOf('/') + 1);

        if (doc.depth <= 2) {
          // show all links of depth <= 2
          active = true;
        } else if (hash.indexOf(doc.id) !== -1) {
          // show ancestors of the current link
          active = true;
        } else if (doc.parent === hash_parent) {
          // show siblings of the current link  
          active = true;
        } else if (doc.parent === hash) {
          // show immediate children of the current link
          active = true;
        } else {
          // otherwise, hide it
          active = false;
        }

        if (hash === doc.id) {
          console.log(hash, doc.id);
          doc.current = true;
        } else {
          doc.current = false;
        }

        doc.active = active;
        return doc;
      });
    }

    $scope.$watch(function () {
      return $location.path().slice(1);
    }, function (path) {
      $scope.sitemap = _filter(path, $scope.sitemap);
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
  '$scope', 'docs', 'sitemap', 'smoothScrollTo',
  function ($scope, docs, sitemap, smoothScrollTo) {
    sitemap
    .flatten()
    .then(function (ids) {
      $scope.sitemap = sitemap.format(ids);
      smoothScrollTo(null, 1000);
    });

    docs
    .get_as_obj()
    .then(function (res) {
      $scope.docs = res;
    });
  }
]);