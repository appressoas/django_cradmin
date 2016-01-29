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

        $scope.pagerLoad = (options) ->
          options = angular.extend({}, $scope.loadmorePagerOptions, options)
          $scope.loadmorePagerIsLoading = true
          $targetElement = angular.element(options.targetElementCssSelector)

          replaceMode = false
          nextPageUrl = new Url()
          if options.mode == "reloadPageOneOnLoad"
            replaceMode = true
          else if options.mode == "loadAllOnClick"
            replaceMode = true
            nextPageUrl.query.disablePaging = "true"
          else
            nextPageUrl.query[options.pageQueryStringAttribute] = $scope.getNextPageNumber()

          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: nextPageUrl.toString()
            },
            remoteElementSelector: options.targetElementCssSelector
            targetElement: $targetElement
            $scope: $scope
            replace: replaceMode
            onHttpError: (response) ->
              console?.error? 'ERROR loading page', response
            onSuccess: ($remoteHtmlDocument) ->
#              console.log 'Success!', $remoteHtmlDocument
#              if $remoteHtmlDocument
              if options.mode == "reloadPageOneOnLoad"
                $targetElement.removeClass('django-cradmin-loadmorepager-target-reloading-page1')
              else
                $element.addClass('django-cradmin-loadmorepager-hidden')

              if options.onSuccess?
                options.onSuccess()

            onFinish: ->
              $scope.loadmorePagerIsLoading = false
          })

        return

      link: ($scope, $element, attributes) ->
        $scope.loadmorePagerOptions = {
          pageQueryStringAttribute: "page"
          mode: "loadMoreOnClick"
        }
        if attributes.djangoCradminLoadMorePager? and attributes.djangoCradminLoadMorePager != ''
          angular.extend($scope.loadmorePagerOptions, angular.fromJson(attributes.djangoCradminLoadMorePager))

        if not $scope.loadmorePagerOptions.targetElementCssSelector?
          throw Error('Missing required option: targetElementCssSelector')

        domId = $element.attr('id')
        djangoCradminLoadmorepagerCoordinator.registerPager(domId, $scope)
        $scope.$on "$destroy", ->
          djangoCradminLoadmorepagerCoordinator.unregisterPager(domId, $scope)

        if $scope.loadmorePagerOptions.mode == "reloadPageOneOnLoad"
          # We assume the initial digest cycle does not take more than 500ms
          $timeout(->
            $scope.pagerLoad()
          500)

        return
    }
])
