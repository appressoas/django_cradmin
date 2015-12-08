angular.module('djangoCradmin.multiselect.services', [])


.factory 'djangoCradminMultiselectCoordinator', ->
  ###
  Coordinates between djangoCradminMultiselectSelect
  and djangoCradminMultiselectTarget.
  ###
  class Coordinator
    constructor: ->
      @targets = {}

    registerTarget: (targetDomId, targetScope) ->
      @targets[targetDomId] = targetScope

    unregisterTarget: (targetDomId, targetScope) ->
      del @targets[targetDomId]

    select: (targetDomId, selectScope) ->
      targetScope = @targets[targetDomId]
      if not targetScope?
        throw Error("No target with ID '#{targetDomId}' registered with djangoCradminMultiselectCoordinator.")
      targetScope.select(selectScope)

  return new Coordinator()



