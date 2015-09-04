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
      @daynumbers = null  # Updated in @setDate()
      @__initWeekdays()
      @__initMonths()
      @__initYears()

      if @selectedDateMomentObject?
        monthToLoadMomentObject = @selectedDateMomentObject
        @selectedCalendarDay = new CalendarDay(@selectedDateMomentObject)
        @selectedDayNumber = null
      else
        monthToLoadMomentObject = moment()
        @selectedCalendarDay = null
        @selectedDayNumber = null
      @setDate(monthToLoadMomentObject)

    __initWeekdays: ->
      @shortWeekdays = getWeekdaysShortForCurrentLocale()

    __initYears: ->
      yearsList = [1990..2030]
      @years = []
      @__yearsMap = {}
      for year in yearsList
        yearObject = {
          value: year
          label: year
        }
        @years.push(yearObject)
        @__yearsMap[year] = yearObject

    __initMonths: ->
      @months = []
      @__monthsMap = {}
      monthnumber = 0
      for monthname in moment.months()
        monthObject = {
          value: monthnumber
          label: monthname
        }
        @months.push(monthObject)
        @__monthsMap[monthnumber] = monthObject
        monthnumber += 1

    __setCurrentYear: ->
      currentYearNumber = @calendarMonth.month.firstDayOfMonth.year()
      @currentYear = @__yearsMap[currentYearNumber]
      if not @currentYear?
        console?.error? "The given year, #{currentYearNumber} is not one of the available choices"

    __setCurrentMonth: ->
      currentMonthNumber = @calendarMonth.month.firstDayOfMonth.month()
      @currentMonth = @__monthsMap[currentMonthNumber]
      if not @currentMonth?
        console?.error? "The given month number, #{currentMonthNumber} is not one of the available choices"

    __updateDaynumbers: ->
      @daynumbers = []
      for daynumber in [1..@calendarMonth.month.getDaysInMonth()]
        dayNumberObject = {
          value: daynumber
          label: daynumber
        }
        @daynumbers.push(dayNumberObject)

    setDate: (momentObject) ->
      @calendarMonth = new CalendarMonth(momentObject)
      @__setCurrentYear()
      @__setCurrentMonth()
      @__updateDaynumbers()

    onChangeMonth: ->
      newFirstDayOfMonth = @calendarMonth.month.firstDayOfMonth.clone().set({
        month: @currentMonth.value
      })
      @calendarMonth = new CalendarMonth(newFirstDayOfMonth)

    onChangeYear: ->
      newFirstDayOfMonth = @calendarMonth.month.firstDayOfMonth.clone().set({
        year: @currentYear.value
      })
      @calendarMonth = new CalendarMonth(newFirstDayOfMonth)

    __setSelectedCalendarDay: (calendarDay) ->
      @selectedCalendarDay = calendarDay
      @selectedDayNumber = @daynumbers[calendarDay.momentObject.date()-1]

    onSelectDayNumber: (daynumber) ->
      momentObject = moment({
        year: @currentYear.value
        month: @currentMonth.value
        day: daynumber
      })
      @__setSelectedCalendarDay(new CalendarDay(momentObject))

    onSelectCalendarDay: (calendarDay) ->
      @__setSelectedCalendarDay(calendarDay)

    getDestinationFieldValue: ->
      return @selectedCalendarDay.momentObject.format('YYYY-MM-DD')


  @$get = ->
    return {
      MonthlyCalendarCoordinator: MonthlyCalendarCoordinator
    }

  return @
