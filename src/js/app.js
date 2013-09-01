angular.module('app', [])
// .constant('md', new Showdown.converter())
.controller('TocCtrl', ['$scope', '$http', function($scope, $http){
  $http({
    url: '/root',
    method: 'GET'
  })
  .success(function(data){
    var docs = {};
    for(var i in data.attachments_md5){
      if(i.substring(0,2) === 'md'){
        docs[i] = {
          path: i
        }; 
      }
    }
    $scope.pages = docs;
  });
}])
.controller('PageCtrl', ['$scope', '$location', '$http', function($scope, $location, $http){
  console.log($location)
}]);