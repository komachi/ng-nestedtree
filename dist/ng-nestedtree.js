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

(function(module) {
try {
  module = angular.module('ngNestedTreeTemplates');
} catch (e) {
  module = angular.module('ngNestedTreeTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ng-nestedtree-templates/inside.html',
    '<span ng-init="child.expand=expand" ng-if="child.childs" ng-click="child.expand=!child.expand; elementExpand(child); $event.stopPropagation()" class="ngnestedtree-icon"></span><span ng-class="{\'ngnestedtree-selected\': child.selected}" class="ngnestedtree-title">{{child.title}}</span><ul ng-if="child.childs" ng-show="child.expand==true"><li ng-repeat="child in child.childs track by $index" ng-include="\'/ng-nestedtree-templates/inside.html\'" ng-click="elementClicked(child); $event.stopPropagation();"></li></ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('ngNestedTreeTemplates');
} catch (e) {
  module = angular.module('ngNestedTreeTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/ng-nestedtree-templates/main.html',
    '<div class="ngnestedtree-main"><ul><li ng-repeat="child in parent track by $index" ng-include="\'/ng-nestedtree-templates/inside.html\'" ng-click="elementClicked(child); $event.stopPropagation();"></li></ul></div>');
}]);
})();
