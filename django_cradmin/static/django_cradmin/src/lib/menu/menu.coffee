angular.module('djangoCradmin.menu', [

])

.controller(
  'CradminMenuController',
  ($scope) ->
    $scope.displayMenu = false
    $scope.toggleNavigation = ->
      $scope.displayMenu = !$scope.displayMenu
)
