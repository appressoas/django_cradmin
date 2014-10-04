angular.module('djangoCradmin.forms.modelchoicefield', [])

.directive('djangoCradminModelChoiceFieldWrapper', [
  '$window'
  ($window) ->
    return {
      restrict: 'A'
      controller: ($scope) ->

        @setIframeWrapper = (iframeWrapperScope) ->
          $scope.iframeWrapperScope = iframeWrapperScope

        @setHiddenField = (hiddenFieldScope) ->
          $scope.hiddenFieldScope = hiddenFieldScope

        @onChangeValueBegin = ->
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

      link: (scope, element, attrs, wrapperCtrl) ->
        element.on 'click', (e) ->
          e.preventDefault()
          wrapperCtrl.onChangeValueBegin()
        return
    }
])

.directive('djangoCradminModelChoiceFieldIframeWrapper', [
  '$window'
  ($window) ->
    return {
      require: '^djangoCradminModelChoiceFieldWrapper'
      restrict: 'A'

      controller: ($scope) ->
        $scope.show = ->
          $scope.iframeWrapperElement.removeClass('ng-hide')
        $scope.hide = ->
          $scope.iframeWrapperElement.addClass('ng-hide')
        return

      link: (scope, element, attrs, wrapperCtrl) ->
        scope.iframeWrapperElement = element
        wrapperCtrl.setIframeWrapper(scope)
        return
    }
])
