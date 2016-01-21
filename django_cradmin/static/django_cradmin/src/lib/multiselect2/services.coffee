angular.module('djangoCradmin.multiselect2.services', [])


.factory 'djangoCradminMultiselect2Coordinator', ->
  ###
  Coordinates between djangoCradminMultiselect2Select
  and djangoCradminMultiselect2Target.
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
        throw Error("No target with ID '#{targetDomId}' registered with djangoCradminMultiselect2Coordinator.")
      return targetScope

    targetScopeExists: (targetDomId) ->
      return @targets[targetDomId]?

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
