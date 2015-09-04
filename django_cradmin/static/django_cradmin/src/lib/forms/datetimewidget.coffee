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

        $scope.onChangeMonth = ->
          $scope.calendarData.onChangeMonth()
          return

        $scope.onChangeYear = ->
          $scope.calendarData.onChangeYear()
          return

        $scope.onSelectCalendarDay = (calendarDay) ->
          $scope.calendarData.onSelectCalendarDay(calendarDay)
          $scope.applySelectedValue()
          return

        $scope.applySelectedValue = ->
          $scope.destinationField.val($scope.calendarData.getDestinationFieldValue())
          $scope.hide()

        $scope.show = ->
          $scope.isVisible = true

        $scope.hide = ->
          $scope.isVisible = false

      link: ($scope, $element) ->
        $scope.weekdays = djangoCradminCalendarApi.getWeekdaysShortForCurrentLocale()
        $scope.calendarData = new djangoCradminCalendarApi.MonthlyCalendarCoordinator()

        if $scope.config.destinationFieldId?
          $scope.destinationField = angular.element("#" + $scope.config.destinationFieldId)
          if $scope.destinationField.length > 0
            $scope.destinationField.on 'focus', ->
              $scope.show()
              $scope.$apply()
              return
          else
            console?.error? "Could not find the destinationField element with ID: #{$scope.config.destinationFieldId}"
        else
          console?.error? "The destinationField config is required!"
        console.log $scope.config
        return
    }
]
