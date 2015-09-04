app = angular.module 'djangoCradmin.forms.datetimewidget', []


app.directive 'djangoCradminDateSelector', [
  'djangoCradminCalendarApi'
  (djangoCradminCalendarApi) ->

    return {
      scope: {
        config: "=djangoCradminDateSelector"
      }
      templateUrl: 'forms/dateselector.tpl.html'

      controller: ($scope, $element) ->
        $scope.isVisible = false

        $scope.onSelectDayNumber = ->
          $scope.monthlyCaledarCoordinator.handleCurrentDayObjectChange()
          return

        $scope.onSelectMonth = ->
          $scope.monthlyCaledarCoordinator.handleCurrentMonthChange()
          return

        $scope.onSelectYear = ->
          $scope.monthlyCaledarCoordinator.handleCurrentYearChange()
          return

        $scope.onSelectCalendarDay = (calendarDay) ->
          $scope.monthlyCaledarCoordinator.onSelectCalendarDay(calendarDay)
          $scope.applySelectedValue()
          return


        $scope.applySelectedValue = ->
          $scope.destinationField.val($scope.monthlyCaledarCoordinator.getDestinationFieldValue())
          $scope.previewElement.html($scope.monthlyCaledarCoordinator.selectedDateMomentObject.format('llll'))
          $scope.hide()

        $scope.show = ->
          $scope.isVisible = true

        $scope.hide = ->
          $scope.isVisible = false

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
        if $scope.config.destinationfieldid?
          $scope.destinationField = angular.element("#" + $scope.config.destinationfieldid)
          if $scope.destinationField.length == 0
            console?.error? "Could not find the destinationField element with ID: #{$scope.config.destinationfieldid}"
        else
          console?.error? "The destinationField config is required!"
          return

        if $scope.config.triggerbuttonid?
          $scope.triggerButton = angular.element("#" + $scope.config.triggerbuttonid)
          if $scope.triggerButton.length > 0
            $scope.triggerButton.on 'click', ->
              $scope.show()
              $scope.$apply()
              return
          else
            console?.warn? "Could not find the triggerButton element with ID: #{$scope.config.triggerbuttonid}"

        if $scope.config.previewid?
          $scope.previewElement = angular.element("#" + $scope.config.previewid)
          if $scope.previewElement.length == 0
            console?.warn? "Could not find the previewElement element with ID: #{$scope.config.previewid}"

        $scope.initialize()
        return
    }
]
