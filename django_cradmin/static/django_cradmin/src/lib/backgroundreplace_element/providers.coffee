angular.module('djangoCradmin.backgroundreplace_element.providers', [])


.provider 'djangoCradminBgReplaceElement', ->
  ###
  Makes a request to a an URL, and replaces or extends a DOM element
  on the current page with the same DOM element within
  the requested URL.

  Can be used for many things, such as:

  - Infinite scroll (append content from ``?page=<pagenumber>``).
  - Live filtering (replace the filtered list when a filter changes).
  ###
  class BgReplace
    constructor: ($http, $compile) ->
      @http = $http
      @compile = $compile

    loadUrlAndExtractRemoteElementHtml: (options, onSuccess) ->
      @http(options.parameters).then((response) ->
        html = response.data
        $remoteHtmlDocument = angular.element(html)
        remoteElement = $remoteHtmlDocument.find(options.remoteElementSelector)
        remoteElementInnerHtml = remoteElement.html()
        onSuccess(remoteElementInnerHtml, $remoteHtmlDocument)
      , (response) ->
        if options.onHttpError?
          options.onHttpError(response)
        else
          console?.error? "Failed to load", options.parameters
        if options.onFinish?
          options.onFinish()
      )

    updateTargetElement: (options, remoteElementInnerHtml, $remoteHtmlDocument) =>
      $compile = @compile
      linkingFunction = $compile(remoteElementInnerHtml)
      loadedElement = linkingFunction(options.$scope)
      if options.replace
        options.targetElement.empty()
      options.targetElement.append(loadedElement)
      if options.onSuccess
        options.onSuccess($remoteHtmlDocument)
      if options.onFinish?
        options.onFinish()

    load: (options) ->
      me = @
      @loadUrlAndExtractRemoteElementHtml options, (remoteElementInnerHtml, $remoteHtmlDocument) ->
        me.updateTargetElement(options, remoteElementInnerHtml, $remoteHtmlDocument)

  @$get = (['$http', '$compile', ($http, $compile) ->
    return new BgReplace($http, $compile)
  ])

  return @
