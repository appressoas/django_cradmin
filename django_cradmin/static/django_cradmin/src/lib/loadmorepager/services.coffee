angular.module('djangoCradmin.loadmorepager.services', [])


.factory 'djangoCradminLoadmorepagerCoordinator', ->
  ###
  Coordinates between djangoCradminLoadMorePager directives.
  ###
  class Coordinator
    constructor: ->
      @targets = {}

    registerPager: (targetDomId, pagerScope) ->
      if not @targets[targetDomId]?
        @targets[targetDomId] = {}
      @targets[targetDomId][pagerScope.getNextPageNumber()] = pagerScope

    unregisterPager: (targetDomId, pagerScope) ->
      del @targets[targetDomId][pagerScope.getNextPageNumber()]

    __getPagerScope: (targetDomId, nextPageNumber) ->
      target = @targets[targetDomId]
      if not target?
        throw Error("No target with ID '#{targetDomId}' registered with djangoCradminLoadmorepagerCoordinator.")
      pagerScope = target[nextPageNumber]
      if not pagerScope?
        throw Error("No pagerScope for targetDomId='#{targetDomId}' and nextPageNumber=#{nextPageNumber} " +
          "registered with djangoCradminLoadmorepagerCoordinator.")
      return pagerScope

  return new Coordinator()
