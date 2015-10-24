angular.module('djangoCradmin.forms.modelchoicefield', [])

.provider 'djangoCradminModelChoiceFieldCoordinator', ->
  class ModelChoiceFieldOverlay
    constructor: (@djangoCradminWindowDimensions) ->
      @modelChoiceFieldIframeWrapper = null
      @bodyContentWrapperElement = angular.element('#django_cradmin_bodycontentwrapper')
      @bodyElement = angular.element('body')
    registerModeChoiceFieldIframeWrapper: (modelChoiceFieldIframeWrapper) ->
      @modelChoiceFieldIframeWrapper = modelChoiceFieldIframeWrapper
    onChangeValueBegin: (fieldWrapperScope) ->
      @modelChoiceFieldIframeWrapper.onChangeValueBegin(fieldWrapperScope)
    addBodyContentWrapperClass: (cssclass) ->
      @bodyContentWrapperElement.addClass(cssclass)
    removeBodyContentWrapperClass: (cssclass) ->
      @bodyContentWrapperElement.removeClass(cssclass)
    disableBodyScrolling: ->
      @bodyElement.addClass('django-cradmin-noscroll')
    enableBodyScrolling: ->
      @bodyElement.removeClass('django-cradmin-noscroll')
      @djangoCradminWindowDimensions.triggerWindowResizeEvent()


  @$get = (['djangoCradminWindowDimensions', (djangoCradminWindowDimensions) ->
    return new ModelChoiceFieldOverlay(djangoCradminWindowDimensions)
  ])

  return @


.directive('djangoCradminModelChoiceFieldIframeWrapper', [
  '$window', '$timeout', 'djangoCradminModelChoiceFieldCoordinator', 'djangoCradminWindowDimensions'
  ($window, $timeout, djangoCradminModelChoiceFieldCoordinator, djangoCradminWindowDimensions) ->
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.origin = "#{window.location.protocol}//#{window.location.host}"
        $scope.bodyElement = angular.element($window.document.body)
        djangoCradminModelChoiceFieldCoordinator.registerModeChoiceFieldIframeWrapper(this)

        @setIframe = (iframeScope) ->
          $scope.iframeScope = iframeScope

        @_setField = (fieldScope) ->
          $scope.fieldScope = fieldScope

        @_setPreviewElement = (previewElementScope) ->
          $scope.previewElementScope = previewElementScope

        @setLoadSpinner = (loadSpinnerScope) ->
          $scope.loadSpinnerScope = loadSpinnerScope

        @setIframeWrapperInner = (iframeInnerScope) ->
          $scope.iframeInnerScope = iframeInnerScope

        @onChangeValueBegin = (fieldWrapperScope) ->
          @_setField(fieldWrapperScope.fieldScope)
          @_setPreviewElement(fieldWrapperScope.previewElementScope)
          $scope.iframeScope.beforeShowingIframe(fieldWrapperScope.iframeSrc)
          $scope.show()

        @onIframeLoadBegin = ->
          $scope.loadSpinnerScope.show()

        @onIframeLoaded = ->
          $scope.iframeInnerScope.show()
          $scope.loadSpinnerScope.hide()

        $scope.onChangeValue = (event) ->
          if event.origin != $scope.origin
            console.error "Message origin '#{event.origin}' does not match current origin '#{$scope.origin}'."
            return
          data = angular.fromJson(event.data)
          if $scope.fieldScope.fieldid != data.fieldid
            # console.log "The received message was not for this field " +
            #   "(#{$scope.fieldScope.fieldid}), it was for #{data.fieldid}"
            return
          $scope.fieldScope.setValue(data.value)
          $scope.previewElementScope.setPreviewHtml(data.preview)
          $scope.hide()
          $scope.iframeScope.afterFieldValueChange()

        $window.addEventListener('message', $scope.onChangeValue, false)

        $scope.onWindowResize = (newWindowDimensions) ->
          $scope.iframeScope.setIframeSize()

        $scope.show = ->
          $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-show')
          djangoCradminModelChoiceFieldCoordinator.disableBodyScrolling()
          djangoCradminModelChoiceFieldCoordinator.addBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper')
          djangoCradminModelChoiceFieldCoordinator.addBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push')
          djangoCradminWindowDimensions.register $scope

        $scope.hide = ->
          $scope.iframeWrapperElement.removeClass('django-cradmin-floating-fullsize-iframe-wrapper-show')
          djangoCradminModelChoiceFieldCoordinator.removeBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper')
          djangoCradminModelChoiceFieldCoordinator.removeBodyContentWrapperClass(
            'django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push')
          djangoCradminModelChoiceFieldCoordinator.enableBodyScrolling()
          $scope.iframeScope.onHide()
          djangoCradminWindowDimensions.unregister $scope

        @closeIframe = ->
          $scope.hide()

        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.iframeWrapperElement = element
        return
    }
])

