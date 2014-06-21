angular.module('django_cradmin.default.menu', [

])

.controller(
  'CradminMenuController',
  ($scope) ->
    $scope.displayMenu = false
    $scope.toggleNavigation = ->
      $scope.displayMenu = !$scope.displayMenu
)
