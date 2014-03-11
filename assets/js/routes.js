angular
.module('routes', [])
.config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider
      .html5Mode(true);
      // .hashPrefix('!');
  }
]);