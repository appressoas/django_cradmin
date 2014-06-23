describe 'CradminMenuController', ->
  beforeEach(module('djangoCradmin.default.menu'))

  it 'should start toggle displayMenu attribute', inject ($controller) ->
    scope = {}
    ctrl = $controller('CradminMenuController', {$scope:scope})
    expect(scope.displayMenu).toBe(false)
    scope.toggleNavigation()
    expect(scope.displayMenu).toBe(true)
    scope.toggleNavigation()
    expect(scope.displayMenu).toBe(false)
