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
        $scope.monthlyCaledarCoordinator = new djangoCradminCalendarApi.MonthlyCalendarCoordinator()

        $scope.onSelectDayNumber = ->
          $scope.monthlyCaledarCoordinator.handleCurrentDayObjectChange()
          $scope.applySelectedValue()
          return

        $scope.onSelectMonth = ->
          $scope.monthlyCaledarCoordinator.handleCurrentMonthChange()
          $scope.applySelectedValue()
          return

        $scope.onSelectYear = ->
          $scope.monthlyCaledarCoordinator.handleCurrentYearChange()
          $scope.applySelectedValue()
          return

        $scope.onSelectCalendarDay = (calendarDay) ->
          $scope.monthlyCaledarCoordinator.onSelectCalendarDay(calendarDay)
          $scope.applySelectedValue()
          return


        $scope.applySelectedValue = ->
          $scope.destinationField.val($scope.monthlyCaledarCoordinator.getDestinationFieldValue())
          $scope.hide()

        $scope.show = ->
          $scope.isVisible = true

        $scope.hide = ->
          $scope.isVisible = false

      link: ($scope, $element) ->
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
        return
    }
]
