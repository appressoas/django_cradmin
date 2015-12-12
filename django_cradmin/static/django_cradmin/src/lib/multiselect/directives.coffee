angular.module('djangoCradmin.multiselect.directives', [])


.directive('djangoCradminMultiselectTarget', [
  'djangoCradminMultiselectCoordinator',
  (djangoCradminMultiselectCoordinator) ->
    return {
      restrict: 'A'

      controller: ($scope, $element) ->
        domId = $element.attr('id')
        $scope.selectedItemsScope = null

        if not domId?
          throw Error('Elements using django-cradmin-multiselect-target must have an id.')

        djangoCradminMultiselectCoordinator.registerTarget(domId, $scope)
        $scope.$on "$destroy", ->
          djangoCradminMultiselectCoordinator.unregisterTarget(domId)

        $scope.select = (selectScope) ->
          ###
          Called by djangoCradminMultiselectSelect via
          djangoCradminMultiselectCoordinator when an item is selected.
          ###
          $scope.selectedItemsScope.append(selectScope)

        @setSelectedItemsScope = (selectedItemsScope) ->
          $scope.selectedItemsScope = selectedItemsScope

        return

      link: ($scope, $element, attributes) ->

        return
    }
])


.directive('djangoCradminMultiselectTargetSelectedItems', [
  '$compile', 'djangoCradminMultiselectCoordinator',
  ($compile, djangoCradminMultiselectCoordinator) ->
    return {
      restrict: 'A'
      require: '^djangoCradminMultiselectTarget'

      controller: ($scope, $element) ->

        $scope.append = (selectScope) ->
          previewHtml = selectScope.getPreviewHtml()
          html = "<div django-cradmin-multiselect-target-selected-item>#{previewHtml}</div>"
          linkingFunction = $compile(html)
          loadedElement = linkingFunction($scope)
#          $wrapperElement = angular.element('')
#          angular.element(loadedElement).appendTo($wrapperElement)
#          angular.element($wrapperElement).appendTo($element)
          angular.element(loadedElement).appendTo($element)

        return

      link: ($scope, $element, attributes, targetCtrl) ->
        targetCtrl.setSelectedItemsScope($scope)
        return
    }
])


.directive('djangoCradminMultiselectTargetSelectedItem', [
  ->
    return {
      restrict: 'A'
      scope: true

      controller: ($scope, $element) ->
        $scope.unselectItem = ->
          $element.remove()
          return

        return

      link: ($scope, $element, attributes) ->
        return
    }
])


.directive('djangoCradminMultiselectSelect', [
  'djangoCradminMultiselectCoordinator',
  (djangoCradminMultiselectCoordinator) ->
    return {
      restrict: 'A',
      scope: {
        options: '=djangoCradminMultiselectSelect'
      }

      controller: ($scope, $element) ->
#        console.log 'djangoCradminMultiselectSelect', $scope.options
        $scope.getPreviewHtml = ->
          $containerElement = $element.parents($scope.options.preview_container_css_selector)
          console.log 'Container', $containerElement
          $previewElement = $containerElement.find($scope.options.preview_css_selector)
          console.log 'Preview', $previewElement
          return $previewElement.html()

        return

      link: ($scope, $element, attributes) ->
        $element.on 'click', (e) ->
          e.preventDefault()
          targetDomId = $scope.options.target_dom_id
          djangoCradminMultiselectCoordinator.select(targetDomId, $scope)
        return
    }
])
