angular.module('djangoCradmin.pagepreview', [])

.directive 'djangoCradminPagePreview', ->
  ###
  A directive that opens the given URL in an iframe overlay.
  ###
  controller = ($scope) ->
    console.log 'YOOOOOO'
    return

  return {
    restrict: 'A'
    scope: {}
    controller: controller
  }
