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

    deselect: (selectButtonDomId) ->
      $selectElement = angular.element('#' + selectButtonDomId)
      if $selectElement?
        selectScope = $selectElement.isolateScope()
        selectScope.onDeselect()
      else
        console.log "Element ##{selectButtonDomId} is not in the DOM"

  return new Coordinator()
