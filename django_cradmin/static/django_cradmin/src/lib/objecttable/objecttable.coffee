angular.module('djangoCradmin.objecttable', [])

.controller('CradminMultiselectObjectTableViewController', [
  '$scope', '$timeout'
  ($scope, $timeout) ->

    # $scope.selectAllChecked tracks the value of the select all
    # checkbox.
    $scope.selectAllChecked = false

    # $scope.items is an object that is initialized through ng-init.
    # The attribute name of each item in the object is item_<PK> where
    # <PK> is the primary-key of the object in the row. The value of
    # the attributes boolean tracking the value of the checkbox for
    # the row. Initially all values are ``false``.

    # The number of selected rows
    $scope.numberOfSelected = 0

    # $scope.actions is an array of multiselect actions
    # that is initialized through ng-init.
    # Each item is an object with a ``label`` and ``url`` attribute.

    # Tracks the selected action (an item in $scope.actions)
    $scope.selectedAction = null


    $scope.setCheckboxValue = (itemkey, value) ->
      if value
        $scope.numberOfSelected += 1
      else
        $scope.numberOfSelected -= 1
      $scope.items[itemkey] = value

    $scope.getCheckboxValue = (itemkey) ->
      return $scope.items[itemkey]

    $scope.toggleAllCheckboxes = ->
      $scope.selectAllChecked = not $scope.selectAllChecked
      angular.forEach $scope.items, (checked, itemkey) ->
        $scope.setCheckboxValue(itemkey, $scope.selectAllChecked)

    $scope.toggleCheckbox = (itemkey) ->
      newvalue = not $scope.getCheckboxValue(itemkey)
      $scope.setCheckboxValue(itemkey, newvalue)
      if not newvalue
        $scope.selectAllChecked = false
])
