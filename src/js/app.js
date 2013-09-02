angular.module('app', ['ngSanitize'])
.config(['$locationProvider', function($locationProvider){
  $locationProvider
    .html5Mode(true)
    .hashPrefix('!');
}])
.constant('root', '/root')
.value('md', new Showdown.converter())
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
        if(path){
          if(path.match(/\.\w{2,3}$/)){
            return pages[path];
          }else{
            return pages[path]['index.md'];
          } 
        }else{
          return pages['index.md'];
        }
      },
      keys: function(){
        return Object.keys(pages).filter(function(key){
          return key !== 'index.md';
        });
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
.controller("TreeController", ['$scope', function($scope) {
    $scope.delete = function(data) {
        data.nodes = [];
    };
    $scope.add = function(data) {
        var post = data.nodes.length + 1;
        var newName = data.name + '-' + post;
        data.nodes.push({name: newName,nodes: []});
    };
    $scope.hasNodes = function(data) {
        return (data.nodes.length > 0);
    };
    $scope.derp = [{name: "Node", nodes: []}];
}])
.controller('ContentCtrl', ['$scope', 'getPages', 'pagesTree', function($scope, getPages, pagesTree){
  getPages.success(function(data){
    $scope.pages = data;
    $scope.tree = pagesTree(data);
  });
}])
.controller('NavCtrl', ['$scope', function($scope){

}])
.controller('CurrentCtrl', ['$scope', '$location', function($scope, $location){
  function updateCurrent(){
    if($scope.tree){
      var parts = $location.path().split('/'),
          parents = parts.slice(1, -1),
          temp = $scope.tree,
          current_page,
          i;
      for(i in parents){
        if(temp.keys().indexOf(parents[i]) !== -1){
          temp = temp.retree(parents[i]);
        }else{
          temp = null;
          break;
        }
      }
      if(temp){
        current_page = temp.get(parts[parts.length-1]);
      }else{
        current_page = $scope.tree.get('index.md');
      }
      $scope.current = current_page;
    }
  }
  $scope.$watch('tree', updateCurrent);
  $scope.$watch(function(){
    return $location.path();
  }, updateCurrent);
}])
.filter('markdown', ['md', function(md){
  return function(input){
    if(input) return md.makeHtml(input);
  };
}]);