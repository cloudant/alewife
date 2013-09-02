angular.module('app', ['ngSanitize'])
.constant('root', '/root')
.constant('md', new Showdown.converter())
.factory('getPages', ['$http', function($http){
  return $http({
    url: '/pages',
    method: 'GET'
  });
}])
.factory('pagesTree', function(){
  var makePages = function(pages){
    if (pages) return {
      get: function(path){
        if(path.match(/\.\w{2,3}$/)){
          return pages[path];
        }else{
          return pages[path]['index.md'];
        }
      },
      keys: function(){
        return Object.keys(pages);
      },
      values: function(){
        var results = [];
        for(var key in pages){
          results.push(pages[key]);
        }
        return results;
      },
      is_dir: function(path){
        return !path.match(/\.\w{2,3}$/);
      },
      retree: function(path){
        return makePages(pages[path]);
      }
    };
  };
  return makePages;
})
.controller('ContentCtrl', ['$scope', 'getPages', 'pagesTree', function($scope, getPages, pagesTree){
  getPages.success(function(data){
    $scope.pages = data;
    $scope.tree = pagesTree(data);
  });
}])
.controller('NavCtrl', ['$scope', function($scope){

}])
.controller('CurrentCtrl', ['$scope', function($scope){

}])
.filter('markdown', ['md', function(md){
  return function(input){
    if (input) {
      return md.makeHtml(input);
    } else {
      console.log(arguments);
    }
  };
}])
.directive('markdown', ['md', function (md) {
  return {
    restrict: 'E',
    replace: true,
    link: function (scope, element, attrs) {
      var html = md.makeHtml(element.text());
      element.html(html);
    }
  };
}]);