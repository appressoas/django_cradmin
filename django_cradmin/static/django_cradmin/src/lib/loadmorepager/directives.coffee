angular.module('djangoCradmin.loadmorepager.directives', [])


.directive('djangoCradminLoadMorePager', [
  'djangoCradminBgReplaceElement'
  (djangoCradminBgReplaceElement) ->
    return {
      restrict: 'A',
      scope: true

      controller: ($scope, $element) ->
        $scope.loadmorePagerIsLoading = false
        $scope.loadmorePagerLastPage = 1

        $scope.loadMore = ->
          $scope.loadmorePagerIsLoading = true
          nextPageUrl = new Url()
          nextPageUrl.query[$scope.loadmorePagerOptions.pageQueryStringAttribute] = $scope.loadmorePagerLastPage + 1
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
            onSuccess: ->
              console.log 'Success!'
              $scope.loadmorePagerLastPage += 1
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

        if not $scope.loadmorePagerOptions.targetElementCssSelector?
          throw new Error('Missing required option: targetElementCssSelector')
        return
    }
])
