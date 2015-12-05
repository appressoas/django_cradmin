angular.module('djangoCradmin.listfilter.directives', [])


.directive('djangoCradminListfilter', [
  '$window', 'djangoCradminBgReplaceElement',
  ($window, djangoCradminBgReplaceElement) ->
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope, $element) ->
        filterListDomId = $element.attr('id')
        filterScopes = []

        @onLoadSuccess = ($remoteHtmlDocument, remoteUrl) =>
          $remoteFilterList = $remoteHtmlDocument.find('#' + filterListDomId)
          title = $window.document.title
          $window.history.pushState("list filter change", title, remoteUrl)
          for filterScope in filterScopes
            filterScope.syncWithRemoteFilterList($remoteFilterList)

        @load = (options) ->
          me = @
          djangoCradminBgReplaceElement.load({
            parameters: {
              method: 'GET'
              url: options.remoteUrl
            },
            remoteElementSelector: $scope.remoteElementSelector
            targetElement: $scope.targetElement
            $scope: $scope
            replace: true
            onHttpError: (response) ->
              console.log 'ERROR', response
            onSuccess: ($remoteHtmlDocument) ->
              me.onLoadSuccess($remoteHtmlDocument, options.remoteUrl)
#            onFinish: ->
#              console.log 'Finish!'
          })

        @addFilterScope = (filterScope) ->
          filterScopes.push(filterScope)

        return

      link: ($scope, $element, attributes) ->
        $scope.remoteElementSelector = attributes.djangoCradminListfilter
        $scope.targetElement = angular.element($scope.remoteElementSelector)
        return
    }
])


.directive('djangoCradminListfilterSelect', [
  ->
    return {
      restrict: 'A',
      require: '^?djangoCradminListfilter'
      scope: {}

      controller: ($scope, $element) ->

        ###
        Replace all <option>-elements with new <option>-elements from the server.
        ###
        $scope.syncWithRemoteFilterList = ($remoteFilterList) ->
          domId = $element.attr('id')
          $remoteElement = $remoteFilterList.find('#' + domId)
          $element.empty()
          $element.append(angular.element($remoteElement.html()))

        return

      link: ($scope, $element, attributes, listfilterCtrl) ->
        listfilterCtrl.addFilterScope($scope)

        getValue = ->
          $element.find("option:selected").attr('value')

        $element.on 'change', ->
          remoteUrl = getValue()
          listfilterCtrl.load({
            remoteUrl: remoteUrl
          })
        return
    }
])
