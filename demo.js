angular.module('ngNestedTreeDemo', ['ngNestedTree'])
  .controller('main', ['$scope', function($scope) {
    var i = 4;
    $scope.home = [{
      title: 'test',
      value: 1,
      childs: [
        {
          title: 'test2',
          value: 2,
          childs: [
            {
              title: 'test3',
              value: 3,
              childs: [
                {
                  title: 'test4',
                  value: 4
                }
              ]
            }
          ]
        }
      ]
    }];
    $scope.cb = function(child) {
      if (angular.isArray(child.childs)) {
        i++;
        child.childs.push({
          title: 'test' + i,
          value: i
        });
      } else {
        child.childs = [{
          title: 'test' + i,
          value: i
        }];
      }
    };
  }]);
