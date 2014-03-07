angular
.module('services', [])
.value('url_root', '_rewrite')
.factory('sitemap', [
  '$http', '$q', 'url_root',
  function ($http, $q, url_root) {
    var promise = $http({
      url: [url_root, 'docs', 'sitemap'].join('/'),
      method: 'GET'
    });

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
            if (i === 0) {
              parent = parent ? [parent, elem].join('/') : elem;
              results.push(parent);
            } else if (include_languages) {
              var path = parent ? [parent, elem].join('/') : elem;
              results.push(path);
            }
          } else {
            results = results.concat(flatten(elem, parent));
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
      
      flatten(include_languages).success(function (ids) {
        deferred.resolve(ids.filter(function (id) {
          return id.indexOf(path) > -1;
        }));
      });

      return deferred.promise;
    }

    return {
      sitemap: sitemap,
      flatten: flatten,
      get: get
    };
  }
])
.factory('languages', [
  '$http', '$q', 'url_root',
  function ($http, $q, url_root) {
    var promise = $http({
      url: [url_root, 'api', '_view', 'languages'].join('/'),
      method: 'GET',
    });

    function get () {
      // get all languages used in sample code
      var deferred = $q.defer();

      promise.success(function (res) {
        var languages = res.rows.map(function (row) {
          return row.key;
        });

        deferred.resolve(languages);
      }).error(deferred.reject);

      return deferred.promise;
    }
  }

  return {
    get: get
  };
])
.factory('docs', [
  '$http', '$q', 'url_root',
  function ($http, $q, url_root) {
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
        url: [url_root, 'api', '_view', 'docs'].join('/'),
        method: 'GET',
        params: {
          start_key: JSON.stringify(id),
          end_key: JSON.stringify(id + '\ufff0'),
          include_docs: true
        }
      }).success(function (res) {
        deferred.resolve(res_to_docs(res));
      }).error(deferred.reject);

      return deferred.promise;
    }

    function get_as_obj (id) {
      // get all docs
      // expose as object
      // so you can access specific ones in constant time
      var deferred = $q.defer();

      get(id)
      .success(function (docs) {
        var results = {};

        docs.forEach(function (doc) {
          results[doc._id] = doc;
        });

        deferred.resolve(results);
      })
      .error(deferred.reject);

      return deferred.promise;
    }

    function search (query) {
      // return all 
      var deferred = $q.defer();

      $http({
        url: [url_root, 'api', '_search', 'docs'].join('/'),
        method: 'GET',
        params: {
          q: query,
          include_docs: true
        }
      }).success(function (res) {
        var docs = res_to_docs(res);

        deferred.resolve(docs);
      }).error(deferred.reject);

      return deferred.promise;
    }
    
    return {
      get: get,
      get_as_obj: get_as_obj,
      search: search
    };
  }
]);