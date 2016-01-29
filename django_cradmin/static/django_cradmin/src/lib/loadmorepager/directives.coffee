angular.module('djangoCradmin.loadmorepager.directives', [])


.directive('djangoCradminLoadMorePager', [
  '$timeout', 'djangoCradminBgReplaceElement', 'djangoCradminLoadmorepagerCoordinator'
  ($timeout, djangoCradminBgReplaceElement, djangoCradminLoadmorepagerCoordinator) ->

    pagerWrapperCssSelector = '.django-cradmin-loadmorepager'

    return {
      restrict: 'A',
      scope: true

      controller: ($scope, $element) ->
        $scope.loadmorePagerIsLoading = false

        $scope.getNextPageNumber = ->
          return $scope.loadmorePagerOptions.nextPageNumber

        $scope.loadMore = ->
          $scope.loadmorePagerIsLoading = true
          nextPageUrl = new Url()
          if not $scope.loadmorePagerOptions.reloadPageOneOnLoad
            nextPageUrl.query[$scope.loadmorePagerOptions.pageQueryStringAttribute] = $scope.getNextPageNumber()

          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: nextPageUrl.toString()
            },
            remoteElementSelector: $scope.loadmorePagerOptions.targetElementCssSelector
            targetElement: angular.element($scope.loadmorePagerOptions.targetElementCssSelector)
            $scope: $scope
            replace: $scope.loadmorePagerOptions.reloadPageOneOnLoad
            onHttpError: (response) ->
              console?.error? 'ERROR loading page', response
            onSuccess: ($remoteHtmlDocument) ->
#              console.log 'Success!', $remoteHtmlDocument
#              if $remoteHtmlDocument
              $element.addClass('django-cradmin-loadmorepager-hidden')
            onFinish: ->
              $scope.loadmorePagerIsLoading = false
          })

        return

      link: ($scope, $element, attributes) ->
        $scope.loadmorePagerOptions = {
          pageQueryStringAttribute: "page"
          reloadPageOneOnLoad: false
        }
        if attributes.djangoCradminLoadMorePager? and attributes.djangoCradminLoadMorePager != ''
          angular.extend($scope.loadmorePagerOptions, angular.fromJson(attributes.djangoCradminLoadMorePager))

        if not $scope.loadmorePagerOptions.targetElementCssSelector?
          throw Error('Missing required option: targetElementCssSelector')

        domId = $element.attr('id')
        djangoCradminLoadmorepagerCoordinator.registerPager(domId, $scope)
        $scope.$on "$destroy", ->
          djangoCradminLoadmorepagerCoordinator.unregisterPager(domId, $scope)

        if $scope.loadmorePagerOptions.reloadPageOneOnLoad
          # We assume the initial digest cycle does not take more than 500ms
          $timeout(->
            $scope.loadMore()
          500)

        return
    }
])
