angular.module('djangoCradmin.loadmorepager.directives', [])


.directive('djangoCradminLoadMorePager', [
  'djangoCradminBgReplaceElement'
  (djangoCradminBgReplaceElement) ->
    return {
      restrict: 'A',
      scope: true

      controller: ($scope, $element) ->
        console.log 'djangoCradminLoadMorePager'
        $scope.isLoading = false
        $scope.lastPage = 1

        $scope.loadMore = ->
          $scope.isLoading = true
          nextPageUrl = new Url()
          nextPageUrl.query.page = $scope.lastPage + 1
          console.log 'loading', nextPageUrl.toString()

          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: nextPageUrl.toString()
            },
            remoteElementSelector: '.django-cradmin-listbuilder-list'
            targetElement: angular.element('.django-cradmin-listbuilder-list')
            $scope: $scope
            replace: false
            onHttpError: (response) ->
              console.log 'ERROR', response
            onSuccess: ->
              console.log 'Success!'
              $scope.lastPage += 1
            onFinish: ->
              console.log 'Finish!'
              $scope.isLoading = false
          })

        return

      link: ($scope, $element, attributes) ->
        return
    }
])