.directive('djangoCradminModelChoiceFieldIframeWrapperInner', [
  '$window'
  ($window) ->
    return {
      require: '^^djangoCradminModelChoiceFieldIframeWrapper'
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

.directive 'djangoCradminModelChoiceFieldIframeClosebutton', ->
  return {
    require: '^djangoCradminModelChoiceFieldIframeWrapper'
    restrict: 'A'
    scope: {}

    link: (scope, element, attrs, iframeWrapperCtrl) ->
      element.on 'click', (e) ->
        e.preventDefault()
        iframeWrapperCtrl.closeIframe()
      return
  }

.directive 'djangoCradminModelChoiceFieldLoadSpinner', ->
  return {
    require: '^^djangoCradminModelChoiceFieldIframeWrapper'
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

.directive('djangoCradminModelChoiceFieldIframe', [
  '$interval'
  ($interval) ->
    return {
      require: '^djangoCradminModelChoiceFieldIframeWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        scrollHeightInterval = null
        currentScrollHeight = 0

        getIframeWindow = ->
          return $scope.element.contents()

        getIframeDocument = ->
          return getIframeWindow()[0]

        getIframeScrollHeight = ->
          iframeDocument = getIframeDocument()
          if iframeDocument?.body?
            return iframeDocument.body.scrollHeight
          else
            return 0

        resizeIfScrollHeightChanges = ->
          newScrollHeight = getIframeScrollHeight()
          if newScrollHeight != currentScrollHeight
            currentScrollHeight = newScrollHeight
            $scope.setIframeSize()

        startScrollHeightInterval = ->
          if not scrollHeightInterval?
            scrollHeightInterval = $interval(resizeIfScrollHeightChanges, 500)

        stopScrollHeightInterval = ->
          if scrollHeightInterval?
            $interval.cancel(scrollHeightInterval)
            scrollHeightInterval = null

        $scope.onHide = ->
          stopScrollHeightInterval()

        $scope.afterFieldValueChange = ->
          # NOTE: We may want to add an option that clears the view
          #       after selecting a value.
          # $scope.element.attr('src', '')
          stopScrollHeightInterval()

        $scope.beforeShowingIframe = (iframeSrc) ->
          currentSrc = $scope.element.attr('src')
          if not currentSrc? or currentSrc == '' or currentSrc != iframeSrc
            $scope.loadedSrc = currentSrc
            $scope.wrapperCtrl.onIframeLoadBegin()
            $scope.resetIframeSize()
            $scope.element.attr('src', iframeSrc)
          startScrollHeightInterval()

        $scope.setIframeSize = ->
#          iframeDocument = getIframeDocument()
#          if iframeDocument?.body?
#            iframeBodyHeight = iframeDocument.body.offsetHeight
#            $scope.element.height(iframeBodyHeight)

        $scope.resetIframeSize = ->
#          $scope.element.height('40px')

        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.element = element
        scope.wrapperCtrl = wrapperCtrl
        wrapperCtrl.setIframe(scope)
        scope.element.on 'load', ->
          wrapperCtrl.onIframeLoaded()
          scope.setIframeSize()
        return
    }
])


.directive('djangoCradminModelChoiceFieldWrapper', [
  'djangoCradminModelChoiceFieldCoordinator'
  (djangoCradminModelChoiceFieldCoordinator) ->
    return {
      restrict: 'A'
      scope: {
        iframeSrc: '@djangoCradminModelChoiceFieldWrapper'
      }

      controller: ($scope) ->
        @setField = (fieldScope) ->
          $scope.fieldScope = fieldScope

        @setPreviewElement = (previewElementScope) ->
          $scope.previewElementScope = previewElementScope

        @onChangeValueBegin = ->
          djangoCradminModelChoiceFieldCoordinator.onChangeValueBegin($scope)

        return
    }
])


.directive('djangoCradminModelChoiceFieldInput', [
  'djangoCradminModelChoiceFieldCoordinator',
  (djangoCradminModelChoiceFieldCoordinator) ->
    return {
      require: '^^djangoCradminModelChoiceFieldWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.setValue = (value) ->
          $scope.inputElement.val(value)
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.inputElement = element
        scope.fieldid = attrs['id']
        wrapperCtrl.setField(scope)
        return
    }
])

.directive('djangoCradminModelChoiceFieldPreview', [
  'djangoCradminModelChoiceFieldCoordinator',
  (djangoCradminModelChoiceFieldCoordinator) ->
    return {
      require: '^^djangoCradminModelChoiceFieldWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.setPreviewHtml = (previewHtml) ->
          $scope.previewElement.html(previewHtml)
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.previewElement = element
        wrapperCtrl.setPreviewElement(scope)
        return
    }
])

.directive('djangoCradminModelChoiceFieldChangebeginButton', [
  'djangoCradminModelChoiceFieldCoordinator',
  (djangoCradminModelChoiceFieldCoordinator) ->
    return {
      require: '^^djangoCradminModelChoiceFieldWrapper'
      restrict: 'A'
      scope: {}

      link: (scope, element, attrs, wrapperCtrl) ->
        element.on 'click', (e) ->
          e.preventDefault()
          wrapperCtrl.onChangeValueBegin()
        return
    }
])
