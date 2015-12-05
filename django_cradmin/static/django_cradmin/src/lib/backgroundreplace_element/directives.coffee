angular.module('djangoCradmin.backgroundreplace_element.directives', [])


.directive('djangoCradminBgReplaceElementOnPageLoad', [
  '$window', 'djangoCradminBgReplaceElement',
  ($window, djangoCradminBgReplaceElement) ->
    return {
      restrict: 'A'

      controller: ($scope, $element) ->
        return

      link: ($scope, $element, attributes) ->
#        domId = $element.attr('id')
        console.log 'YO'
        remoteElementSelector = attributes.djangoCradminRemoteElementSelector
        remoteUrl = attributes.djangoCradminRemoteUrl
        if not remoteElementSelector?
          console?.error? "You must include the 'django-cradmin-remote-element-id' attribute."
        if not remoteUrl?
          console?.error? "You must include the 'django-cradmin-remote-url' attribute."
        angular.element(document).ready ->
          console.log 'load', remoteUrl, remoteElementSelector

          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: remoteUrl
            },
            remoteElementSelector: remoteElementSelector
            targetElement: $element
            $scope: $scope
            replace: true
            onHttpError: (response) ->
              console.log 'ERROR', response
            onSuccess: ->
              console.log 'Success!'
            onFinish: ->
              console.log 'Finish!'
          })
        return
    }
])
