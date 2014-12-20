angular.module('djangoCradmin.pagepreview', [])


.directive('djangoCradminPagePreviewWrapper', [
  ->
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.origin = "#{window.location.protocol}//#{window.location.host}"

        @setIframeWrapper = (iframeWrapperScope) ->
          $scope.iframeWrapperScope = iframeWrapperScope

        @setIframe = (iframeScope) ->
          $scope.iframeScope = iframeScope

        @showPreview = (url) ->
          $scope.iframeScope.setUrl(url)
          $scope.iframeWrapperScope.show()

        return

      link: (scope, element) ->
        return
    }
])


.directive('djangoCradminPagePreviewOpenOnPageLoad', [
  ->
    ###
    A directive that opens the given URL in an iframe overlay instantly (on page load).
    ###
    return {
      require: '^djangoCradminPagePreviewWrapper'
      restrict: 'A'
      scope: {
        previewUrl: '=djangoCradminPagePreviewOpenOnPageLoad'
      }
      link: (scope, element, attrs, wrapperCtrl) ->
        wrapperCtrl.showPreview(scope.previewUrl)
#        element.on 'click', (e) ->
#          e.preventDefault()
        return

    }
])


.directive('djangoCradminPagePreviewIframeWrapper', [
  '$window'
  ($window) ->
    return {
      require: '^djangoCradminPagePreviewWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.bodyElement = angular.element($window.document.body)
        $scope.show = ->
          $scope.iframeWrapperElement.removeClass('ng-hide')
          $scope.bodyElement.addClass('django-cradmin-noscroll')
        $scope.hide = ->
          $scope.iframeWrapperElement.addClass('ng-hide')
          $scope.bodyElement.removeClass('django-cradmin-noscroll')
        @closeIframe = ->
          $scope.hide()
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.iframeWrapperElement = element
        wrapperCtrl.setIframeWrapper(scope)
        return
    }
])

.directive 'djangoCradminPagePreviewIframeClosebutton', ->
  return {
    require: '^djangoCradminPagePreviewIframeWrapper'
    restrict: 'A'
    scope: {}

    link: (scope, element, attrs, iframeWrapperCtrl) ->
      element.on 'click', (e) ->
        e.preventDefault()
        iframeWrapperCtrl.closeIframe()
      return
  }

.directive 'djangoCradminPagePreviewIframe', ->
  return {
    require: '^djangoCradminPagePreviewWrapper'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      $scope.setUrl = (url) ->
        $scope.element.attr('src', url)

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      return
  }
