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

.directive 'djangoCradminFormAction', ->
  return {
    restrict: 'A'
    scope: {
      'value': '=djangoCradminFormAction'
    }

    controller: ($scope) ->
      $scope.$watch 'value', (newValue) ->
        $scope.element.attr('action', newValue)
      return

    link: (scope, element, attrs) ->
      scope.element = element
      return
  }