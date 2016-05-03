angular.module('ngNestedTree', ['ngNestedTreeTemplates'])
  .directive('ngNestedTree', [function() {
    return {
      restrict: 'E',
      scope: {
        parent: '=tree',
        onExpandCb: '=?',
        onClickCb: '=?',
        onChildlessClickCb: '=?',
        selectOnlyChildless: '=?',
        expand: '=?',
        selectOnlySelectable: '=?',
        selectCb: '=?'
      },
      templateUrl: '/ng-nestedtree-templates/main.html',
      link: function(scope) {
        if (!scope.expand) {
          scope.expand = false;
        }
        scope.elementClicked = function(child) {
          if (
            (scope.selectOnlyChildless && !child.childrens) ||
            !scope.selectOnlyChildless || !scope.selectOnlySelectable ||
            (scope.selectOnlySelectable && child.selectable === true)
          ) {
            if (scope.latestClick) {
              scope.latestClick.selected = false;
            }
            child.selected = true;
            scope.latestClick = child;
            if (scope.selectCb) {
              scope.selectCb(child);
            }
          }
          if (scope.onChildlessClickCb && !child.childrens) {
            scope.onChildlessClickCb(child);
          }
          if (scope.onClickCb) {
            scope.onClickCb(child);
          }
        };
        scope.elementExpand = function(child) {
          if (scope.onExpandCb) {
            scope.onExpandCb(child);
          }
        };
      }
    };
  }]);
