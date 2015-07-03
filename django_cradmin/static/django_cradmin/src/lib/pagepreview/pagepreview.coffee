angular.module('djangoCradmin.pagepreview', [])

.directive('djangoCradminPagePreviewWrapper', [
  '$window',
  ($window) ->
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

        @setLoadSpinner = (loadSpinnerScope) ->
          $scope.loadSpinnerScope = loadSpinnerScope

        @setIframeWrapperInner = (iframeInnerScope) ->
          $scope.iframeInnerScope = iframeInnerScope

        @showNavbar = ->
          $scope.iframeWrapperScope.showNavbar()

        @setUrl = (url) ->
          $scope.loadSpinnerScope.show()
          $scope.iframeInnerScope.scrollToTop()
          $scope.iframeScope.setUrl(url)

        @loadPreview = (previewConfig) ->
          url = previewConfig.urls[0].url
          $scope.navbarScope.setConfig(previewConfig)
          @setUrl(url)
          $scope.iframeWrapperScope.show()

        @onIframeLoaded = ->
          $scope.loadSpinnerScope.hide()

        return

      link: (scope, element) ->
        mainWindow = angular.element($window)

        scope.getWindowDimensions = ->
          return {
            height: mainWindow.height()
            width: mainWindow.width()
          }

        scope.$watch scope.getWindowDimensions, ((newSize, oldSize) ->
          scope.iframeScope.setIframeSize()
          return
        ), true

        mainWindow.bind 'resize', ->
          scope.$apply()
          return

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
        $scope.showNavbar = ->
          $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-with-navbar')
        $scope.scrollToTop = ->
          console.log 'Scroll to top'
          $scope.iframeWrapperElement.scrollTop(0)

        @closeIframe = ->
          $scope.hide()
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.iframeWrapperElement = element
        wrapperCtrl.setIframeWrapper(scope)
        return
    }
])


.directive('djangoCradminPagePreviewIframeWrapperInner', [
  '$window'
  ($window) ->
    return {
      require: '^^djangoCradminPagePreviewWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.scrollToTop = ->
          console.log 'Scroll to top'
          $scope.element.scrollTop(0)
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.element = element
        wrapperCtrl.setIframeWrapperInner(scope)
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

.directive 'djangoCradminPagePreviewLoadSpinner', ->
  return {
    require: '^^djangoCradminPagePreviewWrapper'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      $scope.hide = ->
        $scope.element.addClass('ng-hide')
      $scope.show = ->
        $scope.element.removeClass('ng-hide')

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setLoadSpinner(scope)
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
        if previewConfig.urls.length > 1
          $scope.previewConfig = previewConfig
          $scope.$apply()
          $scope.wrapperCtrl.showNavbar()

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      scope.wrapperCtrl = wrapperCtrl
      scope.activeIndex = 0
      scope.wrapperCtrl.setNavbar(scope)

      scope.setActive = (index) ->
        scope.activeIndex = index
      scope.onNavlinkClick = (e, index) ->
        e.preventDefault()
        scope.setActive(index)
        scope.wrapperCtrl.setUrl(scope.previewConfig.urls[index].url)
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
        $scope.element.attr('src', url)
        $scope.setIframeSize()
      $scope.setIframeSize = ->
        iframeWindow = $scope.element.contents()
        iframeDocument = iframeWindow[0]
        if iframeDocument?
          iframeBodyHeight = iframeDocument.body.offsetHeight
          console.log 'iframeBodyHeight', iframeBodyHeight
          $scope.element.height(iframeBodyHeight + 10)

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      scope.element.on 'load', ->
        wrapperCtrl.onIframeLoaded()
        scope.setIframeSize()
      return
  }
