angular.module('djangoCradmin.forms.modelchoicefield', [])

.directive('djangoCradminModelChoiceFieldWrapper', [
  '$window'
  ($window) ->
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.origin = "#{window.location.protocol}//#{window.location.host}"

        @setIframeWrapper = (iframeWrapperScope) ->
          $scope.iframeWrapperScope = iframeWrapperScope

        @setIframe = (iframeScope) ->
          $scope.iframeScope = iframeScope

        @setField = (fieldScope) ->
          $scope.fieldScope = fieldScope

        @setPreviewElement = (previewElementScope) ->
          $scope.previewElementScope = previewElementScope

        @onChangeValueBegin = ->
          $scope.iframeScope.beforeShowingIframe()
          $scope.iframeWrapperScope.show()

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
          $scope.iframeWrapperScope.hide()
          $scope.iframeScope.afterFieldValueChange()

        $window.addEventListener('message', $scope.onChangeValue, false)

        return

      link: (scope, element) ->
        return
    }
])

.directive 'djangoCradminModelChoiceFieldInput', ->
  return {
    require: '^djangoCradminModelChoiceFieldWrapper'
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

.directive 'djangoCradminModelChoiceFieldPreview', ->
  return {
    require: '^djangoCradminModelChoiceFieldWrapper'
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

.directive 'djangoCradminModelChoiceFieldChangebeginButton', ->
  return {
    require: '^djangoCradminModelChoiceFieldWrapper'
    restrict: 'A'
    scope: {}

    link: (scope, element, attrs, wrapperCtrl) ->
      element.on 'click', (e) ->
        e.preventDefault()
        wrapperCtrl.onChangeValueBegin()
      return
  }

.directive('djangoCradminModelChoiceFieldIframeWrapper', [
  '$window'
  ($window) ->
    return {
      require: '^djangoCradminModelChoiceFieldWrapper'
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

.directive 'djangoCradminModelChoiceFieldIframe', ->
  return {
    require: '^djangoCradminModelChoiceFieldWrapper'
    restrict: 'A'
    scope: {
      src: '@djangoCradminModelChoiceFieldIframe'
    }

    controller: ($scope) ->
      $scope.afterFieldValueChange = ->
        # NOTE: Do nothing, but we may want to add an option that clears the view
        #       after selecting a value.
        # $scope.element.attr('src', '')
      $scope.beforeShowingIframe = ->
        currentSrc = $scope.element.attr('src')
        if not currentSrc? or currentSrc == ''
          $scope.element.attr('src', $scope.src)

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      return
  }
