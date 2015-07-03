angular.module('djangoCradmin.pagepreview', [])


.provider 'djangoCradminPagePreview', ->
  class PagePreview
    constructor: ->
      @pagePreviewWrapper = null
      @bodyContentWrapperElement = angular.element('#django_cradmin_bodycontentwrapper')
      @bodyElement = angular.element('body')
    registerPagePreviewWrapper: (pagePreviewWrapper) ->
      @pagePreviewWrapper = pagePreviewWrapper
    loadPreview: (previewConfig) ->
      @pagePreviewWrapper.loadPreview(previewConfig)
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
  '$window', 'djangoCradminPagePreview',
  ($window, djangoCradminPagePreview) ->
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
          $scope.iframeInnerScope.hide()
          @showPreview()
          @setUrl(url)

        @showPreview = ->
          djangoCradminPagePreview.addBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper')
          $scope.iframeWrapperScope.show()

        @hidePreview = ->
          $scope.iframeWrapperScope.hide()
          djangoCradminPagePreview.removeBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper')

        @onIframeLoaded = ->
          $scope.loadSpinnerScope.hide()
          $scope.iframeInnerScope.show()

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
#          $scope.element.addClass('django-cradmin-noscroll')
        $scope.hide = ->
          $scope.element.addClass('ng-hide')
#          $scope.element.removeClass('django-cradmin-noscroll')
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
    scope: {}
    templateUrl: 'pagepreview/navbar.tpl.html'

    controller: ($scope) ->
      $scope.setConfig = (previewConfig) ->
        if previewConfig.urls.length > 1
          $scope.activeIndex = 0
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
        $scope.resetIframeSize()
      $scope.setIframeSize = ->
        iframeWindow = $scope.element.contents()
        iframeDocument = iframeWindow[0]
        if iframeDocument?
          iframeBodyHeight = iframeDocument.body.offsetHeight
          $scope.element.height(iframeBodyHeight + 10)
      $scope.resetIframeSize = ->
        $scope.element.height('90%')

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      scope.element.on 'load', ->
        wrapperCtrl.onIframeLoaded()
        scope.setIframeSize()
      return
  }




#.directive('djangoCradminPagePreviewOpenOnPageLoad', [
#  ->
#    ###
#    A directive that opens the given URL in an iframe overlay instantly (on page load).
#    ###
#    return {
#      require: '^^djangoCradminPagePreviewWrapper'
#      restrict: 'A'
#      scope: {
#        previewConfig: '=djangoCradminPagePreviewOpenOnPageLoad'
#      }
#      link: (scope, element, attrs, wrapperCtrl) ->
#        wrapperCtrl.loadPreview(scope.previewConfig)
#        return
#
#    }
#])


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

      controller: ($scope, djangoCradminPagePreview) ->
        $scope.loadPreview = ->
          djangoCradminPagePreview.loadPreview($scope.previewConfig)

      link: (scope, element, attrs, wrapperCtrl) ->
        element.on 'click', (e) ->
          e.preventDefault()
          scope.loadPreview()
        return

    }
])

