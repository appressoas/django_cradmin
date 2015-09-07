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
    constructor: (@momentObject, @isInCurrentMonth, isDisabled) ->
      @_isDisabled = isDisabled

    getNumberInMonth: ->
      return @momentObject.format('D')

    isToday: ->
      return @momentObject.isSame(moment(), 'day')

    isDisabled: ->
      return @_isDisabled

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
    constructor: (@calendarCoordinator, momentObject)->
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

      isDisabled = not @calendarCoordinator.momentObjectIsAllowed(momentObject)
      calendarDay = new CalendarDay(momentObject, isInCurrentMonth, isDisabled)
      week.addDay(calendarDay)
      @currentDayCount += 1
      @lastDay = calendarDay

    prettyprint: ->
      for week in @calendarWeeks
        rowFormatted = []
        console?.log? week.prettyOneLineFormat()


  ###*
  Coordinates the common calendar data no matter what kind of
  view we present.
  ###
  class CalendarCoordinator
    constructor: (@selectedValueMomentObject, @minimumDatetime, @maximumDatetime) ->
      # We operate with two momentObjects:
      # - selectedValueMomentObject: This is the actual moment object
      #   that the user has selected. This can be null if the user
      #   has not selected a value yet.
      # - shownDateMomentObject: This reflects the value shown on the screen
      #   at any given moment (E.g.: It changes each time a user changes
      #   the day, month, hour, etc). This is never ``null``.
      if @selectedValueMomentObject?
        @shownDateMomentObject = @selectedValueMomentObject.clone()
      else
        # We set this to start the date picker on the current date
        @shownDateMomentObject = moment()

    selectShownValue: ->
      @selectedValueMomentObject = @shownDateMomentObject.clone()

    momentObjectIsAllowed: (momentObject) ->
      isAllowed = true
      if @minimumDatetime?
        minimumDatetimeDateonly = @minimumDatetime.clone().set({
          hour: 0
          minute: 0
          second: 0
        })
        isAllowed = not momentObject.isBefore(minimumDatetimeDateonly)
      if isAllowed and @maximumDatetime?
        maximumDatetimeDateonly = @maximumDatetime.clone().set({
          hour: 59
          minute: 59
          second: 59
        })
        isAllowed = not momentObject.isAfter(maximumDatetimeDateonly)
      return isAllowed

    shownDateIsToday: ->
      return @shownDateMomentObject.isSame(moment(), 'day')

    setToNow: ->
      @shownDateMomentObject = moment()
