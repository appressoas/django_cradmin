angular.module('djangoCradmin.pagepreview', [])

.directive('djangoCradminPagePreviewWrapper', [
  ->
    ###
    A directive that shows a preview of a page in an iframe.
    value.

    Components:

      - A DIV using this directive (``django-cradmin-page-preview-wrapper``)
        with the following child elements:
        - A child DIV using the ``django-cradmin-page-preview-iframe-wrapper``
          directive with the following child elements:
          - A "Close" link/button using the ``django-cradmin-page-preview-iframe-closebutton`` directive.
          - A IFRAME element using the ``django-cradmin-page-preview-iframe`` directive.
        - A child element with one of the following directives:
          - ``django-cradmin-page-preview-open-on-page-load`` to show the preview when the page loads.
          - ``django-cradmin-page-preview-open-on-click`` to show the preview when the element is clicked.

    The outer wrapper (``django-cradmin-page-preview-wrapper``) coordinates everything.

    You can have one wrapper with many ``django-cradmin-page-preview-open-on-click`` directives.
    This is typically used in listings where each item in the list has its own preview button.
    Just wrap the entire list in a ``django-cradmin-page-preview-wrapper``, add the
    ``django-cradmin-page-preview-iframe-wrapper`` before the list, and a button/link with
    the ``django-cradmin-page-preview-open-on-click``-directive for each entry in the list.


    Example:

    ```
    <div django-cradmin-page-preview-wrapper>
        <div class="ng-hide django-cradmin-floating-fullsize-iframe-wrapper"
             django-cradmin-page-preview-iframe-wrapper>
            <a href="#" class="django-cradmin-floating-fullsize-iframe-closebutton"
               django-cradmin-page-preview-iframe-closebutton>
                <span class="fa fa-close"></span>
                <span class="sr-only">Close preview</span>
            </a>
            <div class="django-cradmin-floating-fullsize-loadspinner">
                <span class="fa fa-spinner fa-spin"></span>
            </div>
            <div class="django-cradmin-floating-fullsize-iframe-inner">
                <iframe django-cradmin-page-preview-iframe></iframe>
            </div>
        </div>

        <div django-cradmin-page-preview-open-on-page-load="'/some/view'"></div>
    </div>
    ```
    ###
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.origin = "#{window.location.protocol}//#{window.location.host}"

        @setIframeWrapper = (iframeWrapperScope) ->
          $scope.iframeWrapperScope = iframeWrapperScope

        @setIframe = (iframeScope) ->
          $scope.iframeScope = iframeScope

        @setNavbar = (navbarScope) ->
          $scope.navbarScope = navbarScope

        @setUrl = (url) ->
          $scope.iframeScope.setUrl(url)

        @loadPreview = (previewConfig) ->
          url = previewConfig.urls[0].url
          $scope.navbarScope.setConfig(previewConfig)
          @setUrl(url)
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
      require: '^^djangoCradminPagePreviewWrapper'
      restrict: 'A'
      scope: {
        previewConfig: '=djangoCradminPagePreviewOpenOnPageLoad'
      }
      link: (scope, element, attrs, wrapperCtrl) ->
        wrapperCtrl.loadPreview(scope.previewConfig)
#        element.on 'click', (e) ->
#          e.preventDefault()
        return

    }
])


.directive('djangoCradminPagePreviewOpenOnClick', [
  ->
    ###
    A directive that opens the given URL in an iframe overlay on click.
    ###
    return {
      require: '^^djangoCradminPagePreviewWrapper'
      restrict: 'A'
      scope: {
        previewConfig: '=djangoCradminPagePreviewOpenOnClick'
      }
      link: (scope, element, attrs, wrapperCtrl) ->
        element.on 'click', (e) ->
          e.preventDefault()
          wrapperCtrl.loadPreview(scope.previewConfig)
        return

    }
])


.directive('djangoCradminPagePreviewIframeWrapper', [
  '$window'
  ($window) ->
    return {
      require: '^^djangoCradminPagePreviewWrapper'
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
    require: '^^djangoCradminPagePreviewIframeWrapper'
    restrict: 'A'
    scope: {}

    link: (scope, element, attrs, iframeWrapperCtrl) ->
      element.on 'click', (e) ->
        e.preventDefault()
        iframeWrapperCtrl.closeIframe()
      return
  }

.directive 'djangoCradminPagePreviewNavbar', ->
  return {
    require: '^^djangoCradminPagePreviewWrapper'
    restrict: 'A'
    scope: {}
    templateUrl: 'pagepreview/navbar.tpl.html'

    controller: ($scope) ->
      $scope.setConfig = (previewConfig) ->
        $scope.previewConfig = previewConfig
        $scope.$apply()

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      scope.activeIndex = 0
      wrapperCtrl.setNavbar(scope)

      scope.setActive = (index) ->
        scope.activeIndex = index
      scope.onNavlinkClick = (e, index) ->
        e.preventDefault()
        console.log "hei #{index}"
        scope.setActive(index)
        wrapperCtrl.setUrl(scope.previewConfig.urls[index].url)
        return

      return
  }

.directive 'djangoCradminPagePreviewIframe', ->
  return {
    require: '^^djangoCradminPagePreviewWrapper'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      $scope.setUrl = (url) ->
        console.log "setUrl #{url}"
        $scope.element.attr('src', url)

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      return
  }
