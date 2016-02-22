# ng-nestedtree

A simple library for Angular.js to display nested trees.


## Installation

Using npm

```
npm install ng-nestedtree --save
```

Using bower

```
bower install ng-nestedtree --save
```

## Usage

```js
angular.module('ngNestedTreeDemo', ['ngNestedTree'])
  .controller('demo', ['$scope', function($scope) {
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
      console.log(child);
    };
    $scope.cb2 = function(child) {
      console.log('Childless', child);
    };
  }]);
```

```html
<div ng-controller="demo">
  <ng-nested-tree tree="home" on-click-cb="cb" on-childless-click-cb="cb2" select-only-childless="true" expand="false"></ng-nested-tree>
</div>
```

## Options

#### tree

Object contains the tree. There is no limit on allowed properties, but `childrens` is reserved as array for childrens.

### on-click-cb

Function to be triggered on element click. An element will be passed.

### on-childless-click-cb

Function to be triggered on element click if it has no children. An element will be passed.

### expand

Boolean, should be tree expanded by default. Default: `false`.

### select-only-childless

Boolean, append `ngnestedtree-selected` class only on elements without children. Default: `false`.
