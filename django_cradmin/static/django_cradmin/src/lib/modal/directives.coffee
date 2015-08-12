angular.module('djangoCradmin.modal', [])

.directive('djangoCradminModalWrapper', [
  ->
    ###* Shows a modal window on click.

    Example
    =======

    ```html
    <div django-cradmin-modal-wrapper>
      <button ng-click="showModal($event)" type="button">
        Show modal window
      </button>
      <div django-cradmin-modal class="django-cradmin-modal"
              ng-class="{'django-cradmin-modal-visible': modalVisible}">
          <div class="django-cradmin-modal-backdrop" ng-click="hideModal()"></div>
          <div class="django-cradmin-modal-content">
              <p>Something here</p>
              <button ng-click="hideModal()" type="button">
                Hide modal window
              </button>
          </div>
      </div>
    </div>
    ```
    ###
    return {
      scope: true

      controller: ($scope) ->
        $scope.modalVisible = false
        bodyElement = angular.element('body')

        $scope.showModal = (e) ->
          if e?
            e.preventDefault()
          $scope.modalVisible = true
          bodyElement.addClass('django-cradmin-noscroll')
          return

        $scope.hideModal = ->
          $scope.modalVisible = false
          bodyElement.removeClass('django-cradmin-noscroll')
          return

        return
    }
])

.directive('djangoCradminModal', [
  ->
    return {
      require: '^^djangoCradminModalWrapper'

      link: ($scope, element) ->
        body = angular.element('body')
        element.appendTo(body)
    }
])
