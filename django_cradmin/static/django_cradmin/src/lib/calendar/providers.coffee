app = angular.module 'djangoCradmin.calendar.providers', []


app.provider 'djangoCradminCalendarApi', ->

  ###*
  Get an array of the short names for all the weekdays
  in the current locale, in the the correct order for the
  current locale.
  ###
  getWeekdaysShortForCurrentLocale = ->
    weekdays = []
    weekdaysWithSundayFirst = moment.weekdaysShort()
    firstDayOfWeek = moment.localeData().firstDayOfWeek()
    for index in [firstDayOfWeek..firstDayOfWeek+6]
      if index > 6
        index = Math.abs(7 - index)
      weekday = weekdaysWithSundayFirst[index]
      weekdays.push(weekday)
    return weekdays

  class Month
    constructor: (@firstDayOfMonth) ->
      @lastDayOfMonth = @firstDayOfMonth.clone().add({
        days: @firstDayOfMonth.daysInMonth() - 1
      })

    getDaysInMonth: ->
      return @firstDayOfMonth.daysInMonth()


  class CalendarDay
    constructor: (@momentObject, @isInCurrentMonth) ->

    getNumberInMonth: ->
      return @momentObject.format('D')

  class CalendarWeek
    constructor: ->
      @calendarDays = []

    addDay: (calendarDay) ->
      @calendarDays.push(calendarDay)

    getDayCount: ->
      return @calendarDays.length

    prettyOneLineFormat: ->
      formattedDays = []
      for calendarDay in @calendarDays
        formattedDay = calendarDay.momentObject.format('DD')
        if calendarDay.isInCurrentMonth
          formattedDay = " #{formattedDay} "
        else
          formattedDay = "(#{formattedDay})"
        formattedDays.push(formattedDay)
      return formattedDays.join(' ')


  class CalendarMonth
    constructor: (momentObject)->
      @changeMonth(momentObject)

    changeMonth: (momentObject) ->
      firstDayOfMonthMomentObject = momentObject.clone().set({
        date: 1
        hour: 0
        minute: 0
        second: 0
        millisecond: 0
      })
      @month = new Month(firstDayOfMonthMomentObject)
      @calendarWeeks = [new CalendarWeek()]
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
          @__addMomentObject(momentObject, false)

    __buildSuffixedDays: ->
      totalDayCount = @totalWeeks * @daysPerWeek
      while @currentDayCount < totalDayCount
        momentObject = @lastDay.momentObject.clone().add({
          days: 1
        })
        @__addMomentObject(momentObject, false)

    __buildDaysBelongingInMonth: ->
      for dayIndex in [1..@month.getDaysInMonth()]
        momentObject = @month.firstDayOfMonth.clone().date(dayIndex)
        @__addMomentObject(momentObject, true)

    __build: (momentFirstDayOfMonth) ->
      @__buildPrefixedDays()
      @__buildDaysBelongingInMonth()
      @__buildSuffixedDays()

    __addMomentObject: (momentObject, isInCurrentMonth) ->
      week = @calendarWeeks[@currentWeekIndex]
      calendarDay = new CalendarDay(momentObject, isInCurrentMonth)
      week.addDay(calendarDay)
      if week.getDayCount() >= @daysPerWeek
        @calendarWeeks.push(new CalendarWeek())
        @currentWeekIndex += 1
      @currentDayCount += 1
      @lastDay = calendarDay

    prettyprint: ->
      for week in @calendarWeeks
        rowFormatted = []
        console.log week.prettyOneLineFormat()


  class MonthlyCalendarCoordinator
    constructor: (@selectedDateMomentObject) ->
      @dayobjects = null  # Updated in @__changeSelectedDate()
      @__initWeekdays()
      @__initMonthObjects()
      @__initYearObject()

      if not @selectedDateMomentObject?
        @selectedDateMomentObject = moment()
      @__changeSelectedDate()

    __initWeekdays: ->
      @shortWeekdays = getWeekdaysShortForCurrentLocale()

    __initYearObject: ->
      yearsList = [1990..2030]
      @yearobjects = []
      @__yearsMap = {}
      for year in yearsList
        yearObject = {
          value: year
          label: year
        }
        @yearobjects.push(yearObject)
        @__yearsMap[year] = yearObject

    __initMonthObjects: ->
      @monthobjects = []
      @__monthsMap = {}
      monthnumber = 0
      for monthname in moment.months()
        monthObject = {
          value: monthnumber
          label: monthname
        }
        @monthobjects.push(monthObject)
        @__monthsMap[monthnumber] = monthObject
        monthnumber += 1

    __setCurrentYear: ->
      currentYearNumber = @calendarMonth.month.firstDayOfMonth.year()
      @currentYearObject = @__yearsMap[currentYearNumber]
      if not @currentYearObject?
        console?.error? "The given year, #{currentYearNumber} is not one of the available choices"

    __setCurrentMonth: ->
      currentMonthNumber = @calendarMonth.month.firstDayOfMonth.month()
      @currentMonthObject = @__monthsMap[currentMonthNumber]
      if not @currentMonthObject?
        console?.error? "The given month number, #{currentMonthNumber} is not one of the available choices"

    __updateDayObjects: ->
      @dayobjects = []
      for daynumber in [1..@calendarMonth.month.getDaysInMonth()]
        dayNumberObject = {
          value: daynumber
          label: daynumber
        }
        @dayobjects.push(dayNumberObject)

    ###
    Change month to the month containing the given momentObject,
    and select the date.

    As long as you change ``@selectedDateMomentObject``, this
    will update everything to mirror the change (selected day, month, year, ...).
    ###
    __changeSelectedDate: ->
      @calendarMonth = new CalendarMonth(@selectedDateMomentObject)
      @__setCurrentYear()
      @__setCurrentMonth()
      @__updateDayObjects()
      @currentDayObject = @dayobjects[@selectedDateMomentObject.date()-1]

    handleCurrentDayObjectChange: ->
      @selectedDateMomentObject = moment({
        year: @currentYearObject.value
        month: @currentMonthObject.value
        day: @currentDayObject.value
      })
      @__changeSelectedDate()

    handleCurrentMonthChange: ->
      @selectedDateMomentObject.set({
        month: @currentMonthObject.value
      })
      @__changeSelectedDate()

    handleCurrentYearChange: ->
      @selectedDateMomentObject.set({
        year: @currentYearObject.value
      })
      @__changeSelectedDate()

    onSelectCalendarDay: (calendarDay) ->
      @selectedDateMomentObject = calendarDay.momentObject
      @__changeSelectedDate()

    getDestinationFieldValue: ->
      return @selectedDateMomentObject.format('YYYY-MM-DD')


  @$get = ->
    return {
      MonthlyCalendarCoordinator: MonthlyCalendarCoordinator
    }

  return @
