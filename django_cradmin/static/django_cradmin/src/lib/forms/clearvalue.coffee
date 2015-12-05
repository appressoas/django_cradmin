angular.module('djangoCradmin.forms.clearvalue', [])

.directive('djangoCradminClearValue', [
  ->
    return {
      restrict: 'A',
      link: ($scope, $element, attributes) ->
        targetElementSelector = attributes.djangoCradminClearValue
        $target = angular.element(targetElementSelector)
        $element.on 'click', (e) ->
          e.preventDefault()
          $target.val('')
          $target.focus()
          $target.change()
    }
])
