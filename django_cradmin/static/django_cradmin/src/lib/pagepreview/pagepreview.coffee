angular.module('djangoCradmin.pagepreview', [])


.provider 'djangoCradminPagePreview', ->
  class PagePreview
    constructor: ->
      @pagePreviewWrapper = null
      @bodyContentWrapperElement = angular.element('#django_cradmin_bodycontentwrapper')
      @bodyElement = angular.element('body')
    registerPagePreviewWrapper: (pagePreviewWrapper) ->
      @pagePreviewWrapper = pagePreviewWrapper
    setPreviewConfig: (previewConfig) ->
      @pagePreviewWrapper.setPreviewConfig(previewConfig)
    addBodyContentWrapperClass: (cssclass) ->
      @bodyContentWrapperElement.addClass(cssclass)
    removeBodyContentWrapperClass: (cssclass) ->
      @bodyContentWrapperElement.removeClass(cssclass)
    disableBodyScrolling: ->
      @bodyElement.addClass('django-cradmin-noscroll')
    enableBodyScrolling: ->
      @bodyElement.removeClass('django-cradmin-noscroll')

  @$get = ->
    return new PagePreview()
  return @


.directive('djangoCradminPagePreviewWrapper', [
  '$window', '$timeout', 'djangoCradminPagePreview',
  ($window, $timeout, djangoCradminPagePreview) ->
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
        <div class="django-cradmin-floating-fullsize-iframe-wrapper"
             django-cradmin-page-preview-iframe-wrapper>
            <a href="#" class="django-cradmin-floating-fullsize-iframe-closebutton"
               django-cradmin-page-preview-iframe-closebutton>
                <span class="fa fa-close"></span>
                <span class="sr-only">Close preview</span>
            </a>
            <div class="ng-hide django-cradmin-floating-fullsize-loadspinner">
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

      controller: ($scope, djangoCradminPagePreview) ->
        djangoCradminPagePreview.registerPagePreviewWrapper(this)
        $scope.origin = "#{window.location.protocol}//#{window.location.host}"
        $scope.mainWindow = angular.element($window)
        $scope.windowDimensions = null
        previewConfigWaitingForStartup = null

        @setIframeWrapper = (iframeWrapperScope) ->
          $scope.iframeWrapperScope = iframeWrapperScope
          @_readyCheck()

        @setIframe = (iframeScope) ->
          $scope.iframeScope = iframeScope
          @_readyCheck()

        @setNavbar = (navbarScope) ->
          $scope.navbarScope = navbarScope
          @_readyCheck()

        @setLoadSpinner = (loadSpinnerScope) ->
          $scope.loadSpinnerScope = loadSpinnerScope
          @_readyCheck()

        @setIframeWrapperInner = (iframeInnerScope) ->
          $scope.iframeInnerScope = iframeInnerScope

        @showNavbar = ->
          $scope.iframeWrapperScope.showNavbar()

        @setUrl = (url) ->
          $scope.loadSpinnerScope.show()
          $scope.iframeInnerScope.scrollToTop()
          $scope.iframeScope.setUrl(url)

        @_readyCheck = ->
          isReady = $scope.iframeInnerScope? and $scope.loadSpinnerScope? \
            and $scope.navbarScope? and $scope.iframeScope? and $scope.iframeWrapperScope?
          if isReady
            @_onReady()

        @_onReady = ->
          if previewConfigWaitingForStartup?
            @_applyPreviewConfig()

        @_applyPreviewConfig = ->
          url = previewConfigWaitingForStartup.urls[0].url
          $scope.navbarScope.setConfig(previewConfigWaitingForStartup)
          $scope.iframeInnerScope.hide()
          previewConfigWaitingForStartup = null
          @showPreview()
          @setUrl(url)

        @setPreviewConfig = (previewConfig) ->
          ###
          Called once on startup
          ###
          previewConfigWaitingForStartup = previewConfig
          @_readyCheck()

        @showPreview = ->
          djangoCradminPagePreview.addBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper')
          $scope.iframeWrapperScope.show()
          $scope.mainWindow.bind 'resize', $scope.onWindowResize

        @hidePreview = ->
          $scope.iframeWrapperScope.hide()
          $scope.mainWindow.unbind 'resize', $scope.onWindowResize
          djangoCradminPagePreview.removeBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper')

        @onIframeLoaded = ->
          $scope.iframeInnerScope.show()
          $scope.loadSpinnerScope.hide()

        $scope.getWindowDimensions = ->
          return {
            height: $scope.mainWindow.height()
            width: $scope.mainWindow.width()
          }

        $scope.$watch 'windowDimensions', ((newSize, oldSize) ->
          $scope.iframeScope.setIframeSize()
          return
        ), true

        $scope.onWindowResize = ->
          $timeout.cancel($scope.applyResizeTimer)

          # Use timeout to avoid triggering change for each pixel changed
          $scope.applyResizeTimer = $timeout ->
            $scope.windowDimensions = $scope.getWindowDimensions()
            $scope.$apply()
          , 300
          return

        return

      link: (scope, element) ->

        return
    }
])


