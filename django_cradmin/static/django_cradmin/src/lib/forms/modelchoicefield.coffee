angular.module('djangoCradmin.forms.modelchoicefield', [])

.directive('djangoCradminModelChoiceFieldWrapper', [
  '$window'
  ($window) ->
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope) ->

        @setIframeWrapper = (iframeWrapperScope) ->
          $scope.iframeWrapperScope = iframeWrapperScope

        @setIframe = (iframeScope) ->
          $scope.iframeScope = iframeScope

        @setHiddenField = (hiddenFieldScope) ->
          $scope.hiddenFieldScope = hiddenFieldScope

        @onChangeValueBegin = ->
          $scope.iframeScope.reset()
          $scope.iframeWrapperScope.show()

        $scope.origin = "#{window.location.protocol}//#{window.location.host}"
        $scope.onValueChangeMessage = (event) ->
          if event.origin != $scope.origin
            console.error "Message origin '#{event.origin}' does not match current origin '#{$scope.origin}'."
            return
          data = angular.fromJson(event.data)
          $scope.hiddenFieldScope.setValue(data.selected_fieldid, data.selected_value)
          $scope.iframeWrapperScope.hide()
        $window.addEventListener('message', $scope.onValueChangeMessage, false)

        return

      link: (scope, element) ->
        return
    }
])

.directive('djangoCradminModelChoiceFieldHiddenInput', [
  '$window'
  ($window) ->
    return {
      require: '^djangoCradminModelChoiceFieldWrapper'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        $scope.setValue = (fieldid, value) ->
          if fieldid != $scope.hiddenInputFieldid
#            console.log "Received fieldid '#{fieldid}' does not match my fieldid #{scope.hiddenInputFieldid}."
            return
          $scope.hiddenInputElement.val(value)

        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.hiddenInputElement = element
        scope.hiddenInputFieldid = attrs.id
        wrapperCtrl.setHiddenField(scope)
        return
    }
])

.directive('djangoCradminModelChoiceFieldChangebeginButton', [
  '$window'
  ($window) ->
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
])

.directive 'djangoCradminModelChoiceFieldIframeWrapper', ->
  return {
    require: '^djangoCradminModelChoiceFieldWrapper'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      $scope.show = ->
        $scope.iframeWrapperElement.removeClass('ng-hide')
      $scope.hide = ->
        $scope.iframeWrapperElement.addClass('ng-hide')

      @closeIframe = ->
        $scope.hide()

      return

    link: (scope, element, attrs, wrapperCtrl) ->
      scope.iframeWrapperElement = element
      wrapperCtrl.setIframeWrapper(scope)
      return
  }

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
