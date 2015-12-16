angular.module('djangoCradmin.loadmorepager.directives', [])


.directive('djangoCradminLoadMorePager', [
  'djangoCradminBgReplaceElement', 'djangoCradminLoadmorepagerCoordinator'
  (djangoCradminBgReplaceElement, djangoCradminLoadmorepagerCoordinator) ->

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
          nextPageUrl.query[$scope.loadmorePagerOptions.pageQueryStringAttribute] = $scope.getNextPageNumber()
          console.log 'loading', nextPageUrl.toString()

          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: nextPageUrl.toString()
            },
            remoteElementSelector: $scope.loadmorePagerOptions.targetElementCssSelector
            targetElement: angular.element($scope.loadmorePagerOptions.targetElementCssSelector)
            $scope: $scope
            replace: false
            onHttpError: (response) ->
              console.log 'ERROR', response
            onSuccess: ($remoteHtmlDocument) ->
              console.log 'Success!'
#              console.log 'Success!', $remoteHtmlDocument
#              if $remoteHtmlDocument
              $element.addClass('django-cradmin-loadmorepager-hidden')
            onFinish: ->
              console.log 'Finish!'
              $scope.loadmorePagerIsLoading = false
          })

        return

      link: ($scope, $element, attributes) ->
        $scope.loadmorePagerOptions = {
          pageQueryStringAttribute: "page"
        }
        if attributes.djangoCradminLoadMorePager? and attributes.djangoCradminLoadMorePager != ''
          angular.extend($scope.loadmorePagerOptions, angular.fromJson(attributes.djangoCradminLoadMorePager))
        console.log $scope.loadmorePagerOptions

        if not $scope.loadmorePagerOptions.targetElementCssSelector?
          throw Error('Missing required option: targetElementCssSelector')

        domId = $element.attr('id')
        djangoCradminLoadmorepagerCoordinator.registerPager(domId, $scope)
        $scope.$on "$destroy", ->
          djangoCradminLoadmorepagerCoordinator.unregisterPager(domId, $scope)

        return
    }
])
