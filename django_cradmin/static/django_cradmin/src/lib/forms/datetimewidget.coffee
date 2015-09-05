app = angular.module 'djangoCradmin.forms.datetimewidget', []


app.directive 'djangoCradminDatetimeSelector', [
  '$timeout', '$compile', '$rootScope', 'djangoCradminCalendarApi'
  ($timeout, $compile, $rootScope, djangoCradminCalendarApi) ->

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
          return

        ###
        Used to get the preview of the selected date on page2 (above the time selector).
        ###
        $scope.getTimeselectorDatepreview = ->
          return $scope.monthlyCaledarCoordinator.selectedDateMomentObject.format(
            $scope.config.timeselector_datepreview_momentjs_format
          )

        $scope.__applyPreviewText = ->
          if $scope.monthlyCaledarCoordinator.valueWasSetByUser
            templateScope = $rootScope.$new(true)  # Create new isolated scope
            templateScope.momentObject = $scope.monthlyCaledarCoordinator.selectedDateMomentObject
            preview = $compile($scope.previewAngularjsTemplate)(templateScope)
            $scope.previewElement.empty()
            $scope.previewElement.append(preview)
          else
            $scope.previewElement.html($scope.config.no_value_preview_text)

        $scope.applySelectedValue = ->
          $scope.destinationField.val($scope.monthlyCaledarCoordinator.selectedDateMomentObject.format(
            $scope.config.destinationfield_momentjs_format
          ))
          $scope.__applyPreviewText()
          $scope.triggerButton.html($scope.config.buttonlabel)
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
            valueWasSetByUser = true
            $scope.triggerButton.html($scope.config.buttonlabel)
          else
            currentDateMomentObject = moment()  # Fallback to current date
            valueWasSetByUser = false
            $scope.triggerButton.html($scope.config.buttonlabel_novalue)

          $scope.monthlyCaledarCoordinator = new djangoCradminCalendarApi.MonthlyCalendarCoordinator(
            currentDateMomentObject, valueWasSetByUser)
          $scope.__applyPreviewText()

      link: ($scope, $element) ->
        if not $scope.config.no_value_preview_text?
          $scope.config.no_value_preview_text = ''

        required_config_attributes = [
          'destinationfieldid'
          'triggerbuttonid'
          'previewid'
          'previewtemplateid'
          'usebuttonlabel'
          'close_icon'
          'back_icon'
          'destinationfield_momentjs_format'
          'timeselector_datepreview_momentjs_format'
          'year_screenreader_text'
          'month_screenreader_text'
          'day_screenreader_text'
          'hour_screenreader_text'
          'minute_screenreader_text'
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

        previewTemplateScriptElement = angular.element("#" + $scope.config.previewtemplateid)
        if previewTemplateScriptElement.length == 0
          console?.warn? "Could not find the previewTemplateScriptElement element " +
              "with ID: #{$scope.config.previewtemplateid}"
        else
          $scope.previewAngularjsTemplate = previewTemplateScriptElement.html()

        $scope.initialize()

        return
    }
]
