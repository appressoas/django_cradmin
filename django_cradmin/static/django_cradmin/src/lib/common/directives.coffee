angular.module('djangoCradmin.directives', [])

.directive 'djangoCradminBack', ->
  return {
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on 'click', ->
        history.back()
        scope.$apply()
      return
  }
