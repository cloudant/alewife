angular
.module('controllers', [
  'services'
])
.controller('NavCtrl', [
  '$scope', '$location',
  function ($scope, $location) {
    function _filter (hash, doc) {
      var active;
      // de-urlize
      // hash = deurlizer(hash);
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
        doc.current = true;
      } else {
        doc.current = false;
      }

      doc.active = active;
      return doc;
    }

    function _update () {
      var hash = $location.path().slice(1);
      var sitemap = $scope.$parent.sitemap;

      if (sitemap) {
        $scope.sitemap = sitemap
                          .map(_filter.bind(null, hash));
      }
    }

    // update when parent changes sitemap
    $scope.$watch(function () {
      return $scope.$parent.sitemap;
    }, _update);

    // update when hash changes
    $scope.$watch(function () {
      return $location.path().slice(1);
    }, _update);

    // TODO change these to reflect angular-scroll events
    $scope.$on('duScrollspy:becameActive', function (_, $elem) {
      var id = $elem.attr('href').slice(2);
      console.log(id);
      $elem.parent().addClass('active');
      $scope.$apply(function () {
        $location.path(id);
      });
    });

    $scope.$on('duScrollspy:becameInactive', function (_, $elem) {
      $elem.parent().removeClass('active');
    });
  }
])
.controller('LangCtrl', [
  '$rootScope', '$scope', '$location', '$languages',
  function ($rootScope, $scope, $location, $languages) {
    $languages
    .get()
    .then(function (langs) {
      $scope.languages = langs.map(function (lang, i) {
        return {
          lang: lang,
          active: (i === 0)
        };
      });
      $rootScope.currentLang = $location.search().lang || langs[0];
    });

    $rootScope.$watch('currentLang', function (newLang) {
      if (newLang) {
        $scope.languages = $scope.languages.map(function (lang) {
          lang.active = (newLang === lang.lang);
          return lang;
        }); 
      }
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
      $location.search(search);
    };
  }
])
.controller('SearchCtrl', [
  '$scope', '$docs', '$location',
  function ($scope, $docs, $location) {
    var query = $location.search().q;
    $docs
    .search(query)
    .then(function (docs) {
      $scope.sitemap = docs.map(function (doc) {
        return doc._id;
      });

      var results = {};

      docs.forEach(function (doc) {
        var id = doc._id.replace(/(\/index)?\.md/g, '');
        results[id] = doc;
      });

      $scope.docs = results;
      $anchorScroll();
    });
  }
])
.controller('ListCtrl', [
  '$scope', '$docs', '$sitemap', '$routeParams', 'scroll_to',
  function ($scope, $docs, $sitemap, $routeParams, scroll_to) {
    var docs_promise = $docs.get_as_obj();
    var sitemap_promise = $sitemap.flatten();

    docs_promise
    .then(function (docs) {
      $scope.docs = docs;
      
      sitemap_promise
      .then(function (sitemap) {
        $scope.sitemap = sitemap;
        
        if ($routeParams.path)
          scroll_to($routeParams.path);
      });
    });
  }
]);