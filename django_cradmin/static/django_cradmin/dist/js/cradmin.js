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
                'X-CSRFToken': $cookies.get('csrftoken'),
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
                'X-CSRFToken': $cookies.get('csrftoken')
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
            console.log($scope.fileInfoLists);
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
  var app;

  app = angular.module('djangoCradmin.calendar.providers', []);

  app.provider('djangoCradminCalendarApi', function() {
    /**
    Get an array of the short names for all the weekdays
    in the current locale, in the the correct order for the
    current locale.
    */

    var CalendarDay, CalendarMonth, CalendarWeek, Month, MonthlyCalendarCoordinator, getWeekdaysShortForCurrentLocale;
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
      function CalendarDay(momentObject, isInCurrentMonth) {
        this.momentObject = momentObject;
        this.isInCurrentMonth = isInCurrentMonth;
      }

      CalendarDay.prototype.getNumberInMonth = function() {
        return this.momentObject.format('D');
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
      function CalendarMonth(momentObject) {
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
        var calendarDay, week;
        week = this.calendarWeeks[this.currentWeekIndex];
        calendarDay = new CalendarDay(momentObject, isInCurrentMonth);
        week.addDay(calendarDay);
        if (week.getDayCount() >= this.daysPerWeek) {
          this.calendarWeeks.push(new CalendarWeek());
          this.currentWeekIndex += 1;
        }
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
          _results.push(console.log(week.prettyOneLineFormat()));
        }
        return _results;
      };

      return CalendarMonth;

    })();
    MonthlyCalendarCoordinator = (function() {
      function MonthlyCalendarCoordinator(selectedDateMomentObject) {
        this.selectedDateMomentObject = selectedDateMomentObject;
        this.dayobjects = null;
        this.__initWeekdays();
        this.__initMonthObjects();
        this.__initYearObject();
        if (this.selectedDateMomentObject == null) {
          this.selectedDateMomentObject = moment();
        }
        this.__changeSelectedDate();
      }

      MonthlyCalendarCoordinator.prototype.__initWeekdays = function() {
        return this.shortWeekdays = getWeekdaysShortForCurrentLocale();
      };

      MonthlyCalendarCoordinator.prototype.__initYearObject = function() {
        var year, yearObject, yearsList, _i, _j, _len, _results, _results1;
        yearsList = (function() {
          _results = [];
          for (_i = 1990; _i <= 2030; _i++){ _results.push(_i); }
          return _results;
        }).apply(this);
        this.yearobjects = [];
        this.__yearsMap = {};
        _results1 = [];
        for (_j = 0, _len = yearsList.length; _j < _len; _j++) {
          year = yearsList[_j];
          yearObject = {
            value: year,
            label: year
          };
          this.yearobjects.push(yearObject);
          _results1.push(this.__yearsMap[year] = yearObject);
        }
        return _results1;
      };

      MonthlyCalendarCoordinator.prototype.__initMonthObjects = function() {
        var monthObject, monthname, monthnumber, _i, _len, _ref, _results;
        this.monthobjects = [];
        this.__monthsMap = {};
        monthnumber = 0;
        _ref = moment.months();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          monthname = _ref[_i];
          monthObject = {
            value: monthnumber,
            label: monthname
          };
          this.monthobjects.push(monthObject);
          this.__monthsMap[monthnumber] = monthObject;
          _results.push(monthnumber += 1);
        }
        return _results;
      };

      MonthlyCalendarCoordinator.prototype.__setCurrentYear = function() {
        var currentYearNumber;
        currentYearNumber = this.calendarMonth.month.firstDayOfMonth.year();
        this.currentYearObject = this.__yearsMap[currentYearNumber];
        if (this.currentYearObject == null) {
          return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error("The given year, " + currentYearNumber + " is not one of the available choices") : void 0 : void 0;
        }
      };

      MonthlyCalendarCoordinator.prototype.__setCurrentMonth = function() {
        var currentMonthNumber;
        currentMonthNumber = this.calendarMonth.month.firstDayOfMonth.month();
        this.currentMonthObject = this.__monthsMap[currentMonthNumber];
        if (this.currentMonthObject == null) {
          return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error("The given month number, " + currentMonthNumber + " is not one of the available choices") : void 0 : void 0;
        }
      };

      MonthlyCalendarCoordinator.prototype.__updateDayObjects = function() {
        var dayNumberObject, daynumber, _i, _ref, _results;
        this.dayobjects = [];
        _results = [];
        for (daynumber = _i = 1, _ref = this.calendarMonth.month.getDaysInMonth(); 1 <= _ref ? _i <= _ref : _i >= _ref; daynumber = 1 <= _ref ? ++_i : --_i) {
          dayNumberObject = {
            value: daynumber,
            label: daynumber
          };
          _results.push(this.dayobjects.push(dayNumberObject));
        }
        return _results;
      };

      /*
      Change month to the month containing the given momentObject,
      and select the date.
      */


      MonthlyCalendarCoordinator.prototype.__changeSelectedDate = function() {
        console.log('__changeSelectedDate', this.selectedDateMomentObject);
        this.calendarMonth = new CalendarMonth(this.selectedDateMomentObject);
        this.__setCurrentYear();
        this.__setCurrentMonth();
        this.__updateDayObjects();
        return this.currentDayObject = this.dayobjects[this.selectedDateMomentObject.date() - 1];
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentDayObjectChange = function() {
        this.selectedDateMomentObject = moment({
          year: this.currentYearObject.value,
          month: this.currentMonthObject.value,
          day: this.currentDayObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentMonthChange = function() {
        this.selectedDateMomentObject.set({
          month: this.currentMonthObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.handleCurrentYearChange = function() {
        this.selectedDateMomentObject.set({
          year: this.currentYearObject.value
        });
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.onSelectCalendarDay = function(calendarDay) {
        this.selectedDateMomentObject = calendarDay.momentObject;
        return this.__changeSelectedDate();
      };

      MonthlyCalendarCoordinator.prototype.getDestinationFieldValue = function() {
        return this.selectedDateMomentObject.format('YYYY-MM-DD');
      };

      return MonthlyCalendarCoordinator;

    })();
    this.$get = function() {
      return {
        MonthlyCalendarCoordinator: MonthlyCalendarCoordinator
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
  var app;

  app = angular.module('djangoCradmin.forms.datetimewidget', []);

  app.directive('djangoCradminDateSelector', [
    'djangoCradminCalendarApi', function(djangoCradminCalendarApi) {
      return {
        scope: {
          config: "=djangoCradminDateSelector"
        },
        templateUrl: 'forms/dateselector.tpl.html',
        controller: function($scope, $element) {
          $scope.isVisible = false;
          $scope.monthlyCaledarCoordinator = new djangoCradminCalendarApi.MonthlyCalendarCoordinator();
          $scope.onSelectDayNumber = function() {
            $scope.monthlyCaledarCoordinator.handleCurrentDayObjectChange();
            $scope.applySelectedValue();
          };
          $scope.onSelectMonth = function() {
            $scope.monthlyCaledarCoordinator.handleCurrentMonthChange();
          };
          $scope.onSelectYear = function() {
            $scope.monthlyCaledarCoordinator.handleCurrentYearChange();
          };
          $scope.onSelectCalendarDay = function(calendarDay) {
            $scope.monthlyCaledarCoordinator.onSelectCalendarDay(calendarDay);
            $scope.applySelectedValue();
          };
          $scope.applySelectedValue = function() {
            $scope.destinationField.val($scope.monthlyCaledarCoordinator.getDestinationFieldValue());
            return $scope.hide();
          };
          $scope.show = function() {
            return $scope.isVisible = true;
          };
          return $scope.hide = function() {
            return $scope.isVisible = false;
          };
        },
        link: function($scope, $element) {
          if ($scope.config.destinationFieldId != null) {
            $scope.destinationField = angular.element("#" + $scope.config.destinationFieldId);
            if ($scope.destinationField.length > 0) {
              $scope.destinationField.on('focus', function() {
                $scope.show();
                $scope.$apply();
              });
            } else {
              if (typeof console !== "undefined" && console !== null) {
                if (typeof console.error === "function") {
                  console.error("Could not find the destinationField element with ID: " + $scope.config.destinationFieldId);
                }
              }
            }
          } else {
            if (typeof console !== "undefined" && console !== null) {
              if (typeof console.error === "function") {
                console.error("The destinationField config is required!");
              }
            }
          }
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
          $scope.setIframeSize = function() {
            var iframeBodyHeight, iframeDocument;
            iframeDocument = getIframeDocument();
            if ((iframeDocument != null ? iframeDocument.body : void 0) != null) {
              iframeBodyHeight = iframeDocument.body.offsetHeight;
              return $scope.element.height(iframeBodyHeight);
            }
          };
          $scope.resetIframeSize = function() {
            return $scope.element.height('40px');
          };
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
  angular.module('djangoCradmin', ['djangoCradmin.templates', 'djangoCradmin.directives', 'djangoCradmin.providers', 'djangoCradmin.calendar.providers', 'djangoCradmin.messages', 'djangoCradmin.detectizr', 'djangoCradmin.menu', 'djangoCradmin.objecttable', 'djangoCradmin.acemarkdown', 'djangoCradmin.bulkfileupload', 'djangoCradmin.iosaddtohomescreen', 'djangoCradmin.imagepreview', 'djangoCradmin.collapse', 'djangoCradmin.modal', 'djangoCradmin.scrollfixed', 'djangoCradmin.pagepreview', 'djangoCradmin.forms.modelchoicefield', 'djangoCradmin.forms.usethisbutton', 'djangoCradmin.forms.datetimewidget', 'djangoCradmin.forms.filewidget']);

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

angular.module('djangoCradmin.templates', ['acemarkdown/acemarkdown.tpl.html', 'bulkfileupload/fileinfolist.tpl.html', 'bulkfileupload/progress.tpl.html', 'bulkfileupload/rejectedfiles.tpl.html', 'forms/dateselector.tpl.html', 'pagepreview/navbar.tpl.html']);

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

angular.module("forms/dateselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("forms/dateselector.tpl.html",
    "<div class=\"django-cradmin-date-selector\"\n" +
    "        ng-class=\"{\n" +
    "            'django-cradmin-date-selector-show': isVisible\n" +
    "        }\">\n" +
    "    <div class=\"django-cradmin-date-selector-viewswitchers\">\n" +
    "        <select class=\"django-cradmin-date-selector-dayselect\"\n" +
    "                ng-model=\"monthlyCaledarCoordinator.currentDayObject\"\n" +
    "                ng-options=\"dayobject.label for dayobject in monthlyCaledarCoordinator.dayobjects track by dayobject.value\"\n" +
    "                ng-change=\"onSelectDayNumber()\">\n" +
    "        </select>\n" +
    "        <select class=\"django-cradmin-date-selector-monthselect\"\n" +
    "                ng-model=\"monthlyCaledarCoordinator.currentMonthObject\"\n" +
    "                ng-options=\"monthobject.label for monthobject in monthlyCaledarCoordinator.monthobjects track by monthobject.value\"\n" +
    "                ng-change=\"onSelectMonth()\">\n" +
    "        </select>\n" +
    "        <select class=\"django-cradmin-date-selector-yearselect\"\n" +
    "                ng-model=\"monthlyCaledarCoordinator.currentYearObject\"\n" +
    "                ng-options=\"yearobject.label for yearobject in monthlyCaledarCoordinator.yearobjects track by yearobject.value\"\n" +
    "                ng-change=\"onSelectYear()\">\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    {{ monthlyCaledarCoordinator.currentMonthObject.value }}\n" +
    "    |\n" +
    "    {{ monthlyCaledarCoordinator.currentYearObject.value }}\n" +
    "    |\n" +
    "    {{ monthlyCaledarCoordinator.selectedDateMomentObject.format('ll') }}\n" +
    "\n" +
    "    <table class=\"table\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th ng-repeat=\"weekday in monthlyCaledarCoordinator.shortWeekdays\">\n" +
    "                    {{ weekday }}\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"calendarWeek in monthlyCaledarCoordinator.calendarMonth.calendarWeeks\">\n" +
    "                <td ng-repeat=\"calendarDay in calendarWeek.calendarDays\">\n" +
    "                    <div class=\"django-cradmin-date-selector-day\"\n" +
    "                            ng-class=\"{\n" +
    "                                'django-cradmin-date-selector-day-not-in-current-month': !calendarDay.isInCurrentMonth,\n" +
    "                                'django-cradmin-date-selector-day-in-current-month': calendarDay.isInCurrentMonth\n" +
    "                            }\"\n" +
    "                            ng-click=\"onSelectCalendarDay(calendarDay)\">\n" +
    "                        {{ calendarDay.getNumberInMonth() }}\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
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
