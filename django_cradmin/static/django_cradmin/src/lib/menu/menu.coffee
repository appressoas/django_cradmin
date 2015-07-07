angular.module('djangoCradmin.menu', [])


.directive('djangoCradminMenu', [
  ->
    ###* Menu that collapses automatically on small displays.

    Example
    =======

    ```html
    <nav django-cradmin-menu class="django-cradmin-menu">
      <div class="django-cradmin-menu-mobileheader">
        <a href="#" role="button"
            class="django-cradmin-menu-mobiletoggle"
            ng-click="cradminMenuTogglePressed()"
            ng-class="{'django-cradmin-menu-mobile-toggle-button-expanded': cradminMenuDisplay}"
            aria-pressed="{{ getAriaPressed() }}">
          Menu
        </a>
      </div>
      <div class="django-cradmin-menu-content"
          ng-class="{'django-cradmin-menu-content-display': cradminMenuDisplay}">
        <ul>
          <li><a href="#">Menu item 1</a></li>
          <li><a href="#">Menu item 2</a></li>
        </ul>
      </div>
    </nav>
    ```

    Design notes
    ============

    The example uses css classes provided by the default cradmin CSS, but
    you specify all classes yourself, so you can easily provide your own
    css classes and still use the directive.
    ###

    return {
      scope: true

      controller: ($scope, djangoCradminPagePreview) ->
        $scope.cradminMenuDisplay = false
        $scope.cradminMenuTogglePressed = ->
          $scope.cradminMenuDisplay = !$scope.cradminMenuDisplay

        $scope.getAriaPressed = ->
          if $scope.cradminMenuDisplay
            return 'pressed'
          else
            return ''
    }
])
