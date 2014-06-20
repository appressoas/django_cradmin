angular.module('django_cradmin.menu', [

])

.controller(
  'CradminMenuController',
  ($scope) ->
    $scope.displayMenu = false
    $scope.toggleNavigation = ->
      $scope.displayMenu = !$scope.displayMenu
)
