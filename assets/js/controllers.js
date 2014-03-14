angular
.module('controllers', [
  'services'
])
.controller('NavCtrl', [
  '$rootScope', '$scope', '$location',
  function ($rootScope, $scope, $location) {
    var results = $rootScope.sitemap.map(function (id) {
      var sections = id.split('/');
      var depth = sections.length;
      var name = sections[sections.length - 1];

      return {
        id: id,
        name: name,
        depth: depth
      };
    });

    $scope.$watch(function () {
      return $location.hash();
    }, function (hash) {
      $scope.hash = hash;
    });

    var sitemap = results;
    $scope.sitemap = results;

    $scope.$watch('hash', function (hash) {
      function get_section (hash) {
        return hash.slice(0, hash.lastIndexOf('/'));
      }

      $scope.sitemap = sitemap.filter(function (doc) {
        var section = { 
          doc: get_section(doc.id),
          hash: get_section(hash)
        };
        // show all links less than depth 2
        if (doc.depth.length <= 2) {
          return true;
        // show all parents
        } else if (section.hash.indexOf(section.doc) !== -1) {
          return true;
        // show siblings
        } else if (section.doc === section.hash) {
          return true;
        // show one level of children
        } else if (section.doc === hash) {
          return true;
        // else, don't show
        } else {
          return false;
        }
      });
    });

    $scope.$on('active', function (_, $elem) {
      var id = $elem.attr('href').slice(1);
      $elem.parent().addClass('active');
      $scope.$apply(function () {
        $location.hash(id);
      });
    });

    $scope.$on('inactive', function (_, $elem) {
      $elem.parent().removeClass('active');
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
  '$scope', '$location', '$rootScope', 'docs',
  function ($scope, $location, $rootScope, docs) {
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
    .then(function (docs) {
      var results = {};

      docs.forEach(function (doc) {
        var id = doc._id.replace(/(\/index)?\.md/g, '');
        results[id] = doc;
      });

      $scope.docs = results;
      $scope.sitemap = docs.map(function (doc) {
        return doc._id.replace(/(\/index)?\.md/g, '');
      });
    });
  }
])
.controller('ListCtrl', [
  '$scope', 'docs', 'sitemap', 'scroller', '$location',
  function ($scope, docs, sitemap, scroller, $location) {
    sitemap
    .flatten()
    .then(function (ids) {
      $scope.sitemap = ids;
    });

    docs
    .get_as_obj()
    .then(function (docs) {
      $scope.docs = docs;
    });

    if ($location.path()) {
      var id = $location.path();
      console.log(id);
      scroller.scrollToElement(id);
    }
  }
]);