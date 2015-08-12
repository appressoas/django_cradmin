angular.module('djangoCradmin.scrollfixed', [])


.directive('djangoCradminScrollTopFixed', [
  'djangoCradminWindowScrollTop'
  (djangoCradminWindowScrollTop) ->
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

    isUsingDefaultScroll = true
    swapClasses = false

    swapCssClasses = ($scope, $element, newWindowTopPosition) ->
      settings = $scope.djangoCradminScrollTopFixedSettings
      if newWindowTopPosition >= $scope.djangoCradminScrollTopFixedInitialTopOffset
        if isUsingDefaultScroll
          $element.removeClass settings.cssClasses.defaultClass
          $element.addClass settings.cssClasses.scrollClass
          isUsingDefaultScroll = false
      else if newWindowTopPosition < $scope.djangoCradminScrollTopFixedInitialTopOffset
        if not isUsingDefaultScroll
          $element.addClass settings.cssClasses.defaultClass
          $element.removeClass settings.cssClasses.scrollClass
          isUsingDefaultScroll = true

    return {
      controller: ($scope, $element, $attrs) ->
        $scope.djangoCradminScrollTopFixedSettings = $scope.$eval($attrs.djangoCradminScrollTopFixed)

        if $scope.djangoCradminScrollTopFixedSettings.cssClasses?
          if $scope.djangoCradminScrollTopFixedSettings.cssClasses.defaultClass and
              $scope.djangoCradminScrollTopFixedSettings.cssClasses.scrollClass
            swapClasses = true

        $scope.onWindowScrollTop = (newWindowTopPosition) ->
          if swapClasses
            swapCssClasses $scope, $element, newWindowTopPosition

          offset = $scope.djangoCradminScrollTopFixedInitialTopOffset

          if $scope.djangoCradminScrollTopFixedSettings.pinToTopOnScroll
            if newWindowTopPosition > offset
              offset = 0
            else
              offset = offset - newWindowTopPosition

          newTopPosition = newWindowTopPosition + offset
          $scope.djangoCradminScrollTopFixedElement.css('top', "#{newTopPosition}px")
        return

      link: ($scope, element, attrs) ->
        $scope.djangoCradminScrollTopFixedElement = element
#        $scope.djangoCradminScrollTopFixedSettings = $scope.$eval(attrs.djangoCradminScrollTopFixed)
        $scope.djangoCradminScrollTopFixedInitialTopOffset = parseInt(element.css('top'), 10) || 0

        djangoCradminWindowScrollTop.register $scope
        $scope.$on '$destroy', ->
          djangoCradminWindowScrollTop.unregister $scope
        return
    }
])
