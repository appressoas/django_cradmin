angular.module('djangoCradmin.providers', [])


.provider 'djangoCradminWindowDimensions', ->
  ###* Provider that makes it easy to listen for window resize.

  How it works
  ============
  You register a ``scope`` with the provider. Each time the window
  is resized, the provider will call ``scope.onWindowResize()``.
  The provider uses a ``300ms`` timeout before it triggers a
  resize, so your ``onWindowResize`` method will not be flooded
  with every pixel change.

  Example
  =======

  ```coffeescript
  mymodule.directive('myDirective', [
    'djangoCradminWindowDimensions'
    (djangoCradminWindowDimensions) ->
      return {
        controller: ($scope) ->
          $scope.onWindowResize = (newWindowDimensions) ->
            console.log 'Window was resized to', newWindowDimensions
          return

        link: ($scope, element, attrs) ->
          djangoCradminWindowDimensions.register $scope
          $scope.$on '$destroy', ->
            djangoCradminWindowDimensions.unregister $scope
          return
      }
  ])
  ```
  ###
  class WindowDimensionsProvider
    constructor: ($window, @timeout) ->
      @mainWindow = angular.element($window)
      @windowDimensions = @_getWindowDimensions()
      @applyResizeTimer = null
      @applyResizeTimerTimeoutMs = 300
      @listeningScopes = []

    register: (scope) ->
      scopeIndex = @listeningScopes.indexOf(scope)
      if scopeIndex != -1
        console.error(
          'Trying to register a scope that is already registered with ' +
          'djangoCradminWindowDimensions. Scope:', scope)
        return
      if @listeningScopes.length < 1
        @mainWindow.bind 'resize', @_onWindowResize
      @listeningScopes.push(scope)
      scope.onWindowResize(@windowDimensions)

    unregister: (scope) ->
      scopeIndex = @listeningScopes.indexOf(scope)
      if scopeIndex == -1
        console.error(
          'Trying to unregister a scope that is not registered with ' +
          'djangoCradminWindowDimensions. Scope:', scope)
      @listeningScopes.splice(scopeIndex, 1)
      if @listeningScopes.length < 1
        @mainWindow.unbind 'resize', @_onWindowResize

    _getWindowDimensions: ->
      return {
        height: @mainWindow.height()
        width: @mainWindow.width()
      }

    _setWindowDimensions: ->
      newWindowDimensions = @_getWindowDimensions()
      if not angular.equals(newWindowDimensions, @windowDimensions)
        @windowDimensions = newWindowDimensions
        @_onWindowDimensionsChange()

    _onWindowDimensionsChange: ->
      for scope in @listeningScopes
        scope.onWindowResize(@windowDimensions)

    _onWindowResize: =>
      @timeout.cancel(@applyResizeTimer)

      # Use timeout to avoid triggering change for each pixel changed
      @applyResizeTimer = @timeout =>
        @_setWindowDimensions()
      , @applyResizeTimerTimeoutMs

  @$get = (['$window', '$timeout', ($window, $timeout) ->
    return new WindowDimensionsProvider($window, $timeout)
  ])

  return @
