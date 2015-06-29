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
  angular.module('djangoCradmin.bulkfileupload', ['angularFileUpload', 'ngCookies']).factory('cradminBulkfileupload', function() {
    var FileInfo, FileInfoList;
    FileInfo = (function() {
      function FileInfo(options) {
        this.file = options.file;
        this.temporaryfileid = options.temporaryfileid;
        this.name = this.file.name;
        this.isRemoving = false;
      }

      FileInfo.prototype.markAsIsRemoving = function() {
        return this.isRemoving = true;
      };

      FileInfo.prototype.markAsIsNotRemoving = function() {
        return this.isRemoving = false;
      };

      return FileInfo;

    })();
    FileInfoList = (function() {
      function FileInfoList(options) {
        var file, _i, _len, _ref;
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
        this.rawFiles = options.files;
        this.files = [];
        _ref = options.files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          this.files.push(new FileInfo({
            temporaryfileid: null,
            name: file.name,
            file: file
          }));
        }
        this.errors = options.errors;
      }

      FileInfoList.prototype.updatePercent = function(percent) {
        return this.percent = percent;
      };

      FileInfoList.prototype.finish = function(temporaryfiles) {
        var index, temporaryfile, _i, _len, _results;
        this.finished = true;
        index = 0;
        _results = [];
        for (_i = 0, _len = temporaryfiles.length; _i < _len; _i++) {
          temporaryfile = temporaryfiles[_i];
          this.files[index].name = temporaryfile.filename;
          this.files[index].temporaryfileid = temporaryfile.id;
          _results.push(index += 1);
        }
        return _results;
      };

      FileInfoList.prototype.setErrors = function(errors) {
        this.hasErrors = true;
        return this.errors = errors;
      };

      FileInfoList.prototype.indexOf = function(fileInfo) {
        return this.files.indexOf(fileInfo);
      };

      FileInfoList.prototype.remove = function(index) {
        return this.files.splice(index, 1);
      };

      return FileInfoList;

    })();
    return {
      createFileInfoList: function(options) {
        return new FileInfoList(options);
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
        },
        link: function(scope, element, attr, uploadController) {
          element.on('submit', function(evt) {
            if (scope._inProgressCounter !== 0) {
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
    '$upload', '$cookies', 'cradminDetectize', function($upload, $cookies, cradminDetectize) {
      return {
        require: '^djangoCradminBulkfileuploadForm',
        restrict: 'AE',
        scope: true,
        controller: function($scope) {
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
          this.setFileUploadFieldScope = function(fileUploadFieldScope) {
            return $scope.fileUploadFieldScope = fileUploadFieldScope;
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
            return $scope.uploadUrl;
          };
          this.getCollectionId = function() {
            return $scope.collectionid;
          };
          $scope._addFileInfoList = function(fileInfoList) {
            return $scope.inProgressOrFinishedScope.addFileInfoList(fileInfoList);
          };
          $scope._showAppropriateWidget = function() {
            if ($scope.advancedWidgetScope && $scope.simpleWidgetScope) {
              if (cradminDetectize.device.type === 'desktop') {
                return $scope.simpleWidgetScope.hide();
              } else {
                return $scope.advancedWidgetScope.hide();
              }
            }
          };
          $scope.filesDropped = function(files, evt, rejectedFiles) {
            if (rejectedFiles.length > 0) {
              return $scope.rejectedFilesScope.setRejectedFiles(rejectedFiles);
            }
          };
          $scope.$watch('cradminLastFilesSelectedByUser', function() {
            if ($scope.cradminLastFilesSelectedByUser.length > 0) {
              $scope._addFilesToQueue($scope.cradminLastFilesSelectedByUser.slice());
              return $scope.cradminLastFilesSelectedByUser = [];
            }
          });
          $scope._addFilesToQueue = function(files) {
            var progressInfo;
            progressInfo = $scope.inProgressOrFinishedScope.addFileInfoList({
              percent: 0,
              files: files
            });
            $scope.fileUploadQueue.push(progressInfo);
            if ($scope.firstUploadInProgress) {
              return;
            }
            if ($scope.collectionid === null) {
              $scope.firstUploadInProgress = true;
            }
            return $scope._processFileUploadQueue();
          };
          $scope._onFileUploadComplete = function() {
            /*
            Called both on file upload success and error
            */

            $scope.firstUploadInProgress = false;
            $scope.formController.removeInProgress();
            if ($scope.fileUploadQueue.length > 0) {
              return $scope._processFileUploadQueue();
            }
          };
          $scope._processFileUploadQueue = function() {
            var apidata, progressInfo;
            progressInfo = $scope.fileUploadQueue.shift();
            apidata = angular.extend({}, $scope.apiparameters, {
              collectionid: $scope.collectionid
            });
            $scope.formController.addInProgress();
            return $scope.upload = $upload.upload({
              url: $scope.uploadUrl,
              method: 'POST',
              data: apidata,
              file: progressInfo.rawFiles,
              fileFormDataName: 'file',
              headers: {
                'X-CSRFToken': $cookies.csrftoken,
                'Content-Type': 'multipart/form-data'
              }
            }).progress(function(evt) {
              return progressInfo.updatePercent(parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
              progressInfo.finish(data.temporaryfiles);
              $scope._setCollectionId(data.collectionid);
              return $scope._onFileUploadComplete();
            }).error(function(data) {
              progressInfo.setErrors(data);
              return $scope._onFileUploadComplete();
            });
          };
          $scope._setCollectionId = function(collectionid) {
            $scope.collectionid = collectionid;
            return $scope.fileUploadFieldScope.setCollectionId(collectionid);
          };
        },
        link: function(scope, element, attr, formController) {
          scope.uploadUrl = attr.djangoCradminBulkfileupload;
          if (attr.djangoCradminBulkfileuploadApiparameters != null) {
            scope.apiparameters = scope.$parent.$eval(attr.djangoCradminBulkfileuploadApiparameters);
            if (!angular.isObject(scope.apiparameters)) {
              throw new Error('django-cradmin-bulkfileupload-apiparameters must be a javascript object.');
            }
          } else {
            scope.apiparameters = {};
          }
          scope.formController = formController;
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadRejectedFiles', [
    function() {
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
          rejectedFileErrorMessage: '@djangoCradminBulkfileuploadRejectedFiles'
        },
        controller: function($scope) {
          $scope.rejectedFiles = [];
          $scope.setRejectedFiles = function(rejectedFiles) {
            return $scope.rejectedFiles = rejectedFiles;
          };
          return $scope.closeMessage = function(rejectedFile) {
            var index;
            index = $scope.rejectedFiles.indexOf(rejectedFile);
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
          $scope.fileInfoLists = [];
          $scope._findFileInfo = function(fileInfo) {
            var fileInfoIndex, fileInfoList, _i, _len, _ref;
            if (fileInfo.temporaryfileid == null) {
              throw new Error("Can not remove files without a temporaryfileid");
            }
            _ref = $scope.fileInfoLists;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              fileInfoList = _ref[_i];
              fileInfoIndex = fileInfoList.indexOf(fileInfo);
              if (fileInfoIndex !== -1) {
                return {
                  fileInfoList: fileInfoList,
                  index: fileInfoIndex
                };
              }
            }
            throw new Error("Could not find requested fileInfo with temporaryfileid=" + fileInfo.temporaryfileid + ".");
          };
          this.removeFile = function(fileInfo) {
            var fileInfoLocation;
            fileInfoLocation = $scope._findFileInfo(fileInfo);
            fileInfo.markAsIsRemoving();
            $scope.$apply();
            return $http({
              url: $scope.uploadController.getUploadUrl(),
              method: 'DELETE',
              headers: {
                'X-CSRFToken': $cookies.csrftoken
              },
              data: {
                collectionid: $scope.uploadController.getCollectionId(),
                temporaryfileid: fileInfo.temporaryfileid
              }
            }).success(function(data, status, headers, config) {
              return fileInfoLocation.fileInfoList.remove(fileInfoLocation.index);
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
          $scope.addFileInfoList = function(options) {
            var fileInfoList;
            fileInfoList = cradminBulkfileupload.createFileInfoList(options);
            $scope.fileInfoLists.push(fileInfoList);
            return fileInfoList;
          };
        },
        link: function(scope, element, attr, uploadController) {
          scope.uploadController = uploadController;
          uploadController.setInProgressOrFinishedScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkFileInfoList', [
    function() {
      return {
        restrict: 'AE',
        scope: {
          fileInfoList: '=djangoCradminBulkFileInfoList'
        },
        templateUrl: 'bulkfileupload/fileinfolist.tpl.html',
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
        require: '^djangoCradminBulkFileInfoList',
        scope: {},
        link: function(scope, element, attr, fileInfoListController) {
          element.on('click', function(evt) {
            evt.preventDefault();
            return fileInfoListController.close();
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
          uploadController.setFileUploadFieldScope(scope);
        }
      };
    }
  ]).directive('djangoCradminBulkfileuploadAdvancedWidget', [
    function() {
      return {
        require: '^djangoCradminBulkfileupload',
        restrict: 'AE',
        scope: {},
        link: function(scope, element, attr, uploadController) {
          scope.hide = function() {
            return element.css('display', 'none');
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
          uploadController.setSimpleWidgetScope(scope);
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
  angular.module('djangoCradmin.detectizr', []).factory('cradminDetectize', function() {
    Detectizr.detect({
      addAllFeaturesAsClass: false,
      detectDevice: true,
      detectDeviceModel: false,
      detectScreen: false,
      detectOS: false,
      detectBrowser: false,
      detectPlugins: false
    });
    return Detectizr;
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
          this.setField = function(fieldScope) {
            return $scope.fieldScope = fieldScope;
          };
          this.setPreviewElement = function(previewElementScope) {
            return $scope.previewElementScope = previewElementScope;
          };
          this.onChangeValueBegin = function() {
            $scope.iframeScope.beforeShowingIframe();
            return $scope.iframeWrapperScope.show();
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
            $scope.iframeWrapperScope.hide();
            return $scope.iframeScope.afterFieldValueChange();
          };
          $window.addEventListener('message', $scope.onChangeValue, false);
        },
        link: function(scope, element) {}
      };
    }
  ]).directive('djangoCradminModelChoiceFieldInput', function() {
    return {
      require: '^djangoCradminModelChoiceFieldWrapper',
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
  }).directive('djangoCradminModelChoiceFieldPreview', function() {
    return {
      require: '^djangoCradminModelChoiceFieldWrapper',
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
  }).directive('djangoCradminModelChoiceFieldChangebeginButton', function() {
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
        $scope.afterFieldValueChange = function() {};
        return $scope.beforeShowingIframe = function() {
          var currentSrc;
          currentSrc = $scope.element.attr('src');
          if ((currentSrc == null) || currentSrc === '') {
            return $scope.element.attr('src', $scope.src);
          }
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
        return scope.wrapperelement.addClass('django-cradmin-filewidget-field-and-overlay-wrapper-hover');
      });
      element.bind('mouseleave', function() {
        return scope.wrapperelement.removeClass('django-cradmin-filewidget-field-and-overlay-wrapper-hover');
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
  angular.module('djangoCradmin', ['djangoCradmin.templates', 'djangoCradmin.directives', 'djangoCradmin.messages', 'djangoCradmin.detectizr', 'djangoCradmin.menu', 'djangoCradmin.objecttable', 'djangoCradmin.acemarkdown', 'djangoCradmin.bulkfileupload', 'djangoCradmin.imagepreview', 'djangoCradmin.pagepreview', 'djangoCradmin.forms.modelchoicefield', 'djangoCradmin.forms.usethisbutton']);

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
  angular.module('djangoCradmin.pagepreview', []).directive('djangoCradminPagePreviewWrapper', [
    function() {
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
          <div class="ng-hide django-cradmin-floating-fullsize-iframe-wrapper"
               django-cradmin-page-preview-iframe-wrapper>
              <a href="#" class="django-cradmin-floating-fullsize-iframe-closebutton"
                 django-cradmin-page-preview-iframe-closebutton>
                  <span class="fa fa-close"></span>
                  <span class="sr-only">Close preview</span>
              </a>
              <div class="django-cradmin-floating-fullsize-loadspinner">
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
        controller: function($scope) {
          $scope.origin = "" + window.location.protocol + "//" + window.location.host;
          this.setIframeWrapper = function(iframeWrapperScope) {
            return $scope.iframeWrapperScope = iframeWrapperScope;
          };
          this.setIframe = function(iframeScope) {
            return $scope.iframeScope = iframeScope;
          };
          this.showPreview = function(url) {
            $scope.iframeScope.setUrl(url);
            return $scope.iframeWrapperScope.show();
          };
        },
        link: function(scope, element) {}
      };
    }
  ]).directive('djangoCradminPagePreviewOpenOnPageLoad', [
    function() {
      /*
      A directive that opens the given URL in an iframe overlay instantly (on page load).
      */

      return {
        require: '^^djangoCradminPagePreviewWrapper',
        restrict: 'A',
        scope: {
          previewUrl: '@djangoCradminPagePreviewOpenOnPageLoad'
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          wrapperCtrl.showPreview(scope.previewUrl);
        }
      };
    }
  ]).directive('djangoCradminPagePreviewOpenOnClick', [
    function() {
      /*
      A directive that opens the given URL in an iframe overlay on click.
      */

      return {
        require: '^^djangoCradminPagePreviewWrapper',
        restrict: 'A',
        scope: {
          previewUrl: '@djangoCradminPagePreviewOpenOnClick'
        },
        link: function(scope, element, attrs, wrapperCtrl) {
          element.on('click', function(e) {
            e.preventDefault();
            return wrapperCtrl.showPreview(scope.previewUrl);
          });
        }
      };
    }
  ]).directive('djangoCradminPagePreviewIframeWrapper', [
    '$window', function($window) {
      return {
        require: '^^djangoCradminPagePreviewWrapper',
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
  ]).directive('djangoCradminPagePreviewIframeClosebutton', function() {
    return {
      require: '^^djangoCradminPagePreviewIframeWrapper',
      restrict: 'A',
      scope: {},
      link: function(scope, element, attrs, iframeWrapperCtrl) {
        element.on('click', function(e) {
          e.preventDefault();
          return iframeWrapperCtrl.closeIframe();
        });
      }
    };
  }).directive('djangoCradminPagePreviewIframe', function() {
    return {
      require: '^^djangoCradminPagePreviewWrapper',
      restrict: 'A',
      scope: {},
      controller: function($scope) {
        return $scope.setUrl = function(url) {
          return $scope.element.attr('src', url);
        };
      },
      link: function(scope, element, attrs, wrapperCtrl) {
        scope.element = element;
        wrapperCtrl.setIframe(scope);
      }
    };
  });

}).call(this);

angular.module('djangoCradmin.templates', ['acemarkdown/acemarkdown.tpl.html', 'bulkfileupload/fileinfolist.tpl.html', 'bulkfileupload/progress.tpl.html', 'bulkfileupload/rejectedfiles.tpl.html']);

angular.module("acemarkdown/acemarkdown.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("acemarkdown/acemarkdown.tpl.html",
    "<div ng-transclude></div>");
}]);

angular.module("bulkfileupload/fileinfolist.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bulkfileupload/fileinfolist.tpl.html",
    "<p ng-repeat=\"fileInfo in fileInfoList.files\"\n" +
    "        class=\"django-cradmin-bulkfileupload-progress-item\"\n" +
    "        ng-class=\"{\n" +
    "            'django-cradmin-bulkfileupload-progress-item-finished': fileInfoList.finished,\n" +
    "            'django-cradmin-bulkfileupload-progress-item-error django-cradmin-bulkfileupload-errorparagraph': fileInfoList.hasErrors\n" +
    "        }\">\n" +
    "    <span ng-if=\"fileInfoList.hasErrors\">\n" +
    "        <button django-cradmin-bulkfileupload-error-close-button\n" +
    "                type=\"button\"\n" +
    "                class=\"btn btn-link django-cradmin-bulkfileupload-error-closebutton\">\n" +
    "            <span class=\"fa fa-times\"></span>\n" +
    "            <span class=\"sr-only\">Close</span>\n" +
    "        </button>\n" +
    "        <span ng-repeat=\"(errorfield,errors) in fileInfoList.errors\">\n" +
    "            <span ng-repeat=\"error in errors\" class=\"django-cradmin-bulkfileupload-error\">\n" +
    "                {{ error.message }}\n" +
    "            </span>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "    <span ng-if=\"!fileInfoList.hasErrors\">\n" +
    "        <button django-cradmin-bulkfileupload-remove-file-button=\"fileInfo\"\n" +
    "                ng-if=\"fileInfoList.finished\"\n" +
    "                type=\"button\"\n" +
    "                class=\"btn btn-link django-cradmin-bulkfileupload-remove-file-button\">\n" +
    "            <span ng-if=\"!fileInfo.isRemoving\"\n" +
    "                  class=\"django-cradmin-bulkfileupload-remove-file-button-isnotremoving\">\n" +
    "                <span class=\"fa fa-times\"></span>\n" +
    "                <span class=\"sr-only\">Remove</span>\n" +
    "            </span>\n" +
    "            <span ng-if=\"fileInfo.isRemoving\"\n" +
    "                  class=\"django-cradmin-bulkfileupload-remove-file-button-isremoving\">\n" +
    "                <span class=\"fa fa-spinner fa-spin\"></span>\n" +
    "                <span class=\"sr-only\">Removing ...</span>\n" +
    "            </span>\n" +
    "        </button>\n" +
    "\n" +
    "        <span class=\"django-cradmin-progressbar\">\n" +
    "            <span class=\"django-cradmin-progressbar-progress\" ng-style=\"{'width': fileInfoList.percent+'%'}\">&nbsp;</span>\n" +
    "            <span class=\"django-cradmin-progresspercent\">\n" +
    "                <span class=\"django-cradmin-progresspercent-number\">{{ fileInfoList.percent }}</span>%\n" +
    "            </span>\n" +
    "        </span>\n" +
    "        <span class=\"django-cradmin-filename\">{{fileInfo.name}}</span>\n" +
    "    </span>\n" +
    "</p>\n" +
    "");
}]);

angular.module("bulkfileupload/progress.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bulkfileupload/progress.tpl.html",
    "<div class=\"django-cradmin-bulkfileupload-progress\">\n" +
    "    <div ng-repeat=\"fileInfoList in fileInfoLists\">\n" +
    "        <div django-cradmin-bulk-file-info-list=\"fileInfoList\"\n" +
    "             class=\"django-cradmin-bulkfileupload-progress-fileinfolist\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("bulkfileupload/rejectedfiles.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bulkfileupload/rejectedfiles.tpl.html",
    "<div class=\"django-cradmin-bulkfileupload-rejectedfiles\">\n" +
    "    <p ng-repeat=\"rejectedFile in rejectedFiles\"\n" +
    "            class=\"django-cradmin-bulkfileupload-rejectedfile django-cradmin-bulkfileupload-errorparagraph\">\n" +
    "        <button ng-click=\"closeMessage(rejectedFile)\"\n" +
    "                type=\"button\"\n" +
    "                class=\"btn btn-link django-cradmin-bulkfileupload-error-closebutton\">\n" +
    "            <span class=\"fa fa-times\"></span>\n" +
    "            <span class=\"sr-only\">Close</span>\n" +
    "        </button>\n" +
    "        <span class=\"django-cradmin-bulkfileupload-rejectedfile-filename\">{{ rejectedFile.name }}:</span>\n" +
    "        <span class=\"django-cradmin-bulkfileupload-rejectedfile-errormessage\">{{ rejectedFileErrorMessage }}</span>\n" +
    "    </p>\n" +
    "</div>\n" +
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
