angular.module('djangoCradmin.modal', [])

.directive('djangoCradminModal', [
  ->
    ###* Shows a modal window on click.

    Example
    =======

    ```html
    <div django-cradmin-modal>
      <button ng-click="showModal()" type="button">
        Show modal window
      </button>
      <div class="django-cradmin-modal"
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
        $scope.showModal = ->
          $scope.modalVisible = true
        $scope.hideModal = ->
          $scope.modalVisible = false
        return
    }
])
