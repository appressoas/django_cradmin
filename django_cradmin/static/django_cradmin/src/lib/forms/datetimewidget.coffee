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
        Returns the item we want to focus on when we tab forward from the last
        focusable item on the current page.
        ###
        __getFirstFocusableItemInCurrentPage = ->
          if $scope.page == 1
            return $element.find('.django-cradmin-datetime-selector-dateview ' +
                '.django-cradmin-datetime-selector-closebutton')
          else if $scope.page == 2
            return $element.find('.django-cradmin-datetime-selector-timeview ' +
                '.django-cradmin-datetime-selector-closebutton')

        ###
        Returns the item we want to focus on when we tab back from the first
        focusable item on the current page.
        ###
        __getLastFocusableItemInCurrentPage = ->
          if $scope.page == 1
            useButton = $element.find('.django-cradmin-datetime-selector-dateview ' +
              '.django-cradmin-datetime-selector-use-button')
            if useButton.is(":visible")
              return useButton
            else
              return $element.find('.django-cradmin-datetime-selector-table ' +
                  'td.django-cradmin-datetime-selector-daybuttoncell-in-current-month button').last()
          else if $scope.page == 2
            return $element.find('.django-cradmin-datetime-selector-timeview ' +
              '.django-cradmin-datetime-selector-use-button')

        ###
        Get the initial item to focus on when we open/show a page.
        ###
        __getInitialFocusItemForCurrentPage = ->
          if $scope.page == 1
            dayselectElement = $element.find('.django-cradmin-datetime-selector-dayselect')
            if dayselectElement.is(':visible')
              return dayselectElement
            else
              return $element.find('.django-cradmin-datetime-selector-monthselect')
          else if $scope.page == 2
            return $element.find('.django-cradmin-datetime-selector-timeview ' +
                '.django-cradmin-datetime-selector-hourselect')

        ###
        Get the item to focus on when we close the datetime picker.
        ###
        __getFocusItemAfterHide = ->
          return $scope.triggerButton

        ###
        Triggered when the user focuses on the hidden (sr-only) button we have
        added to the start of the datetime-selector div.
        ###
        $scope.onFocusHead = ->
          if $scope.page != null
            __getLastFocusableItemInCurrentPage().focus()
          return

        ###
        Triggered when the user focuses on the hidden (sr-only) button we have
        added to the end of the datetime-selector div.
        ###
        $scope.onFocusTail = ->
          if $scope.page != null
            __getFirstFocusableItemInCurrentPage().focus()
          return

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

        ###
        This is used to get the aria-label attribute for the "Use" button.
        ###
        $scope.getUseButtonAriaLabel = ->
          if $scope.monthlyCaledarCoordinator?
            formattedDate = $scope.monthlyCaledarCoordinator.selectedDateMomentObject.format(
              $scope.config.usebutton_arialabel_momentjs_format)
            return "#{$scope.config.usebutton_arialabel_prefix} " +
              "#{formattedDate}"
          else
          return ''

        $scope.getTabindexForCalendarDay = (calendarDay) ->
          if calendarDay.isInCurrentMonth
            return "0"
          else
          return "-1"

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
          __getInitialFocusItemForCurrentPage().focus()
          return

        $scope.showPage2 = ->
          $scope.page = 2
          __getInitialFocusItemForCurrentPage().focus()
          return

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
          __getFocusItemAfterHide().focus()

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

        #
        # Validate required config
        #

        if not $scope.config.no_value_preview_text?
          $scope.config.no_value_preview_text = ''

        required_config_attributes = [
          'destinationfieldid'
          'triggerbuttonid'
          'previewid'
          'previewtemplateid'
          'usebuttonlabel'
          'usebutton_arialabel_prefix'
          'usebutton_arialabel_momentjs_format'
          'close_icon'
          'back_icon'
          'back_to_datepicker_screenreader_text'
          'destinationfield_momentjs_format'
          'timeselector_datepreview_momentjs_format'
          'year_screenreader_text'
          'month_screenreader_text'
          'day_screenreader_text'
          'hour_screenreader_text'
          'minute_screenreader_text'
          'dateselector_table_screenreader_caption'
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


        #
        # Find the required elements outside the datepicker:
        # - The (hidden) destination field
        # - The button that triggers the widget
        # - The element where we show the preview of the selected date/datetime
        # - The <script> tag containing the AngularJS template used to
        #   create the preview.
        #

        $scope.destinationField = angular.element("#" + $scope.config.destinationfieldid)
        if $scope.destinationField.length == 0
          console?.error? "Could not find the destinationField element with ID: #{$scope.config.destinationfieldid}"

        $scope.triggerButton = angular.element("#" + $scope.config.triggerbuttonid)
        if $scope.triggerButton.length > 0
          $scope.triggerButton.on 'click', ->
            $scope.showPage1()
            $scope.$apply()
            return
          labelElement = angular.element("label[for=#{$scope.config.destinationfieldid}]")
          if labelElement.length > 0
            if not labelElement.attr('id')
              labelElement.attr('id', "#{$scope.config.destinationfieldid}_label")
            $scope.triggerButton.attr('aria-labeledby', "#{labelElement.attr('id')} #{$scope.config.previewid}")
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
