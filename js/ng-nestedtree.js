angular.module('ngNestedTree', ['ngNestedTreeTemplates'])
  .directive('ngNestedTree', [function() {
    return {
      restrict: 'E',
      scope: {
        parent: '=tree',
        onClickCb: '=?',
        onChildlessClickCb: '=?',
        selectOnlyChildless: '=?',
        expand: '=?'
      },
      templateUrl: '/ng-nestedtree-templates/main.html',
      link: function(scope) {
        if (!scope.expand) {
          scope.expand = false;
        }
        scope.elementClicked = function(child) {
          if (
            (scope.selectOnlyChildless && !child.childrens) ||
            !scope.selectOnlyChildless
          ) {
            if (scope.latestClick) {
              scope.latestClick.selected = false;
            }
            child.selected = true;
            scope.latestClick = child;
          }
          if (scope.onChildlessClickCb && !child.childrens) {
            scope.onChildlessClickCb(child);
          }
          if (scope.onClickCb) {
            scope.onClickCb(child);
          }
        };
      }
    };
  }]);
