app = angular.module 'djangoCradmin.forms.datetimewidget', ['cfp.hotkeys']

#app.config (hotkeysProvider) ->
#  hotkeysProvider.includeCheatSheet = false

app.directive 'djangoCradminDatetimeSelector', [
  '$timeout', '$compile', '$rootScope', 'hotkeys', 'djangoCradminCalendarApi',
  ($timeout, $compile, $rootScope, hotkeys, djangoCradminCalendarApi) ->

    return {
      scope: {
        config: "=djangoCradminDatetimeSelector"
      }
      templateUrl: 'forms/dateselector.tpl.html'

      controller: ($scope, $element) ->
        $scope.page = null

        ###
        Handles keyboard navigation.
        ###
        $scope.__keyboardNavigation = (event, direction) ->
          if direction == 'pageup' or direction == 'pagedown'
            event.preventDefault()
          if $element.find('.django-cradmin-datetime-selector-table').is(':visible')
            activeElement = angular.element(document.activeElement)
            if activeElement.hasClass('django-cradmin-datetime-selector-daybuttoncell-button')
              event.preventDefault()

              if direction == 'right'
                nextSibling = activeElement.parent().next()
                if nextSibling.length > 0
                  newFocusTd = nextSibling
              if direction == 'left'
                previousSibling = activeElement.parent().prev()
                if previousSibling.length > 0
                  newFocusTd = previousSibling
              if direction == 'up'
                previousTr = activeElement.parent().parent().prev()
                if previousTr.length > 0
                  newFocusTd = angular.element(previousTr.children().get(activeElement.parent().index()))
              if direction == 'down'
                nextTr = activeElement.parent().parent().next()
                if nextTr.length > 0
                  newFocusTd = angular.element(nextTr.children().get(activeElement.parent().index()))


              if direction == 'home'
                newFocusTd = activeElement.parent().parent().parent().children().first().children().first()
              if direction == 'end'
                newFocusTd = activeElement.parent().parent().parent().children().last().children().last()

              if newFocusTd? and newFocusTd.length > 0
                newFocusTd.find('button').focus()

              if direction == 'pageup'
                $element.find('.django-cradmin-datetime-selector-monthselect').focus()

            else if direction == 'pagedown'
              if activeElement.parent().hasClass('django-cradmin-datetime-selector-dateselectors')
                lastFocusedElement = $element.find('.django-cradmin-datetime-selector-daybuttoncell-lastfocused button')
                if lastFocusedElement.is(':visible')
                  lastFocusedElement.focus()
                else
                  angular.element(
                    $element.find('.django-cradmin-datetime-selector-daybuttoncell-in-current-month button').first()
                  ).focus()

        ###
        Called when enter is pressed in any of the select fields.

        If we have a visible use-button, we do the same as if the user
        pressed that. If we are on page1, on desktop (no use-button),
        we move the focus into the first day of the current month
        in the day select table, or to the selected day if that is visible.
        ###
        $scope.__onSelectEnterPressed = ->
          if $scope.page == 1
            useButton = $element.find('.django-cradmin-datetime-selector-dateview ' +
              '.django-cradmin-datetime-selector-use-button')
            if useButton.is(":visible")
              $scope.onClickUseTime()
            else
              tableElement = $element.find('.django-cradmin-datetime-selector-table')
              selectedButton = tableElement.find('.django-cradmin-datetime-selector-daybuttoncell-selected button')
              if selectedButton.length > 0
                selectedButton.focus()
              else
                tableElement.find(
                  '.django-cradmin-datetime-selector-daybuttoncell-in-current-month button').first().focus()
          else if $scope.page == 2
            $scope.onClickUseTime()

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
        Called when a users focuses a date in the calendar table.
        ###
        $scope.onFocusCalendayDay = (calendarDay) ->
          $scope.monthlyCaledarCoordinator.handleFocusOnCalendarDay(calendarDay)
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
          return $scope.monthlyCaledarCoordinator.shownDateMomentObject.format(
            $scope.config.timeselector_datepreview_momentjs_format
          )

        ###
        This is used to get the aria-label attribute for the "Use" button.
        ###
        $scope.getUseButtonAriaLabel = ->
          if $scope.monthlyCaledarCoordinator?
            formattedDate = $scope.monthlyCaledarCoordinator.shownDateMomentObject.format(
              $scope.config.usebutton_arialabel_momentjs_format)
            return "#{$scope.config.usebutton_arialabel_prefix} " +
              "#{formattedDate}"
          else
          return ''

        ###
        Get day-button (button in the calendar table) aria-label attribute.
        ###
        $scope.getDaybuttonAriaLabel = (calendarDay) ->
          label = "#{calendarDay.momentObject.format('MMMM D')}"
          if $scope.config.today_label_text != '' and calendarDay.isToday()
            label = "#{label} (#{$scope.config.today_label_text})"
          else
            isSelected = calendarDay.momentObject.isSame(
              $scope.monthlyCaledarCoordinator.selectedValueMomentObject, 'day')
            if $scope.config.selected_day_label_text != '' and isSelected
              label = "#{label} (#{$scope.config.selected_day_label_text})"
          return label

        $scope.getTabindexForCalendarDay = (calendarDay) ->
          if calendarDay.isInCurrentMonth
            return "0"
          else
          return "-1"

        $scope.__applyPreviewText = ->
          if $scope.monthlyCaledarCoordinator.valueWasSetByUser
            templateScope = $rootScope.$new(true)  # Create new isolated scope
            # NOTE: We must clone the object, if we do not clone it, the value
            # will be reflected in the preview each time we change any value
            # in the date picker, and we only want the value to be applied when
            # the user confirms a value.
            templateScope.momentObject = $scope.monthlyCaledarCoordinator.shownDateMomentObject.clone()
            preview = $compile($scope.previewAngularjsTemplate)(templateScope)
            $scope.previewElement.empty()
            $scope.previewElement.append(preview)
          else
            $scope.previewElement.html($scope.config.no_value_preview_text)

        $scope.applySelectedValue = ->
          # We update the selectedValueMomentObject because that should
          # reflect the value selected by the user. E.g. the selectedValueMomentObject
          # is the value the user last applied.
          # We must clone the value to avoid that it is reflected for each change in the date picker.
          $scope.monthlyCaledarCoordinator.selectedValueMomentObject = $scope.monthlyCaledarCoordinator.shownDateMomentObject.clone()

          # Update the (hidden) destination field
          $scope.destinationField.val($scope.monthlyCaledarCoordinator.shownDateMomentObject.format(
            $scope.config.destinationfield_momentjs_format
          ))

          # Update the preview text and trigger button label
          $scope.__applyPreviewText()
          $scope.triggerButton.html($scope.config.buttonlabel)

          $scope.hide()

        __addCommonHotkeys = ->
          hotkeys.add({
            combo: 'esc'
            callback: (event) ->
              $scope.hide()
            allowIn: ['BUTTON', 'SELECT', 'INPUT']
          })
          hotkeys.add({
            combo: 'up'
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'up')
          })
          hotkeys.add({
            combo: 'down'
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'down')
          })
          hotkeys.add({
            combo: 'left'
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'left')
          })
          hotkeys.add({
            combo: 'right'
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'right')
          })
          hotkeys.add({
            combo: 'home'
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'home')
          })
          hotkeys.add({
            combo: 'end'
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'end')
          })
          hotkeys.add({
            combo: 'pagedown'
            allowIn: ['BUTTON', 'SELECT', 'INPUT']
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'pagedown')
          })
          hotkeys.add({
            combo: 'pageup'
            allowIn: ['BUTTON', 'SELECT', 'INPUT', 'BUTTON']
            callback: (event) ->
              $scope.__keyboardNavigation(event, 'pageup')
          })

        __addPage1Hotkeys = ->

        __removeHotkeys = ->
          hotkeys.del('esc')
          hotkeys.del('up')
          hotkeys.del('down')
          hotkeys.del('left')
          hotkeys.del('right')
          hotkeys.del('home')
          hotkeys.del('end')
          hotkeys.del('pagedown')
          hotkeys.del('pageup')

        $scope.showPage1 = ->
          $element.show()
          $scope.page = 1
          # Use a timeout to ensure screenreaders are not stuck on the
          # last focused element.
          $timeout(->
            __getInitialFocusItemForCurrentPage().focus()
          , 150)
          __addCommonHotkeys()
          __addPage1Hotkeys()
          return

        $scope.showPage2 = ->
          $scope.page = 2

          # Update "selectedValueMomentObject" to reflect the change. This will mark this as
          # the selected value when we return from to page2.
          $scope.monthlyCaledarCoordinator.selectedValueMomentObject = $scope.monthlyCaledarCoordinator.shownDateMomentObject.clone()
          $element.show()
          # Use a timeout to ensure screenreaders are not stuck on the
          # last focused element.
          $timeout(->
            __getInitialFocusItemForCurrentPage().focus()
          , 150)
          __addCommonHotkeys()
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

          __removeHotkeys()

          # Use a timeout to ensure screenreaders are not stuck on the
          # last focused element.
          $timeout(->
            __getFocusItemAfterHide().focus()
          , 150)

          return

        $scope.initialize = ->
          currentDateIsoString = $scope.destinationField.val()
          if currentDateIsoString? and currentDateIsoString != ''
            selectedValueMomentObject = moment(currentDateIsoString)
            $scope.triggerButton.html($scope.config.buttonlabel)
          else
            selectedValueMomentObject = null
            $scope.triggerButton.html($scope.config.buttonlabel_novalue)

          $scope.monthlyCaledarCoordinator = new djangoCradminCalendarApi.MonthlyCalendarCoordinator(
            selectedValueMomentObject)
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
          'today_label_text'
          'selected_day_label_text'
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
            $scope.initialize()
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

        # We need this timeout to ensure all the items are rendered.
        # it seems empty selects are not matched or something like that
        # The timeout should not matter unless a user somehow manages to open
        # the datepicker in 100ms (after page load)
        $timeout(->
          $element.find('select').on 'keydown', (e) ->
            if e.which == 13  # 13 is the enter key
              $scope.__onSelectEnterPressed()
              # Prevent form submit when hitting enter on any select in the datepicker
              e.preventDefault()
            return
        , 100)
        return
    }
]
