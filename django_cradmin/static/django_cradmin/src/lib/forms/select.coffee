angular.module('djangoCradmin.forms.select', [])

.directive('djangoCradminOpenUrlStoredInSelectedOption', [
  'djangoCradminBgReplaceElement',
  (djangoCradminBgReplaceElement) ->
    return {
      restrict: 'A',
      link: ($scope, $element, attributes) ->
        backgroundreplaceElementSelector = attributes.djangoCradminBackgroundreplaceElementSelector

        getValue = ->
          $element.find("option:selected").attr('value')

        $element.on 'change', ->
          remoteUrl = getValue()
          targetElement = angular.element(backgroundreplaceElementSelector)
          if backgroundreplaceElementSelector?
            console.log 'Background', remoteUrl

            djangoCradminBgReplaceElement.load({
              parameters: {
                method: 'GET'
                url: remoteUrl
              },
              remoteElementSelector: backgroundreplaceElementSelector
              targetElement: targetElement
              $scope: $scope
              replace: true
              onHttpError: (response) ->
                console.log 'ERROR', response
              onSuccess: ->
                console.log 'Success!'
              onFinish: ->
                console.log 'Finish!'
            })
          else
            window.location = value
    }
])
