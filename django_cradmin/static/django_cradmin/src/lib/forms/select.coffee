angular.module('djangoCradmin.forms.select', [])

.directive('djangoCradminOpenUrlStoredInSelectedOption', [
  ->
    return {
      restrict: 'A',
      link: ($scope, $element, attributes) ->
        getValue = ->
          $element.find("option:selected").attr('value')

        $element.on 'change', ->
          remoteUrl = getValue()
          window.location = value
    }
])
