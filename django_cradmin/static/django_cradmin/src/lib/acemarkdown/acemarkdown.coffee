angular.module('djangoCradmin.acemarkdown', [
  # 'ui.ace'
])

.directive 'djangoCradminAcemarkdown', ->
  return {
    restrict: 'A'
    transclude: true
    templateUrl: 'acemarkdown/acemarkdown.tpl.html'
    scope: {}
    controller: ($scope) ->
      @setEditor = (editorScope) ->
        $scope.editor = editorScope
      @setTextarea = (textareaScope) ->
        $scope.textarea = textareaScope
        $scope.editor.setValue($scope.textarea.getValue())
      @setTextAreaValue = (value) ->
        $scope.textarea.setValue(value)
      @focusOnEditor = ->
        $scope.editor.focus()
      return
  }

.directive 'djangoCradminAcemarkdownEditor', ->
  return {
    require: '^djangoCradminAcemarkdown'
    restrict: 'A'
    template: '<div></div>'
    scope: {}
    link: (scope, element, attrs, markdownCtrl) ->
      scope.aceEditor = ace.edit(element[0])
      scope.aceEditor.on 'change', ->
        value = scope.aceEditor.getSession().getValue()
        markdownCtrl.setTextAreaValue(value)
      markdownCtrl.setEditor(scope)

    controller: ($scope) ->
      # console.log('editor scope', $scope)
      $scope.setValue = (value) ->
        console.log 'editor setValue', value
        $scope.aceEditor.getSession().setValue(value)
      $scope.focus = ->
        $scope.aceEditor.focus()
      return
  }

.directive 'djangoCradminAcemarkdownTextarea', ->
  return {
    require: '^djangoCradminAcemarkdown'
    restrict: 'A'
    scope: {}
    link: (scope, element, attrs, markdownCtrl) ->
      scope.textarea = element
      markdownCtrl.setTextarea(scope)
      scope.textarea.on 'focus', ->
        markdownCtrl.focusOnEditor()

    controller: ($scope) ->
      $scope.setValue = (value) ->
        console.log 'textarea setValue:', value
      $scope.getValue = ->
        return $scope.textarea.val()
      $scope.setValue = (value) ->
        if $scope.getValue() != value
          $scope.textarea.val(value)
      return
  }
