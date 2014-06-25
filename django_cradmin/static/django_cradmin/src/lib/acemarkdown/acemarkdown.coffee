angular.module('djangoCradmin.acemarkdown', [
  # 'ui.ace'
])

.directive 'djangoCradminAcemarkdown', ->
  return {
    restrict: 'A'
    transclude: true
    templateUrl: 'acemarkdown/acemarkdown.tpl.html'
    scope: {
      'config': '=djangoCradminAcemarkdown'
    }
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

    link: (scope, element) ->
      element.addClass('django-cradmin-acemarkdown')
      if scope.config.showTextarea
        element.addClass('django-cradmin-acemarkdown-textareavisible')

      theme = scope.config.theme
      if not theme
        theme = 'tomorrow'
      scope.editor.setTheme(theme)

  }

.directive 'djangoCradminAcemarkdownEditor', ->
  return {
    require: '^djangoCradminAcemarkdown'
    restrict: 'A'
    template: '<div></div>'
    scope: {}

    controller: ($scope) ->
      ###
      Set the value of the ace editor.

      Used by the djangoCradminAcemarkdownTextarea to set the
      initial value of the editor.
      ###
      $scope.setValue = (value) ->
        $scope.aceEditor.getSession().setValue(value)

      ###
      Focus on the ACE editor. Called when a user focuses
      on the djangoCradminAcemarkdownTextarea.
      ###
      $scope.focus = ->
        $scope.aceEditor.focus()

      ###
      Set the theme for the ACE editor.
      ###
      $scope.setTheme = (theme) ->
        $scope.aceEditor.setTheme("ace/theme/#{theme}")

      ###
      Triggered each time the aceEditor value changes.
      Updates the textarea with the current value of the
      ace editor.
      ###
      $scope.onChange = ->
        value = $scope.aceEditor.getSession().getValue()
        $scope.markdownCtrl.setTextAreaValue(value)

      return

    link: (scope, element, attrs, markdownCtrl) ->
      scope.markdownCtrl = markdownCtrl

      scope.aceEditor = ace.edit(element[0])
      scope.aceEditor.setHighlightActiveLine(false)
      scope.aceEditor.setShowPrintMargin(false)
      scope.aceEditor.renderer.setShowGutter(false)

      session = scope.aceEditor.getSession()
      session.setMode("ace/mode/markdown")
      session.setUseWrapMode(true)
      session.setUseSoftTabs(true)

      scope.aceEditor.on 'change', ->
        scope.onChange()

      markdownCtrl.setEditor(scope)
      return
  }

.directive 'djangoCradminAcemarkdownTextarea', ->
  return {
    require: '^djangoCradminAcemarkdown'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->

      ###
      Get the current value of the textarea.

      Used on load to initialize the ACE editor with the current
      value of the textarea.
      ###
      $scope.getValue = ->
        return $scope.textarea.val()

      ###
      Set the value of the textarea. Does nothing if the
      value is the same as the current value.

      Used by the djangoCradminAcemarkdownEditor to update the
      value of the textarea for each change in the editor.
      ###
      $scope.setValue = (value) ->
        if $scope.getValue() != value
          $scope.textarea.val(value)
      return

    link: (scope, element, attrs, markdownCtrl) ->
      scope.textarea = element
      scope.textarea.on 'focus', ->
        markdownCtrl.focusOnEditor()

      markdownCtrl.setTextarea(scope)
      return
  }
