angular.module('djangoCradmin.forms.select', [])

.directive('djangoCradminOpenUrlStoredInSelectedOption', ->
  {
    restrict: 'A',
    link: ($scope, $element) ->
      getValue = ->
        $element.find("option:selected").attr('value')

      $element.on 'change', ->
        value = getValue()
        window.location = value
  }
)
