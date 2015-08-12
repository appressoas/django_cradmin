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

        @close = ->
          $scope.cradminMenuDisplay = false
          $scope.$apply()

        return
    }
])


.directive('djangoCradminMenuAutodetectOverflowY', [
  'djangoCradminWindowDimensions'
  (djangoCradminWindowDimensions) ->
    ###*
    ###
    return {
      require: '?djangoCradminMenu'

      controller: ($scope) ->
        $scope.onWindowResize = (newWindowDimensions) ->
          $scope.setOrUnsetOverflowYClass()

        $scope.setOrUnsetOverflowYClass = ->
          menuDomElement = $scope.menuElement?[0]
          if menuDomElement?
            if menuDomElement.clientHeight < menuDomElement.scrollHeight
              $scope.menuElement.addClass($scope.overflowYClass)
            else
              $scope.menuElement.removeClass($scope.overflowYClass)

        disableInitialWatcher = $scope.$watch(
          ->
            if $scope.menuElement?[0]?
              return true
            else
              return false
          , (newValue) ->
            if newValue
              $scope.setOrUnsetOverflowYClass()
              disableInitialWatcher()
        )

        return

      link: ($scope, element, attrs) ->
        $scope.overflowYClass = attrs.djangoCradminMenuAutodetectOverflowY
        $scope.menuElement = element

        djangoCradminWindowDimensions.register $scope
        $scope.$on '$destroy', ->
          djangoCradminWindowDimensions.unregister $scope
        return
    }
])

.directive('djangoCradminMenuCloseOnClick', [
  ->
    ###* Directive that you can put on menu links to automatically close the
    menu on click.
    ###

    return {
      require: '^^djangoCradminMenu'

      link: (scope, element, attrs, djangoCradminMenuCtrl) ->
        element.on 'click', ->
          djangoCradminMenuCtrl.close()
          return
        return
    }
])
