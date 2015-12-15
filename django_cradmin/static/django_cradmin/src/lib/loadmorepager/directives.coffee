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

        $scope.loadMore = ->
          $scope.isLoading = true
          console.log 'loadMore'
          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: 'http://cradmin.dev:9000/multiselectdemo/filter/?page=2'
            },
            remoteElementSelector: '.django-cradmin-listbuilder-list'
            targetElement: angular.element('.django-cradmin-listbuilder-list')
            $scope: $scope
            replace: false
            onHttpError: (response) ->
              console.log 'ERROR', response
            onSuccess: ->
              console.log 'Success!'
            onFinish: ->
              console.log 'Finish!'
          })

        return

      link: ($scope, $element, attributes) ->
        return
    }
])
