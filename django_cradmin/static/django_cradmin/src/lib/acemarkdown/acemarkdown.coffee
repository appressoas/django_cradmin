angular.module('djangoCradmin.acemarkdown', [
  'ui.ace'
])

.directive 'djangoCradminAcemarkdown', () ->
  console.log 'hei'
  return {
    restrict: 'A'
    transclude: true
    # template: '<div><div ng-transclude></div></div>',
    templateUrl: 'acemarkdown/acemarkdown.tpl.html'
  }
