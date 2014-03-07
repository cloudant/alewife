angular
.module('routes', ['ngRoute'])
// .config([
//   '$routeProvider',
//   function ($routeProvider) {
//     $routeProvider
//     .when('/', {
//       templateUrl: 'list.html'
//     })
//     .when('/search', {
//       controller: 'SearchCtrl',
//       templateUrl: 'list.html'
//     })
//     .when('/404', {
//       templateUrl: 'notfound.html'
//     })
//     .otherwise({
//       redirectTo: '/404'
//     });
//   }
// ])
.config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider
      .html5Mode(true);
      // .hashPrefix('!');
  }
]);