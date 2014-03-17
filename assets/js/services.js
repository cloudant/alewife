angular
.module('services', ['ngSanitize'])
.value('query_root', '_rewrite')
.value('docs_root', '_rewrite/docs')
.factory('sitemap', [
  '$http', '$q', 'docs_root', 'urlizer',
  function ($http, $q, docs_root, urlizer) {
    var promise = $http({
      url: [docs_root, 'sitemap'].join('/'),
      method: 'GET'
    });

    function format (sitemap) {
      return sitemap.map(function (id) {
        var doc = {
          id: id,
          url: urlizer(id),
          depth: id.split('/').length
        };

        if (id.lastIndexOf('/') === -1) {
          doc.parent = '';
          doc.name = id;
        } else {
          doc.parent = id.slice(0, id.lastIndexOf('/'));
          doc.name = id.slice(id.lastIndexOf('/') + 1);
        }

        return doc;
      });
    }

    function sitemap () {
      var deferred = $q.defer();

      promise.success(function (doc) {
        deferred.resolve(doc.sitemap);
      });

      return deferred.promise;
    }

    function flatten (include_languages) {
      // flattens the sitemap into 
      // an array of strings representing doc IDs
      var deferred = $q.defer();
      
      function _flatten (list, parent) {
        var results = [];
        
        list.forEach(function (elem, i) {
          if (typeof(elem) === 'string') {
            var path = parent ? [parent, elem].join('/') : elem;
            if (i === 0) {
              parent = path;
              results.push(parent);
            } else if (include_languages) {
              results.push(path);
            }
          } else {
            results = results.concat(_flatten(elem, parent));
          }
        });

        return results;
      }

      promise.success(function (doc) {
        var flat_sitemap = _flatten(doc.sitemap);
        deferred.resolve(flat_sitemap);
      });

      return deferred.promise;
    }

    function get (path, include_languages) {
      // return IDs for children of the given path
      var deferred = $q.defer();
      
      flatten(include_languages).then(function (ids) {
        deferred.resolve(ids.filter(function (id) {
          return id.indexOf(path) > -1;
        }));
      });

      return deferred.promise;
    }

    return {
      sitemap: sitemap,
      flatten: flatten,
      get: get,
      format: format
    };
  }
])
.factory('languages', [
  '$http', '$q', 'query_root',
  function ($http, $q, query_root) {
    var promise = $http({
      url: [query_root, '_view', 'languages'].join('/'),
      method: 'GET',
      params: {
        group: true
      }
    });

    function get () {
      // get all languages used in sample code
      var deferred = $q.defer();

      promise.success(function (res) {
        var languages = res.rows.map(function (row) {
          return row.key;
        });

        deferred.resolve(languages);
      });

      return deferred.promise;
    }

    return {
      get: get
    };
  }
])
.factory('docs', [
  '$http', '$q', 'query_root',
  function ($http, $q, query_root) {
    function res_to_docs (res) {
      var docs = res.rows.map(function (row) {
        return row.doc;
      });

      return docs;
    }

    function get (id) {
      // get all children of a particular doc
      // or all docs, if `id` is unspecified
      id = id || '';
      var deferred = $q.defer();

      $http({
        url: [query_root, '_view', 'docs'].join('/'),
        method: 'GET',
        params: {
          start_key: JSON.stringify(id),
          end_key: JSON.stringify(id + '\ufff0'),
          include_docs: true
        }
      }).success(function (res) {
        deferred.resolve(res_to_docs(res));
      });

      return deferred.promise;
    }

    function to_obj (list) {
      var results = {};

      list.forEach(function (elem) {
        var id = elem._id.replace(/(\/index)?\.md/g, '');
        results[id] = elem;
      });

      return results;
    }

    function get_as_obj (id) {
      // get all docs
      // expose as object
      // so you can access specific ones in constant time
      var deferred = $q.defer();

      get(id)
      .then(function (docs) {
        deferred.resolve(to_obj(docs));
      });

      return deferred.promise;
    }

    function search (query) {
      // return all 
      var deferred = $q.defer();

      $http({
        url: [query_root, '_search', 'docs'].join('/'),
        method: 'GET',
        params: {
          q: query,
          include_docs: true
        }
      }).success(function (res) {
        var docs = res_to_docs(res);

        deferred.resolve(docs);
      });

      return deferred.promise;
    }
    
    return {
      get: get,
      get_as_obj: get_as_obj,
      to_obj: to_obj,
      search: search
    };
  }
])
.factory('smoothScrollTo', [
  '$location', '$timeout',
  function ($location, $timeout) {
    return function (id, delay) {
      id = id || $location.path().slice(1);
      delay = delay || 0;

      $timeout(function () {
        elem = document.getElementById(id);

        if (elem) {
          $('body').animate({
            scrollTop: elem.offsetTop
          });
        }
      }, delay);
    };
  }
])
.constant('md', new Showdown.converter())
.filter('markdown', [
  'md', 
  function (md) {
    return function (input){
      if (input) return md.makeHtml(input);
    };
  }
])
.factory('urlizer', function () {
  return function (input) {
    if (input) return input.trim().replace(/\s/g, '+').replace(/\//g, '_');
  };
})
.factory('deurlizer', function () {
  return function (input) {
    if (input) return input.trim().replace(/\+/g, ' ').replace(/_/g, '/');
  };
})
.filter('urlize', [
  'urlizer',
  function (urlizer) {
    return urlizer;
  }
]);
