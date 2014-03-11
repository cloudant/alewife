angular
.module('controllers', [
  'services'
])
.controller('NavCtrl', [
  '$rootScope', '$scope', '$location',
  function ($rootScope, $scope, $location) {
    var results = $rootScope.sitemap.map(function (id) {
      var sections = id.split('/');
      // TODO: actual indents, or better, sub lists
      var indent = Array(sections.length).join().replace(/,/g, '-');
      var name = indent + sections[sections.length - 1];
      return {
        id: id,
        name: name,
        indent: indent
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
        // show all level-1 links
        if (doc.indent.length <= 1) {
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
      $scope.$apply(function () {
        $location.hash(id);
      });
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
        });
      } else {
        docs
        .get_as_obj()
        .then(function (docs) {
          $rootScope.docs = docs;
        });
      }
    });
  }
])
.controller('SearchCtrl', [
  '$scope', 'docs', '$location',
  function ($scope, docs, $location) {
  }
]);