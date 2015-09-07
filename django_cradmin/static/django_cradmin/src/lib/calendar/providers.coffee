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

    isToday: ->
      return @momentObject.isSame(moment(), 'day')

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
      if week.getDayCount() >= @daysPerWeek
        @calendarWeeks.push(new CalendarWeek())
        @currentWeekIndex += 1
        week = @calendarWeeks[@currentWeekIndex]
      calendarDay = new CalendarDay(momentObject, isInCurrentMonth)
      week.addDay(calendarDay)
      @currentDayCount += 1
      @lastDay = calendarDay

    prettyprint: ->
      for week in @calendarWeeks
        rowFormatted = []
        console?.log? week.prettyOneLineFormat()


  class MonthlyCalendarCoordinator
    constructor: (@selectedValueMomentObject) ->
      # We operate with two momentObjects:
      # - selectedValueMomentObject: This is the actual moment object
      #   that the user has selected.
      # - shownDateMomentObject: This reflects the value shown on the screen
      #   at any given moment (E.g.: It changes each time a user changes
      #   the day, month, hour, etc).
      @dayobjects = null  # Updated in @__changeSelectedDate()
      if @selectedValueMomentObject?
        @shownDateMomentObject = @selectedValueMomentObject.clone()
        valueWasSetByUser = true
      else
        @shownDateMomentObject = moment()  # We set this to start the date picker in the current month
        valueWasSetByUser = false
      @valueWasSetByUser = false  # Updated in @__changeSelectedDate()
      @__initWeekdays()
      @__initMonthObjects()
      @__initYearObjects()
      @__initHourObjects()
      @__initMinuteObjects()
      @__changeSelectedDate(valueWasSetByUser)

    __initWeekdays: ->
      @shortWeekdays = getWeekdaysShortForCurrentLocale()

    __initYearObjects: ->
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

    __initHourObjects: ->
      hourList = [0..23]
      @hourobjects = []
      @__hoursMap = {}
      for hour in hourList
        hourObject = {
          value: hour
          label: hour
        }
        @hourobjects.push(hourObject)
        @__hoursMap[hour] = hourObject

    __initMinuteObjects: ->
      minuteList = (minute for minute in [0..55] by 5)
      minuteList.push(59)

      # Since we do not include all minutes in the minuteList, we need
      # to handle the case when the given datetimes minute is not in the
      # list. We handle this by adding it to the end of the list.
      if minuteList.indexOf(@shownDateMomentObject.minute()) == -1
        minuteList.push(@shownDateMomentObject.minute())

      @minuteobjects = []
      @__minutesMap = {}
      for minute in minuteList
        minuteObject = {
          value: minute
          label: minute
        }
        @minuteobjects.push(minuteObject)
        @__minutesMap[minute] = minuteObject

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

    __setCurrentHour: ->
      currentHourNumber = @shownDateMomentObject.hour()
      @currentHourObject = @__hoursMap[currentHourNumber]
      if not @currentHourObject?
        console?.error? "The given hour, #{currentHourNumber} is not one of the available choices"

    __setCurrentMinute: ->
      currentMinuteNumber = @shownDateMomentObject.minute()
      @currentMinuteObject = @__minutesMap[currentMinuteNumber]
      if not @currentMinuteObject?
        console?.error? "The given minute, #{currentMinuteNumber} is not one of the available choices"

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

    As long as you change ``@shownDateMomentObject``, this
    will update everything to mirror the change (selected day, month, year, ...).
    ###
    __changeSelectedDate: (valueWasSetByUser) ->
      @calendarMonth = new CalendarMonth(@shownDateMomentObject)
      @__setCurrentYear()
      @__setCurrentMonth()
      @__setCurrentHour()
      @__setCurrentMinute()
      @__updateDayObjects()
      @currentDayObject = @dayobjects[@shownDateMomentObject.date()-1]
      if valueWasSetByUser
        @valueWasSetByUser = true

    __handleDayChange: (momentObject) ->
      @shownDateMomentObject = momentObject.clone().set({
        hour: @currentHourObject.value
        minute: @currentMinuteObject.value
      })
      @__changeSelectedDate(true)

    handleCurrentDayObjectChange: ->
      momentObject = moment({
        year: @currentYearObject.value
        month: @currentMonthObject.value
        day: @currentDayObject.value
      })
      @__handleDayChange(momentObject)

    handleCalendarDayChange: (calendarDay) ->
      @__handleDayChange(calendarDay.momentObject)

    handleCurrentMonthChange: ->
      @shownDateMomentObject.set({
        month: @currentMonthObject.value
      })
      @__changeSelectedDate(true)

    handleCurrentYearChange: ->
      @shownDateMomentObject.set({
        year: @currentYearObject.value
      })
      @__changeSelectedDate(true)

    handleCurrentHourChange: ->
      @shownDateMomentObject.set({
        hour: @currentHourObject.value
      })
      @__changeSelectedDate(true)

    handleCurrentMinuteChange: ->
      @shownDateMomentObject.set({
        minute: @currentMinuteObject.value
      })
      @__changeSelectedDate(true)

    handleFocusOnCalendarDay: (calendarDay) ->
      @lastFocusedMomentObject = calendarDay.momentObject

    getLastFocusedMomentObject: ->
      if @lastFocusedMomentObject?
        return @lastFocusedMomentObject
      else
        return @shownDateMomentObject

  @$get = ->
    return {
      MonthlyCalendarCoordinator: MonthlyCalendarCoordinator
    }

  return @
