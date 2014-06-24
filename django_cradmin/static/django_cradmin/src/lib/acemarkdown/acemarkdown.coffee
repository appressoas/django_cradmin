angular.module('djangoCradmin.acemarkdown', [
  'ui.ace'
])

.directive 'djangoCradminAcemarkdown', () ->
  return {
    restrict: 'A'
    transclude: true
    template: '<div><div ng-transclude></div></div>'
  }
