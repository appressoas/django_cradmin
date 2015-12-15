angular.module('djangoCradmin.multiselect.directives', [])


.directive('djangoCradminMultiselectTarget', [
  'djangoCradminMultiselectCoordinator',
  (djangoCradminMultiselectCoordinator) ->
    return {
      restrict: 'A'
      scope: true

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

          Calls ``djangoCradminMultiselectTargetSelectedItems.select()``.
          ###
          $scope.selectedItemsScope.select(selectScope)
          $scope.$apply()

        $scope.onDeselect = (selectScope) ->
          ###
          Called by djangoCradminMultiselectCoordinator when an item is deselected.

          Calls ``djangoCradminMultiselectTargetSelectedItems.onDeselect()``.
          ###
          $scope.selectedItemsScope.onDeselect(selectScope)

        $scope.isSelected = (selectScope) ->
          ###
          Called by djangoCradminMultiselectSelect via
          djangoCradminMultiselectCoordinator to check if the item is selected.
          ###
          $scope.selectedItemsScope.isSelected(selectScope)

        $scope.hasItems = ->
          return $scope.selectedItemsScope?.hasItems()

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

    selectedItemCssClass = 'django-cradmin-multiselect-target-selected-item'

    return {
      restrict: 'A'
      require: '^djangoCradminMultiselectTarget'
      scope: true

      controller: ($scope, $element) ->
        $scope.selectedItemsCount = 0

        $scope.select = (selectScope) ->
          previewHtml = selectScope.getPreviewHtml()
          selectButtonDomId = selectScope.getDomId()
          html = "<div id='#{selectButtonDomId}_selected_item'" +
            "django-cradmin-multiselect-target-selected-item='#{selectButtonDomId}' " +
            "class='#{selectedItemCssClass}'>" +
            "#{previewHtml}</div>"
          linkingFunction = $compile(html)
          loadedElement = linkingFunction($scope)
          angular.element(loadedElement).appendTo($element)
          $scope.selectedItemsCount += 1

        $scope.onDeselect = (selectScope) ->
          $scope.selectedItemsCount -= 1

        $scope.isSelected = (selectScope) ->
          selectButtonDomId = selectScope.getDomId()
          return $element.find("##{selectButtonDomId}_selected_item").length > 0

        $scope.hasItems = ->
          return $scope.selectedItemsCount > 0

        return

      link: ($scope, $element, attributes, targetCtrl) ->
        targetCtrl.setSelectedItemsScope($scope)
        return
    }
])


.directive('djangoCradminMultiselectTargetSelectedItem', [
  'djangoCradminMultiselectCoordinator',
  (djangoCradminMultiselectCoordinator) ->
    return {
      restrict: 'A'
      scope: true

      controller: ($scope, $element) ->
        $scope.deselect = ->
          $element.remove()
          djangoCradminMultiselectCoordinator.onDeselect($scope.selectButtonDomId)
          return

        return

      link: ($scope, $element, attributes) ->
        $scope.selectButtonDomId = attributes.djangoCradminMultiselectTargetSelectedItem
        return
    }
])


.directive('djangoCradminMultiselectSelect', [
  '$rootScope', 'djangoCradminMultiselectCoordinator',
  ($rootScope, djangoCradminMultiselectCoordinator) ->

    itemWrapperSelectedCssClass = 'django-cradmin-multiselect-item-wrapper-selected'

    return {
      restrict: 'A',
      scope: {
        options: '=djangoCradminMultiselectSelect'
      }

      controller: ($scope, $element) ->
        $scope.getPreviewHtml = ->
          $containerElement = $element.parents($scope.options.preview_container_css_selector)
          $previewElement = $containerElement.find($scope.options.preview_css_selector)
          return $previewElement.html()

        $scope.getDomId = ->
          return $element.attr('id')

        $scope.getListElementCssSelector = ->
          return $scope.options.listelement_css_selector

        $scope.onDeselect = ->
          ###
          Called by djangoCradminMultiselectCoordinator when the item is deselected.
          ###
          $scope.getItemWrapperElement().removeClass(itemWrapperSelectedCssClass)

        $scope.markAsSelected = ->
          $scope.getItemWrapperElement().addClass(itemWrapperSelectedCssClass)

        $scope.getItemWrapperElement = ->
          return $element.closest($scope.options.item_wrapper_css_selector)

        $scope.getTargetDomId = ->
          return $scope.options.target_dom_id

        unregisterBgReplaceEventHandler = $scope.$on 'djangoCradminBgReplaceElementEvent', (event, options) ->
          # We only care about this if the replaced element in one of our parent elements
          if $element.closest(options.remoteElementSelector).length > 0
            targetDomId = $scope.options.target_dom_id
            if djangoCradminMultiselectCoordinator.isSelected(targetDomId, $scope)
              $scope.markAsSelected()

        $scope.$on '$destroy', ->
          unregisterBgReplaceEventHandler()

        return

      link: ($scope, $element, attributes) ->
        select = ->
          djangoCradminMultiselectCoordinator.select($scope)
          $scope.markAsSelected()

        $element.on 'click', (e) ->
          e.preventDefault()
          select()

        return
    }
])
