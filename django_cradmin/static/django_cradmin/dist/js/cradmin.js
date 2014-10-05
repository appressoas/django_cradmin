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
            selectionRange.end.column += pre.length - newlines + emptyText.length;
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
  }).directive('djangoCradminAcemarkdownLink', [
    '$window', function($window) {
      return {
        require: '^djangoCradminAcemarkdown',
        restrict: 'A',
        scope: {
          'config': '=djangoCradminAcemarkdownLink'
        },
        link: function(scope, element, attr, markdownCtrl) {
          element.on('click', function(e) {
            var url;
            e.preventDefault();
            url = $window.prompt(scope.config.help, '');
            if (url != null) {
              return markdownCtrl.editorSurroundSelectionWith({
                pre: '[',
                post: "](" + url + ")",
                emptyText: scope.config.emptyText
              });
            }
          });
        }
      };
    }
  ]).directive('djangoCradminAcemarkdownTextarea', function() {
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
  }).directive('djangoCradminFormAction', function() {
    return {
      restrict: 'A',
      scope: {
        'value': '=djangoCradminFormAction'
      },
      controller: function($scope) {
        $scope.$watch('value', function(newValue) {
          return $scope.element.attr('action', newValue);
        });
      },
      link: function(scope, element, attrs) {
        scope.element = element;
      }
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.forms.modelchoicefield', []).directive('djangoCradminModelChoiceFieldWrapper', [
    '$window', function($window) {
      return {
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.origin = "" + window.location.protocol + "//" + window.location.host;
          this.setIframeWrapper = function(iframeWrapperScope) {
            return $scope.iframeWrapperScope = iframeWrapperScope;
          };
          this.setIframe = function(iframeScope) {
            return $scope.iframeScope = iframeScope;
          };
          this.setHiddenField = function(hiddenFieldScope) {
            return $scope.hiddenFieldScope = hiddenFieldScope;
          };
          this.onChangeValueBegin = function() {
            $scope.iframeScope.reset();
            return $scope.iframeWrapperScope.show();
          };
          $scope.onChangeValue = function(event) {
            var data;
            if (event.origin !== $scope.origin) {
              console.error("Message origin '" + event.origin + "' does not match current origin '" + $scope.origin + "'.");
              return;
            }
            data = angular.fromJson(event.data);
            $scope.hiddenFieldScope.setValue(data.selected_fieldid, data.selected_value);
            return $scope.iframeWrapperScope.hide();
          };
          $window.addEventListener('message', $scope.onChangeValue, false);
        },
        link: function(scope, element) {}
      };
    }
  ]).directive('djangoCradminModelChoiceFieldHiddenInput', [
    '$window', function($window) {
      return {
        require: '^djangoCradminModelChoiceFieldWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.setValue = function(fieldid, value) {
            if (fieldid !== $scope.hiddenInputFieldid) {
              return;
            }
            return $scope.hiddenInputElement.val(value);
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.hiddenInputElement = element;
          scope.hiddenInputFieldid = attrs.id;
          wrapperCtrl.setHiddenField(scope);
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldChangebeginButton', function() {
    return {
      require: '^djangoCradminModelChoiceFieldWrapper',
      restrict: 'A',
      scope: {},
      link: function(scope, element, attrs, wrapperCtrl) {
        element.on('click', function(e) {
          e.preventDefault();
          return wrapperCtrl.onChangeValueBegin();
        });
      }
    };
  }).directive('djangoCradminModelChoiceFieldIframeWrapper', [
    '$window', function($window) {
      return {
        require: '^djangoCradminModelChoiceFieldWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.bodyElement = angular.element($window.document.body);
          $scope.show = function() {
            $scope.iframeWrapperElement.removeClass('ng-hide');
            return $scope.bodyElement.addClass('django-cradmin-noscroll');
          };
          $scope.hide = function() {
            $scope.iframeWrapperElement.addClass('ng-hide');
            return $scope.bodyElement.removeClass('django-cradmin-noscroll');
          };
          this.closeIframe = function() {
            return $scope.hide();
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.iframeWrapperElement = element;
          wrapperCtrl.setIframeWrapper(scope);
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldIframeClosebutton', function() {
    return {
      require: '^djangoCradminModelChoiceFieldIframeWrapper',
      restrict: 'A',
      scope: {},
      link: function(scope, element, attrs, iframeWrapperCtrl) {
        element.on('click', function(e) {
          e.preventDefault();
          return iframeWrapperCtrl.closeIframe();
        });
      }
    };
  }).directive('djangoCradminModelChoiceFieldIframe', function() {
    return {
      require: '^djangoCradminModelChoiceFieldWrapper',
      restrict: 'A',
      scope: {
        src: '@djangoCradminModelChoiceFieldIframe'
      },
      controller: function($scope) {
        return $scope.reset = function() {
          return $scope.element.attr('src', $scope.src);
        };
      },
      link: function(scope, element, attrs, wrapperCtrl) {
        scope.element = element;
        wrapperCtrl.setIframe(scope);
      }
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.forms.usethisbutton', []).directive('djangoCradminUseThis', [
    '$window', function($window) {
      /*
      The django-cradmin-use-this directive is used to select elements for
      the ``django-cradmin-model-choice-field`` directive. You add this directive
      to a button or a-element within an iframe, and this directive will use
      ``window.postMessage`` to send the needed information to the
      ``django-cradmin-model-choice-field-wrapper``.
      
      You may also use this if you create your own custom iframe communication
      receiver directive where a "use this" button within an iframe is needed.
      
      Example
      =======
      ```
        <a class="btn btn-default" django-cradmin-use-this="Peter Pan" django-cradmin-fieldid="id_name">
          Use this
        </a>
      ```
      
      How it works
      ============
      When the user clicks an element with this directive, the click
      is captured, the default action is prevented, and we JSON encode
      the following:
      
      ```
      {
        postmessageid: 'django-cradmin-usethis',
        'selected_value': '<the value provided via the django-cradmin attribute>',
        'selected_fieldid': '<the fieldid provided via the django-cradmin-fieldid attribute>',
      }
      ```
      
      We assume there is a event listener listening for the ``message`` event on
      the message in the parent of the iframe where this was clicked, but no checks
      ensuring this is made.
      */

      return {
        restrict: 'A',
        scope: {
          'value': '@djangoCradminUseThis',
          'fieldid': '@djangoCradminFieldid',
          'selected_value': '@djangoCradminSelectedvalue'
        },
        link: function(scope, element, attrs) {
          element.on('click', function(e) {
            e.preventDefault();
            return $window.parent.postMessage(angular.toJson({
              postmessageid: 'django-cradmin-usethis',
              selected_fieldid: scope.fieldid,
              selected_value: scope.value
            }), window.parent.location.href);
          });
        }
      };
    }
  ]).directive('djangoCradminUseThisHidden', [
    '$window', function($window) {
      /*
      Works just like the ``django-cradmin-usethis`` directive, except this
      is intended to be triggered on load.
      
      The intended use-case is to trigger the same action as clicking a
      ``django-cradmin-usethis``-button but on load, typically after creating/adding
      a new item that the user wants to be selected without any further manual input.
      */

      return {
        restrict: 'A',
        scope: {
          'value': '@djangoCradminUseThisHidden',
          'fieldid': '@djangoCradminFieldid',
          'selected_value': '@djangoCradminSelectedvalue'
        },
        link: function(scope, element, attrs) {
          $window.parent.postMessage(angular.toJson({
            postmessageid: 'django-cradmin-usethis',
            selected_fieldid: scope.fieldid,
            selected_value: scope.value
          }), window.parent.location.href);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.imagepreview', []).directive('djangoCradminImagePreview', function() {
    /*
    A directive that shows a preview when an image field changes
    value.
    
    Components:
      - A wrapper (typically a DIV) using this directive (``django-cradmin-image-preview``)
      - An IMG element using the ``django-cradmin-image-preview-img`` directive. This is
        needed even if we have no initial image.
      - A file input field using the ``django-cradmin-image-preview-filefield`` directive.
    
    Example:
    
      <div django-cradmin-image-preview>
        <img django-cradmin-image-preview-img>
        <input type="file" name="myfile" django-cradmin-image-preview-filefield>
      </div>
    */

    var controller;
    controller = function($scope) {
      this.setImg = function(imgscope) {
        return $scope.img = imgscope;
      };
      this.previewFile = function(file) {
        return $scope.img.previewFile(file);
      };
    };
    return {
      restrict: 'A',
      scope: {},
      controller: controller
    };
  }).directive('djangoCradminImagePreviewImg', function() {
    var controller, link, onFilePreviewLoaded;
    onFilePreviewLoaded = function($scope, srcData) {
      $scope.element.attr('height', '');
      $scope.element[0].src = srcData;
      return $scope.element.removeClass('ng-hide');
    };
    controller = function($scope) {
      $scope.previewFile = function(file) {
        var reader;
        reader = new FileReader();
        reader.onload = function(evt) {
          return onFilePreviewLoaded($scope, evt.target.result);
        };
        return reader.readAsDataURL(file);
      };
    };
    link = function(scope, element, attrs, previewCtrl) {
      scope.element = element;
      previewCtrl.setImg(scope);
      if ((element.attr('src') == null) || element.attr('src') === '') {
        element.addClass('ng-hide');
      }
    };
    return {
      require: '^djangoCradminImagePreview',
      restrict: 'A',
      scope: {},
      controller: controller,
      link: link
    };
  }).directive('djangoCradminImagePreviewFilefield', function() {
    var link;
    link = function(scope, element, attrs, previewCtrl) {
      scope.previewCtrl = previewCtrl;
      scope.element = element;
      scope.wrapperelement = element.parent();
      element.bind('change', function(evt) {
        var file;
        if (evt.target.files != null) {
          file = evt.target.files[0];
          return scope.previewCtrl.previewFile(file);
        }
      });
      element.bind('mouseover', function() {
        return scope.wrapperelement.addClass('django_cradmin_filewidget_field_and_overlay_wrapper_hover');
      });
      element.bind('mouseleave', function() {
        return scope.wrapperelement.removeClass('django_cradmin_filewidget_field_and_overlay_wrapper_hover');
      });
    };
    return {
      require: '^djangoCradminImagePreview',
      restrict: 'A',
      scope: {},
      link: link
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin', ['djangoCradmin.templates', 'djangoCradmin.directives', 'djangoCradmin.menu', 'djangoCradmin.objecttable', 'djangoCradmin.acemarkdown', 'djangoCradmin.imagepreview', 'djangoCradmin.forms.modelchoicefield', 'djangoCradmin.forms.usethisbutton']);

}).call(this);

(function() {
  angular.module('djangoCradmin.menu', []).controller('CradminMenuController', function($scope) {
    $scope.displayMenu = false;
    return $scope.toggleNavigation = function() {
      return $scope.displayMenu = !$scope.displayMenu;
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.objecttable', []).controller('CradminMultiselectObjectTableViewController', [
    '$scope', function($scope) {
      $scope.selectAllChecked = false;
      $scope.numberOfSelected = 0;
      $scope.selectedAction = null;
      $scope.setCheckboxValue = function(itemkey, value) {
        return $scope.items[itemkey] = value;
      };
      $scope.getCheckboxValue = function(itemkey) {
        return $scope.items[itemkey];
      };
      $scope.toggleAllCheckboxes = function() {
        $scope.selectAllChecked = !$scope.selectAllChecked;
        $scope.numberOfSelected = 0;
        return angular.forEach($scope.items, function(checked, itemkey) {
          $scope.setCheckboxValue(itemkey, $scope.selectAllChecked);
          if ($scope.selectAllChecked) {
            return $scope.numberOfSelected += 1;
          }
        });
      };
      return $scope.toggleCheckbox = function(itemkey) {
        var newvalue;
        newvalue = !$scope.getCheckboxValue(itemkey);
        $scope.setCheckboxValue(itemkey, newvalue);
        if (newvalue) {
          return $scope.numberOfSelected += 1;
        } else {
          $scope.numberOfSelected -= 1;
          return $scope.selectAllChecked = false;
        }
      };
    }
  ]);

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
