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

    __getTargetScope: (targetDomId) ->
      targetScope = @targets[targetDomId]
      if not targetScope?
        throw Error("No target with ID '#{targetDomId}' registered with djangoCradminMultiselectCoordinator.")
      return targetScope

    select: (selectScope) ->
      targetScope = @__getTargetScope(selectScope.getTargetDomId())
      targetScope.select(selectScope)

    onDeselect: (selectButtonDomId) ->
      $selectElement = angular.element('#' + selectButtonDomId)
      if $selectElement?
        selectScope = $selectElement.isolateScope()
        selectScope.onDeselect()
        targetScope = @__getTargetScope(selectScope.getTargetDomId())
        targetScope.onDeselect(selectScope)
      else
        console.log "Element ##{selectButtonDomId} is not in the DOM"

    isSelected: (targetDomId, selectScope) ->
      targetScope = @__getTargetScope(targetDomId)
      return targetScope.isSelected(selectScope)


  return new Coordinator()
