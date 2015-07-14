app = angular.module 'djangoCradmin.forms.datetimewidget', ['ui.bootstrap']

app.controller 'CradminDateFieldController', ($scope, $filter) ->

  $scope.init = ->
    $scope.datepicker_is_open = false
    return

  $scope.open_datepicker = ($event) ->
    $event.preventDefault()
    $event.stopPropagation()
    $scope.datepicker_is_open = true
    return

  $scope.set_date_from_string = (datestr) ->
    if datestr
      $scope.datevalue = new Date datestr
    else
      $scope.datevalue = new Date
    $scope.datefield_changed()
    return

  $scope.datefield_changed = ->
    datestr = $filter('date')($scope.datevalue, 'yyyy-MM-dd')
    $scope.hiddendatefieldvalue = datestr
    return

  $scope.init()
  return

app.controller 'CradminTimeFieldController', ($scope, $filter) ->

  $scope.set_time_from_string = (timestr) ->
    if timestr
      $scope.timevalue = new Date timestr
    else
      $scope.timevalue = new Date()
    $scope.timefield_changed()
    return

  $scope.timefield_changed = ->
    timestr = $filter('date')($scope.timevalue, 'HH:mm')
    $scope.hiddentimefieldvalue = timestr
    return