.directive('djangoCradminPagePreviewIframeWrapper', [
  '$window', 'djangoCradminPagePreview'
  ($window, djangoCradminPagePreview) ->
    return {
      require: '^^djangoCradminPagePreviewWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.show = ->
          $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-show')
          djangoCradminPagePreview.disableBodyScrolling()
          djangoCradminPagePreview.addBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push')
        $scope.hide = ->
          $scope.iframeWrapperElement.removeClass('django-cradmin-floating-fullsize-iframe-wrapper-show')
          djangoCradminPagePreview.enableBodyScrolling()
          djangoCradminPagePreview.removeBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push')
        $scope.showNavbar = ->
          $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-with-navbar')
        $scope.scrollToTop = ->
          $scope.iframeWrapperElement.scrollTop(0)

        @hide = ->
          $scope.hide()
        @show = ->
          $scope.show()
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
          $scope.element.scrollTop(0)
        $scope.show = ->
          $scope.element.removeClass('ng-hide')
        $scope.hide = ->
          $scope.element.addClass('ng-hide')
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.element = element
        wrapperCtrl.setIframeWrapperInner(scope)
        return
    }
])

.directive 'djangoCradminPagePreviewIframeClosebutton', ->
  return {
    require: '^^djangoCradminPagePreviewWrapper'
    restrict: 'A'
    scope: {}

    link: (scope, element, attrs, wrapperCtrl) ->
      element.on 'click', (e) ->
        e.preventDefault()
        wrapperCtrl.hidePreview()
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
    scope: {
      mobileMenuHeader: '@djangoCradminPagePreviewNavbarMobileMenuHeader'
    }
    templateUrl: 'pagepreview/navbar.tpl.html'

    controller: ($scope) ->
      $scope.activeIndex = 0
      $scope.activeUrlConfig = null

      $scope.setConfig = (previewConfig) ->
        if previewConfig.urls.length > 1
          $scope.previewConfig = previewConfig
          $scope.setActive(0)
          $scope.$apply()
          $scope.wrapperCtrl.showNavbar()

      $scope.setActive = (index) ->
        $scope.activeIndex = index
        $scope.activeUrlConfig = $scope.previewConfig.urls[$scope.activeIndex]

    link: ($scope, element, attrs, wrapperCtrl) ->
      $scope.element = element
      $scope.wrapperCtrl = wrapperCtrl
      $scope.wrapperCtrl.setNavbar($scope)

      $scope.onNavlinkClick = (e, index) ->
        e.preventDefault()
        $scope.setActive(index)
        $scope.wrapperCtrl.setUrl($scope.previewConfig.urls[index].url)
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
        $scope.resetIframeSize()
      $scope.setIframeSize = ->
        iframeWindow = $scope.element.contents()
        iframeDocument = iframeWindow[0]
        if iframeDocument?
          iframeBodyHeight = iframeDocument.body.offsetHeight
          $scope.element.height(iframeBodyHeight + 60)
      $scope.resetIframeSize = ->
        $scope.element.height('40px')

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      scope.element.on 'load', ->
        wrapperCtrl.onIframeLoaded()
        scope.setIframeSize()
      return
  }


.directive('djangoCradminPagePreviewOpenOnPageLoad', [
  'djangoCradminPagePreview'
  (djangoCradminPagePreview) ->
    ###
    A directive that opens the given URL in an iframe overlay instantly (on page load).
    ###
    return {
      restrict: 'A'
      scope: {
        previewConfig: '=djangoCradminPagePreviewOpenOnPageLoad'
      }

      link: (scope, element, attrs) ->
        djangoCradminPagePreview.setPreviewConfig(scope.previewConfig)
        return

    }
])


.directive('djangoCradminPagePreviewOpenOnClick', [
  'djangoCradminPagePreview'
  (djangoCradminPagePreview) ->
    ###
    A directive that opens the given URL in an iframe overlay on click.
    ###
    return {
      restrict: 'A'
      scope: {
        previewConfig: '=djangoCradminPagePreviewOpenOnClick'
      }

      link: (scope, element, attrs) ->
        element.on 'click', (e) ->
          e.preventDefault()
          djangoCradminPagePreview.setPreviewConfig(scope.previewConfig)
        return

    }
])
