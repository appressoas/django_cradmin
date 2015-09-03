app = angular.module 'djangoCradmin.forms.datetimewidget', []

#app.controller 'CradminDateFieldController', ($scope, $filter) ->
#
#  $scope.init = ->
#    $scope.datepicker_is_open = false
#    return
#
#  $scope.open_datepicker = ($event) ->
#    $event.preventDefault()
#    $event.stopPropagation()
#    $scope.datepicker_is_open = true
#    return
#
#  $scope.set_date_from_string = (datestr) ->
#    if datestr
#      $scope.datevalue = new Date datestr
#      $scope.datefield_changed()
#    return
#
#  $scope.datefield_changed = ->
#    datestr = $filter('date')($scope.datevalue, 'yyyy-MM-dd')
#    $scope.hiddendatefieldvalue = datestr
#    return
#
#  $scope.init()
#  return

#app.controller 'CradminTimeFieldController', ($scope, $filter) ->
#
#  $scope.set_time_from_string = (timestr) ->
#    if timestr
#      $scope.timevalue = new Date timestr
#    else
#      $scope.timevalue = new Date()
#    $scope.timefield_changed()
#    return
#
#  $scope.timefield_changed = ->
#    timestr = $filter('date')($scope.timevalue, 'HH:mm')
#    $scope.hiddentimefieldvalue = timestr
#    return


app.directive 'djangoCradminDatePicker', ->
  class CalendarDay
    constructor: (@momentObject) ->


  class CalendarWeek
    constructor: ->
      @days = []

    addDay: (calendarDay) ->
      @days.push(calendarDay)

    getDayCount: ->
      return @days.length

    prettyOneLineFormat: ->
      formattedDays = []
      for calendarDay in @days
        formattedDays.push(calendarDay.momentObject.format('DD'))
      return formattedDays.join(' ')


  class CalendarMonth
    constructor: (@month)->
      @table = [new CalendarWeek()]
      @currentWeekIndex = 0
      @daysPerWeek = 7
      @totalWeeks = 6
      @currentDayCount = 0
      @lastDay = null
      @__build()

    __buildPrefixedDays: ->
      if @month.firstDayOfMonth.weekday() > 0
        for index in [@month.firstDayOfMonth.weekday()..1]
          momentObject = @month.firstDayOfMonth.clone().subtract({
            days: index
          })
          @__addMomentObject(momentObject)

    __buildSuffixedDays: ->
      totalDayCount = @totalWeeks * @daysPerWeek
      while @currentDayCount < totalDayCount
        momentObject = @lastDay.momentObject.clone().add({
          days: 1
        })
        @__addMomentObject(momentObject)

    __buildDaysBelongingInMonth: ->
      for dayIndex in [1..@month.getDaysInMonth()]
        @__addMomentObject(@month.firstDayOfMonth.clone().date(dayIndex))

    __build: (momentFirstDayOfMonth) ->
      @__buildPrefixedDays()
      @__buildDaysBelongingInMonth()
      @__buildSuffixedDays()

    __addMomentObject: (momentObject) ->
      week = @table[@currentWeekIndex]
      calendarDay = new CalendarDay(momentObject)
      week.addDay(calendarDay)
      if week.getDayCount() >= @daysPerWeek
        @table.push(new CalendarWeek())
        @currentWeekIndex += 1
      @currentDayCount += 1
      @lastDay = calendarDay

    prettyprint: ->
      for week in @table
        rowFormatted = []
        console.log week.prettyOneLineFormat()


  class Month
    constructor: (@firstDayOfMonth) ->
      @lastDayOfMonth = @firstDayOfMonth.clone().add({
        days: @firstDayOfMonth.daysInMonth() - 1
      })

    getDaysInMonth: ->
      return @firstDayOfMonth.daysInMonth()


  return {
    link: ($scope, $element) ->
      month = new Month(moment('2015-05-01'))
      calendarMonth = new CalendarMonth(month)
      calendarMonth.prettyprint()
      return
  }
