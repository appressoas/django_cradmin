(function() {
  angular.module('djangoCradmin.acemarkdown', []).directive('djangoCradminAcemarkdown', function() {
    return {
      restrict: 'A',
      transclude: true,
      templateUrl: 'acemarkdown/acemarkdown.tpl.html',
      scope: {
        'config': '=djangoCradminAcemarkdown'
      },
      controller: function($scope) {
        this.setEditor = function(editorScope) {
          $scope.editor = editorScope;
          $scope.editor.aceEditor.on('focus', function() {
            return $scope.element.addClass('cradmin-focus');
          });
          return $scope.editor.aceEditor.on('blur', function() {
            return $scope.element.removeClass('cradmin-focus');
          });
        };
        this.setTextarea = function(textareaScope) {
          $scope.textarea = textareaScope;
          return $scope.editor.setValue($scope.textarea.getValue());
        };
        this.setTextAreaValue = function(value) {
          return $scope.textarea.setValue(value);
        };
        this.focusOnEditor = function() {
          return $scope.editor.focus();
        };
        this.editorSurroundSelectionWith = function(options) {
          return $scope.editor.surroundSelectionWith(options);
        };
      },
      link: function(scope, element) {
        var theme;
        scope.element = element;
        if (scope.config.showTextarea) {
          element.addClass('cradmin-acemarkdown-textareavisible');
        }
        theme = scope.config.theme;
        if (!theme) {
          theme = 'tomorrow';
        }
        return scope.editor.setTheme(theme);
      }
    };
  }).directive('djangoCradminAcemarkdownEditor', function() {
    return {
      require: '^djangoCradminAcemarkdown',
      restrict: 'A',
      template: '<div></div>',
      scope: {},
      controller: function($scope) {
        /*
        Set the value of the ace editor.
        
        Used by the djangoCradminAcemarkdownTextarea to set the
        initial value of the editor.
        */

        $scope.setValue = function(value) {
          return $scope.aceEditor.getSession().setValue(value);
        };
        /*
        Focus on the ACE editor. Called when a user focuses
        on the djangoCradminAcemarkdownTextarea.
        */

        $scope.focus = function() {
          return $scope.aceEditor.focus();
        };
        /*
        Set the theme for the ACE editor.
        */

        $scope.setTheme = function(theme) {
          return $scope.aceEditor.setTheme("ace/theme/" + theme);
        };
        /*
        Triggered each time the aceEditor value changes.
        Updates the textarea with the current value of the
        ace editor.
        */

        $scope.onChange = function() {
          var value;
          value = $scope.aceEditor.getSession().getValue();
          return $scope.markdownCtrl.setTextAreaValue(value);
        };
        $scope.surroundSelectionWith = function(options) {
          var emptyText, newlines, noSelection, post, pre, selectedText, selectionRange;
          pre = options.pre, post = options.post, emptyText = options.emptyText;
          if (emptyText == null) {
            emptyText = '';
          }
          if (pre == null) {
            pre = '';
          }
          if (post == null) {
            post = '';
          }
          selectionRange = $scope.aceEditor.getSelectionRange();
          selectedText = $scope.aceEditor.session.getTextRange(selectionRange);
          noSelection = selectedText === '';
          if (noSelection) {
            selectedText = emptyText;
          }
          $scope.aceEditor.insert("" + pre + selectedText + post);
          if (noSelection) {
            newlines = pre.split('\n').length - 1;
            selectionRange.start.row += newlines;
            selectionRange.end.row = selectionRange.start.row;
            selectionRange.start.column += pre.length - newlines;
            selectionRange.end.column += selectionRange.start.column + emptyText.length;
            $scope.aceEditor.getSelection().setSelectionRange(selectionRange);
          }
          return $scope.aceEditor.focus();
        };
      },
      link: function(scope, element, attrs, markdownCtrl) {
        var session;
        scope.markdownCtrl = markdownCtrl;
        scope.aceEditor = ace.edit(element[0]);
        scope.aceEditor.setHighlightActiveLine(false);
        scope.aceEditor.setShowPrintMargin(false);
        scope.aceEditor.renderer.setShowGutter(false);
        session = scope.aceEditor.getSession();
        session.setMode("ace/mode/markdown");
        session.setUseWrapMode(true);
        session.setUseSoftTabs(true);
        scope.aceEditor.on('change', function() {
          return scope.onChange();
        });
        markdownCtrl.setEditor(scope);
      }
    };
  }).directive('djangoCradminAcemarkdownTool', function() {
    return {
      require: '^djangoCradminAcemarkdown',
      restrict: 'A',
      scope: {
        'config': '=djangoCradminAcemarkdownTool'
      },
      link: function(scope, element, attr, markdownCtrl) {
        element.on('click', function(e) {
          e.preventDefault();
          return markdownCtrl.editorSurroundSelectionWith(scope.config);
        });
      }
    };
  }).directive('djangoCradminAcemarkdownTextarea', function() {
    return {
      require: '^djangoCradminAcemarkdown',
      restrict: 'A',
      scope: {},
      controller: function($scope) {
        /*
        Get the current value of the textarea.
        
        Used on load to initialize the ACE editor with the current
        value of the textarea.
        */

        $scope.getValue = function() {
          return $scope.textarea.val();
        };
        /*
        Set the value of the textarea. Does nothing if the
        value is the same as the current value.
        
        Used by the djangoCradminAcemarkdownEditor to update the
        value of the textarea for each change in the editor.
        */

        $scope.setValue = function(value) {
          if ($scope.getValue() !== value) {
            return $scope.textarea.val(value);
          }
        };
      },
      link: function(scope, element, attrs, markdownCtrl) {
        scope.textarea = element;
        scope.textarea.addClass('cradmin-acemarkdowntextarea');
        scope.textarea.on('focus', function() {
          return markdownCtrl.focusOnEditor();
        });
        markdownCtrl.setTextarea(scope);
      }
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.directives', []).directive('djangoCradminBack', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          history.back();
          return scope.$apply();
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin', ['djangoCradmin.templates', 'djangoCradmin.directives', 'djangoCradmin.menu', 'djangoCradmin.acemarkdown', 'djangoCradmin.wysihtml']);

}).call(this);

(function() {
  angular.module('djangoCradmin.menu', []).controller('CradminMenuController', function($scope) {
    $scope.displayMenu = false;
    return $scope.toggleNavigation = function() {
      return $scope.displayMenu = !$scope.displayMenu;
    };
  });

}).call(this);

angular.module('djangoCradmin.templates', ['acemarkdown/acemarkdown.tpl.html']);

angular.module("acemarkdown/acemarkdown.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("acemarkdown/acemarkdown.tpl.html",
    "<div ng-transclude></div>");
}]);

(function() {
  angular.module('djangoCradmin.wysihtml', []).directive('djangoCradminWysihtml', function() {
    return {
      restrict: 'A',
      transclude: true,
      template: '<div><p>Stuff is awesome!</p><div ng-transclude></div></div>'
    };
  });

}).call(this);
