angular.module('djangoCradmin.forms.usethisbutton', [])

.directive('djangoCradminUseThis', [
  '$window'
  ($window) ->
    ###
    The django-cradmin-use-this directive is used to select elements for
    the ``django-cradmin-model-choice-field`` directive. You add this directive
    to a button or a-element within an iframe, and this directive will use
    ``window.postMessage`` to send the needed information to the
    ``django-cradmin-model-choice-field-wrapper``.

    You may also use this if you create your own custom iframe communication
    receiver directive where a "use this" button within an iframe is needed.

    Example
    =======
    ```
      <a class="btn btn-default" django-cradmin-use-this="Peter Pan" django-cradmin-fieldid="id_name">
        Use this
      </a>
    ```

    How it works
    ============
    When the user clicks an element with this directive, the click
    is captured, the default action is prevented, and we JSON encode
    the following:

    ```
    {
      postmessageid: 'django-cradmin-usethis',
      'selected_value': '<the value provided via the django-cradmin attribute>',
      'selected_fieldid': '<the fieldid provided via the django-cradmin-fieldid attribute>',
    }
    ```

    We assume there is a event listener listening for the ``message`` event on
    the message in the parent of the iframe where this was clicked, but no checks
    ensuring this is made.
    ###
    return {
      restrict: 'A'
      scope: {
        'value': '@djangoCradminUseThis'
        'fieldid': '@djangoCradminFieldid'
      }

      link: (scope, element, attrs) ->
        scope.iframeWrapperElement = element
        element.on 'click', (e) ->
          e.preventDefault()
          $window.parent.postMessage(
            angular.toJson({
              postmessageid: 'django-cradmin-usethis',
              selected_fieldid: scope.fieldid,
              selected_value: scope.value
            }),
            window.parent.location.href)

        return
    }
])
