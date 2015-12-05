angular.module('djangoCradmin.forms.clearabletextinput', [])

.directive('djangoCradminClearableTextinput', [
  ->
    return {
      restrict: 'A',
      link: ($scope, $element, attributes) ->
        targetElementSelector = attributes.djangoCradminClearableTextinput
        $target = angular.element(targetElementSelector)

        onTargetValueChange = ->
          if $target.val() == ''
            $element.removeClass('django-cradmin-clearable-textinput-button-visible')
          else
            $element.addClass('django-cradmin-clearable-textinput-button-visible')

        $element.on 'click', (e) ->
          e.preventDefault()
          $target.val('')
          $target.focus()
          $target.change()

        $target.on 'change', ->
          onTargetValueChange()

        $target.on 'keydown', (e) ->
          onTargetValueChange()

        onTargetValueChange()
    }
])
