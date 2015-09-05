app = angular.module 'djangoCradmin.forms.datetimewidget', []


app.directive 'djangoCradminDatetimeSelector', [
  '$timeout', 'djangoCradminCalendarApi'
  ($timeout, djangoCradminCalendarApi) ->

    return {
      scope: {
        config: "=djangoCradminDatetimeSelector"
      }
      templateUrl: 'forms/dateselector.tpl.html'

      controller: ($scope, $element) ->
        $scope.page = null

        ###
        Called when a users selects a date using the mobile-only <select>
        menu to select a day.
        ###
        $scope.onSelectDayNumber = ->
          $scope.monthlyCaledarCoordinator.handleCurrentDayObjectChange()
          return

        ###
        Called when a user selects a date by clicking on a day
        in the calendar table.
        ###
        $scope.onClickCalendarDay = (calendarDay) ->
          $scope.monthlyCaledarCoordinator.handleCalendarDayChange(calendarDay)
          if $scope.config.include_time
            $scope.showPage2()
          else
            $scope.applySelectedValue()
          return

        ###
        Called when a users selects a month using the month <select>
        menu.
        ###
        $scope.onSelectMonth = ->
          $scope.monthlyCaledarCoordinator.handleCurrentMonthChange()
          return

        ###
        Called when a users selects a year using the year <select>
        menu.
        ###
        $scope.onSelectYear = ->
          $scope.monthlyCaledarCoordinator.handleCurrentYearChange()
          return

        ###
        Called when a users selects an hour using the hour <select>
        menu.
        ###
        $scope.onSelectHour = ->
          $scope.monthlyCaledarCoordinator.handleCurrentHourChange()
          return

        ###
        Called when a users selects a minute using the minute <select>
        menu.
        ###
        $scope.onSelectMinute = ->
          $scope.monthlyCaledarCoordinator.handleCurrentMinuteChange()
          return

        ###
        Called when a user clicks the "Use" button on the time page.
        ###
        $scope.onClickUseTime = ->
          $scope.applySelectedValue()
          console.log 'Apply'
          return

        $scope.applySelectedValue = ->
          $scope.destinationField.val($scope.monthlyCaledarCoordinator.getDestinationFieldValue())
          $scope.previewElement.html($scope.monthlyCaledarCoordinator.selectedDateMomentObject.format('llll'))
          $scope.hide()

        $scope.showPage1 = ->
          $scope.page = 1

        $scope.showPage2 = ->
          $scope.page = 2

        $scope.hide = ->
          if $scope.page == 2
            # We use page3 to make it possible to have a custom animation for hiding
            # page2 (avoid that it animates sideways back to the starting point).
            # The timeout just needs to be longer than the css animation, but
            # shorter than a reasonable time that a user is able to re-open the
            # date picker.
            $scope.page = 3
            $timeout(->
              $scope.page = null
            , 400)
          else
            $scope.page = null

        $scope.initialize = ->
          currentDateIsoString = $scope.destinationField.val()
          if currentDateIsoString? and currentDateIsoString != ''
            currentDateMomentObject = moment(currentDateIsoString)
            $scope.triggerButton.html($scope.config.buttonlabel)
          else
            currentDateMomentObject = moment()  # Fallback to current date
            $scope.triggerButton.html($scope.config.buttonlabel_novalue)

          $scope.monthlyCaledarCoordinator = new djangoCradminCalendarApi.MonthlyCalendarCoordinator(
            currentDateMomentObject)

      link: ($scope, $element) ->
        if not $scope.config.no_value_preview_text?
          $scope.config.no_value_preview_text = ''

        required_config_attributes = [
          'destinationfieldid'
          'triggerbuttonid'
          'previewid'
          'usebuttonlabel'
          'close_icon'
#          'year_emptyvalue'
#          'month_emptyvalue'
#          'day_emptyvalue'
#          'hour_emptyvalue'
#          'minute_emptyvalue'
        ]
        for configname in required_config_attributes
          configvalue = $scope.config[configname]
          if not configvalue? or configvalue == ''
            console?.error? "The #{configname} config is required!"

        $scope.destinationField = angular.element("#" + $scope.config.destinationfieldid)
        if $scope.destinationField.length == 0
          console?.error? "Could not find the destinationField element with ID: #{$scope.config.destinationfieldid}"

        $scope.triggerButton = angular.element("#" + $scope.config.triggerbuttonid)
        if $scope.triggerButton.length > 0
          $scope.triggerButton.on 'click', ->
            $scope.showPage1()
            $scope.$apply()
            return
        else
          console?.warn? "Could not find the triggerButton element with ID: #{$scope.config.triggerbuttonid}"

        $scope.previewElement = angular.element("#" + $scope.config.previewid)
        if $scope.previewElement.length == 0
          console?.warn? "Could not find the previewElement element with ID: #{$scope.config.previewid}"

        $scope.initialize()
        return
    }
]
