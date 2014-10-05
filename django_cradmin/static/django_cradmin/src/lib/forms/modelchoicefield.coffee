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

        @setHiddenField = (hiddenFieldScope) ->
          $scope.hiddenFieldScope = hiddenFieldScope

        @onChangeValueBegin = ->
          $scope.iframeScope.reset()
          $scope.iframeWrapperScope.show()

        $scope.onChangeValue = (event) ->
          if event.origin != $scope.origin
            console.error "Message origin '#{event.origin}' does not match current origin '#{$scope.origin}'."
            return
          data = angular.fromJson(event.data)
          $scope.hiddenFieldScope.setValue(data.value)
          $scope.iframeWrapperScope.hide()

        $window.addEventListener('message', $scope.onChangeValue, false)

        return

      link: (scope, element) ->
        return
    }
])

.directive 'djangoCradminModelChoiceFieldHiddenInput', ->
  return {
    require: '^djangoCradminModelChoiceFieldWrapper'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      $scope.setValue = (value) ->
        $scope.hiddenInputElement.val(value)
      return

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.hiddenInputElement = element
      wrapperCtrl.setHiddenField(scope)
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
      $scope.reset = ->
        $scope.element.attr('src', $scope.src)

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.element = element
      wrapperCtrl.setIframe(scope)
      return
  }