#      @__changeSelectedDate()


  ###*
  Coordinates the common calendar data for a month-view.
  ###
  class MonthlyCalendarCoordinator
    constructor: (@calendarCoordinator,
                  @yearselectConfig,
                  @hourselectConfig,
                  @minuteselectConfig) ->
      @dayobjects = null  # Updated in @__changeSelectedDate()
      @__initWeekdays()
      @__initMonthObjects()
      @__initYearObjects()
      @__initHourObjects()
      @__initMinuteObjects()
      @__changeSelectedDate()

    __initWeekdays: ->
      @shortWeekdays = getWeekdaysShortForCurrentLocale()

    __initYearObjects: ->
      selectedYearValue = @calendarCoordinator.shownDateMomentObject.year()
      hasSelectedYearValue = false

      @__yearsMap = {}
      for yearConfig in @yearselectConfig
        @__yearsMap[yearConfig.value] = yearConfig
        if yearConfig.value == selectedYearValue
          hasSelectedYearValue = true

      if not hasSelectedYearValue
        # Since we do not include all years in the yearList, we need
        # to handle the case when the given datetimes year is not in the
        # list. We handle this by adding it to the end of the list.
        yearConfig = {
          value: selectedYearValue,
          label: selectedYearValue
        }
        @yearselectConfig.push(yearConfig)
        @__yearsMap[yearConfig.value] = yearConfig

    __initMonthObjects: ->
      @monthselectConfig = []
      @__monthsMap = {}
      monthnumber = 0
      for monthname in moment.months()
        monthObject = {
          value: monthnumber
          label: monthname
        }
        @monthselectConfig.push(monthObject)
        @__monthsMap[monthnumber] = monthObject
        monthnumber += 1

    __initHourObjects: ->
      @__hoursMap = {}
      for hourConfig in @hourselectConfig
        @__hoursMap[hourConfig.value] = hourConfig

    __initMinuteObjects: ->
      selectedMinuteValue = @calendarCoordinator.shownDateMomentObject.minute()
      hasSelectedMinuteValue = false

      @__minutesMap = {}
      for minuteConfig in @minuteselectConfig
        @__minutesMap[minuteConfig.value] = minuteConfig
        if minuteConfig.value == selectedMinuteValue
          hasSelectedMinuteValue = true

      if not hasSelectedMinuteValue
        # Since we do not include all minutes in the minuteList, we need
        # to handle the case when the given datetimes minute is not in the
        # list. We handle this by adding it to the end of the list.
        minuteConfig = {
          value: selectedMinuteValue,
          label: selectedMinuteValue
        }
        @minuteselectConfig.push(minuteConfig)
        @__minutesMap[minuteConfig.value] = minuteConfig

    __setCurrentYear: ->
      currentYearNumber = @calendarMonth.month.firstDayOfMonth.year()
      @currentYearObject = @__yearsMap[currentYearNumber]
      if not @currentYearObject?
        console?.warn? "The given year, #{currentYearNumber} is not one of the available choices"

    __setCurrentMonth: ->
      currentMonthNumber = @calendarMonth.month.firstDayOfMonth.month()
      @currentMonthObject = @__monthsMap[currentMonthNumber]
      if not @currentMonthObject?
        console?.warn? "The given month number, #{currentMonthNumber} is not one of the available choices"

    __setCurrentHour: ->
      currentHourNumber = @calendarCoordinator.shownDateMomentObject.hour()
      @currentHourObject = @__hoursMap[currentHourNumber]
      if not @currentHourObject?
        console?.warn? "The given hour, #{currentHourNumber} is not one of the available choices"

    __setCurrentMinute: ->
      currentMinuteNumber = @calendarCoordinator.shownDateMomentObject.minute()
      @currentMinuteObject = @__minutesMap[currentMinuteNumber]
      if not @currentMinuteObject?
        console?.warn? "The given minute, #{currentMinuteNumber} is not one of the available choices"

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

    As long as you change ``@calendarCoordinator.shownDateMomentObject``, this
    will update everything to mirror the change (selected day, month, year, ...).
    ###
    __changeSelectedDate: ->
      @calendarMonth = new CalendarMonth(@calendarCoordinator, @calendarCoordinator.shownDateMomentObject)
      @__setCurrentYear()
      @__setCurrentMonth()
      @__setCurrentHour()
      @__setCurrentMinute()
      @__updateDayObjects()
      @currentDayObject = @dayobjects[@calendarCoordinator.shownDateMomentObject.date()-1]

    handleDayChange: (momentObject) ->
      @calendarCoordinator.shownDateMomentObject = momentObject.clone().set({
        hour: @currentHourObject.value
        minute: @currentMinuteObject.value
      })
      @__changeSelectedDate()

    handleCurrentDayObjectChange: ->
      momentObject = moment({
        year: @currentYearObject.value
        month: @currentMonthObject.value
        day: @currentDayObject.value
      })
      @handleDayChange(momentObject)

    handleCalendarDayChange: (calendarDay) ->
      @handleDayChange(calendarDay.momentObject)

    handleCurrentMonthChange: ->
      @calendarCoordinator.shownDateMomentObject.set({
        month: @currentMonthObject.value
      })
      @__changeSelectedDate()

    handleCurrentYearChange: ->
      @calendarCoordinator.shownDateMomentObject.set({
        year: @currentYearObject.value
      })
      @__changeSelectedDate()

    handleCurrentHourChange: ->
      @calendarCoordinator.shownDateMomentObject.set({
        hour: @currentHourObject.value
      })
      @__changeSelectedDate()

    handleCurrentMinuteChange: ->
      @calendarCoordinator.shownDateMomentObject.set({
        minute: @currentMinuteObject.value
      })
      @__changeSelectedDate()

    handleFocusOnCalendarDay: (calendarDay) ->
      @lastFocusedMomentObject = calendarDay.momentObject

    getLastFocusedMomentObject: ->
      if @lastFocusedMomentObject?
        return @lastFocusedMomentObject
      else
        return @calendarCoordinator.shownDateMomentObject


  @$get = ->
    return {
      MonthlyCalendarCoordinator: MonthlyCalendarCoordinator
      CalendarCoordinator: CalendarCoordinator
    }

  return @
