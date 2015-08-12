angular.module('djangoCradmin.scrollfixed', [])


.directive('djangoCradminScrollTopFixed', [
  'djangoCradminWindowScrollTop', 'djangoCradminWindowDimensions'
  (djangoCradminWindowScrollTop, djangoCradminWindowDimensions) ->
    ###* Keep an item aligned relative to a given top pixel position on the screen when scrolling.

    Example
    =======

    ```html
    <div django-cradmin-scroll-top-fixed>
      Some content here.
    </div>
    ```

    Make sure you style your element with absolute position. Example:

    ```
    position: absolute;
    top: 0;
    left: 0;
    ```

    Uses the initial top position as the offset. This means that you can style an element
    with something like this:

    ```
    position: absolute;
    top: 40px;
    right: 90px;
    ```

    And have it stay 40px from the top of the viewarea.

    Handling mobile devices
    =======================
    You may not want to scroll content on small displays. You
    should solve this with CSS media queries - simply do not
    use ``position: absolute;`` for the screen sizes you do
    not want to scroll.
    ###

    return {
      controller: ($scope) ->
        $scope.onWindowScrollTop = (newWindowTopPosition) ->
          newTopPosition = newWindowTopPosition + $scope.djangoCradminScrollTopFixedInitialTopOffset
          $scope.djangoCradminScrollTopFixedElement.css('top', "#{newTopPosition}px")
        return

      link: ($scope, element, attrs) ->
        $scope.djangoCradminScrollTopFixedElement = element
        $scope.djangoCradminScrollTopFixedSettings = $scope.$eval(attrs.djangoCradminScrollTopFixed)
        $scope.djangoCradminScrollTopFixedInitialTopOffset = parseInt(element.css('top'), 10) || 0

        djangoCradminWindowScrollTop.register $scope
        $scope.$on '$destroy', ->
          djangoCradminWindowScrollTop.unregister $scope
        return
    }
])
