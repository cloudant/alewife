angular
.module('routes', ['ngRoute'])
.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'main.html',
      controller: 'ListCtrl'
    })
    .when('/search', {
      templateUrl: 'main.html',
      controller: 'SearchCtrl'
    })
    .when('/:path*', {
      templateUrl: 'main.html',
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
    // $locationProvider
    //   .html5Mode(true);
    //   .hashPrefix('!');
  }
]);