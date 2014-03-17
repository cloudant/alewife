angular
.module('routes', ['ngRoute'])
.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'main.html',
      controller: 'ListCtrl',
      reloadOnSearch: false
    })
    .when('/search', {
      templateUrl: 'main.html',
      controller: 'SearchCtrl'
    })
    .when('/:path*', {
      templateUrl: 'main.html',
      controller: 'ListCtrl',
      reloadOnSearch: false
    })
    .otherwise({
      redirectTo: '/'
    });
  }
])
.config([
  '$locationProvider',
  function ($locationProvider) {
    // $locationProvider
    //   .html5Mode(true);
      // .hashPrefix('!');
  }
]);