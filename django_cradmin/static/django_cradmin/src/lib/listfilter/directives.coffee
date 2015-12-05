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
        loadInProgress = false

        @loadIsInProgress = ->
          return loadInProgress

        @onLoadSuccess = ($remoteHtmlDocument, remoteUrl) =>
          $remoteFilterList = $remoteHtmlDocument.find('#' + filterListDomId)
          title = $window.document.title
          $window.history.pushState("list filter change", title, remoteUrl)
          for filterScope in filterScopes
            filterScope.syncWithRemoteFilterList($remoteFilterList)

        @load = (options) ->
          loadInProgress = true
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
              if options.onLoadSuccess?
                options.onLoadSuccess(options.onLoadSuccessData)
            onFinish: ->
              loadInProgress = false
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
      require: '^djangoCradminListfilter'
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


.directive('djangoCradminListfilterTextinput', [
  '$timeout'
  ($timeout) ->
    urlpatternAttribute = 'django-cradmin-listfilter-urlpattern'
    urlpatternReplaceText = '_-_TEXTINPUT_-_VALUE_-_'

    return {
      restrict: 'A',
      require: '^djangoCradminListfilter'
      scope: {
        options: '=djangoCradminListfilterTextinput'
      }

      controller: ($scope, $element) ->

        ###
        Update the "django-cradmin-listfilter-urlpattern"-attribute with
        the one from the server.
        ###
        $scope.syncWithRemoteFilterList = ($remoteFilterList) ->
          domId = $element.attr('id')
          $remoteElement = $remoteFilterList.find('#' + domId)
          $element.attr(urlpatternAttribute,
            $remoteElement.attr(urlpatternAttribute))

        return

      link: ($scope, $element, attributes, listfilterCtrl) ->
        listfilterCtrl.addFilterScope($scope)
        applySearchTimer = null
        loadedValue = $element.val()
        timeoutMilliseconds = $scope.options.timeout_milliseconds
        if not timeoutMilliseconds?
          timeoutMilliseconds = 500

        buildUrl = (value) ->
          urlpattern = $element.attr(urlpatternAttribute)
          return urlpattern.replace(urlpatternReplaceText, value)

        onLoadSearchSuccess = (data) ->
          currentValue = $element.val()
          if data.value != currentValue
            onValueChange(true)
          loadedValue = data.value

        loadSearch = ->
          if listfilterCtrl.loadIsInProgress()
            return

          value = $element.val()
          if loadedValue == value
            return

#          console.log 'Search for', value
          remoteUrl = buildUrl(value)
          loadedValue = value
          listfilterCtrl.load({
            remoteUrl: remoteUrl
            onLoadSuccess: onLoadSearchSuccess
            onLoadSuccessData: {
              value: value
            }
          })

        onValueChange = (useTimeout) ->
          if applySearchTimer?
            $timeout.cancel(applySearchTimer)
          if not listfilterCtrl.loadIsInProgress()
            if useTimeout
              applySearchTimer = $timeout(loadSearch, timeoutMilliseconds)
            else
              loadSearch()

        $element.on 'change', ->
          onValueChange(false)

        $element.on 'keydown', (e) ->
          if e.which == 13
            # ENTER/RETURN was pressed, load search instantly
            onValueChange(false)
          else
            onValueChange(true)
        return
    }
])
