app = angular.module 'djangoCradmin.forms.setfieldvalue', ['cfp.hotkeys']

###*
Directive for setting the value of a form field to specified value.

Example:

```
  <button type="button"
          django-cradmin-setfieldvalue="2015-12-24 12:30"
          django-cradmin-setfieldvalue-field-id="my_datetimefield_id">
      Set value to 2015-12-24 12:30
  </button>
```
###
app.directive 'djangoCradminSetfieldvalue', [
  ->
    return {
      scope: {
        value: "@djangoCradminSetfieldvalue"
        fieldid: "@djangoCradminSetfieldvalueFieldId"
      }

      link: ($scope, $element) ->
        fieldElement = angular.element("##{$scope.fieldid}")
        if fieldElement.length == 0
          console?.error? "Could not find a field with the '#{$scope.fieldid}' ID."
        else
          $element.on 'click', ->
            fieldElement.val $scope.value
            fieldElement.trigger 'change'
          return
    }
]
