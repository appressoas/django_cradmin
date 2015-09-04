app = angular.module 'djangoCradmin.calendar.providers', []


app.provider 'djangoCradminCalendarApi', ->
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
      @__initYears()
      if @selectedDateMomentObject?
        monthToLoadMomentObject = @selectedDateMomentObject
        @selectedCalendarDay = new CalendarDay(@selectedDateMomentObject)
      else
        monthToLoadMomentObject = moment()
        @selectedCalendarDay = null
      @__initYears()
      @__initMonths()
      @setDate(monthToLoadMomentObject)

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

    setDate: (momentObject) ->
      @calendarMonth = new CalendarMonth(momentObject)
      @calendarMonth.prettyprint()
      @__setCurrentYear()
      @__setCurrentMonth()

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

    onSelectCalendarDay: (calendarDay) ->
      @selectedCalendarDay = calendarDay

    getDestinationFieldValue: ->
      return @selectedCalendarDay.momentObject.format('YYYY-MM-DD')


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

  @$get = ->
    return {
      getWeekdaysShortForCurrentLocale: getWeekdaysShortForCurrentLocale
      MonthlyCalendarCoordinator: MonthlyCalendarCoordinator
    }

  return @
