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
  angular.module('djangoCradmin.backgroundreplace_element.directives', []).directive('djangoCradminBgReplaceElementOnPageLoad', [
    '$window', 'djangoCradminBgReplaceElement', function($window, djangoCradminBgReplaceElement) {
      return {
        restrict: 'A',
        controller: function($scope, $element) {},
        link: function($scope, $element, attributes) {
          var remoteElementSelector, remoteUrl;
          remoteElementSelector = attributes.djangoCradminRemoteElementSelector;
          remoteUrl = attributes.djangoCradminRemoteUrl;
          if (remoteElementSelector == null) {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.error === "function") {
                console.error("You must include the 'django-cradmin-remote-element-id' attribute.");
              }
            }
          }
          if (remoteUrl == null) {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.error === "function") {
                console.error("You must include the 'django-cradmin-remote-url' attribute.");
              }
            }
          }
          angular.element(document).ready(function() {
            console.log('load', remoteUrl, remoteElementSelector);
            return djangoCradminBgReplaceElement.load({
              parameters: {
                method: 'GET',
                url: remoteUrl
              },
              remoteElementSelector: remoteElementSelector,
              targetElement: $element,
              $scope: $scope,
              replace: true,
              onHttpError: function(response) {
                return console.log('ERROR', response);
              },
              onSuccess: function() {
                return console.log('Success!');
              },
              onFinish: function() {
                return console.log('Finish!');
              }
            });
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('djangoCradmin.backgroundreplace_element.providers', []).provider('djangoCradminBgReplaceElement', function() {
    /*
    Makes a request to a an URL, and replaces or extends a DOM element
    on the current page with the same DOM element within
    the requested URL.
    
    Can be used for many things, such as:
    
    - Infinite scroll (append content from ``?page=<pagenumber>``).
    - Live filtering (replace the filtered list when a filter changes).
    */

    var BgReplace;
    BgReplace = (function() {
      function BgReplace($http, $compile) {
        this.updateTargetElement = __bind(this.updateTargetElement, this);
        this.http = $http;
        this.compile = $compile;
      }

      BgReplace.prototype.loadUrlAndExtractRemoteElementHtml = function(options, onSuccess) {
        return this.http(options.parameters).then(function(response) {
          var $remoteHtmlDocument, html, remoteElement, remoteElementInnerHtml;
          html = response.data;
          $remoteHtmlDocument = angular.element(html);
          remoteElement = $remoteHtmlDocument.find(options.remoteElementSelector);
          remoteElementInnerHtml = remoteElement.html();
          return onSuccess(remoteElementInnerHtml, $remoteHtmlDocument);
        }, function(response) {
          if (options.onFinish != null) {
            options.onFinish();
          }
          if (options.onHttpError != null) {
            return options.onHttpError(response);
          } else {
            return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error("Failed to load", options.parameters) : void 0 : void 0;
          }
        });
      };

      BgReplace.prototype.updateTargetElement = function(options, remoteElementInnerHtml, $remoteHtmlDocument) {
        var $compile, linkingFunction, loadedElement;
        $compile = this.compile;
        linkingFunction = $compile(remoteElementInnerHtml);
        loadedElement = linkingFunction(options.$scope);
        if (options.replace) {
          options.targetElement.empty();
        }
        options.targetElement.append(loadedElement);
        if (options.onFinish != null) {
          options.onFinish();
        }
        if (options.onSuccess) {
          return options.onSuccess($remoteHtmlDocument);
        }
      };

      BgReplace.prototype.load = function(options) {
        var me;
        me = this;
        return this.loadUrlAndExtractRemoteElementHtml(options, function(remoteElementInnerHtml, $remoteHtmlDocument) {
          return me.updateTargetElement(options, remoteElementInnerHtml, $remoteHtmlDocument);
        });
      };

      return BgReplace;

    })();
    this.$get = [
      '$http', '$compile', function($http, $compile) {
        return new BgReplace($http, $compile);
      }
    ];
    return this;
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.bulkfileupload', ['angularFileUpload', 'ngCookies']).provider('cradminBulkfileuploadCoordinator', function() {
    var FileUploadCoordinator;
    FileUploadCoordinator = (function() {
      function FileUploadCoordinator($window) {
        this.hiddenfieldnameToScopeMap = {};
        this.window = $window;
      }

      FileUploadCoordinator.prototype.register = function(hiddenfieldname, scope) {
        var existingScope;
        existingScope = this.hiddenfieldnameToScopeMap[hiddenfieldname];
        if (existingScope != null) {
          console.error('Trying to register a fieldname that is already registered with ' + 'cradminBulkfileuploadCoordinator. Fieldname:', hiddenfieldname);
          return;
        }
        return this.hiddenfieldnameToScopeMap[hiddenfieldname] = scope;
      };

      FileUploadCoordinator.prototype.unregister = function(hiddenfieldname) {
        var scope;
        scope = this.hiddenfieldnameToScopeMap[hiddenfieldname];
        if (scope == null) {
          console.error('Trying to unregister a field that is not registered with ' + 'cradminBulkfileuploadCoordinator. Fieldname:', hiddenfieldname);
        }
        return this.hiddenfieldnameToScopeMap[hiddenfieldname] = void 0;
      };

      FileUploadCoordinator.prototype._getScope = function(hiddenfieldname) {
        var scope;
        scope = this.hiddenfieldnameToScopeMap[hiddenfieldname];
        if (scope == null) {
          console.error('Trying to get a field that is not registered with ' + 'cradminBulkfileuploadCoordinator. Fieldname:', hiddenfieldname);
        }
        return scope;
      };

      FileUploadCoordinator.prototype.showOverlayForm = function(hiddenfieldname) {
        var scope;
        scope = this._getScope(hiddenfieldname);
        return scope.formController.showOverlay();
      };

      return FileUploadCoordinator;

    })();
    this.$get = [
      '$window', function($window) {
        return new FileUploadCoordinator($window);
      }
    ];
    return this;
  }).factory('cradminBulkfileupload', function() {
    var FileInfo;
    FileInfo = (function() {
      function FileInfo(options) {
        this.file = options.file;
        this.autosubmit = options.autosubmit;
        this.i18nStrings = options.i18nStrings;
        this.temporaryfileid = options.temporaryfileid;
        if (this.file != null) {
          this.name = this.file.name;
        } else {
          this.name = options.name;
        }
        this.isRemoving = false;
        this.percent = options.percent;
        if (options.finished) {
          this.finished = true;
        } else {
          this.finished = false;
        }
        if (options.hasErrors) {
          this.hasErrors = true;
        } else {
          this.hasErrors = false;
        }
        this.errors = options.errors;
      }

      FileInfo.prototype.markAsIsRemoving = function() {
        return this.isRemoving = true;
      };

      FileInfo.prototype.markAsIsNotRemoving = function() {
        return this.isRemoving = false;
      };

      FileInfo.prototype.updatePercent = function(percent) {
        return this.percent = percent;
      };

      FileInfo.prototype.finish = function(temporaryfile, singlemode) {
        var index;
        this.finished = true;
        index = 0;
        this.file = void 0;
        this.temporaryfileid = temporaryfile.id;
        return this.name = temporaryfile.filename;
      };

      FileInfo.prototype.setErrors = function(errors) {
        this.hasErrors = true;
        return this.errors = errors;
      };

      FileInfo.prototype.indexOf = function(fileInfo) {
        return this.files.indexOf(fileInfo);
      };

      FileInfo.prototype.remove = function(index) {
        return this.files.splice(index, 1);
      };

      return FileInfo;

    })();
    return {
      createFileInfo: function(options) {
        return new FileInfo(options);
      }
    };
  }).directive('djangoCradminBulkfileuploadForm', [
    function() {
      /*
      A form containing ``django-cradmin-bulkfileupload`` fields
      must use this directive.
      */

      return {
        restrict: 'AE',
        scope: {},
        controller: function($scope) {
          $scope._inProgressCounter = 0;
          $scope._submitButtonScopes = [];
          $scope._setSubmitButtonsInProgress = function() {
            var buttonScope, _i, _len, _ref, _results;
            _ref = $scope._submitButtonScopes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              buttonScope = _ref[_i];
              _results.push(buttonScope.setNotInProgress());
            }
            return _results;
          };
          $scope._setSubmitButtonsNotInProgress = function() {
            var buttonScope, _i, _len, _ref, _results;
            _ref = $scope._submitButtonScopes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              buttonScope = _ref[_i];
              _results.push(buttonScope.setInProgress());
            }
            return _results;
          };
          this.addInProgress = function() {
            $scope._inProgressCounter += 1;
            if ($scope._inProgressCounter === 1) {
              return $scope._setSubmitButtonsInProgress();
            }
          };
          this.removeInProgress = function() {
            if ($scope._inProgressCounter === 0) {
              throw new Error("It should not be possible to get _inProgressCounter below 0");
            }
            $scope._inProgressCounter -= 1;
            if ($scope._inProgressCounter === 0) {
              return $scope._setSubmitButtonsNotInProgress();
            }
          };
          this.addSubmitButtonScope = function(submitButtonScope) {
            return $scope._submitButtonScopes.push(submitButtonScope);
          };
          this.addSubmitButtonScope = function(submitButtonScope) {
            return $scope._submitButtonScopes.push(submitButtonScope);
          };
          this.registerOverlayControls = function(overlayControlsScope) {
            return $scope._overlayControlsScope = overlayControlsScope;
          };
          this.registerOverlayUploadingmessageScope = function(overlayUploadingmessageScope) {
            return $scope._overlayUploadingmessageScope = overlayUploadingmessageScope;
          };
          this.submitForm = function() {
            if ($scope.overlay) {
              $scope._overlayUploadingmessageScope.onSubmitForm();
            }
            return $scope.element.submit();
          };
          $scope._showOverlay = function() {
            if ($scope.overlay) {
              return $scope.wrapperElement.addClass('django-cradmin-bulkfileupload-overlaywrapper-show');
            } else {
              throw new Error('Can only show the overlay if the form has the ' + 'django-cradmin-bulkfileupload-form-overlay="true" attribute.');
            }
          };
          this.showOverlay = function() {
            return $scope._showOverlay();
          };
          this.hideOverlay = function() {
            if ($scope.overlay) {
              return $scope.wrapperElement.removeClass('django-cradmin-bulkfileupload-overlaywrapper-show');
            } else {
              throw new Error('Can only hide the overlay if the form has the ' + 'django-cradmin-bulkfileupload-form-overlay="true" attribute.');
            }
          };
        },
        link: function($scope, element, attr, uploadController) {
          var body;
          $scope.overlay = attr.djangoCradminBulkfileuploadFormOverlay === 'true';
          $scope.preventWindowDragdrop = attr.djangoCradminBulkfileuploadFormPreventWindowDragdrop !== 'false';
          $scope.openOverlayOnWindowDragdrop = attr.djangoCradminBulkfileuploadFormOpenOverlayOnWindowDragdrop === 'true';
          $scope.element = element;
          if ($scope.overlay) {
            element.addClass('django-cradmin-bulkfileupload-form-overlay');
            body = angular.element('body');
            $scope.wrapperElement = angular.element('<div></div>');
            $scope.wrapperElement.addClass('django-cradmin-bulkfileupload-overlaywrapper');
            $scope.wrapperElement.appendTo(body);
            element.appendTo($scope.wrapperElement);
            $scope._overlayControlsScope.element.appendTo($scope.wrapperElement);
            if (element.find('.has-error').length > 0) {
              $scope._showOverlay();
            }
            if ($scope.preventWindowDragdrop) {
              window.addEventListener("dragover", function(e) {
                return e.preventDefault();
              }, false);
              window.addEventListener("drop", function(e) {
                return e.preventDefault();
              }, false);
            }
            window.addEventListener("dragover", function(e) {
              e.preventDefault();
              $scope.wrapperElement.addClass('django-cradmin-bulkfileupload-overlaywrapper-window-dragover');
              if ($scope.openOverlayOnWindowDragdrop) {
                return $scope._showOverlay();
              }
            }, false);
            window.addEventListener("drop", function(e) {
              e.preventDefault();
              return $scope.wrapperElement.removeClass('django-cradmin-bulkfileupload-overlaywrapper-window-dragover');
            }, false);
            angular.element('body').on('mouseleave', function(e) {
              return $scope.wrapperElement.removeClass('django-cradmin-bulkfileupload-overlaywrapper-window-dragover');
            });
          }
          element.on('submit', function(evt) {
            if ($scope._inProgressCounter !== 0) {
              return evt.preventDefault();
            }
          });
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadSubmit', [
    function() {
      return {
        require: '^djangoCradminBulkfileuploadForm',
        restrict: 'A',
        scope: true,
        controller: function($scope) {
          $scope.inProgress = false;
          $scope.setInProgress = function() {
            $scope.element.prop('disabled', false);
            return $scope.inProgress = false;
          };
          return $scope.setNotInProgress = function() {
            $scope.element.prop('disabled', true);
            return $scope.inProgress = true;
          };
        },
        link: function(scope, element, attr, formController) {
          scope.element = element;
          formController.addSubmitButtonScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileupload', [
    '$upload', '$cookies', 'cradminDetectize', 'cradminBulkfileuploadCoordinator', function($upload, $cookies, cradminDetectize, cradminBulkfileuploadCoordinator) {
      return {
        require: '^djangoCradminBulkfileuploadForm',
        restrict: 'AE',
        scope: true,
        controller: function($scope) {
          var validateSelectedFiles;
          $scope.collectionid = null;
          $scope.cradminLastFilesSelectedByUser = [];
          $scope.fileUploadQueue = [];
          $scope.firstUploadInProgress = false;
          $scope.simpleWidgetScope = null;
          $scope.advancedWidgetScope = null;
          $scope.rejectedFilesScope = null;
          this.setInProgressOrFinishedScope = function(inProgressOrFinishedScope) {
            return $scope.inProgressOrFinishedScope = inProgressOrFinishedScope;
          };
          this.setFileUploadFieldScope = function(fileUploadFieldScope, fieldname) {
            $scope.fileUploadFieldScope = fileUploadFieldScope;
            return cradminBulkfileuploadCoordinator.register(fileUploadFieldScope.fieldname, $scope);
          };
          this.setSimpleWidgetScope = function(simpleWidgetScope) {
            $scope.simpleWidgetScope = simpleWidgetScope;
            return $scope._showAppropriateWidget();
          };
          this.setAdvancedWidgetScope = function(advancedWidgetScope) {
            $scope.advancedWidgetScope = advancedWidgetScope;
            return $scope._showAppropriateWidget();
          };
          this.setRejectFilesScope = function(rejectedFilesScope) {
            return $scope.rejectedFilesScope = rejectedFilesScope;
          };
          this.getUploadUrl = function() {
            return $scope.uploadapiurl;
          };
          this.getCollectionId = function() {
            return $scope.collectionid;
          };
          this.onAdvancedWidgetDragLeave = function() {
            return $scope.formController.onAdvancedWidgetDragLeave();
          };
          $scope._hideUploadWidget = function() {
            $scope.simpleWidgetScope.hide();
            return $scope.advancedWidgetScope.hide();
          };
          $scope._showAppropriateWidget = function() {
            var deviceType;
            if ($scope.advancedWidgetScope && $scope.simpleWidgetScope) {
              deviceType = cradminDetectize.device.type;
              if (deviceType === 'desktop') {
                $scope.simpleWidgetScope.hide();
                return $scope.advancedWidgetScope.show();
              } else {
                $scope.advancedWidgetScope.hide();
                return $scope.simpleWidgetScope.show();
              }
            }
          };
          $scope.filesDropped = function(files, evt, rejectedFiles) {
            /*
            Called when a file is draggen&dropped into the widget.
            */

            if (rejectedFiles.length > 0) {
              return $scope.rejectedFilesScope.setRejectedFiles(rejectedFiles, 'invalid_filetype', $scope.i18nStrings);
            }
          };
          validateSelectedFiles = function() {
            var file, filesToUpload, _i, _len, _ref;
            filesToUpload = [];
            _ref = $scope.cradminLastFilesSelectedByUser;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              file = _ref[_i];
              if ($scope.apiparameters.max_filesize_bytes) {
                if (file.size > $scope.apiparameters.max_filesize_bytes) {
                  $scope.rejectedFilesScope.addRejectedFile(file, 'max_filesize_bytes_exceeded', $scope.i18nStrings);
                  continue;
                }
              }
              filesToUpload.push(file);
            }
            if ($scope.rejectedFilesScope.hasRejectedFiles() && $scope.autosubmit) {
              return [];
            }
            return filesToUpload;
          };
          $scope.$watch('cradminLastFilesSelectedByUser', function() {
            var file, filesToUpload, _i, _len;
            if ($scope.cradminLastFilesSelectedByUser.length > 0) {
              $scope.rejectedFilesScope.clearRejectedFiles();
              filesToUpload = validateSelectedFiles();
              if (filesToUpload.length > 0) {
                if ($scope.autosubmit) {
                  $scope._hideUploadWidget();
                }
                for (_i = 0, _len = filesToUpload.length; _i < _len; _i++) {
                  file = filesToUpload[_i];
                  $scope._addFileToQueue(file);
                  if ($scope.apiparameters.singlemode) {
                    break;
                  }
                }
              }
              return $scope.cradminLastFilesSelectedByUser = [];
            }
          });
          $scope._addFileToQueue = function(file) {
            var progressFileInfo;
            if ($scope.apiparameters.singlemode) {
              $scope.inProgressOrFinishedScope.clear();
            }
            progressFileInfo = $scope.inProgressOrFinishedScope.addFileInfo({
              percent: 0,
              file: file,
              autosubmit: $scope.autosubmit,
              i18nStrings: $scope.i18nStrings
            });
            $scope.fileUploadQueue.push(progressFileInfo);
            if ($scope.firstUploadInProgress) {
              return;
            }
            if ($scope.collectionid === null) {
              $scope.firstUploadInProgress = true;
            }
            return $scope._processFileUploadQueue();
          };
          $scope._onFileUploadComplete = function(successful) {
            /*
            Called both on file upload success and error
            */

            $scope.firstUploadInProgress = false;
            $scope.formController.removeInProgress();
            if ($scope.fileUploadQueue.length > 0) {
              return $scope._processFileUploadQueue();
            } else if ($scope.autosubmit) {
              if (successful) {
                return $scope.formController.submitForm();
              } else {
                return $scope._showAppropriateWidget();
              }
            }
          };
          $scope._processFileUploadQueue = function() {
            var apidata, progressFileInfo;
            progressFileInfo = $scope.fileUploadQueue.shift();
            apidata = angular.extend({}, $scope.apiparameters, {
              collectionid: $scope.collectionid
            });
            $scope.formController.addInProgress();
            return $scope.upload = $upload.upload({
              url: $scope.uploadapiurl,
              method: 'POST',
              data: apidata,
              file: progressFileInfo.file,
              fileFormDataName: 'file',
              headers: {
                'X-CSRFToken': $cookies.get('csrftoken'),
                'Content-Type': 'multipart/form-data'
              }
            }).progress(function(evt) {
              return progressFileInfo.updatePercent(parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
              progressFileInfo.finish(data.temporaryfiles[0], $scope.apiparameters.singlemode);
              $scope._setCollectionId(data.collectionid);
              return $scope._onFileUploadComplete(true);
            }).error(function(data, status) {
              console.log(data);
              if (status === 503) {
                progressFileInfo.setErrors({
                  file: [
                    {
                      message: $scope.errormessage503
                    }
                  ]
                });
              } else {
                progressFileInfo.setErrors(data);
              }
              $scope.inProgressOrFinishedScope.removeFileInfo(progressFileInfo);
              $scope.rejectedFilesScope.addRejectedFileInfo(progressFileInfo);
              return $scope._onFileUploadComplete(false);
            });
          };
          $scope._setCollectionId = function(collectionid) {
            $scope.collectionid = collectionid;
            return $scope.fileUploadFieldScope.setCollectionId(collectionid);
          };
        },
        link: function($scope, element, attributes, formController) {
          var options;
          options = angular.fromJson(attributes.djangoCradminBulkfileupload);
          $scope.uploadapiurl = options.uploadapiurl;
          $scope.apiparameters = options.apiparameters;
          $scope.errormessage503 = options.errormessage503;
          $scope.autosubmit = options.autosubmit;
          $scope.i18nStrings = {
            close_errormessage_label: options.close_errormessage_label,
            remove_file_label: options.remove_file_label,
            removing_file_message: options.removing_file_message
          };
          $scope.formController = formController;
          $scope.$on('$destroy', function() {
            if ($scope.fileUploadFieldScope != null) {
              return cradminBulkfileuploadCoordinator.unregister($scope.fileUploadFieldScope.fieldname);
            }
          });
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadRejectedFiles', [
    'cradminBulkfileupload', function(cradminBulkfileupload) {
      /*
      This directive is used to show files that are rejected on drop because
      of wrong mimetype. Each time a user drops one or more file with invalid
      mimetype, this template is re-rendered and displayed.
      */

      return {
        restrict: 'A',
        require: '^djangoCradminBulkfileupload',
        templateUrl: 'bulkfileupload/rejectedfiles.tpl.html',
        transclude: true,
        scope: {
          errorMessageMap: '=djangoCradminBulkfileuploadRejectedFiles'
        },
        controller: function($scope) {
          $scope.rejectedFiles = [];
          $scope.clearRejectedFiles = function() {
            return $scope.rejectedFiles = [];
          };
          $scope.addRejectedFileInfo = function(fileInfo, errormessagecode) {
            return $scope.rejectedFiles.push(fileInfo);
          };
          $scope.addRejectedFile = function(file, errormessagecode, i18nStrings) {
            return $scope.addRejectedFileInfo(cradminBulkfileupload.createFileInfo({
              file: file,
              hasErrors: true,
              i18nStrings: i18nStrings,
              errors: {
                files: [
                  {
                    message: $scope.errorMessageMap[errormessagecode]
                  }
                ]
              }
            }));
          };
          $scope.hasRejectedFiles = function() {
            return $scope.rejectedFiles.length > 0;
          };
          $scope.setRejectedFiles = function(rejectedFiles, errormessagecode, i18nStrings) {
            var file, _i, _len, _results;
            $scope.clearRejectedFiles();
            _results = [];
            for (_i = 0, _len = rejectedFiles.length; _i < _len; _i++) {
              file = rejectedFiles[_i];
              _results.push($scope.addRejectedFile(file, errormessagecode, i18nStrings));
            }
            return _results;
          };
          return $scope.closeMessage = function(fileInfo) {
            var index;
            index = $scope.rejectedFiles.indexOf(fileInfo);
            if (index !== -1) {
              return $scope.rejectedFiles.splice(index, 1);
            }
          };
        },
        link: function(scope, element, attr, bulkfileuploadController) {
          bulkfileuploadController.setRejectFilesScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadProgress', [
    'cradminBulkfileupload', '$http', '$cookies', function(cradminBulkfileupload, $http, $cookies) {
      return {
        restrict: 'AE',
        require: '^djangoCradminBulkfileupload',
        templateUrl: 'bulkfileupload/progress.tpl.html',
        scope: {},
        controller: function($scope) {
          $scope.fileInfoArray = [];
          $scope.removeFileInfo = function(fileInfo) {
            var fileInfoIndex;
            fileInfoIndex = $scope.fileInfoArray.indexOf(fileInfo);
            if (fileInfoIndex !== -1) {
              return $scope.fileInfoArray.splice(fileInfoIndex, 1);
            } else {
              throw new Error("Could not find requested fileInfo with temporaryfileid=" + fileInfo.temporaryfileid + ".");
            }
          };
          this.removeFile = function(fileInfo) {
            if (fileInfo.temporaryfileid == null) {
              throw new Error("Can not remove files without a temporaryfileid");
            }
            fileInfo.markAsIsRemoving();
            $scope.$apply();
            return $http({
              url: $scope.uploadController.getUploadUrl(),
              method: 'DELETE',
              headers: {
                'X-CSRFToken': $cookies.get('csrftoken')
              },
              data: {
                collectionid: $scope.uploadController.getCollectionId(),
                temporaryfileid: fileInfo.temporaryfileid
              }
            }).success(function(data, status, headers, config) {
              return $scope.removeFileInfo(fileInfo);
            }).error(function(data, status, headers, config) {
              if (typeof console !== "undefined" && console !== null) {
                if (typeof console.error === "function") {
                  console.error('ERROR', data);
                }
              }
              alert('An error occurred while removing the file. Please try again.');
              return fileInfo.markAsIsNotRemoving();
            });
          };
          $scope.addFileInfo = function(options) {
            var fileInfo;
            fileInfo = cradminBulkfileupload.createFileInfo(options);
            $scope.fileInfoArray.push(fileInfo);
            return fileInfo;
          };
          $scope.clear = function(options) {
            return $scope.fileInfoArray = [];
          };
          $scope.clearErrors = function() {
            var fileInfo, index, _i, _ref, _results;
            _results = [];
            for (index = _i = _ref = $scope.fileInfoArray.length - 1; _i >= 0; index = _i += -1) {
              fileInfo = $scope.fileInfoArray[index];
              if (fileInfo.hasErrors) {
                _results.push($scope.fileInfoArray.splice(index, 1));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        },
        link: function(scope, element, attr, uploadController) {
          scope.uploadController = uploadController;
          uploadController.setInProgressOrFinishedScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkFileInfo', [
    function() {
      /**
      Renders a single file info with progress info, errors, etc.
      
      Used both the djangoCradminBulkfileuploadProgress directive.
      */

      return {
        restrict: 'AE',
        scope: {
          fileInfo: '=djangoCradminBulkFileInfo'
        },
        templateUrl: 'bulkfileupload/fileinfo.tpl.html',
        transclude: true,
        controller: function($scope) {
          this.close = function() {
            return $scope.element.remove();
          };
        },
        link: function(scope, element, attr) {
          scope.element = element;
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadErrorCloseButton', [
    function() {
      return {
        restrict: 'A',
        require: '^djangoCradminBulkFileInfo',
        scope: {},
        link: function(scope, element, attr, fileInfoController) {
          element.on('click', function(evt) {
            evt.preventDefault();
            return fileInfoController.close();
          });
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadRemoveFileButton', [
    function() {
      return {
        restrict: 'A',
        require: '^djangoCradminBulkfileuploadProgress',
        scope: {
          'fileInfo': '=djangoCradminBulkfileuploadRemoveFileButton'
        },
        link: function(scope, element, attr, progressController) {
          element.on('click', function(evt) {
            evt.preventDefault();
            return progressController.removeFile(scope.fileInfo);
          });
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadCollectionidField', [
    function() {
      return {
        require: '^djangoCradminBulkfileupload',
        restrict: 'AE',
        scope: {},
        controller: function($scope) {
          $scope.setCollectionId = function(collectionid) {
            return $scope.element.val("" + collectionid);
          };
        },
        link: function(scope, element, attr, uploadController) {
          scope.element = element;
          scope.fieldname = attr.name;
          uploadController.setFileUploadFieldScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadAdvancedWidget', [
    '$timeout', function($timeout) {
      return {
        require: '^djangoCradminBulkfileupload',
        restrict: 'AE',
        scope: {},
        link: function(scope, element, attr, uploadController) {
          scope.hide = function() {
            return element.css('display', 'none');
          };
          scope.show = function() {
            return element.css('display', 'block');
          };
          uploadController.setAdvancedWidgetScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadSimpleWidget', [
    function() {
      return {
        require: '^djangoCradminBulkfileupload',
        restrict: 'AE',
        scope: {},
        link: function(scope, element, attr, uploadController) {
          scope.hide = function() {
            return element.css('display', 'none');
          };
          scope.show = function() {
            return element.css('display', 'block');
          };
          uploadController.setSimpleWidgetScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadShowOverlay', [
    'cradminBulkfileuploadCoordinator', function(cradminBulkfileuploadCoordinator) {
      return {
        restrict: 'AE',
        scope: {
          hiddenfieldname: '@djangoCradminBulkfileuploadShowOverlay'
        },
        link: function($scope, element, attr) {
          element.on('click', function() {
            return cradminBulkfileuploadCoordinator.showOverlayForm($scope.hiddenfieldname);
          });
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadHideOverlay', [
    function() {
      return {
        restrict: 'AE',
        require: '^djangoCradminBulkfileuploadForm',
        scope: {
          hiddenfieldname: '@djangoCradminBulkfileuploadHideOverlay'
        },
        link: function($scope, element, attr, uploadFormController) {
          element.on('click', function() {
            return uploadFormController.hideOverlay();
          });
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadOverlayControls', [
    function() {
      return {
        restrict: 'AE',
        require: '^djangoCradminBulkfileuploadForm',
        scope: {},
        link: function($scope, element, attr, uploadFormController) {
          $scope.element = element;
          uploadFormController.registerOverlayControls($scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadOverlayUploadingmessage', [
    function() {
      return {
        restrict: 'AE',
        require: '^djangoCradminBulkfileuploadForm',
        scope: {},
        controller: function($scope) {
          $scope.onSubmitForm = function() {
            return $scope.element.addClass('django-cradmin-bulkfileupload-overlay-uploadingmessage-visible');
          };
        },
        link: function($scope, element, attr, uploadFormController) {
          $scope.element = element;
          uploadFormController.registerOverlayUploadingmessageScope($scope);
        }
      };
    }
  ]);

}).call(this);

(function() {
  var app;

  app = angular.module('djangoCradmin.calendar.providers', []);

  app.provider('djangoCradminCalendarApi', function() {
    /**
    Get an array of the short names for all the weekdays
    in the current locale, in the the correct order for the
    current locale.
    */

    var CalendarCoordinator, CalendarDay, CalendarMonth, CalendarWeek, Month, MonthlyCalendarCoordinator, getWeekdaysShortForCurrentLocale;
    getWeekdaysShortForCurrentLocale = function() {
      var firstDayOfWeek, index, weekday, weekdays, weekdaysWithSundayFirst, _i, _ref;
      weekdays = [];
      weekdaysWithSundayFirst = moment.weekdaysShort();
      firstDayOfWeek = moment.localeData().firstDayOfWeek();
      for (index = _i = firstDayOfWeek, _ref = firstDayOfWeek + 6; firstDayOfWeek <= _ref ? _i <= _ref : _i >= _ref; index = firstDayOfWeek <= _ref ? ++_i : --_i) {
        if (index > 6) {
          index = Math.abs(7 - index);
        }
        weekday = weekdaysWithSundayFirst[index];
        weekdays.push(weekday);
      }
      return weekdays;
    };
    Month = (function() {
      function Month(firstDayOfMonth) {
        this.firstDayOfMonth = firstDayOfMonth;
        this.lastDayOfMonth = this.firstDayOfMonth.clone().add({
          days: this.firstDayOfMonth.daysInMonth() - 1
        });
      }

      Month.prototype.getDaysInMonth = function() {
        return this.firstDayOfMonth.daysInMonth();
      };

      return Month;

    })();
    CalendarDay = (function() {
      function CalendarDay(momentObject, isInCurrentMonth, isDisabled, nowMomentObject) {
        this.momentObject = momentObject;
        this.isInCurrentMonth = isInCurrentMonth;
        this.nowMomentObject = nowMomentObject;
        this._isDisabled = isDisabled;
      }

      CalendarDay.prototype.getNumberInMonth = function() {
        return this.momentObject.format('D');
      };

      CalendarDay.prototype.isToday = function() {
        return this.momentObject.isSame(this.nowMomentObject, 'day');
      };

      CalendarDay.prototype.isDisabled = function() {
        return this._isDisabled;
      };

      return CalendarDay;

    })();
    CalendarWeek = (function() {
      function CalendarWeek() {
        this.calendarDays = [];
      }

      CalendarWeek.prototype.addDay = function(calendarDay) {
        return this.calendarDays.push(calendarDay);
      };

      CalendarWeek.prototype.getDayCount = function() {
        return this.calendarDays.length;
      };

      CalendarWeek.prototype.prettyOneLineFormat = function() {
        var calendarDay, formattedDay, formattedDays, _i, _len, _ref;
        formattedDays = [];
        _ref = this.calendarDays;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          calendarDay = _ref[_i];
          formattedDay = calendarDay.momentObject.format('DD');
          if (calendarDay.isInCurrentMonth) {
            formattedDay = " " + formattedDay + " ";
          } else {
            formattedDay = "(" + formattedDay + ")";
          }
          formattedDays.push(formattedDay);
        }
        return formattedDays.join(' ');
      };

      return CalendarWeek;

    })();
    CalendarMonth = (function() {
      function CalendarMonth(calendarCoordinator, momentObject) {
        this.calendarCoordinator = calendarCoordinator;
        this.changeMonth(momentObject);
      }

      CalendarMonth.prototype.changeMonth = function(momentObject) {
        var firstDayOfMonthMomentObject;
        firstDayOfMonthMomentObject = momentObject.clone().set({
          date: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0
        });
        this.month = new Month(firstDayOfMonthMomentObject);
        this.calendarWeeks = [new CalendarWeek()];
        this.currentWeekIndex = 0;
        this.daysPerWeek = 7;
        this.totalWeeks = 6;
        this.currentDayCount = 0;
        this.lastDay = null;
        return this.__build();
      };

      CalendarMonth.prototype.__buildPrefixedDays = function() {
        var index, momentObject, _i, _ref, _results;
        if (this.month.firstDayOfMonth.weekday() > 0) {
          _results = [];
          for (index = _i = _ref = this.month.firstDayOfMonth.weekday(); _ref <= 1 ? _i <= 1 : _i >= 1; index = _ref <= 1 ? ++_i : --_i) {
            momentObject = this.month.firstDayOfMonth.clone().subtract({
              days: index
            });
            _results.push(this.__addMomentObject(momentObject, false));
          }
          return _results;
        }
      };

      CalendarMonth.prototype.__buildSuffixedDays = function() {
        var momentObject, totalDayCount, _results;
        totalDayCount = this.totalWeeks * this.daysPerWeek;
        _results = [];
        while (this.currentDayCount < totalDayCount) {
          momentObject = this.lastDay.momentObject.clone().add({
            days: 1
          });
          _results.push(this.__addMomentObject(momentObject, false));
        }
        return _results;
      };

      CalendarMonth.prototype.__buildDaysBelongingInMonth = function() {
        var dayIndex, momentObject, _i, _ref, _results;
        _results = [];
        for (dayIndex = _i = 1, _ref = this.month.getDaysInMonth(); 1 <= _ref ? _i <= _ref : _i >= _ref; dayIndex = 1 <= _ref ? ++_i : --_i) {
          momentObject = this.month.firstDayOfMonth.clone().date(dayIndex);
          _results.push(this.__addMomentObject(momentObject, true));
        }
        return _results;
      };

      CalendarMonth.prototype.__build = function(momentFirstDayOfMonth) {
        this.__buildPrefixedDays();
        this.__buildDaysBelongingInMonth();
        return this.__buildSuffixedDays();
      };

      CalendarMonth.prototype.__addMomentObject = function(momentObject, isInCurrentMonth) {
        var calendarDay, isDisabled, week;
        week = this.calendarWeeks[this.currentWeekIndex];
        if (week.getDayCount() >= this.daysPerWeek) {
          this.calendarWeeks.push(new CalendarWeek());
          this.currentWeekIndex += 1;
          week = this.calendarWeeks[this.currentWeekIndex];
        }
        isDisabled = !this.calendarCoordinator.momentObjectIsAllowed(momentObject);
        calendarDay = new CalendarDay(momentObject, isInCurrentMonth, isDisabled, this.calendarCoordinator.nowMomentObject);
        week.addDay(calendarDay);
        this.currentDayCount += 1;
        return this.lastDay = calendarDay;
      };

      CalendarMonth.prototype.prettyprint = function() {
        var rowFormatted, week, _i, _len, _ref, _results;
        _ref = this.calendarWeeks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          week = _ref[_i];
          rowFormatted = [];
          _results.push(typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(week.prettyOneLineFormat()) : void 0 : void 0);
        }
        return _results;
      };

      return CalendarMonth;

    })();
    /**
    Coordinates the common calendar data no matter what kind of
    view we present.
    */

    CalendarCoordinator = (function() {
      function CalendarCoordinator(_arg) {
        this.selectedMomentObject = _arg.selectedMomentObject, this.minimumDatetime = _arg.minimumDatetime, this.maximumDatetime = _arg.maximumDatetime, this.nowMomentObject = _arg.nowMomentObject;
        if (this.selectedMomentObject != null) {
          this.shownMomentObject = this.selectedMomentObject.clone();
        } else {
          this.setToNow();
          if (!this.momentObjectIsAllowed(this.shownMomentObject)) {
            this.shownMomentObject = this.minimumDatetime.clone();
          }
        }
      }

      CalendarCoordinator.prototype.selectShownValue = function() {
        return this.selectedMomentObject = this.shownMomentObject.clone();
      };

      CalendarCoordinator.prototype.clearSelectedMomentObject = function() {
        return this.selectedMomentObject = null;
      };

      CalendarCoordinator.prototype.momentObjectIsAllowed = function(momentObject, ignoreTime) {
        var isAllowed, maximumDatetime, minimumDatetime;
        if (ignoreTime == null) {
          ignoreTime = true;
        }
        isAllowed = true;
        if (this.minimumDatetime != null) {
          minimumDatetime = this.minimumDatetime;
          if (ignoreTime) {
            minimumDatetime = minimumDatetime.clone().set({
              hour: 0,
              minute: 0,
              second: 0
            });
          }
          isAllowed = !momentObject.isBefore(minimumDatetime);
        }
        if (isAllowed && (this.maximumDatetime != null)) {
          maximumDatetime = this.maximumDatetime;
          if (ignoreTime) {
            maximumDatetime = maximumDatetime.clone().set({
              hour: 23,
              minute: 59,
              second: 59
            });
          }
          isAllowed = !momentObject.isAfter(maximumDatetime);
        }
        return isAllowed;
      };

      CalendarCoordinator.prototype.todayIsValidValue = function() {
        return this.momentObjectIsAllowed(this.nowMomentObject);
      };

      CalendarCoordinator.prototype.nowIsValidValue = function() {
        return this.momentObjectIsAllowed(this.nowMomentObject, false);
      };

      CalendarCoordinator.prototype.shownDateIsToday = function() {
        return this.shownMomentObject.isSame(this.nowMomentObject, 'day');
      };

      CalendarCoordinator.prototype.shownDateIsTodayAndNowIsValid = function() {
        return this.shownDateIsToday() && this.nowIsValidValue();
      };

      CalendarCoordinator.prototype.setToNow = function() {
        return this.shownMomentObject = this.nowMomentObject.clone();
      };

      return CalendarCoordinator;

    })();
    /**
    Coordinates the common calendar data for a month-view.
    */

    MonthlyCalendarCoordinator = (function() {
      function MonthlyCalendarCoordinator(_arg) {
        this.calendarCoordinator = _arg.calendarCoordinator, this.yearselectValues = _arg.yearselectValues, this.hourselectValues = _arg.hourselectValues, this.minuteselectValues = _arg.minuteselectValues, this.yearFormat = _arg.yearFormat, this.monthFormat = _arg.monthFormat, this.dayOfMonthSelectFormat = _arg.dayOfMonthSelectFormat, this.dayOfMonthTableCellFormat = _arg.dayOfMonthTableCellFormat, this.hourFormat = _arg.hourFormat, this.minuteFormat = _arg.minuteFormat;
        this.dayobjects = null;
        this.__initWeekdays();
        this.__initMonthObjects();
        this.__initYearObjects();
        this.__initHourObjects();
        this.__initMinuteObjects();
        this.__changeSelectedDate();
      }

      MonthlyCalendarCoordinator.prototype.__sortConfigObjectsByValue = function(configObjects) {
        var compareFunction;
        compareFunction = function(a, b) {
          if (a.value < b.value) {
            return -1;
          }
          if (a.value > b.value) {
            return 1;
          }
          return 0;
        };
        return configObjects.sort(compareFunction);
      };

      MonthlyCalendarCoordinator.prototype.__initWeekdays = function() {
        return this.shortWeekdays = getWeekdaysShortForCurrentLocale();
      };

      MonthlyCalendarCoordinator.prototype.__initYearObjects = function() {
        var formatMomentObject, hasSelectedYearValue, label, selectedYearValue, year, yearConfig, _i, _len, _ref;
        selectedYearValue = this.calendarCoordinator.shownMomentObject.year();
        hasSelectedYearValue = false;
        formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
          month: 0,
          date: 0,
          hour: 0,
          minute: 0,
          second: 0
        });
        this.__yearsMap = {};
        this.yearselectConfig = [];
        _ref = this.yearselectValues;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          year = _ref[_i];
          label = formatMomentObject.set({
            year: year
          }).format(this.yearFormat);
          yearConfig = {
            value: year,
            label: label
          };
          this.yearselectConfig.push(yearConfig);
          this.__yearsMap[year] = yearConfig;
          if (year === selectedYearValue) {
            hasSelectedYearValue = true;
          }
        }
        if (!hasSelectedYearValue) {
          label = formatMomentObject.set({
            year: selectedYearValue
          }).format(this.yearFormat);
          yearConfig = {
            value: selectedYearValue,
            label: label
          };
          this.yearselectConfig.push(yearConfig);
          this.__yearsMap[yearConfig.value] = yearConfig;
          return this.__sortConfigObjectsByValue(this.yearselectConfig);
        }
      };

      MonthlyCalendarCoordinator.prototype.__initMonthObjects = function() {
        var formatMomentObject, label, monthObject, monthnumber, _i, _results;
        this.monthselectConfig = [];
        this.__monthsMap = {};
        formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
          month: 0,
          date: 0,
          hour: 0,
          minute: 0,
          second: 0
        });
        _results = [];
        for (monthnumber = _i = 0; _i <= 11; monthnumber = ++_i) {
          label = formatMomentObject.set({
            month: monthnumber
          }).format(this.monthFormat);
          monthObject = {
            value: monthnumber,
            label: label
          };
          this.monthselectConfig.push(monthObject);
          _results.push(this.__monthsMap[monthnumber] = monthObject);
        }
        return _results;
      };

      MonthlyCalendarCoordinator.prototype.__initHourObjects = function() {
        var formatMomentObject, hasSelectedHourValue, hour, hourConfig, label, selectedHourValue, _i, _len, _ref;
        selectedHourValue = this.calendarCoordinator.shownMomentObject.hour();
        hasSelectedHourValue = false;
        formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
          minute: 0,
          second: 0
        });
        this.__hoursMap = {};
        this.hourselectConfig = [];
        _ref = this.hourselectValues;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          hour = _ref[_i];
          label = formatMomentObject.set({
            hour: hour
          }).format(this.hourFormat);
          hourConfig = {
            value: hour,
            label: label
          };
          this.hourselectConfig.push(hourConfig);
          this.__hoursMap[hourConfig.value] = hourConfig;
          if (hourConfig.value === selectedHourValue) {
            hasSelectedHourValue = true;
          }
        }
        if (!hasSelectedHourValue) {
          label = formatMomentObject.set({
            hour: selectedHourValue
          }).format(this.hourFormat);
          hourConfig = {
            value: selectedHourValue,
            label: label
          };
          this.hourselectConfig.push(hourConfig);
          this.__hoursMap[hourConfig.value] = hourConfig;
          return this.__sortConfigObjectsByValue(this.hourselectConfig);
        }
      };

      MonthlyCalendarCoordinator.prototype.__initMinuteObjects = function() {
        var formatMomentObject, hasSelectedMinuteValue, label, minute, minuteConfig, selectedMinuteValue, _i, _len, _ref;
        selectedMinuteValue = this.calendarCoordinator.shownMomentObject.minute();
        hasSelectedMinuteValue = false;
        formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
          second: 0
        });
        this.__minutesMap = {};
        this.minuteselectConfig = [];
        _ref = this.minuteselectValues;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          minute = _ref[_i];
          label = formatMomentObject.set({
            minute: minute
          }).format(this.minuteFormat);
          minuteConfig = {
            value: minute,
            label: label
          };
          this.minuteselectConfig.push(minuteConfig);
          this.__minutesMap[minuteConfig.value] = minuteConfig;
          if (minuteConfig.value === selectedMinuteValue) {
            hasSelectedMinuteValue = true;
          }
        }
        if (!hasSelectedMinuteValue) {
          label = formatMomentObject.set({
            minute: selectedMinuteValue
          }).format(this.minuteFormat);
          minuteConfig = {
            value: selectedMinuteValue,
            label: label
          };
          this.minuteselectConfig.push(minuteConfig);
          this.__minutesMap[minuteConfig.value] = minuteConfig;
          return this.__sortConfigObjectsByValue(this.minuteselectConfig);
        }
      };

      MonthlyCalendarCoordinator.prototype.__setCurrentYear = function() {
        var currentYearNumber;
        currentYearNumber = this.calendarMonth.month.firstDayOfMonth.year();
        this.currentYearObject = this.__yearsMap[currentYearNumber];
        if (this.currentYearObject == null) {
          return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("The given year, " + currentYearNumber + " is not one of the available choices") : void 0 : void 0;
        }
      };

      MonthlyCalendarCoordinator.prototype.__setCurrentMonth = function() {
        var currentMonthNumber;
        currentMonthNumber = this.calendarMonth.month.firstDayOfMonth.month();
        this.currentMonthObject = this.__monthsMap[currentMonthNumber];
        if (this.currentMonthObject == null) {
          return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("The given month number, " + currentMonthNumber + " is not one of the available choices") : void 0 : void 0;
        }
      };

      MonthlyCalendarCoordinator.prototype.__setCurrentHour = function() {
        var currentHourNumber;
        currentHourNumber = this.calendarCoordinator.shownMomentObject.hour();
        this.currentHourObject = this.__hoursMap[currentHourNumber];
        if (this.currentHourObject == null) {
          return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("The given hour, " + currentHourNumber + " is not one of the available choices") : void 0 : void 0;
        }
      };

      MonthlyCalendarCoordinator.prototype.__setCurrentMinute = function() {
        var currentMinuteNumber;
        currentMinuteNumber = this.calendarCoordinator.shownMomentObject.minute();
        this.currentMinuteObject = this.__minutesMap[currentMinuteNumber];
        if (this.currentMinuteObject == null) {
          return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn("The given minute, " + currentMinuteNumber + " is not one of the available choices") : void 0 : void 0;
        }
      };

      MonthlyCalendarCoordinator.prototype.__updateDayObjects = function() {
        var dayNumberObject, daynumber, formatMomentObject, label, _i, _ref, _results;
        formatMomentObject = this.calendarCoordinator.shownMomentObject.clone().set({
          hour: 0,
          minute: 0,
          second: 0
        });
        this.dayobjects = [];
        _results = [];
        for (daynumber = _i = 1, _ref = this.calendarMonth.month.getDaysInMonth(); 1 <= _ref ? _i <= _ref : _i >= _ref; daynumber = 1 <= _ref ? ++_i : --_i) {
          label = formatMomentObject.set({
            date: daynumber
          }).format(this.dayOfMonthSelectFormat);
          dayNumberObject = {
            value: daynumber,
            label: label
          };
          _results.push(this.dayobjects.push(dayNumberObject));
        }
        return _results;
      };

      /*
      Change month to the month containing the given momentObject,
      and select the date.
      
      As long as you change ``@calendarCoordinator.shownMomentObject``, this
      will update everything to mirror the change (selected day, month, year, ...).
      */


      MonthlyCalendarCoordinator.prototype.__changeSelectedDate = function() {
        this.calendarMonth = new CalendarMonth(this.calendarCoordinator, this.calendarCoordinator.shownMomentObject);
        this.__setCurrentYear();
        this.__setCurrentMonth();
        this.__setCurrentHour();
        this.__setCurrentMinute();
        this.__updateDayObjects();
        return this.currentDayObject = this.dayobjects[this.calendarCoordinator.shownMomentObject.date() - 1];
      };

      MonthlyCalendarCoordinator.prototype.handleDayChange = function(momentObject) {
        this.calendarCoordinator.shownMomentObject = momentObject.clone().set({
          hour: this.currentHourObject.value,
          minute: this.currentMinuteObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentDayObjectChange = function() {
        var momentObject;
        momentObject = moment({
          year: this.currentYearObject.value,
          month: this.currentMonthObject.value,
          day: this.currentDayObject.value
        });
        return this.handleDayChange(momentObject);
      };

      MonthlyCalendarCoordinator.prototype.handleCalendarDayChange = function(calendarDay) {
        return this.handleDayChange(calendarDay.momentObject);
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentMonthChange = function() {
        this.calendarCoordinator.shownMomentObject.set({
          month: this.currentMonthObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentYearChange = function() {
        this.calendarCoordinator.shownMomentObject.set({
          year: this.currentYearObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentHourChange = function() {
        this.calendarCoordinator.shownMomentObject.set({
          hour: this.currentHourObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentMinuteChange = function() {
        this.calendarCoordinator.shownMomentObject.set({
          minute: this.currentMinuteObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleFocusOnCalendarDay = function(calendarDay) {
        return this.lastFocusedMomentObject = calendarDay.momentObject;
      };

      MonthlyCalendarCoordinator.prototype.getLastFocusedMomentObject = function() {
        if (this.lastFocusedMomentObject != null) {
          return this.lastFocusedMomentObject;
        } else {
          return this.calendarCoordinator.shownMomentObject;
        }
      };

      MonthlyCalendarCoordinator.prototype.getDayOfMonthLabelForTableCell = function(calendarDay) {
        return calendarDay.momentObject.format(this.dayOfMonthTableCellFormat);
      };

      MonthlyCalendarCoordinator.prototype.setToToday = function() {
        return this.handleDayChange(this.calendarCoordinator.nowMomentObject.clone());
      };

      return MonthlyCalendarCoordinator;

    })();
    this.$get = function() {
      return {
        MonthlyCalendarCoordinator: MonthlyCalendarCoordinator,
        CalendarCoordinator: CalendarCoordinator
      };
    };
    return this;
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.collapse', []).directive('djangoCradminCollapse', [
    function() {
      /** A box that collapses/expands its content automatically when the header is clicked.
      
      Example
      =======
      
      ```html
      <div django-cradmin-collapse>
        <button ng-click="toggleContentVisible()" type="button">
          <span ng-if="contentHidden">Show</span>
          <span ng-if="!contentHidden">Hide</span>
        </button>
        <div ng-class="{'ng-hide': contentHidden}">
          Something here
        </div>
      </div>
      ```
      
      You can make it visible by default using ``initial-state="visible"``:
      
      ```html
      <div django-cradmin-collapse initial-state="visible">
        ...
      </div>
      ```
      
      If you want to avoid the initial flicker before the directive
      hides the content, add the ``ng-hide`` css class to the content div:
      
      ```html
      <div django-cradmin-collapse>
        <button ng-click="toggleContentVisible()" type="button">
          ...
        </button>
        <div ng-class="{'ng-hide': contentHidden}" ng-class="ng-hide">
          Something here
        </div>
      </div>
      ```
      */

      return {
        scope: true,
        controller: function($scope) {
          $scope.contentHidden = true;
          $scope.toggleContentVisible = function() {
            return $scope.contentHidden = !$scope.contentHidden;
          };
        },
        link: function($scope, $element, attrs) {
          return $scope.contentHidden = attrs.initialState !== 'visible';
        }
      };
    }
  ]);

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
  }).directive('djangoCradminSelectTextForCopyOnFocus', function() {
    /*
    Select text of an input field or textarea when the field
    receives focus.
    
    Example:
    ```
    <p>Copy the url below and share it on social media!</p>
    <input type="text" value="example.com" django-cradmin-select-text-for-copy-on-focus="http://example.com">
    ```
    */

    return {
      restrict: 'A',
      scope: {
        valueToCopy: '@djangoCradminSelectTextForCopyOnFocus'
      },
      link: function(scope, element, attrs) {
        scope.value = attrs['value'];
        element.on('click', function() {
          element.val(scope.valueToCopy);
          return this.select();
        });
        scope.resetValue = function() {
          return element.val(scope.value);
        };
        element.on('change', function() {
          return scope.resetValue();
        });
        element.on('blur', function() {
          return scope.resetValue();
        });
      }
    };
  }).directive('focusonme', [
    '$timeout', function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, $element) {
          $timeout(function() {
            $element[0].focus();
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('djangoCradmin.providers', []).provider('djangoCradminWindowDimensions', function() {
    /** Provider that makes it easy to listen for window resize.
    
    How it works
    ============
    You register a ``scope`` with the provider. Each time the window
    is resized, the provider will call ``scope.onWindowResize()``.
    The provider uses a ``300ms`` timeout before it triggers a
    resize, so your ``onWindowResize`` method will not be flooded
    with every pixel change.
    
    Example
    =======
    
    ```coffeescript
    mymodule.directive('myDirective', [
      'djangoCradminWindowDimensions'
      (djangoCradminWindowDimensions) ->
        return {
          controller: ($scope) ->
            $scope.onWindowResize = (newWindowDimensions) ->
              console.log 'Window was resized to', newWindowDimensions
            return
    
          link: ($scope, element, attrs) ->
            djangoCradminWindowDimensions.register $scope
            $scope.$on '$destroy', ->
              djangoCradminWindowDimensions.unregister $scope
            return
        }
    ])
    ```
    */

    var WindowDimensionsProvider;
    WindowDimensionsProvider = (function() {
      function WindowDimensionsProvider($window, timeout) {
        this.timeout = timeout;
        this._onWindowResize = __bind(this._onWindowResize, this);
        this.mainWindow = angular.element($window);
        this.deviceMinWidths = {
          tablet: 768,
          mediumDesktop: 992,
          largeDesktop: 1200
        };
        this.windowDimensions = this._getWindowDimensions();
        this.applyResizeTimer = null;
        this.applyResizeTimerTimeoutMs = 300;
        this.listeningScopes = [];
      }

      WindowDimensionsProvider.prototype._triggerResizeEventsForScope = function(scope) {
        return scope.onWindowResize(this.windowDimensions);
      };

      WindowDimensionsProvider.prototype.register = function(scope) {
        var scopeIndex;
        scopeIndex = this.listeningScopes.indexOf(scope);
        if (scopeIndex !== -1) {
          console.error('Trying to register a scope that is already registered with ' + 'djangoCradminWindowDimensions. Scope:', scope);
          return;
        }
        if (this.listeningScopes.length < 1) {
          this.mainWindow.bind('resize', this._onWindowResize);
        }
        return this.listeningScopes.push(scope);
      };

      WindowDimensionsProvider.prototype.unregister = function(scope) {
        var scopeIndex;
        scopeIndex = this.listeningScopes.indexOf(scope);
        if (scopeIndex === -1) {
          console.error('Trying to unregister a scope that is not registered with ' + 'djangoCradminWindowDimensions. Scope:', scope);
        }
        this.listeningScopes.splice(scopeIndex, 1);
        if (this.listeningScopes.length < 1) {
          return this.mainWindow.unbind('resize', this._onWindowResize);
        }
      };

      WindowDimensionsProvider.prototype._getWindowDimensions = function() {
        return {
          height: this.mainWindow.height(),
          width: this.mainWindow.width()
        };
      };

      WindowDimensionsProvider.prototype.getDeviceFromWindowDimensions = function(windowDimensions) {
        if (windowDimensions < this.deviceMinWidths.tablet) {
          return 'phone';
        } else if (windowDimensions < this.deviceMinWidths.mediumDesktop) {
          return 'tablet';
        } else if (windowDimensions < this.deviceMinWidths.largeDesktop) {
          return 'medium-desktop';
        } else {
          return 'large-desktop';
        }
      };

      WindowDimensionsProvider.prototype._updateWindowDimensions = function(newWindowDimensions) {
        this.windowDimensions = newWindowDimensions;
        return this._onWindowDimensionsChange();
      };

      WindowDimensionsProvider.prototype._setWindowDimensions = function() {
        var newWindowDimensions;
        newWindowDimensions = this._getWindowDimensions();
        if (!angular.equals(newWindowDimensions, this.windowDimensions)) {
          return this._updateWindowDimensions(newWindowDimensions);
        }
      };

      WindowDimensionsProvider.prototype._onWindowDimensionsChange = function() {
        var scope, _i, _len, _ref, _results;
        _ref = this.listeningScopes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          scope = _ref[_i];
          _results.push(this._triggerResizeEventsForScope(scope));
        }
        return _results;
      };

      WindowDimensionsProvider.prototype.triggerWindowResizeEvent = function() {
        return this._onWindowDimensionsChange();
      };

      WindowDimensionsProvider.prototype._onWindowResize = function() {
        var _this = this;
        this.timeout.cancel(this.applyResizeTimer);
        return this.applyResizeTimer = this.timeout(function() {
          return _this._setWindowDimensions();
        }, this.applyResizeTimerTimeoutMs);
      };

      return WindowDimensionsProvider;

    })();
    this.$get = [
      '$window', '$timeout', function($window, $timeout) {
        return new WindowDimensionsProvider($window, $timeout);
      }
    ];
    return this;
  }).provider('djangoCradminWindowScrollTop', function() {
    /** Provider that makes it easy to listen for scrolling on the main window.
    
    How it works
    ============
    You register a ``scope`` with the provider. Each time the window
    is scrolled, the provider will call ``scope.onWindowScrollTop()``.
    The provider uses a ``100ms`` timeout before it triggers a
    resize, so your ``onWindowScrollTop`` method will not be flooded
    with every pixel change.
    
    Example
    =======
    
    ```coffeescript
    mymodule.directive('myDirective', [
      'djangoCradminWindowScrollTop'
      (djangoCradminWindowScrollTop) ->
        return {
          controller: ($scope) ->
            $scope.onWindowScrollTop = (newTopPosition) ->
              console.log 'Window was scrolled to', newTopPosition
            return
    
          link: ($scope, element, attrs) ->
            djangoCradminWindowScrollTop.register $scope
            $scope.$on '$destroy', ->
              djangoCradminWindowScrollTop.unregister $scope
            return
        }
    ])
    ```
    */

    var WindowScrollProvider;
    WindowScrollProvider = (function() {
      function WindowScrollProvider($window, timeout) {
        this.timeout = timeout;
        this._onScroll = __bind(this._onScroll, this);
        this.mainWindow = angular.element($window);
        this.scrollTopPosition = this._getScrollTopPosition();
        this.applyScrollTimer = null;
        this.applyScrollTimerTimeoutMs = 100;
        this.listeningScopes = [];
      }

      WindowScrollProvider.prototype.register = function(scope) {
        var scopeIndex;
        scopeIndex = this.listeningScopes.indexOf(scope);
        if (scopeIndex !== -1) {
          console.error('Trying to register a scope that is already registered with ' + 'djangoCradminWindowScrollTop. Scope:', scope);
          return;
        }
        if (this.listeningScopes.length < 1) {
          this.mainWindow.bind('scroll', this._onScroll);
        }
        this.listeningScopes.push(scope);
        return scope.onWindowScrollTop(this.scrollTopPosition);
      };

      WindowScrollProvider.prototype.unregister = function(scope) {
        var scopeIndex;
        scopeIndex = this.listeningScopes.indexOf(scope);
        if (scopeIndex === -1) {
          console.error('Trying to unregister a scope that is not registered with ' + 'djangoCradminWindowScrollTop. Scope:', scope);
        }
        this.listeningScopes.splice(scopeIndex, 1);
        if (this.listeningScopes.length < 1) {
          return this.mainWindow.unbind('scroll', this._onScroll);
        }
      };

      WindowScrollProvider.prototype._getScrollTopPosition = function() {
        return this.mainWindow.scrollTop();
      };

      WindowScrollProvider.prototype._setScrollTopPosition = function() {
        var scrollTopPosition;
        scrollTopPosition = this._getScrollTopPosition();
        if (scrollTopPosition !== this.scrollTopPosition) {
          this.scrollTopPosition = scrollTopPosition;
          return this._onScrollTopChange();
        }
      };

      WindowScrollProvider.prototype._onScrollTopChange = function() {
        var scope, _i, _len, _ref, _results;
        _ref = this.listeningScopes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          scope = _ref[_i];
          _results.push(scope.onWindowScrollTop(this.scrollTopPosition));
        }
        return _results;
      };

      WindowScrollProvider.prototype._onScroll = function() {
        var _this = this;
        this.timeout.cancel(this.applyScrollTimer);
        return this.applyScrollTimer = this.timeout(function() {
          return _this._setScrollTopPosition();
        }, this.applyScrollTimerTimeoutMs);
      };

      return WindowScrollProvider;

    })();
    this.$get = [
      '$window', '$timeout', function($window, $timeout) {
        return new WindowScrollProvider($window, $timeout);
      }
    ];
    return this;
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.detectizr', []).factory('cradminDetectize', function() {
    Detectizr.detect({
      addAllFeaturesAsClass: false,
      detectDevice: true,
      detectDeviceModel: true,
      detectScreen: true,
      detectOS: true,
      detectBrowser: true,
      detectPlugins: false
    });
    return Detectizr;
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.forms.clearabletextinput', []).directive('djangoCradminClearableTextinput', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, $element, attributes) {
          var $target, onTargetValueChange, targetElementSelector;
          targetElementSelector = attributes.djangoCradminClearableTextinput;
          $target = angular.element(targetElementSelector);
          onTargetValueChange = function() {
            if ($target.val() === '') {
              return $element.removeClass('django-cradmin-clearable-textinput-button-visible');
            } else {
              return $element.addClass('django-cradmin-clearable-textinput-button-visible');
            }
          };
          $element.on('click', function(e) {
            e.preventDefault();
            $target.val('');
            $target.focus();
            return $target.change();
          });
          $target.on('change', function() {
            return onTargetValueChange();
          });
          $target.on('keydown', function(e) {
            return onTargetValueChange();
          });
          return onTargetValueChange();
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.forms.clearvalue', []).directive('djangoCradminClearValue', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, $element, attributes) {
          var $target, targetElementSelector;
          targetElementSelector = attributes.djangoCradminClearValue;
          $target = angular.element(targetElementSelector);
          return $element.on('click', function(e) {
            e.preventDefault();
            $target.val('');
            $target.focus();
            return $target.change();
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  var app;

  app = angular.module('djangoCradmin.forms.datetimewidget', ['cfp.hotkeys']);

  app.directive('djangoCradminDatetimeSelector', [
    '$timeout', '$compile', '$rootScope', 'hotkeys', 'djangoCradminCalendarApi', 'djangoCradminWindowDimensions', function($timeout, $compile, $rootScope, hotkeys, djangoCradminCalendarApi, djangoCradminWindowDimensions) {
      return {
        scope: {
          config: "=djangoCradminDatetimeSelector"
        },
        templateUrl: 'forms/dateselector.tpl.html',
        controller: function($scope, $element) {
          var __addCommonHotkeys, __addPage1Hotkeys, __getFirstFocusableItemInCurrentPage, __getFocusItemAfterHide, __getInitialFocusItemForCurrentPage, __getLastFocusableItemInCurrentPage, __removeHotkeys;
          $scope.page = null;
          /*
          Handles keyboard navigation.
          */

          $scope.__keyboardNavigation = function(event, direction) {
            var activeElement, lastFocusedElement, newFocusTd, nextSibling, nextTr, previousSibling, previousTr;
            if (direction === 'pageup' || direction === 'pagedown') {
              event.preventDefault();
            }
            if ($element.find('.django-cradmin-datetime-selector-table').is(':visible')) {
              activeElement = angular.element(document.activeElement);
              if (activeElement.hasClass('django-cradmin-datetime-selector-daybuttoncell-button')) {
                event.preventDefault();
                if (direction === 'right') {
                  nextSibling = activeElement.parent().next();
                  if (nextSibling.length > 0) {
                    newFocusTd = nextSibling;
                  }
                }
                if (direction === 'left') {
                  previousSibling = activeElement.parent().prev();
                  if (previousSibling.length > 0) {
                    newFocusTd = previousSibling;
                  }
                }
                if (direction === 'up') {
                  previousTr = activeElement.parent().parent().prev();
                  if (previousTr.length > 0) {
                    newFocusTd = angular.element(previousTr.children().get(activeElement.parent().index()));
                  }
                }
                if (direction === 'down') {
                  nextTr = activeElement.parent().parent().next();
                  if (nextTr.length > 0) {
                    newFocusTd = angular.element(nextTr.children().get(activeElement.parent().index()));
                  }
                }
                if ((newFocusTd != null) && newFocusTd.length > 0) {
                  newFocusTd.find('button').focus();
                }
                if (direction === 'home') {
                  activeElement.parent().parent().parent().find('button:enabled').first().focus();
                }
                if (direction === 'end') {
                  activeElement.parent().parent().parent().find('button:enabled').last().focus();
                }
                if (direction === 'pageup') {
                  return $element.find('.django-cradmin-datetime-selector-monthselect').focus();
                }
              } else if (direction === 'pagedown') {
                if (activeElement.parent().hasClass('django-cradmin-datetime-selector-dateselectors')) {
                  lastFocusedElement = $element.find('.django-cradmin-datetime-selector-daybuttoncell-lastfocused button');
                  if (lastFocusedElement.is(':visible')) {
                    return lastFocusedElement.focus();
                  } else {
                    return angular.element($element.find('.django-cradmin-datetime-selector-daybuttoncell-in-current-month button').first()).focus();
                  }
                }
              }
            }
          };
          /*
          Called when enter is pressed in any of the select fields.
          
          If we have a visible use-button, we do the same as if the user
          pressed that. If we are on page1, on desktop (no use-button),
          we move the focus into the first day of the current month
          in the day select table, or to the selected day if that is visible.
          */

          $scope.__onSelectEnterPressed = function() {
            var selectedButton, tableElement, useButton;
            if ($scope.page === 1) {
              useButton = $element.find('.django-cradmin-datetime-selector-dateview ' + '.django-cradmin-datetime-selector-use-button');
              if (useButton.is(":visible")) {
                return $scope.onClickUseTime();
              } else {
                tableElement = $element.find('.django-cradmin-datetime-selector-table');
                selectedButton = tableElement.find('.django-cradmin-datetime-selector-daybuttoncell-selected button');
                if (selectedButton.length > 0) {
                  return selectedButton.focus();
                } else {
                  return tableElement.find('.django-cradmin-datetime-selector-daybuttoncell-in-current-month button').first().focus();
                }
              }
            } else if ($scope.page === 2) {
              return $scope.onClickUseTime();
            }
          };
          /*
          Returns the item we want to focus on when we tab forward from the last
          focusable item on the current page.
          */

          __getFirstFocusableItemInCurrentPage = function() {
            if ($scope.page === 1) {
              return $element.find('.django-cradmin-datetime-selector-dateview ' + '.django-cradmin-datetime-selector-closebutton');
            } else if ($scope.page === 2) {
              return $element.find('.django-cradmin-datetime-selector-timeview ' + '.django-cradmin-datetime-selector-closebutton');
            }
          };
          /*
          Returns the item we want to focus on when we tab back from the first
          focusable item on the current page.
          */

          __getLastFocusableItemInCurrentPage = function() {
            var useButton;
            if ($scope.page === 1) {
              useButton = $element.find('.django-cradmin-datetime-selector-dateview ' + '.django-cradmin-datetime-selector-use-button');
              if (useButton.is(":visible")) {
                return useButton;
              } else {
                return $element.find('.django-cradmin-datetime-selector-table ' + 'td.django-cradmin-datetime-selector-daybuttoncell-in-current-month button').last();
              }
            } else if ($scope.page === 2) {
              return $element.find('.django-cradmin-datetime-selector-timeview ' + '.django-cradmin-datetime-selector-use-button');
            }
          };
          /*
          Get the initial item to focus on when we open/show a page.
          */

          __getInitialFocusItemForCurrentPage = function() {
            var dayselectElement;
            if ($scope.page === 1) {
              dayselectElement = $element.find('.django-cradmin-datetime-selector-dayselect');
              if (dayselectElement.is(':visible')) {
                return dayselectElement;
              } else {
                return $element.find('.django-cradmin-datetime-selector-monthselect');
              }
            } else if ($scope.page === 2) {
              return $element.find('.django-cradmin-datetime-selector-timeview ' + '.django-cradmin-datetime-selector-hourselect');
            }
          };
          /*
          Get the item to focus on when we close the datetime picker.
          */

          __getFocusItemAfterHide = function() {
            return $scope.triggerButton;
          };
          /*
          Triggered when the user focuses on the hidden (sr-only) button we have
          added to the start of the datetime-selector div.
          */

          $scope.onFocusHead = function() {
            if ($scope.page !== null) {
              __getLastFocusableItemInCurrentPage().focus();
            }
          };
          /*
          Triggered when the user focuses on the hidden (sr-only) button we have
          added to the end of the datetime-selector div.
          */

          $scope.onFocusTail = function() {
            if ($scope.page !== null) {
              __getFirstFocusableItemInCurrentPage().focus();
            }
          };
          /*
          Called when a users selects a date using the mobile-only <select>
          menu to select a day.
          */

          $scope.onSelectDayNumber = function() {
            $scope.monthlyCalendarCoordinator.handleCurrentDayObjectChange();
          };
          /*
          Called when a user selects a date by clicking on a day
          in the calendar table.
          */

          $scope.onClickCalendarDay = function(calendarDay) {
            $scope.monthlyCalendarCoordinator.handleCalendarDayChange(calendarDay);
            if ($scope.config.include_time) {
              $scope.showPage2();
            } else {
              $scope.__useShownValue();
            }
          };
          /*
          Called when a users focuses a date in the calendar table.
          */

          $scope.onFocusCalendayDay = function(calendarDay) {
            $scope.monthlyCalendarCoordinator.handleFocusOnCalendarDay(calendarDay);
          };
          /*
          Called when a users selects a month using the month <select>
          menu.
          */

          $scope.onSelectMonth = function() {
            $scope.monthlyCalendarCoordinator.handleCurrentMonthChange();
          };
          /*
          Called when a users selects a year using the year <select>
          menu.
          */

          $scope.onSelectYear = function() {
            $scope.monthlyCalendarCoordinator.handleCurrentYearChange();
          };
          /*
          Called when a users selects an hour using the hour <select>
          menu.
          */

          $scope.onSelectHour = function() {
            $scope.monthlyCalendarCoordinator.handleCurrentHourChange();
          };
          /*
          Called when a users selects a minute using the minute <select>
          menu.
          */

          $scope.onSelectMinute = function() {
            $scope.monthlyCalendarCoordinator.handleCurrentMinuteChange();
          };
          /*
          Called when a user clicks the "Use" button on the time page.
          */

          $scope.onClickUseTime = function() {
            $scope.__useShownValue();
          };
          /*
          Used to get the preview of the selected date on page2 (above the time selector).
          */

          $scope.getTimeselectorDatepreview = function() {
            return $scope.calendarCoordinator.shownMomentObject.format($scope.config.timeselector_datepreview_momentjs_format);
          };
          /*
          This is used to get the aria-label attribute for the "Use" button.
          */

          $scope.getUseButtonAriaLabel = function() {
            var formattedDate;
            if ($scope.monthlyCalendarCoordinator != null) {
              formattedDate = $scope.calendarCoordinator.shownMomentObject.format($scope.config.usebutton_arialabel_momentjs_format);
              return ("" + $scope.config.usebutton_arialabel_prefix + " ") + ("" + formattedDate);
            } else {

            }
            return '';
          };
          /*
          Get day-button (button in the calendar table) aria-label attribute.
          */

          $scope.getDaybuttonAriaLabel = function(calendarDay) {
            var isSelected, label;
            label = "" + (calendarDay.momentObject.format('MMMM D'));
            if ($scope.config.today_label_text !== '' && calendarDay.isToday()) {
              label = "" + label + " (" + $scope.config.today_label_text + ")";
            } else {
              isSelected = calendarDay.momentObject.isSame($scope.calendarCoordinator.selectedMomentObject, 'day');
              if ($scope.config.selected_day_label_text !== '' && isSelected) {
                label = "" + label + " (" + $scope.config.selected_day_label_text + ")";
              }
            }
            return label;
          };
          /*
          Returns ``true`` if we have any buttons in the buttonrow.
          */

          $scope.hasShortcuts = function() {
            if ($scope.calendarCoordinator.nowIsValidValue()) {
              return true;
            } else if (!$scope.config.required) {
              return true;
            } else {
              return false;
            }
          };
          $scope.onClickTodayButton = function() {
            $scope.monthlyCalendarCoordinator.setToToday();
            if ($scope.config.include_time) {
              $scope.showPage2();
            } else {
              $scope.__useShownValue();
            }
          };
          $scope.onClickNowButton = function() {
            $scope.calendarCoordinator.setToNow();
            return $scope.__useShownValue();
          };
          $scope.onClickClearButton = function() {
            return $scope.__clearSelectedValue();
          };
          $scope.getTabindexForCalendarDay = function(calendarDay) {
            if (calendarDay.isInCurrentMonth) {
              return "0";
            } else {

            }
            return "-1";
          };
          /*
          Update the preview text to reflect the selected value.
          */

          $scope.__updatePreviewText = function() {
            var preview, templateScope;
            if ($scope.calendarCoordinator.selectedMomentObject != null) {
              templateScope = $rootScope.$new(true);
              templateScope.momentObject = $scope.calendarCoordinator.selectedMomentObject.clone();
              preview = $compile($scope.previewAngularjsTemplate)(templateScope);
              $scope.previewElement.empty();
              $scope.previewElement.append(preview);
              return $scope.previewElement.show();
            } else {
              if (($scope.config.no_value_preview_text != null) && $scope.config.no_value_preview_text !== '') {
                $scope.previewElement.html($scope.config.no_value_preview_text);
                return $scope.previewElement.show();
              } else {
                return $scope.previewElement.hide();
              }
            }
          };
          /*
          Apply a css animation to indicate that the preview text has
          changed.
          
          The ``delay_milliseconds`` parameter is the number of milliseonds
          to delay starting the animation.
          */

          $scope.__animatePreviewText = function(delay_milliseconds) {
            if ($scope.config.preview_change_animation_cssclass != null) {
              $scope.previewElement.addClass($scope.config.preview_change_animation_cssclass);
              return $timeout(function() {
                return $timeout(function() {
                  $scope.previewElement.removeClass($scope.config.preview_change_animation_cssclass);
                  return $scope.previewElement.first().offsetWidth = $scope.previewElement.first().offsetWidth;
                }, $scope.config.preview_change_animation_duration_milliseconds);
              }, delay_milliseconds);
            }
          };
          /*
          Update the trigger button label to reflect the selected value.
          */

          $scope.__updateTriggerButtonLabel = function() {
            var label;
            if ($scope.calendarCoordinator.selectedMomentObject != null) {
              label = $scope.config.buttonlabel;
            } else {
              label = $scope.config.buttonlabel_novalue;
            }
            return $scope.triggerButton.html(label);
          };
          /*
          Update the value of the destination field to reflect the selected value.
          */

          $scope.__updateDestinationFieldValue = function() {
            var destinationFieldValue;
            if ($scope.calendarCoordinator.selectedMomentObject != null) {
              destinationFieldValue = $scope.calendarCoordinator.selectedMomentObject.format($scope.config.destinationfield_momentjs_format);
            } else {
              destinationFieldValue = '';
            }
            return $scope.destinationField.val(destinationFieldValue);
          };
          /*
          Update destination field value, preview text and trigger button label,
          and hide the datetime selector.
          */

          $scope.__hideWithSelectedValueApplied = function() {
            $scope.__updateDestinationFieldValue();
            $scope.__updatePreviewText();
            $scope.__updateTriggerButtonLabel();
            return $scope.hide();
          };
          /*
          Make the shown value the selected value and call
          ``$scope.__hideWithSelectedValueApplied()``.
          */

          $scope.__useShownValue = function() {
            $scope.calendarCoordinator.selectShownValue();
            return $scope.__hideWithSelectedValueApplied();
          };
          /*
          Clear the selected value and call ``$scope.__hideWithSelectedValueApplied()``.
          */

          $scope.__clearSelectedValue = function() {
            $scope.calendarCoordinator.clearSelectedMomentObject();
            return $scope.__hideWithSelectedValueApplied();
          };
          __addCommonHotkeys = function() {
            hotkeys.add({
              combo: 'esc',
              callback: function(event) {
                return $scope.hide();
              },
              allowIn: ['BUTTON', 'SELECT', 'INPUT']
            });
            hotkeys.add({
              combo: 'up',
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'up');
              }
            });
            hotkeys.add({
              combo: 'down',
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'down');
              }
            });
            hotkeys.add({
              combo: 'left',
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'left');
              }
            });
            hotkeys.add({
              combo: 'right',
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'right');
              }
            });
            hotkeys.add({
              combo: 'home',
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'home');
              }
            });
            hotkeys.add({
              combo: 'end',
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'end');
              }
            });
            hotkeys.add({
              combo: 'pagedown',
              allowIn: ['BUTTON', 'SELECT', 'INPUT'],
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'pagedown');
              }
            });
            return hotkeys.add({
              combo: 'pageup',
              allowIn: ['BUTTON', 'SELECT', 'INPUT', 'BUTTON'],
              callback: function(event) {
                return $scope.__keyboardNavigation(event, 'pageup');
              }
            });
          };
          __addPage1Hotkeys = function() {};
          __removeHotkeys = function() {
            hotkeys.del('esc');
            hotkeys.del('up');
            hotkeys.del('down');
            hotkeys.del('left');
            hotkeys.del('right');
            hotkeys.del('home');
            hotkeys.del('end');
            hotkeys.del('pagedown');
            return hotkeys.del('pageup');
          };
          $scope.__onMouseWheel = function(e) {
            e.preventDefault();
            return e.stopPropagation();
          };
          $scope.__adjustPosition = function() {
            var contentWrapperElement, scrollTop, windowHeight;
            contentWrapperElement = $element.find('.django-cradmin-datetime-selector-contentwrapper');
            scrollTop = angular.element(window).scrollTop();
            windowHeight = angular.element(window).height();
            return $scope.datetimeSelectorElement.css({
              top: scrollTop,
              height: "" + windowHeight + "px"
            });
          };
          $scope.onWindowResize = function() {
            return $scope.__adjustPosition();
          };
          $scope.__show = function() {
            __removeHotkeys();
            __addCommonHotkeys();
            return $scope.__adjustPosition();
          };
          $scope.showPage1 = function() {
            angular.element('body').on('mousewheel touchmove', $scope.__onMouseWheel);
            $scope.page = 1;
            $timeout(function() {
              return __getInitialFocusItemForCurrentPage().focus();
            }, 150);
            $scope.__show();
            __addPage1Hotkeys();
          };
          $scope.showPage2 = function() {
            $scope.page = 2;
            $scope.calendarCoordinator.selectShownValue();
            $timeout(function() {
              return __getInitialFocusItemForCurrentPage().focus();
            }, 150);
            $scope.__show();
          };
          $scope.hide = function() {
            angular.element('body').off('mousewheel touchmove', $scope.__onMouseWheel);
            if ($scope.page === 2) {
              $scope.page = 3;
              $timeout(function() {
                return $scope.page = null;
              }, $scope.config.hide_animation_duration_milliseconds);
            } else {
              $scope.page = null;
            }
            __removeHotkeys();
            $timeout(function() {
              return $scope.__animatePreviewText();
            }, $scope.config.hide_animation_duration_milliseconds);
            $timeout(function() {
              return __getFocusItemAfterHide().focus();
            }, 150);
          };
          return $scope.initialize = function() {
            var currentDateIsoString, maximumDatetime, minimumDatetime, selectedMomentObject;
            currentDateIsoString = $scope.destinationField.val();
            if ((currentDateIsoString != null) && currentDateIsoString !== '') {
              selectedMomentObject = moment(currentDateIsoString);
              $scope.triggerButton.html($scope.config.buttonlabel);
            } else {
              selectedMomentObject = null;
              $scope.triggerButton.html($scope.config.buttonlabel_novalue);
            }
            minimumDatetime = null;
            maximumDatetime = null;
            if ($scope.config.minimum_datetime != null) {
              minimumDatetime = moment($scope.config.minimum_datetime);
            }
            if ($scope.config.maximum_datetime != null) {
              maximumDatetime = moment($scope.config.maximum_datetime);
            }
            $scope.calendarCoordinator = new djangoCradminCalendarApi.CalendarCoordinator({
              selectedMomentObject: selectedMomentObject,
              minimumDatetime: minimumDatetime,
              maximumDatetime: maximumDatetime,
              nowMomentObject: moment($scope.config.now)
            });
            $scope.monthlyCalendarCoordinator = new djangoCradminCalendarApi.MonthlyCalendarCoordinator({
              calendarCoordinator: $scope.calendarCoordinator,
              yearselectValues: $scope.config.yearselect_values,
              hourselectValues: $scope.config.hourselect_values,
              minuteselectValues: $scope.config.minuteselect_values,
              yearFormat: $scope.config.yearselect_momentjs_format,
              monthFormat: $scope.config.monthselect_momentjs_format,
              dayOfMonthSelectFormat: $scope.config.dayofmonthselect_momentjs_format,
              dayOfMonthTableCellFormat: $scope.config.dayofmonthtablecell_momentjs_format,
              hourFormat: $scope.config.hourselect_momentjs_format,
              minuteFormat: $scope.config.minuteselect_momentjs_format
            });
            return $scope.__updatePreviewText();
          };
        },
        link: function($scope, $element) {
          var body, configname, configvalue, labelElement, previewTemplateScriptElement, required_config_attributes, _i, _len;
          body = angular.element('body');
          $element.appendTo(body);
          djangoCradminWindowDimensions.register($scope);
          $scope.$on('$destroy', function() {
            return djangoCradminWindowDimensions.unregister($scope);
          });
          if ($scope.config.no_value_preview_text == null) {
            $scope.config.no_value_preview_text = '';
          }
          required_config_attributes = ['now', 'destinationfieldid', 'triggerbuttonid', 'previewid', 'previewtemplateid', 'required', 'usebuttonlabel', 'usebutton_arialabel_prefix', 'usebutton_arialabel_momentjs_format', 'close_icon', 'back_icon', 'back_to_datepicker_screenreader_text', 'destinationfield_momentjs_format', 'timeselector_datepreview_momentjs_format', 'year_screenreader_text', 'month_screenreader_text', 'day_screenreader_text', 'hour_screenreader_text', 'minute_screenreader_text', 'dateselector_table_screenreader_caption', 'today_label_text', 'selected_day_label_text', 'yearselect_values', 'hourselect_values', 'yearselect_momentjs_format', 'monthselect_momentjs_format', 'dayofmonthselect_momentjs_format', 'dayofmonthtablecell_momentjs_format', 'hourselect_momentjs_format', 'minuteselect_momentjs_format', 'minuteselect_values', 'now_button_text', 'today_button_text', 'clear_button_text', 'hide_animation_duration_milliseconds'];
          for (_i = 0, _len = required_config_attributes.length; _i < _len; _i++) {
            configname = required_config_attributes[_i];
            configvalue = $scope.config[configname];
            if ((configvalue == null) || configvalue === '') {
              if (typeof console !== "undefined" && console !== null) {
                if (typeof console.error === "function") {
                  console.error("The " + configname + " config is required!");
                }
              }
            }
          }
          $scope.destinationField = angular.element("#" + $scope.config.destinationfieldid);
          if ($scope.destinationField.length === 0) {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.error === "function") {
                console.error("Could not find the destinationField element with ID: " + $scope.config.destinationfieldid);
              }
            }
          }
          $scope.triggerButton = angular.element("#" + $scope.config.triggerbuttonid);
          if ($scope.triggerButton.length > 0) {
            $scope.triggerButton.on('click', function() {
              $scope.initialize();
              $scope.showPage1();
              $scope.$apply();
            });
            labelElement = angular.element("label[for=" + $scope.config.destinationfieldid + "]");
            if (labelElement.length > 0) {
              if (!labelElement.attr('id')) {
                labelElement.attr('id', "" + $scope.config.destinationfieldid + "_label");
              }
              $scope.triggerButton.attr('aria-labeledby', "" + (labelElement.attr('id')) + " " + $scope.config.previewid);
            }
          } else {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.warn === "function") {
                console.warn("Could not find the triggerButton element with ID: " + $scope.config.triggerbuttonid);
              }
            }
          }
          $scope.previewElement = angular.element("#" + $scope.config.previewid);
          if ($scope.previewElement.length === 0) {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.warn === "function") {
                console.warn("Could not find the previewElement element with ID: " + $scope.config.previewid);
              }
            }
          }
          previewTemplateScriptElement = angular.element("#" + $scope.config.previewtemplateid);
          if (previewTemplateScriptElement.length === 0) {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.warn === "function") {
                console.warn("Could not find the previewTemplateScriptElement element " + ("with ID: " + $scope.config.previewtemplateid));
              }
            }
          } else {
            $scope.previewAngularjsTemplate = previewTemplateScriptElement.html();
          }
          $scope.datetimeSelectorElement = $element.find('.django-cradmin-datetime-selector');
          $scope.initialize();
          $scope.destinationField.on('change', function() {
            $scope.initialize();
            $scope.$apply();
            return $scope.__animatePreviewText(0);
          });
          $timeout(function() {
            return $element.find('select').on('keydown', function(e) {
              if (e.which === 13) {
                $scope.__onSelectEnterPressed();
                e.preventDefault();
              }
            });
          }, 100);
        }
      };
    }
  ]);

}).call(this);

(function() {
  var app;

  app = angular.module('djangoCradmin.forms.filewidget', []);

  app.controller('CradminFileFieldController', function($scope, $filter) {
    $scope.init = function() {
      $scope.$watch('cradmin_filefield_has_value', function(newValue) {
        if (newValue != null) {
          if (newValue) {
            return $scope.cradmin_filefield_clearcheckbox_value = '';
          } else {
            return $scope.cradmin_filefield_clearcheckbox_value = 'checked';
          }
        }
      });
    };
    $scope.cradminClearFileField = function() {
      return $scope.cradmin_filefield_clear_value = true;
    };
    $scope.init();
  });

  app.directive('cradminFilefieldValue', function() {
    return {
      scope: false,
      link: function($scope, element, attributes) {
        var fileFieldElement, setupFileFieldChangeListener;
        $scope.cradmin_filefield_clear_value = false;
        fileFieldElement = element;
        if ((attributes.cradminFilefieldValue != null) && attributes.cradminFilefieldValue !== "") {
          $scope.cradmin_filefield_has_value = true;
          $scope.cradmin_filefield_has_original_value = true;
        }
        setupFileFieldChangeListener = function() {
          return fileFieldElement.bind('change', function(changeEvent) {
            var reader;
            reader = new FileReader;
            reader.onload = function(loadEvent) {
              $scope.$apply(function() {
                $scope.cradmin_filefield_has_value = true;
                $scope.cradmin_filefield_has_original_value = false;
              });
            };
            reader.readAsDataURL(changeEvent.target.files[0]);
          });
        };
        $scope.$watch('cradmin_filefield_clear_value', function(newValue) {
          var newFileFieldElement;
          if (newValue) {
            $scope.cradmin_filefield_has_value = false;
            $scope.cradmin_filefield_clear_value = false;
            $scope.cradmin_filefield_has_original_value = false;
            newFileFieldElement = fileFieldElement.clone();
            jQuery(fileFieldElement).replaceWith(newFileFieldElement);
            fileFieldElement = newFileFieldElement;
            return setupFileFieldChangeListener();
          }
        });
        setupFileFieldChangeListener();
      }
    };
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.forms.modelchoicefield', []).provider('djangoCradminModelChoiceFieldCoordinator', function() {
    var ModelChoiceFieldOverlay;
    ModelChoiceFieldOverlay = (function() {
      function ModelChoiceFieldOverlay(djangoCradminWindowDimensions) {
        this.djangoCradminWindowDimensions = djangoCradminWindowDimensions;
        this.modelChoiceFieldIframeWrapper = null;
        this.bodyContentWrapperElement = angular.element('#django_cradmin_bodycontentwrapper');
        this.bodyElement = angular.element('body');
      }

      ModelChoiceFieldOverlay.prototype.registerModeChoiceFieldIframeWrapper = function(modelChoiceFieldIframeWrapper) {
        return this.modelChoiceFieldIframeWrapper = modelChoiceFieldIframeWrapper;
      };

      ModelChoiceFieldOverlay.prototype.onChangeValueBegin = function(fieldWrapperScope) {
        return this.modelChoiceFieldIframeWrapper.onChangeValueBegin(fieldWrapperScope);
      };

      ModelChoiceFieldOverlay.prototype.addBodyContentWrapperClass = function(cssclass) {
        return this.bodyContentWrapperElement.addClass(cssclass);
      };

      ModelChoiceFieldOverlay.prototype.removeBodyContentWrapperClass = function(cssclass) {
        return this.bodyContentWrapperElement.removeClass(cssclass);
      };

      ModelChoiceFieldOverlay.prototype.disableBodyScrolling = function() {
        return this.bodyElement.addClass('django-cradmin-noscroll');
      };

      ModelChoiceFieldOverlay.prototype.enableBodyScrolling = function() {
        this.bodyElement.removeClass('django-cradmin-noscroll');
        return this.djangoCradminWindowDimensions.triggerWindowResizeEvent();
      };

      return ModelChoiceFieldOverlay;

    })();
    this.$get = [
      'djangoCradminWindowDimensions', function(djangoCradminWindowDimensions) {
        return new ModelChoiceFieldOverlay(djangoCradminWindowDimensions);
      }
    ];
    return this;
  }).directive('djangoCradminModelChoiceFieldIframeWrapper', [
    '$window', '$timeout', 'djangoCradminModelChoiceFieldCoordinator', 'djangoCradminWindowDimensions', function($window, $timeout, djangoCradminModelChoiceFieldCoordinator, djangoCradminWindowDimensions) {
      return {
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.origin = "" + window.location.protocol + "//" + window.location.host;
          $scope.bodyElement = angular.element($window.document.body);
          djangoCradminModelChoiceFieldCoordinator.registerModeChoiceFieldIframeWrapper(this);
          this.setIframe = function(iframeScope) {
            return $scope.iframeScope = iframeScope;
          };
          this._setField = function(fieldScope) {
            return $scope.fieldScope = fieldScope;
          };
          this._setPreviewElement = function(previewElementScope) {
            return $scope.previewElementScope = previewElementScope;
          };
          this.setLoadSpinner = function(loadSpinnerScope) {
            return $scope.loadSpinnerScope = loadSpinnerScope;
          };
          this.setIframeWrapperInner = function(iframeInnerScope) {
            return $scope.iframeInnerScope = iframeInnerScope;
          };
          this.onChangeValueBegin = function(fieldWrapperScope) {
            this._setField(fieldWrapperScope.fieldScope);
            this._setPreviewElement(fieldWrapperScope.previewElementScope);
            $scope.iframeScope.beforeShowingIframe(fieldWrapperScope.iframeSrc);
            return $scope.show();
          };
          this.onIframeLoadBegin = function() {
            return $scope.loadSpinnerScope.show();
          };
          this.onIframeLoaded = function() {
            $scope.iframeInnerScope.show();
            return $scope.loadSpinnerScope.hide();
          };
          $scope.onChangeValue = function(event) {
            var data;
            if (event.origin !== $scope.origin) {
              console.error("Message origin '" + event.origin + "' does not match current origin '" + $scope.origin + "'.");
              return;
            }
            data = angular.fromJson(event.data);
            if ($scope.fieldScope.fieldid !== data.fieldid) {
              return;
            }
            $scope.fieldScope.setValue(data.value);
            $scope.previewElementScope.setPreviewHtml(data.preview);
            $scope.hide();
            return $scope.iframeScope.afterFieldValueChange();
          };
          $window.addEventListener('message', $scope.onChangeValue, false);
          $scope.onWindowResize = function(newWindowDimensions) {
            return $scope.iframeScope.setIframeSize();
          };
          $scope.show = function() {
            $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-show');
            djangoCradminModelChoiceFieldCoordinator.disableBodyScrolling();
            djangoCradminModelChoiceFieldCoordinator.addBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper');
            djangoCradminModelChoiceFieldCoordinator.addBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push');
            return djangoCradminWindowDimensions.register($scope);
          };
          $scope.hide = function() {
            $scope.iframeWrapperElement.removeClass('django-cradmin-floating-fullsize-iframe-wrapper-show');
            djangoCradminModelChoiceFieldCoordinator.removeBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper');
            djangoCradminModelChoiceFieldCoordinator.removeBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push');
            djangoCradminModelChoiceFieldCoordinator.enableBodyScrolling();
            $scope.iframeScope.onHide();
            return djangoCradminWindowDimensions.unregister($scope);
          };
          this.closeIframe = function() {
            return $scope.hide();
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.iframeWrapperElement = element;
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldIframeWrapperInner', [
    '$window', function($window) {
      return {
        require: '^^djangoCradminModelChoiceFieldIframeWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.scrollToTop = function() {
            return $scope.element.scrollTop(0);
          };
          $scope.show = function() {
            return $scope.element.removeClass('ng-hide');
          };
          $scope.hide = function() {
            return $scope.element.addClass('ng-hide');
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.element = element;
          wrapperCtrl.setIframeWrapperInner(scope);
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
  }).directive('djangoCradminModelChoiceFieldLoadSpinner', function() {
    return {
      require: '^^djangoCradminModelChoiceFieldIframeWrapper',
      restrict: 'A',
      scope: {},
      controller: function($scope) {
        $scope.hide = function() {
          return $scope.element.addClass('ng-hide');
        };
        return $scope.show = function() {
          return $scope.element.removeClass('ng-hide');
        };
      },
      link: function(scope, element, attrs, wrapperCtrl) {
        scope.element = element;
        wrapperCtrl.setLoadSpinner(scope);
      }
    };
  }).directive('djangoCradminModelChoiceFieldIframe', [
    '$interval', function($interval) {
      return {
        require: '^djangoCradminModelChoiceFieldIframeWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          var currentScrollHeight, getIframeDocument, getIframeScrollHeight, getIframeWindow, resizeIfScrollHeightChanges, scrollHeightInterval, startScrollHeightInterval, stopScrollHeightInterval;
          scrollHeightInterval = null;
          currentScrollHeight = 0;
          getIframeWindow = function() {
            return $scope.element.contents();
          };
          getIframeDocument = function() {
            return getIframeWindow()[0];
          };
          getIframeScrollHeight = function() {
            var iframeDocument;
            iframeDocument = getIframeDocument();
            if ((iframeDocument != null ? iframeDocument.body : void 0) != null) {
              return iframeDocument.body.scrollHeight;
            } else {
              return 0;
            }
          };
          resizeIfScrollHeightChanges = function() {
            var newScrollHeight;
            newScrollHeight = getIframeScrollHeight();
            if (newScrollHeight !== currentScrollHeight) {
              currentScrollHeight = newScrollHeight;
              return $scope.setIframeSize();
            }
          };
          startScrollHeightInterval = function() {
            if (scrollHeightInterval == null) {
              return scrollHeightInterval = $interval(resizeIfScrollHeightChanges, 500);
            }
          };
          stopScrollHeightInterval = function() {
            if (scrollHeightInterval != null) {
              $interval.cancel(scrollHeightInterval);
              return scrollHeightInterval = null;
            }
          };
          $scope.onHide = function() {
            return stopScrollHeightInterval();
          };
          $scope.afterFieldValueChange = function() {
            return stopScrollHeightInterval();
          };
          $scope.beforeShowingIframe = function(iframeSrc) {
            var currentSrc;
            currentSrc = $scope.element.attr('src');
            if ((currentSrc == null) || currentSrc === '' || currentSrc !== iframeSrc) {
              $scope.loadedSrc = currentSrc;
              $scope.wrapperCtrl.onIframeLoadBegin();
              $scope.resetIframeSize();
              $scope.element.attr('src', iframeSrc);
            }
            return startScrollHeightInterval();
          };
          $scope.setIframeSize = function() {};
          $scope.resetIframeSize = function() {};
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.element = element;
          scope.wrapperCtrl = wrapperCtrl;
          wrapperCtrl.setIframe(scope);
          scope.element.on('load', function() {
            wrapperCtrl.onIframeLoaded();
            return scope.setIframeSize();
          });
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldWrapper', [
    'djangoCradminModelChoiceFieldCoordinator', function(djangoCradminModelChoiceFieldCoordinator) {
      return {
        restrict: 'A',
        scope: {
          iframeSrc: '@djangoCradminModelChoiceFieldWrapper'
        },
        controller: function($scope) {
          this.setField = function(fieldScope) {
            return $scope.fieldScope = fieldScope;
          };
          this.setPreviewElement = function(previewElementScope) {
            return $scope.previewElementScope = previewElementScope;
          };
          this.onChangeValueBegin = function() {
            return djangoCradminModelChoiceFieldCoordinator.onChangeValueBegin($scope);
          };
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldInput', [
    'djangoCradminModelChoiceFieldCoordinator', function(djangoCradminModelChoiceFieldCoordinator) {
      return {
        require: '^^djangoCradminModelChoiceFieldWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.setValue = function(value) {
            return $scope.inputElement.val(value);
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.inputElement = element;
          scope.fieldid = attrs['id'];
          wrapperCtrl.setField(scope);
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldPreview', [
    'djangoCradminModelChoiceFieldCoordinator', function(djangoCradminModelChoiceFieldCoordinator) {
      return {
        require: '^^djangoCradminModelChoiceFieldWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.setPreviewHtml = function(previewHtml) {
            return $scope.previewElement.html(previewHtml);
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.previewElement = element;
          wrapperCtrl.setPreviewElement(scope);
        }
      };
    }
  ]).directive('djangoCradminModelChoiceFieldChangebeginButton', [
    'djangoCradminModelChoiceFieldCoordinator', function(djangoCradminModelChoiceFieldCoordinator) {
      return {
        require: '^^djangoCradminModelChoiceFieldWrapper',
        restrict: 'A',
        scope: {},
        link: function(scope, element, attrs, wrapperCtrl) {
          element.on('click', function(e) {
            e.preventDefault();
            return wrapperCtrl.onChangeValueBegin();
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.forms.select', []).directive('djangoCradminOpenUrlStoredInSelectedOption', [
    function() {
      return {
        restrict: 'A',
        link: function($scope, $element, attributes) {
          var getValue;
          getValue = function() {
            return $element.find("option:selected").attr('value');
          };
          return $element.on('change', function() {
            var remoteUrl;
            remoteUrl = getValue();
            return window.location = value;
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  var app;

  app = angular.module('djangoCradmin.forms.setfieldvalue', ['cfp.hotkeys']);

  /**
  Directive for setting the value of a form field to specified value.
  
  Example:
  
  ```
    <button type="button"
            django-cradmin-setfieldvalue="2015-12-24 12:30"
            django-cradmin-setfieldvalue-field-id="my_datetimefield_id">
        Set value to 2015-12-24 12:30
    </button>
  ```
  
  You can make the directive change the focus on click after applying the
  value with ``django-cradmin-setfieldvalue-move-focus-on-click="<id>"``:
  
  ```
    <button type="button"
            django-cradmin-setfieldvalue="2015-12-24 12:30"
            django-cradmin-setfieldvalue-field-id="my_datetimefield_id"
            django-cradmin-setfieldvalue-move-focus-on-click="my_datetimefield_id">
        Set value to 2015-12-24 12:30
    </button>
  ```
  
  
  Can also be used on ``<a>``-elements. The directive uses ``e.preventDefault``
  to ensure the href is not triggered.
  */


  app.directive('djangoCradminSetfieldvalue', [
    function() {
      return {
        scope: {
          value: "@djangoCradminSetfieldvalue",
          fieldid: "@djangoCradminSetfieldvalueFieldId",
          moveFocusOnClick: "@djangoCradminSetfieldvalueMoveFocusOnClick"
        },
        link: function($scope, $element) {
          var fieldElement, focusElement;
          fieldElement = angular.element("#" + $scope.fieldid);
          if ($scope.moveFocusOnClick != null) {
            focusElement = angular.element("#" + $scope.moveFocusOnClick);
          }
          if (fieldElement.length === 0) {
            return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error("Could not find a field with the '" + $scope.fieldid + "' ID.") : void 0 : void 0;
          } else {
            $element.on('click', function(e) {
              e.preventDefault();
              fieldElement.val($scope.value);
              fieldElement.trigger('change');
              if (focusElement != null) {
                return focusElement.focus();
              }
            });
          }
        }
      };
    }
  ]);

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
      is captured, the default action is prevented, and we decode the
      given JSON encoded value and add ``postmessageid='django-cradmin-use-this'``
      to the object making it look something like this::
      
        ```
        {
          postmessageid: 'django-cradmin-use-this',
          value: '<the value provided via the django-cradmin attribute>',
          fieldid: '<the fieldid provided via the django-cradmin-fieldid attribute>',
          preview: '<the preview HTML>'
        }
        ```
      
      We assume there is a event listener listening for the ``message`` event on
      the message in the parent of the iframe where this was clicked, but no checks
      ensuring this is made.
      */

      return {
        restrict: 'A',
        scope: {
          data: '@djangoCradminUseThis'
        },
        link: function(scope, element, attrs) {
          element.on('click', function(e) {
            var data;
            e.preventDefault();
            data = angular.fromJson(scope.data);
            data.postmessageid = 'django-cradmin-use-this';
            return $window.parent.postMessage(angular.toJson(data), window.parent.location.href);
          });
        }
      };
    }
  ]).directive('djangoCradminUseThisHidden', [
    '$window', function($window) {
      /*
      Works just like the ``django-cradmin-use-this`` directive, except this
      is intended to be triggered on load.
      
      The intended use-case is to trigger the same action as clicking a
      ``django-cradmin-use-this``-button but on load, typically after creating/adding
      a new item that the user wants to be selected without any further manual input.
      */

      return {
        restrict: 'A',
        scope: {
          data: '@djangoCradminUseThisHidden'
        },
        link: function(scope, element, attrs) {
          var data;
          data = angular.fromJson(scope.data);
          data.postmessageid = 'django-cradmin-use-this';
          $window.parent.postMessage(angular.toJson(data), window.parent.location.href);
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
        return $scope.cradminImagePreviewImage = imgscope;
      };
      this.previewFile = function(file) {
        return $scope.cradminImagePreviewImage.previewFile(file);
      };
    };
    return {
      restrict: 'A',
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
    link = function($scope, element, attrs, previewCtrl) {
      $scope.element = element;
      previewCtrl.setImg($scope);
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
    link = function($scope, element, attrs, previewCtrl) {
      $scope.previewCtrl = previewCtrl;
      $scope.element = element;
      $scope.wrapperelement = element.parent();
      element.bind('change', function(evt) {
        var file;
        if (evt.target.files != null) {
          file = evt.target.files[0];
          return $scope.previewCtrl.previewFile(file);
        }
      });
      element.bind('mouseover', function() {
        return $scope.wrapperelement.addClass('django-cradmin-filewidget-field-and-overlay-wrapper-hover');
      });
      element.bind('mouseleave', function() {
        return $scope.wrapperelement.removeClass('django-cradmin-filewidget-field-and-overlay-wrapper-hover');
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
  angular.module('djangoCradmin.iosaddtohomescreen', []).directive('iosAddToHomeScreen', [
    '$window', 'cradminDetectize', function($window, cradminDetectize) {
      return {
        transclude: true,
        template: '<div ng-transclude>This is my directive content</div>',
        link: function($scope, $element, attrs) {
          if (attrs.forceOs != null) {
            $scope.os = attrs.forceOs;
          } else {
            $scope.os = cradminDetectize.os.name;
          }
          if (attrs.forceBrowser != null) {
            $scope.browser = attrs.forceBrowser;
          } else {
            $scope.browser = cradminDetectize.browser.name;
          }
          if (attrs.forceDeviceModel != null) {
            $scope.deviceModel = attrs.forceDeviceModel;
          } else {
            $scope.deviceModel = cradminDetectize.device.model;
          }
          if ($scope.os === 'ios' && $scope.browser === 'safari') {
            $element.show();
          } else {
            $element.hide();
          }
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin', ['djangoCradmin.templates', 'djangoCradmin.directives', 'djangoCradmin.providers', 'djangoCradmin.calendar.providers', 'djangoCradmin.messages', 'djangoCradmin.detectizr', 'djangoCradmin.menu', 'djangoCradmin.objecttable', 'djangoCradmin.acemarkdown', 'djangoCradmin.bulkfileupload', 'djangoCradmin.iosaddtohomescreen', 'djangoCradmin.imagepreview', 'djangoCradmin.collapse', 'djangoCradmin.modal', 'djangoCradmin.scrollfixed', 'djangoCradmin.pagepreview', 'djangoCradmin.forms.modelchoicefield', 'djangoCradmin.forms.usethisbutton', 'djangoCradmin.forms.datetimewidget', 'djangoCradmin.forms.filewidget', 'djangoCradmin.forms.setfieldvalue', 'djangoCradmin.forms.select', 'djangoCradmin.forms.clearabletextinput', 'djangoCradmin.backgroundreplace_element.providers', 'djangoCradmin.backgroundreplace_element.directives', 'djangoCradmin.listfilter.directives']);

}).call(this);

(function() {
  angular.module('djangoCradmin.listfilter.directives', []).directive('djangoCradminListfilter', [
    '$window', '$timeout', 'djangoCradminBgReplaceElement', function($window, $timeout, djangoCradminBgReplaceElement) {
      return {
        restrict: 'A',
        scope: {
          options: '=djangoCradminListfilter'
        },
        controller: function($scope, $element) {
          var $messageElement, filterListDomId, filterScopes, hideMessage, loadInProgress, onLoadSuccess, queueMessage, setLoadFinished, setLoadInProgress, showMessage, showMessageTimer,
            _this = this;
          filterListDomId = $element.attr('id');
          filterScopes = [];
          loadInProgress = false;
          $messageElement = null;
          showMessageTimer = null;
          this.loadIsInProgress = function() {
            return loadInProgress;
          };
          setLoadInProgress = function(options) {
            var filterScope, _i, _len, _results;
            loadInProgress = true;
            $scope.targetElement.addClass('django-cradmin-listfilter-target-loading');
            _results = [];
            for (_i = 0, _len = filterScopes.length; _i < _len; _i++) {
              filterScope = filterScopes[_i];
              _results.push(filterScope.onLoadInProgress(options.filterDomId));
            }
            return _results;
          };
          setLoadFinished = function(options) {
            var filterScope, _i, _len;
            loadInProgress = false;
            $scope.targetElement.removeClass('django-cradmin-listfilter-target-loading');
            for (_i = 0, _len = filterScopes.length; _i < _len; _i++) {
              filterScope = filterScopes[_i];
              filterScope.onLoadFinished(options.filterDomId);
            }
            return $scope.targetElement.attr('aria-busy', 'false');
          };
          onLoadSuccess = function($remoteHtmlDocument, remoteUrl) {
            var $remoteFilterList, filterScope, title, _i, _len, _results;
            $remoteFilterList = $remoteHtmlDocument.find('#' + filterListDomId);
            title = $window.document.title;
            $window.history.pushState("list filter change", title, remoteUrl);
            _results = [];
            for (_i = 0, _len = filterScopes.length; _i < _len; _i++) {
              filterScope = filterScopes[_i];
              _results.push(filterScope.syncWithRemoteFilterList($remoteFilterList));
            }
            return _results;
          };
          showMessage = function(variant, message) {
            var loadspinner;
            hideMessage();
            loadspinner = "";
            if ($scope.options.loadspinner_css_class != null) {
              loadspinner = "<span class='django-cradmin-listfilter-message-loadspinner " + ("" + $scope.options.loadspinner_css_class + "' aria-hidden='true'></span>");
            }
            $messageElement = angular.element("<div aria-role='progressbar' " + ("class='django-cradmin-listfilter-message django-cradmin-listfilter-message-" + variant + "'>") + ("" + loadspinner) + ("<span class='django-cradmin-listfilter-message-text'>" + message + "</span></div>"));
            $messageElement.prependTo($scope.targetElement);
            return $scope.targetElement.attr('aria-busy', 'true');
          };
          queueMessage = function(variant, message) {
            if (showMessageTimer != null) {
              $timeout.cancel(showMessageTimer);
            }
            return showMessageTimer = $timeout(function() {
              return showMessage(variant, message);
            }, $scope.options.loadingmessage_delay_milliseconds);
          };
          hideMessage = function() {
            if (showMessageTimer != null) {
              $timeout.cancel(showMessageTimer);
            }
            if ($messageElement) {
              $messageElement.remove();
              return $messageElement = null;
            }
          };
          this.load = function(options) {
            setLoadInProgress(options);
            queueMessage('loading', options.loadingmessage);
            return djangoCradminBgReplaceElement.load({
              parameters: {
                method: 'GET',
                url: options.remoteUrl
              },
              remoteElementSelector: '#' + $scope.options.target_dom_id,
              targetElement: $scope.targetElement,
              $scope: $scope,
              replace: true,
              onHttpError: function(response) {
                if (typeof console !== "undefined" && console !== null) {
                  if (typeof console.error === "function") {
                    console.error('Error while filtering', response);
                  }
                }
                return showMessage('error', $scope.options.loaderror_message);
              },
              onSuccess: function($remoteHtmlDocument) {
                onLoadSuccess($remoteHtmlDocument, options.remoteUrl);
                if (options.onLoadSuccess != null) {
                  return options.onLoadSuccess(options.onLoadSuccessData);
                }
              },
              onFinish: function() {
                setLoadFinished(options);
                return hideMessage();
              }
            });
          };
          this.addFilterScope = function(filterScope) {
            return filterScopes.push(filterScope);
          };
        },
        link: function($scope, $element, attributes) {
          $scope.targetElement = angular.element('#' + $scope.options.target_dom_id);
        }
      };
    }
  ]).directive('djangoCradminListfilterSelect', [
    function() {
      return {
        restrict: 'A',
        require: '^djangoCradminListfilter',
        scope: {
          options: '=djangoCradminListfilterSelect'
        },
        controller: function($scope, $element) {
          /*
          Replace all <option>-elements with new <option>-elements from the server.
          */

          $scope.syncWithRemoteFilterList = function($remoteFilterList) {
            var $remoteElement, domId;
            domId = $element.attr('id');
            $remoteElement = $remoteFilterList.find('#' + domId);
            $element.empty();
            return $element.append(angular.element($remoteElement.html()));
          };
          $scope.onLoadInProgress = function(filterDomId) {
            return $element.prop('disabled', true);
          };
          $scope.onLoadFinished = function(filterDomId) {
            return $element.prop('disabled', false);
          };
        },
        link: function($scope, $element, attributes, listfilterCtrl) {
          var getValue;
          listfilterCtrl.addFilterScope($scope);
          getValue = function() {
            return $element.find("option:selected").attr('value');
          };
          $element.on('change', function() {
            var remoteUrl;
            remoteUrl = getValue();
            return listfilterCtrl.load({
              remoteUrl: remoteUrl,
              filterDomId: $element.attr('id'),
              loadingmessage: $scope.options.loadingmessage,
              onLoadSuccess: function() {
                return $element.focus();
              }
            });
          });
        }
      };
    }
  ]).directive('djangoCradminListfilterTextinput', [
    '$timeout', function($timeout) {
      var urlpatternAttribute, urlpatternReplaceText;
      urlpatternAttribute = 'django-cradmin-listfilter-urlpattern';
      urlpatternReplaceText = '_-_TEXTINPUT_-_VALUE_-_';
      return {
        restrict: 'A',
        require: '^djangoCradminListfilter',
        scope: {
          options: '=djangoCradminListfilterTextinput'
        },
        controller: function($scope, $element) {
          /*
          Update the "django-cradmin-listfilter-urlpattern"-attribute with
          the one from the server.
          */

          $scope.syncWithRemoteFilterList = function($remoteFilterList) {
            var $remoteElement, domId;
            domId = $element.attr('id');
            $remoteElement = $remoteFilterList.find('#' + domId);
            return $element.attr(urlpatternAttribute, $remoteElement.attr(urlpatternAttribute));
          };
          $scope.onLoadInProgress = function(filterDomId) {
            if (filterDomId !== $element.attr('id')) {
              return $element.prop('disabled', true);
            }
          };
          $scope.onLoadFinished = function(filterDomId) {
            return $element.prop('disabled', false);
          };
        },
        link: function($scope, $element, attributes, listfilterCtrl) {
          var applySearchTimer, buildUrl, loadSearch, loadedValue, onLoadSearchSuccess, onValueChange, timeoutMilliseconds;
          listfilterCtrl.addFilterScope($scope);
          applySearchTimer = null;
          loadedValue = $element.val();
          timeoutMilliseconds = $scope.options.timeout_milliseconds;
          if (timeoutMilliseconds == null) {
            timeoutMilliseconds = 500;
          }
          buildUrl = function(value) {
            var urlpattern;
            urlpattern = $element.attr(urlpatternAttribute);
            return urlpattern.replace(urlpatternReplaceText, value);
          };
          onLoadSearchSuccess = function(data) {
            var currentValue;
            currentValue = $element.val();
            if (data.value !== currentValue) {
              onValueChange(true);
            }
            return loadedValue = data.value;
          };
          loadSearch = function() {
            var remoteUrl, value;
            if (listfilterCtrl.loadIsInProgress()) {
              return;
            }
            value = $element.val();
            if (loadedValue === value) {
              return;
            }
            remoteUrl = buildUrl(value);
            loadedValue = value;
            return listfilterCtrl.load({
              remoteUrl: remoteUrl,
              onLoadSuccess: onLoadSearchSuccess,
              onLoadSuccessData: {
                value: value
              },
              filterDomId: $element.attr('id'),
              loadingmessage: $scope.options.loadingmessage
            });
          };
          onValueChange = function(useTimeout) {
            if (applySearchTimer != null) {
              $timeout.cancel(applySearchTimer);
            }
            if (!listfilterCtrl.loadIsInProgress()) {
              if (useTimeout) {
                return applySearchTimer = $timeout(loadSearch, timeoutMilliseconds);
              } else {
                return loadSearch();
              }
            }
          };
          $element.on('change', function() {
            return onValueChange(false);
          });
          $element.on('keydown', function(e) {
            if (e.which === 13) {
              return onValueChange(false);
            } else {
              return onValueChange(true);
            }
          });
        }
      };
    }
  ]).directive('djangoCradminListfilterCheckboxlist', [
    function() {
      return {
        restrict: 'A',
        require: '^djangoCradminListfilter',
        scope: {
          options: '=djangoCradminListfilterCheckboxlist'
        },
        controller: function($scope, $element) {
          /*
          Replace all contents with new elements from the server.
          */

          $scope.syncWithRemoteFilterList = function($remoteFilterList) {
            var $remoteElement, domId;
            domId = $element.attr('id');
            $remoteElement = $remoteFilterList.find('#' + domId);
            $element.empty();
            $element.append(angular.element($remoteElement.html()));
            return $scope.registerCheckboxChangeListeners(true);
          };
          $scope.onLoadInProgress = function(filterDomId) {
            return $element.find('input').prop('disabled', true);
          };
          $scope.onLoadFinished = function(filterDomId) {
            return $element.find('input').prop('disabled', false);
          };
        },
        link: function($scope, $element, attributes, listfilterCtrl) {
          var getUrl;
          listfilterCtrl.addFilterScope($scope);
          getUrl = function($inputElement) {
            return $inputElement.attr('data-url');
          };
          $scope.onCheckboxChange = function(e) {
            var remoteUrl;
            console.log('Change');
            remoteUrl = getUrl(angular.element(e.target));
            return listfilterCtrl.load({
              remoteUrl: remoteUrl,
              filterDomId: $element.attr('id'),
              loadingmessage: $scope.options.loadingmessage,
              onLoadSuccess: function() {
                return $element.focus();
              }
            });
          };
          $scope.registerCheckboxChangeListeners = function(removeFirst) {
            if (removeFirst) {
              $element.find('input').off('change', $scope.onCheckboxChange);
            }
            return $element.find('input').on('change', $scope.onCheckboxChange);
          };
          $scope.registerCheckboxChangeListeners(false);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.menu', []).directive('djangoCradminMenu', [
    function() {
      /** Menu that collapses automatically on small displays.
      
      Example
      =======
      
      ```html
      <nav django-cradmin-menu class="django-cradmin-menu">
        <div class="django-cradmin-menu-mobileheader">
          <a href="#" role="button"
              class="django-cradmin-menu-mobiletoggle"
              ng-click="cradminMenuTogglePressed()"
              ng-class="{'django-cradmin-menu-mobile-toggle-button-expanded': cradminMenuDisplay}"
              aria-pressed="{{ getAriaPressed() }}">
            Menu
          </a>
        </div>
        <div class="django-cradmin-menu-content"
            ng-class="{'django-cradmin-menu-content-display': cradminMenuDisplay}">
          <ul>
            <li><a href="#">Menu item 1</a></li>
            <li><a href="#">Menu item 2</a></li>
          </ul>
        </div>
      </nav>
      ```
      
      Design notes
      ============
      
      The example uses css classes provided by the default cradmin CSS, but
      you specify all classes yourself, so you can easily provide your own
      css classes and still use the directive.
      */

      return {
        scope: true,
        controller: function($scope, djangoCradminPagePreview) {
          $scope.cradminMenuDisplay = false;
          $scope.cradminMenuTogglePressed = function() {
            return $scope.cradminMenuDisplay = !$scope.cradminMenuDisplay;
          };
          $scope.getAriaPressed = function() {
            if ($scope.cradminMenuDisplay) {
              return 'pressed';
            } else {
              return '';
            }
          };
          this.close = function() {
            $scope.cradminMenuDisplay = false;
            return $scope.$apply();
          };
        }
      };
    }
  ]).directive('djangoCradminMenuAutodetectOverflowY', [
    'djangoCradminWindowDimensions', function(djangoCradminWindowDimensions) {
      /**
      */

      return {
        require: '?djangoCradminMenu',
        controller: function($scope) {
          var disableInitialWatcher;
          $scope.onWindowResize = function(newWindowDimensions) {
            return $scope.setOrUnsetOverflowYClass();
          };
          $scope.setOrUnsetOverflowYClass = function() {
            var menuDomElement, _ref;
            menuDomElement = (_ref = $scope.menuElement) != null ? _ref[0] : void 0;
            if (menuDomElement != null) {
              if (menuDomElement.clientHeight < menuDomElement.scrollHeight) {
                return $scope.menuElement.addClass($scope.overflowYClass);
              } else {
                return $scope.menuElement.removeClass($scope.overflowYClass);
              }
            }
          };
          disableInitialWatcher = $scope.$watch(function() {
            var _ref;
            if (((_ref = $scope.menuElement) != null ? _ref[0] : void 0) != null) {
              return true;
            } else {
              return false;
            }
          }, function(newValue) {
            if (newValue) {
              $scope.setOrUnsetOverflowYClass();
              return disableInitialWatcher();
            }
          });
        },
        link: function($scope, element, attrs) {
          $scope.overflowYClass = attrs.djangoCradminMenuAutodetectOverflowY;
          $scope.menuElement = element;
          djangoCradminWindowDimensions.register($scope);
          $scope.$on('$destroy', function() {
            return djangoCradminWindowDimensions.unregister($scope);
          });
        }
      };
    }
  ]).directive('djangoCradminMenuCloseOnClick', [
    function() {
      /** Directive that you can put on menu links to automatically close the
      menu on click.
      */

      return {
        require: '^^djangoCradminMenu',
        link: function(scope, element, attrs, djangoCradminMenuCtrl) {
          element.on('click', function() {
            djangoCradminMenuCtrl.close();
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.messages', []).controller('DjangoCradminMessagesCtrl', [
    '$scope', '$timeout', function($scope, $timeout) {
      $scope.loading = true;
      $timeout(function() {
        return $scope.loading = false;
      }, 650);
      $scope.messageHidden = {};
      $scope.hideMessage = function(index) {
        return $scope.messageHidden[index] = true;
      };
      $scope.messageIsHidden = function(index) {
        return $scope.messageHidden[index];
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.modal', []).directive('djangoCradminModalWrapper', [
    function() {
      /** Shows a modal window on click.
      
      Example
      =======
      
      ```html
      <div django-cradmin-modal-wrapper>
        <button ng-click="showModal($event)" type="button">
          Show modal window
        </button>
        <div django-cradmin-modal class="django-cradmin-modal"
                ng-class="{'django-cradmin-modal-visible': modalVisible}">
            <div class="django-cradmin-modal-backdrop" ng-click="hideModal()"></div>
            <div class="django-cradmin-modal-content">
                <p>Something here</p>
                <button ng-click="hideModal()" type="button">
                  Hide modal window
                </button>
            </div>
        </div>
      </div>
      ```
      */

      return {
        scope: true,
        controller: function($scope) {
          var bodyElement;
          $scope.modalVisible = false;
          bodyElement = angular.element('body');
          $scope.showModal = function(e) {
            if (e != null) {
              e.preventDefault();
            }
            $scope.modalVisible = true;
            bodyElement.addClass('django-cradmin-noscroll');
          };
          $scope.hideModal = function() {
            $scope.modalVisible = false;
            bodyElement.removeClass('django-cradmin-noscroll');
          };
        }
      };
    }
  ]).directive('djangoCradminModal', [
    function() {
      return {
        require: '^^djangoCradminModalWrapper',
        link: function($scope, element) {
          var body;
          body = angular.element('body');
          return element.appendTo(body);
        }
      };
    }
  ]);

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

(function() {
  angular.module('djangoCradmin.pagepreview', []).provider('djangoCradminPagePreview', function() {
    var PagePreview;
    PagePreview = (function() {
      function PagePreview() {
        this.pagePreviewWrapper = null;
        this.bodyContentWrapperElement = angular.element('#django_cradmin_bodycontentwrapper');
        this.bodyElement = angular.element('body');
      }

      PagePreview.prototype.registerPagePreviewWrapper = function(pagePreviewWrapper) {
        return this.pagePreviewWrapper = pagePreviewWrapper;
      };

      PagePreview.prototype.setPreviewConfig = function(previewConfig) {
        return this.pagePreviewWrapper.setPreviewConfig(previewConfig);
      };

      PagePreview.prototype.addBodyContentWrapperClass = function(cssclass) {
        return this.bodyContentWrapperElement.addClass(cssclass);
      };

      PagePreview.prototype.removeBodyContentWrapperClass = function(cssclass) {
        return this.bodyContentWrapperElement.removeClass(cssclass);
      };

      PagePreview.prototype.disableBodyScrolling = function() {
        return this.bodyElement.addClass('django-cradmin-noscroll');
      };

      PagePreview.prototype.enableBodyScrolling = function() {
        return this.bodyElement.removeClass('django-cradmin-noscroll');
      };

      return PagePreview;

    })();
    this.$get = function() {
      return new PagePreview();
    };
    return this;
  }).directive('djangoCradminPagePreviewWrapper', [
    '$window', '$timeout', 'djangoCradminPagePreview', function($window, $timeout, djangoCradminPagePreview) {
      /*
      A directive that shows a preview of a page in an iframe.
      value.
      
      Components:
      
        - A DIV using this directive (``django-cradmin-page-preview-wrapper``)
          with the following child elements:
          - A child DIV using the ``django-cradmin-page-preview-iframe-wrapper``
            directive with the following child elements:
            - A "Close" link/button using the ``django-cradmin-page-preview-iframe-closebutton`` directive.
            - A IFRAME element using the ``django-cradmin-page-preview-iframe`` directive.
          - A child element with one of the following directives:
            - ``django-cradmin-page-preview-open-on-page-load`` to show the preview when the page loads.
            - ``django-cradmin-page-preview-open-on-click`` to show the preview when the element is clicked.
      
      The outer wrapper (``django-cradmin-page-preview-wrapper``) coordinates everything.
      
      You can have one wrapper with many ``django-cradmin-page-preview-open-on-click`` directives.
      This is typically used in listings where each item in the list has its own preview button.
      Just wrap the entire list in a ``django-cradmin-page-preview-wrapper``, add the
      ``django-cradmin-page-preview-iframe-wrapper`` before the list, and a button/link with
      the ``django-cradmin-page-preview-open-on-click``-directive for each entry in the list.
      
      
      Example:
      
      ```
      <div django-cradmin-page-preview-wrapper>
          <div class="django-cradmin-floating-fullsize-iframe-wrapper"
               django-cradmin-page-preview-iframe-wrapper>
              <a href="#" class="django-cradmin-floating-fullsize-iframe-closebutton"
                 django-cradmin-page-preview-iframe-closebutton>
                  <span class="fa fa-close"></span>
                  <span class="sr-only">Close preview</span>
              </a>
              <div class="ng-hide django-cradmin-floating-fullsize-loadspinner">
                  <span class="fa fa-spinner fa-spin"></span>
              </div>
              <div class="django-cradmin-floating-fullsize-iframe-inner">
                  <iframe django-cradmin-page-preview-iframe></iframe>
              </div>
          </div>
      
          <div django-cradmin-page-preview-open-on-page-load="'/some/view'"></div>
      </div>
      ```
      */

      return {
        restrict: 'A',
        scope: {},
        controller: function($scope, djangoCradminPagePreview) {
          var previewConfigWaitingForStartup;
          djangoCradminPagePreview.registerPagePreviewWrapper(this);
          $scope.origin = "" + window.location.protocol + "//" + window.location.host;
          $scope.mainWindow = angular.element($window);
          $scope.windowDimensions = null;
          previewConfigWaitingForStartup = null;
          this.setIframeWrapper = function(iframeWrapperScope) {
            $scope.iframeWrapperScope = iframeWrapperScope;
            return this._readyCheck();
          };
          this.setIframe = function(iframeScope) {
            $scope.iframeScope = iframeScope;
            return this._readyCheck();
          };
          this.setNavbar = function(navbarScope) {
            $scope.navbarScope = navbarScope;
            return this._readyCheck();
          };
          this.setLoadSpinner = function(loadSpinnerScope) {
            $scope.loadSpinnerScope = loadSpinnerScope;
            return this._readyCheck();
          };
          this.setIframeWrapperInner = function(iframeInnerScope) {
            return $scope.iframeInnerScope = iframeInnerScope;
          };
          this.showNavbar = function() {
            return $scope.iframeWrapperScope.showNavbar();
          };
          this.setUrl = function(url) {
            $scope.loadSpinnerScope.show();
            $scope.iframeInnerScope.scrollToTop();
            return $scope.iframeScope.setUrl(url);
          };
          this._readyCheck = function() {
            var isReady;
            isReady = ($scope.iframeInnerScope != null) && ($scope.loadSpinnerScope != null) && ($scope.navbarScope != null) && ($scope.iframeScope != null) && ($scope.iframeWrapperScope != null);
            if (isReady) {
              return this._onReady();
            }
          };
          this._onReady = function() {
            if (previewConfigWaitingForStartup != null) {
              return this._applyPreviewConfig();
            }
          };
          this._applyPreviewConfig = function() {
            var url;
            url = previewConfigWaitingForStartup.urls[0].url;
            $scope.navbarScope.setConfig(previewConfigWaitingForStartup);
            $scope.iframeInnerScope.hide();
            previewConfigWaitingForStartup = null;
            this.showPreview();
            return this.setUrl(url);
          };
          this.setPreviewConfig = function(previewConfig) {
            /*
            Called once on startup
            */

            previewConfigWaitingForStartup = previewConfig;
            return this._readyCheck();
          };
          this.showPreview = function() {
            djangoCradminPagePreview.addBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper');
            $scope.iframeWrapperScope.show();
            return $scope.mainWindow.bind('resize', $scope.onWindowResize);
          };
          this.hidePreview = function() {
            $scope.iframeWrapperScope.hide();
            $scope.mainWindow.unbind('resize', $scope.onWindowResize);
            return djangoCradminPagePreview.removeBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper');
          };
          this.onIframeLoaded = function() {
            $scope.iframeInnerScope.show();
            return $scope.loadSpinnerScope.hide();
          };
          $scope.getWindowDimensions = function() {
            return {
              height: $scope.mainWindow.height(),
              width: $scope.mainWindow.width()
            };
          };
          $scope.$watch('windowDimensions', (function(newSize, oldSize) {
            $scope.iframeScope.setIframeSize();
          }), true);
          $scope.onWindowResize = function() {
            $timeout.cancel($scope.applyResizeTimer);
            $scope.applyResizeTimer = $timeout(function() {
              $scope.windowDimensions = $scope.getWindowDimensions();
              return $scope.$apply();
            }, 300);
          };
        },
        link: function(scope, element) {}
      };
    }
  ]).directive('djangoCradminPagePreviewIframeWrapper', [
    '$window', 'djangoCradminPagePreview', function($window, djangoCradminPagePreview) {
      return {
        require: '^^djangoCradminPagePreviewWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.show = function() {
            $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-show');
            djangoCradminPagePreview.disableBodyScrolling();
            return djangoCradminPagePreview.addBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push');
          };
          $scope.hide = function() {
            $scope.iframeWrapperElement.removeClass('django-cradmin-floating-fullsize-iframe-wrapper-show');
            djangoCradminPagePreview.enableBodyScrolling();
            return djangoCradminPagePreview.removeBodyContentWrapperClass('django-cradmin-floating-fullsize-iframe-bodycontentwrapper-push');
          };
          $scope.showNavbar = function() {
            return $scope.iframeWrapperElement.addClass('django-cradmin-floating-fullsize-iframe-wrapper-with-navbar');
          };
          $scope.scrollToTop = function() {
            return $scope.iframeWrapperElement.scrollTop(0);
          };
          this.hide = function() {
            return $scope.hide();
          };
          this.show = function() {
            return $scope.show();
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.iframeWrapperElement = element;
          wrapperCtrl.setIframeWrapper(scope);
        }
      };
    }
  ]).directive('djangoCradminPagePreviewIframeWrapperInner', [
    '$window', function($window) {
      return {
        require: '^^djangoCradminPagePreviewWrapper',
        restrict: 'A',
        scope: {},
        controller: function($scope) {
          $scope.scrollToTop = function() {
            return $scope.element.scrollTop(0);
          };
          $scope.show = function() {
            return $scope.element.removeClass('ng-hide');
          };
          $scope.hide = function() {
            return $scope.element.addClass('ng-hide');
          };
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          scope.element = element;
          wrapperCtrl.setIframeWrapperInner(scope);
        }
      };
    }
  ]).directive('djangoCradminPagePreviewIframeClosebutton', function() {
    return {
      require: '^^djangoCradminPagePreviewWrapper',
      restrict: 'A',
      scope: {},
      link: function(scope, element, attrs, wrapperCtrl) {
        element.on('click', function(e) {
          e.preventDefault();
          return wrapperCtrl.hidePreview();
        });
      }
    };
  }).directive('djangoCradminPagePreviewLoadSpinner', function() {
    return {
      require: '^^djangoCradminPagePreviewWrapper',
      restrict: 'A',
      scope: {},
      controller: function($scope) {
        $scope.hide = function() {
          return $scope.element.addClass('ng-hide');
        };
        return $scope.show = function() {
          return $scope.element.removeClass('ng-hide');
        };
      },
      link: function(scope, element, attrs, wrapperCtrl) {
        scope.element = element;
        wrapperCtrl.setLoadSpinner(scope);
      }
    };
  }).directive('djangoCradminPagePreviewNavbar', function() {
    return {
      require: '^^djangoCradminPagePreviewWrapper',
      restrict: 'A',
      scope: {
        mobileMenuHeader: '@djangoCradminPagePreviewNavbarMobileMenuHeader'
      },
      templateUrl: 'pagepreview/navbar.tpl.html',
      controller: function($scope) {
        $scope.activeIndex = 0;
        $scope.activeUrlConfig = null;
        $scope.setConfig = function(previewConfig) {
          if (previewConfig.urls.length > 1) {
            $scope.previewConfig = previewConfig;
            $scope.setActive(0);
            $scope.$apply();
            return $scope.wrapperCtrl.showNavbar();
          }
        };
        return $scope.setActive = function(index) {
          $scope.activeIndex = index;
          return $scope.activeUrlConfig = $scope.previewConfig.urls[$scope.activeIndex];
        };
      },
      link: function($scope, element, attrs, wrapperCtrl) {
        $scope.element = element;
        $scope.wrapperCtrl = wrapperCtrl;
        $scope.wrapperCtrl.setNavbar($scope);
        $scope.onNavlinkClick = function(e, index) {
          e.preventDefault();
          $scope.setActive(index);
          $scope.wrapperCtrl.setUrl($scope.previewConfig.urls[index].url);
        };
      }
    };
  }).directive('djangoCradminPagePreviewIframe', function() {
    return {
      require: '^^djangoCradminPagePreviewWrapper',
      restrict: 'A',
      scope: {},
      controller: function($scope) {
        $scope.setUrl = function(url) {
          $scope.element.attr('src', url);
          return $scope.resetIframeSize();
        };
        $scope.setIframeSize = function() {
          var iframeBodyHeight, iframeDocument, iframeWindow;
          iframeWindow = $scope.element.contents();
          iframeDocument = iframeWindow[0];
          if (iframeDocument != null) {
            iframeBodyHeight = iframeDocument.body.offsetHeight;
            return $scope.element.height(iframeBodyHeight + 60);
          }
        };
        return $scope.resetIframeSize = function() {
          return $scope.element.height('40px');
        };
      },
      link: function(scope, element, attrs, wrapperCtrl) {
        scope.element = element;
        wrapperCtrl.setIframe(scope);
        scope.element.on('load', function() {
          wrapperCtrl.onIframeLoaded();
          return scope.setIframeSize();
        });
      }
    };
  }).directive('djangoCradminPagePreviewOpenOnPageLoad', [
    'djangoCradminPagePreview', function(djangoCradminPagePreview) {
      /*
      A directive that opens the given URL in an iframe overlay instantly (on page load).
      */

      return {
        restrict: 'A',
        scope: {
          previewConfig: '=djangoCradminPagePreviewOpenOnPageLoad'
        },
        link: function(scope, element, attrs) {
          djangoCradminPagePreview.setPreviewConfig(scope.previewConfig);
        }
      };
    }
  ]).directive('djangoCradminPagePreviewOpenOnClick', [
    'djangoCradminPagePreview', function(djangoCradminPagePreview) {
      /*
      A directive that opens the given URL in an iframe overlay on click.
      */

      return {
        restrict: 'A',
        scope: {
          previewConfig: '=djangoCradminPagePreviewOpenOnClick'
        },
        link: function(scope, element, attrs) {
          element.on('click', function(e) {
            e.preventDefault();
            return djangoCradminPagePreview.setPreviewConfig(scope.previewConfig);
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('djangoCradmin.scrollfixed', []).directive('djangoCradminScrollTopFixed', [
    'djangoCradminWindowScrollTop', function(djangoCradminWindowScrollTop) {
      /** Keep an item aligned relative to a given top pixel position on the screen when scrolling.
      
      Example
      =======
      
      ```html
      <div django-cradmin-scroll-top-fixed>
        Some content here.
      </div>
      ```
      
      Make sure you style your element with absolute position. Example:
      
      ```
      position: absolute;
      top: 0;
      left: 0;
      ```
      
      Uses the initial top position as the offset. This means that you can style an element
      with something like this:
      
      ```
      position: absolute;
      top: 40px;
      right: 90px;
      ```
      
      And have it stay 40px from the top of the viewarea.
      
      Handling mobile devices
      =======================
      You may not want to scroll content on small displays. You
      should solve this with CSS media queries - simply do not
      use ``position: absolute;`` for the screen sizes you do
      not want to scroll.
      */

      var isUsingDefaultScroll, swapClasses, swapCssClasses;
      isUsingDefaultScroll = true;
      swapClasses = false;
      swapCssClasses = function($scope, $element, newWindowTopPosition) {
        var settings;
        settings = $scope.djangoCradminScrollTopFixedSettings;
        if (newWindowTopPosition >= $scope.djangoCradminScrollTopFixedInitialTopOffset) {
          if (isUsingDefaultScroll) {
            $element.removeClass(settings.cssClasses.defaultClass);
            $element.addClass(settings.cssClasses.scrollClass);
            return isUsingDefaultScroll = false;
          }
        } else if (newWindowTopPosition < $scope.djangoCradminScrollTopFixedInitialTopOffset) {
          if (!isUsingDefaultScroll) {
            $element.addClass(settings.cssClasses.defaultClass);
            $element.removeClass(settings.cssClasses.scrollClass);
            return isUsingDefaultScroll = true;
          }
        }
      };
      return {
        controller: function($scope, $element, $attrs) {
          $scope.djangoCradminScrollTopFixedSettings = $scope.$eval($attrs.djangoCradminScrollTopFixed);
          if ($scope.djangoCradminScrollTopFixedSettings.cssClasses != null) {
            if ($scope.djangoCradminScrollTopFixedSettings.cssClasses.defaultClass && $scope.djangoCradminScrollTopFixedSettings.cssClasses.scrollClass) {
              swapClasses = true;
            }
          }
          $scope.onWindowScrollTop = function(newWindowTopPosition) {
            var newTopPosition, offset;
            if (swapClasses) {
              swapCssClasses($scope, $element, newWindowTopPosition);
            }
            offset = $scope.djangoCradminScrollTopFixedInitialTopOffset;
            if ($scope.djangoCradminScrollTopFixedSettings.pinToTopOnScroll) {
              if (newWindowTopPosition > offset) {
                offset = 0;
              } else {
                offset = offset - newWindowTopPosition;
              }
            }
            newTopPosition = newWindowTopPosition + offset;
            return $scope.djangoCradminScrollTopFixedElement.css('top', "" + newTopPosition + "px");
          };
        },
        link: function($scope, element, attrs) {
          $scope.djangoCradminScrollTopFixedElement = element;
          $scope.djangoCradminScrollTopFixedInitialTopOffset = parseInt(element.css('top'), 10) || 0;
          djangoCradminWindowScrollTop.register($scope);
          $scope.$on('$destroy', function() {
            return djangoCradminWindowScrollTop.unregister($scope);
          });
        }
      };
    }
  ]);

}).call(this);

angular.module('djangoCradmin.templates', ['acemarkdown/acemarkdown.tpl.html', 'bulkfileupload/fileinfo.tpl.html', 'bulkfileupload/progress.tpl.html', 'bulkfileupload/rejectedfiles.tpl.html', 'forms/dateselector.tpl.html', 'pagepreview/navbar.tpl.html']);

angular.module("acemarkdown/acemarkdown.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("acemarkdown/acemarkdown.tpl.html",
    "<div ng-transclude></div>");
}]);

angular.module("bulkfileupload/fileinfo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bulkfileupload/fileinfo.tpl.html",
    "<p class=\"django-cradmin-bulkfileupload-progress-item\"\n" +
    "        ng-class=\"{\n" +
    "            'django-cradmin-bulkfileupload-progress-item-finished': fileInfo.finished,\n" +
    "            'django-cradmin-bulkfileupload-progress-item-error django-cradmin-bulkfileupload-errorparagraph': fileInfo.hasErrors\n" +
    "        }\">\n" +
    "    <button django-cradmin-bulkfileupload-remove-file-button=\"fileInfo\"\n" +
    "            ng-if=\"fileInfo.finished\"\n" +
    "            type=\"button\"\n" +
    "            class=\"btn btn-link django-cradmin-bulkfileupload-remove-file-button\">\n" +
    "        <span ng-if=\"!fileInfo.isRemoving &amp;&amp; !fileInfo.autosubmit\"\n" +
    "              class=\"django-cradmin-bulkfileupload-remove-file-button-isnotremoving\">\n" +
    "            <span class=\"fa fa-times\"></span>\n" +
    "            <span class=\"sr-only\">{{fileInfo.i18nStrings.remove_file_label}}</span>\n" +
    "        </span>\n" +
    "        <span ng-if=\"fileInfo.isRemoving\"\n" +
    "              class=\"django-cradmin-bulkfileupload-remove-file-button-isremoving\">\n" +
    "            <span class=\"fa fa-spinner fa-spin\"></span>\n" +
    "            <span class=\"sr-only\">{{fileInfo.i18nStrings.removing_file_message}}</span>\n" +
    "        </span>\n" +
    "    </button>\n" +
    "\n" +
    "    <span class=\"django-cradmin-progressbar\">\n" +
    "        <span class=\"django-cradmin-progressbar-progress\" ng-style=\"{'width': fileInfo.percent+'%'}\">&nbsp;</span>\n" +
    "        <span class=\"django-cradmin-progresspercent\">\n" +
    "            <span class=\"django-cradmin-progresspercent-number\">{{ fileInfo.percent }}</span>%\n" +
    "        </span>\n" +
    "    </span>\n" +
    "    <span class=\"django-cradmin-filename\">{{fileInfo.name}}</span>\n" +
    "</p>\n" +
    "");
}]);

angular.module("bulkfileupload/progress.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bulkfileupload/progress.tpl.html",
    "<div class=\"django-cradmin-bulkfileupload-progress\">\n" +
    "    <div ng-repeat=\"fileInfo in fileInfoArray\">\n" +
    "        <div django-cradmin-bulk-file-info=\"fileInfo\"\n" +
    "             class=\"django-cradmin-bulkfileupload-progress-file\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("bulkfileupload/rejectedfiles.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bulkfileupload/rejectedfiles.tpl.html",
    "<div class=\"django-cradmin-bulkfileupload-rejectedfiles\">\n" +
    "    <p ng-repeat=\"fileInfo in rejectedFiles\"\n" +
    "            class=\"django-cradmin-bulkfileupload-rejectedfile django-cradmin-bulkfileupload-errorparagraph\">\n" +
    "        <button ng-click=\"closeMessage(fileInfo)\"\n" +
    "                type=\"button\"\n" +
    "                class=\"btn btn-link django-cradmin-bulkfileupload-error-closebutton\">\n" +
    "            <span class=\"fa fa-times\"></span>\n" +
    "            <span class=\"sr-only\">{{fileInfo.i18nStrings.close_errormessage_label}}</span>\n" +
    "        </button>\n" +
    "\n" +
    "        <span class=\"django-cradmin-bulkfileupload-rejectedfile-filename\">{{ fileInfo.name }}:</span>\n" +
    "        <span ng-repeat=\"(errorfield,errors) in fileInfo.errors\">\n" +
    "            <span ng-repeat=\"error in errors\"\n" +
    "                  class=\"django-cradmin-bulkfileupload-error\">\n" +
    "                {{ error.message }}\n" +
    "            </span>\n" +
    "        </span>\n" +
    "    </p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("forms/dateselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("forms/dateselector.tpl.html",
    "<div class=\"django-cradmin-datetime-selector\"\n" +
    "        ng-class=\"{\n" +
    "            'django-cradmin-datetime-selector-show': page != null,\n" +
    "            'django-cradmin-datetime-selector-page1': page == 1,\n" +
    "            'django-cradmin-datetime-selector-page2': page == 2,\n" +
    "            'django-cradmin-datetime-selector-page3': page == 3,\n" +
    "            'django-cradmin-datetime-selector-has-shortcuts': hasShortcuts()\n" +
    "        }\">\n" +
    "\n" +
    "    <div class=\"django-cradmin-datetime-selector-backdrop\"></div>\n" +
    "\n" +
    "    <div class=\"django-cradmin-datetime-selector-contentwrapper\">\n" +
    "        <div class=\"django-cradmin-datetime-selector-closeoverlay\" ng-click=\"hide()\"></div>\n" +
    "        <div class=\"django-cradmin-datetime-selector-page django-cradmin-datetime-selector-dateview\">\n" +
    "            <button type=\"button\" class=\"sr-only\" ng-focus=\"onFocusHead()\"></button>\n" +
    "            <button type=\"button\"\n" +
    "                    class=\"btn btn-link django-cradmin-datetime-selector-closebutton\"\n" +
    "                    aria-label=\"{{ config.close_screenreader_text }}\"\n" +
    "                    ng-click=\"hide()\">\n" +
    "                        <span class=\"{{ config.close_icon }}\" aria-hidden=\"true\"></span>\n" +
    "                    </button>\n" +
    "\n" +
    "            <div class=\"django-cradmin-datetime-selector-selectors-wrapper\">\n" +
    "                <div class=\"django-cradmin-datetime-selector-selectors\">\n" +
    "                    <div class=\"django-cradmin-datetime-selector-dateselectors\">\n" +
    "                        <label class=\"django-cradmin-datetime-selector-date-label\" ng-if=\"config.date_label_text\">\n" +
    "                            {{ config.date_label_text }}\n" +
    "                        </label>\n" +
    "                        <label for=\"{{ config.destinationfieldid }}_dayselect\" class=\"sr-only\">\n" +
    "                            {{ config.day_screenreader_text }}\n" +
    "                        </label>\n" +
    "                        <select id=\"{{ config.destinationfieldid }}_dayselect\"\n" +
    "                                class=\"form-control django-cradmin-datetime-selector-dayselect\"\n" +
    "                                ng-model=\"monthlyCalendarCoordinator.currentDayObject\"\n" +
    "                                ng-options=\"dayobject.label for dayobject in monthlyCalendarCoordinator.dayobjects track by dayobject.value\"\n" +
    "                                ng-change=\"onSelectDayNumber()\">\n" +
    "                        </select>\n" +
    "\n" +
    "                        <label for=\"{{ config.destinationfieldid }}_monthselect\" class=\"sr-only\">\n" +
    "                            {{ config.month_screenreader_text }}\n" +
    "                        </label>\n" +
    "                        <select id=\"{{ config.destinationfieldid }}_monthselect\"\n" +
    "                                class=\"form-control django-cradmin-datetime-selector-monthselect\"\n" +
    "                                ng-model=\"monthlyCalendarCoordinator.currentMonthObject\"\n" +
    "                                ng-options=\"monthobject.label for monthobject in monthlyCalendarCoordinator.monthselectConfig track by monthobject.value\"\n" +
    "                                ng-change=\"onSelectMonth()\">\n" +
    "                        </select>\n" +
    "\n" +
    "                        <label for=\"{{ config.destinationfieldid }}_yearselect\" class=\"sr-only\">\n" +
    "                            {{ config.year_screenreader_text }}\n" +
    "                        </label>\n" +
    "                        <select id=\"{{ config.destinationfieldid }}_yearselect\"\n" +
    "                                class=\"form-control django-cradmin-datetime-selector-yearselect\"\n" +
    "                                ng-model=\"monthlyCalendarCoordinator.currentYearObject\"\n" +
    "                                ng-options=\"yearobject.label for yearobject in monthlyCalendarCoordinator.yearselectConfig track by yearobject.value\"\n" +
    "                                ng-change=\"onSelectYear()\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"django-cradmin-datetime-selector-timeselectors\" ng-if=\"config.include_time\">\n" +
    "                        <label class=\"django-cradmin-datetime-selector-time-label\" ng-if=\"config.time_label_text\">\n" +
    "                            {{ config.time_label_text }}\n" +
    "                        </label>\n" +
    "                        <label for=\"{{ config.destinationfieldid }}_hourselect\" class=\"sr-only\">\n" +
    "                            {{ config.hour_screenreader_text }}\n" +
    "                        </label>\n" +
    "                        <select id=\"{{ config.destinationfieldid }}_hourselect\"\n" +
    "                                class=\"form-control django-cradmin-datetime-selector-hourselect\"\n" +
    "                                ng-model=\"monthlyCalendarCoordinator.currentHourObject\"\n" +
    "                                ng-options=\"hourobject.label for hourobject in monthlyCalendarCoordinator.hourselectConfig track by hourobject.value\"\n" +
    "                                ng-change=\"onSelectHour()\">\n" +
    "                        </select>\n" +
    "                        :\n" +
    "                        <label for=\"{{ config.destinationfieldid }}_minuteselect\" class=\"sr-only\">\n" +
    "                            {{ config.minute_screenreader_text }}\n" +
    "                        </label>\n" +
    "                        <select id=\"{{ config.destinationfieldid }}_minuteselect\"\n" +
    "                                class=\"form-control django-cradmin-datetime-selector-minuteselect\"\n" +
    "                                ng-model=\"monthlyCalendarCoordinator.currentMinuteObject\"\n" +
    "                                ng-options=\"minuteobject.label for minuteobject in monthlyCalendarCoordinator.minuteselectConfig track by minuteobject.value\"\n" +
    "                                ng-change=\"onSelectMinute()\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button type=\"button\"\n" +
    "                            class=\"btn btn-primary django-cradmin-datetime-selector-use-button\"\n" +
    "                            ng-click=\"onClickUseTime()\"\n" +
    "                            aria-label=\"{{ getUseButtonAriaLabel() }}\">\n" +
    "                        {{ config.usebuttonlabel }}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <table class=\"django-cradmin-datetime-selector-table\">\n" +
    "                <caption class=\"sr-only\">\n" +
    "                    {{ config.dateselector_table_screenreader_caption }}\n" +
    "                </caption>\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <th ng-repeat=\"weekday in monthlyCalendarCoordinator.shortWeekdays\">\n" +
    "                            {{ weekday }}\n" +
    "                        </th>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                    <tr ng-repeat=\"calendarWeek in monthlyCalendarCoordinator.calendarMonth.calendarWeeks\">\n" +
    "                        <td ng-repeat=\"calendarDay in calendarWeek.calendarDays\"\n" +
    "                                class=\"django-cradmin-datetime-selector-daybuttoncell\"\n" +
    "                                ng-class=\"{\n" +
    "                                    'django-cradmin-datetime-selector-daybuttoncell-not-in-current-month': !calendarDay.isInCurrentMonth,\n" +
    "                                    'django-cradmin-datetime-selector-daybuttoncell-in-current-month': calendarDay.isInCurrentMonth,\n" +
    "                                    'django-cradmin-datetime-selector-daybuttoncell-selected': calendarDay.momentObject.isSame(calendarCoordinator.selectedMomentObject, 'day'),\n" +
    "                                    'django-cradmin-datetime-selector-daybuttoncell-lastfocused': calendarDay.momentObject.isSame(monthlyCalendarCoordinator.getLastFocusedMomentObject(), 'day'),\n" +
    "                                    'django-cradmin-datetime-selector-daybuttoncell-today': calendarDay.isToday(),\n" +
    "                                    'django-cradmin-datetime-selector-daybuttoncell-disabled': calendarDay.isDisabled()\n" +
    "                                }\">\n" +
    "                            <button type=\"button\" class=\"btn btn-link django-cradmin-datetime-selector-daybuttoncell-button\"\n" +
    "                                    ng-click=\"onClickCalendarDay(calendarDay)\"\n" +
    "                                    tabindex=\"{{ getTabindexForCalendarDay(calendarDay) }}\"\n" +
    "                                    ng-focus=\"onFocusCalendayDay(calendarDay)\"\n" +
    "                                    aria-label=\"{{ getDaybuttonAriaLabel(calendarDay) }}\"\n" +
    "                                    ng-disabled=\"{{ calendarDay.isDisabled() }}\">\n" +
    "                                {{ monthlyCalendarCoordinator.getDayOfMonthLabelForTableCell(calendarDay) }}\n" +
    "                                <span class=\"django-cradmin-datetime-selector-daybuttoncell-label\n" +
    "                                             django-cradmin-datetime-selector-daybuttoncell-label-today\"\n" +
    "                                        ng-if=\"config.today_label_text &amp;&amp; calendarDay.isToday()\">\n" +
    "                                    {{ config.today_label_text }}\n" +
    "                                </span>\n" +
    "                                <span class=\"django-cradmin-datetime-selector-daybuttoncell-label\n" +
    "                                             django-cradmin-datetime-selector-daybuttoncell-label-selected\"\n" +
    "                                        ng-if=\"\n" +
    "                                            config.selected_day_label_text &amp;&amp;\n" +
    "                                            calendarDay.momentObject.isSame(calendarCoordinator.selectedMomentObject, 'day')\">\n" +
    "                                    {{ config.selected_day_label_text }}\n" +
    "                                </span>\n" +
    "                            </button>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "\n" +
    "            <div class=\"django-cradmin-datetime-selector-shortcuts\" ng-if=\"hasShortcuts()\">\n" +
    "                <button type=\"button\"\n" +
    "                        class=\"btn btn-default django-cradmin-datetime-selector-shortcuts-todaybutton\"\n" +
    "                        ng-if=\"calendarCoordinator.todayIsValidValue()\"\n" +
    "                        ng-click=\"onClickTodayButton()\">\n" +
    "                    {{ config.today_button_text }}\n" +
    "                </button>\n" +
    "                <button type=\"button\"\n" +
    "                        class=\"btn btn-default django-cradmin-datetime-selector-shortcuts-nowbutton\"\n" +
    "                        ng-if=\"calendarCoordinator.nowIsValidValue()\"\n" +
    "                        ng-click=\"onClickNowButton()\">\n" +
    "                    {{ config.now_button_text }}\n" +
    "                </button>\n" +
    "                <button type=\"button\"\n" +
    "                        class=\"btn btn-danger django-cradmin-datetime-selector-shortcuts-clearbutton\"\n" +
    "                        ng-if=\"!config.required\"\n" +
    "                        ng-click=\"onClickClearButton()\">\n" +
    "                    {{ config.clear_button_text }}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "            <button type=\"button\" class=\"sr-only\" ng-focus=\"onFocusTail()\"></button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"django-cradmin-datetime-selector-page django-cradmin-datetime-selector-timeview\">\n" +
    "            <button type=\"button\" class=\"sr-only\" ng-focus=\"onFocusHead()\"></button>\n" +
    "            <button type=\"button\"\n" +
    "                    class=\"btn btn-link django-cradmin-datetime-selector-closebutton\"\n" +
    "                    aria-label=\"{{ config.close_screenreader_text }}\"\n" +
    "                    ng-click=\"hide()\">\n" +
    "                        <span class=\"{{ config.close_icon }}\" aria-hidden=\"true\"></span>\n" +
    "                    </button>\n" +
    "\n" +
    "            <button type=\"button\"\n" +
    "                    class=\"btn btn-link django-cradmin-datetime-selector-backbutton\"\n" +
    "                    tabindex=\"0\"\n" +
    "                    aria-label=\"{{ config.back_to_datepicker_screenreader_text }}\"\n" +
    "                    ng-click=\"showPage1()\">\n" +
    "                <span class=\"django-cradmin-datetime-selector-backbutton-icon-outer-wrapper\">\n" +
    "                    <span class=\"django-cradmin-datetime-selector-backbutton-icon-inner-wrapper\">\n" +
    "                        <span class=\"django-cradmin-datetime-selector-backbutton-icon {{ config.back_icon }}\"></span>\n" +
    "                    </span>\n" +
    "                </span>\n" +
    "            </button>\n" +
    "\n" +
    "            <div class=\"django-cradmin-datetime-selector-timeview-body-wrapper\">\n" +
    "                <div class=\"django-cradmin-datetime-selector-timeview-body\">\n" +
    "                    <p class=\"django-cradmin-datetime-selector-datepreview\">\n" +
    "                        {{ getTimeselectorDatepreview() }}\n" +
    "                    </p>\n" +
    "                    <div class=\"django-cradmin-datetime-selector-timeselectors\">\n" +
    "                        <form class=\"form-inline\">\n" +
    "                            <label class=\"django-cradmin-datetime-selector-time-label\" ng-if=\"config.time_label_text\">\n" +
    "                                {{ config.time_label_text }}\n" +
    "                            </label>\n" +
    "                            <label for=\"{{ config.destinationfieldid }}_hourselect_page2\" class=\"sr-only\">\n" +
    "                                {{ config.hour_screenreader_text }}\n" +
    "                            </label>\n" +
    "                            <select id=\"{{ config.destinationfieldid }}_hourselect_page2\"\n" +
    "                                    class=\"form-control django-cradmin-datetime-selector-hourselect\"\n" +
    "                                    ng-model=\"monthlyCalendarCoordinator.currentHourObject\"\n" +
    "                                    ng-options=\"hourobject.label for hourobject in monthlyCalendarCoordinator.hourselectConfig track by hourobject.value\"\n" +
    "                                    ng-change=\"onSelectHour()\">\n" +
    "                            </select>\n" +
    "                            :\n" +
    "                            <label for=\"{{ config.destinationfieldid }}_minuteselect_page2\" class=\"sr-only\">\n" +
    "                                {{ config.minute_screenreader_text }}\n" +
    "                            </label>\n" +
    "                            <select id=\"{{ config.destinationfieldid }}_minuteselect_page2\"\n" +
    "                                    class=\"form-control django-cradmin-datetime-selector-minuteselect\"\n" +
    "                                    ng-model=\"monthlyCalendarCoordinator.currentMinuteObject\"\n" +
    "                                    ng-options=\"minuteobject.label for minuteobject in monthlyCalendarCoordinator.minuteselectConfig track by minuteobject.value\"\n" +
    "                                    ng-change=\"onSelectMinute()\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\"\n" +
    "                                    class=\"btn btn-primary django-cradmin-datetime-selector-use-button\"\n" +
    "                                    ng-click=\"onClickUseTime()\"\n" +
    "                                    aria-label=\"{{ getUseButtonAriaLabel() }}\">\n" +
    "                                {{ config.usebuttonlabel }}\n" +
    "                            </button>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"django-cradmin-datetime-selector-shortcuts\" ng-if=\"hasShortcuts()\">\n" +
    "                    <button type=\"button\"\n" +
    "                            class=\"btn btn-default django-cradmin-datetime-selector-shortcuts-nowbutton\"\n" +
    "                            ng-click=\"onClickNowButton()\"\n" +
    "                            ng-if=\"calendarCoordinator.shownDateIsTodayAndNowIsValid()\">\n" +
    "                        {{ config.now_button_text }}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <button type=\"button\" class=\"sr-only\" ng-focus=\"onFocusTail()\"></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("pagepreview/navbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pagepreview/navbar.tpl.html",
    "<nav django-cradmin-menu class=\"django-cradmin-menu\">\n" +
    "    <div class=\"django-cradmin-menu-mobileheader\">\n" +
    "        <a href=\"#\" role=\"button\"\n" +
    "           class=\"django-cradmin-menu-mobiletoggle\"\n" +
    "           ng-click=\"cradminMenuTogglePressed()\"\n" +
    "           ng-class=\"{'django-cradmin-menu-mobile-toggle-button-expanded': cradminMenuDisplay}\"\n" +
    "           aria-pressed=\"{{ getAriaPressed() }}\">\n" +
    "                {{ mobileMenuHeader }}\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"django-cradmin-menu-content\"\n" +
    "             ng-class=\"{'django-cradmin-menu-content-display': cradminMenuDisplay}\">\n" +
    "        <ul class=\"django-cradmin-menu-content-main\">\n" +
    "            <li ng-repeat=\"urlConfig in previewConfig.urls\"\n" +
    "                    class=\"django-cradmin-menu-item {{urlConfig.css_classes}}\"\n" +
    "                    ng-class=\"{\n" +
    "                        'django-cradmin-menu-activeitem': $index == activeIndex\n" +
    "                    }\">\n" +
    "                <a href=\"{{ urlConfig.url }}\"\n" +
    "                        django-cradmin-menu-close-on-click\n" +
    "                        ng-click=\"onNavlinkClick($event, $index)\">\n" +
    "                    {{urlConfig.label}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul class=\"django-cradmin-menu-content-footer\">\n" +
    "            <li>\n" +
    "                <a href=\"{{ activeUrlConfig.url }}\" target=\"_blank\">\n" +
    "                    {{ activeUrlConfig.open_label }}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "");
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
