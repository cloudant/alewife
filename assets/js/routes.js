angular
.module('routes', ['ngRoute'])
.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'list.html',
      controller: 'ListCtrl'
    })
    .when('/search', {
      templateUrl: 'list.html',
      controller: 'SearchCtrl'
    })
    .when('/:path*', {
      templateUrl: 'list.html',
      controller: 'ListCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  }
])
.config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider
      .html5Mode(true);
      // .hashPrefix('!');
  }
]);