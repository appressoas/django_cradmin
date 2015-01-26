
angular.module('djangoCradmin.bulkfileupload', [
  'angularFileUpload', 'ngCookies'
])


.factory 'cradminBulkfileupload', ->
  class FileInfo
    constructor: (options) ->
      @file = options.file
      @temporaryfileid = options.temporaryfileid
      @name = @file.name
      @isRemoving = false

    markAsIsRemoving: ->
      @isRemoving = true

    markAsIsNotRemoving: ->
      @isRemoving = false

  class FileInfoList
    constructor: (options) ->
      @percent = options.percent
      if options.finished
        @finished = true
      else
        @finished = false
      if options.hasErrors
        @hasErrors = true
      else
        @hasErrors = false
      @files = []
      for file in options.files
        @files.push(new FileInfo({
          temporaryfileid: null
          name: file.name
          file: file
        }))
      @errors = options.errors

    updatePercent: (percent) ->
      @percent = percent

    finish: (temporaryfiles) ->
      @finished = true

      # Update the client provided filenames with the filename from the server
      index = 0
      for temporaryfile in temporaryfiles
        @files[index].name = temporaryfile.filename
        @files[index].temporaryfileid = temporaryfile.id
        index += 1

    setErrors: (errors) ->
      @hasErrors = true
      @errors = errors

    indexOf: (fileInfo) ->
      return @files.indexOf(fileInfo)

    remove: (index) ->
      return @files.splice(index, 1)

  return {
    createFileInfoList: (options) ->
      new FileInfoList(options)
  }


.directive('djangoCradminBulkfileuploadForm', [
  ->
    ###
    A form containing ``django-cradmin-bulkfileupload`` fields
    must use this directive.
    ###
    return {
      restrict: 'AE'
      scope: {}

      controller: ($scope) ->
        $scope._inProgressCounter = 0

        # Simple submit buttons are simply disabled when files are beeing uploaded.
        $scope._submitButtonScopes = []

        $scope._setSubmitButtonsInProgress = ->
          for buttonScope in $scope._submitButtonScopes
            buttonScope.setNotInProgress()

        $scope._setSubmitButtonsNotInProgress = ->
          for buttonScope in $scope._submitButtonScopes
            buttonScope.setInProgress()

        @addInProgress = ->
          $scope._inProgressCounter += 1
          if $scope._inProgressCounter == 1
            $scope._setSubmitButtonsInProgress()

        @removeInProgress = ->
          if $scope._inProgressCounter == 0
            throw new Error("It should not be possible to get _inProgressCounter below 0")
          $scope._inProgressCounter -= 1
          if $scope._inProgressCounter == 0
            $scope._setSubmitButtonsNotInProgress()

        @addSubmitButtonScope = (submitButtonScope) ->
          $scope._submitButtonScopes.push(submitButtonScope)

        return

      link: (scope, element, attr, uploadController) ->
        element.on 'submit', (evt) ->
          if scope._inProgressCounter != 0
            evt.preventDefault()
        return
    }
])


.directive('djangoCradminBulkfileuploadSubmit', [
  ->
    return {
      require: '^djangoCradminBulkfileuploadForm'
      restrict: 'A'
      scope: true

      controller: ($scope) ->
        $scope.inProgress = false

        $scope.setInProgress = ->
          $scope.element.prop('disabled', false)
          $scope.inProgress = false

        $scope.setNotInProgress = ->
          $scope.element.prop('disabled', true)
          $scope.inProgress = true

      link: (scope, element, attr, formController) ->
        scope.element = element
        formController.addSubmitButtonScope(scope)
        return
    }
])



.directive('djangoCradminBulkfileupload', [
  '$upload', '$cookies', 'cradminDetectize'
  ($upload, $cookies, cradminDetectize) ->
    return {
      require: '^djangoCradminBulkfileuploadForm'
      restrict: 'AE'
      scope: true

      controller: ($scope) ->
        $scope.collectionid = null
        $scope.cradminBulkFileUploadFiles = []
        $scope.simpleWidgetScope = null
        $scope.advancedWidgetScope = null

        @setInProgressOrFinishedScope = (inProgressOrFinishedScope) ->
          $scope.inProgressOrFinishedScope = inProgressOrFinishedScope

        @setFileUploadFieldScope = (fileUploadFieldScope) ->
          $scope.fileUploadFieldScope = fileUploadFieldScope

        @setSimpleWidgetScope = (simpleWidgetScope) ->
          $scope.simpleWidgetScope = simpleWidgetScope
          $scope._showAppropriateWidget()

        @setAdvancedWidgetScope = (advancedWidgetScope) ->
          $scope.advancedWidgetScope = advancedWidgetScope
          $scope._showAppropriateWidget()

        @getUploadUrl = ->
          return $scope.uploadUrl

        @getCollectionId = ->
          return $scope.collectionid

        $scope._addFileInfoList = (fileInfoList) ->
          $scope.inProgressOrFinishedScope.addFileInfoList(fileInfoList)

        $scope._showAppropriateWidget = ->
          if $scope.advancedWidgetScope and $scope.simpleWidgetScope
            if cradminDetectize.device.type == 'desktop'
              $scope.simpleWidgetScope.hide()
            else
              $scope.advancedWidgetScope.hide()

        $scope.$watch 'cradminBulkFileUploadFiles', ->
          if $scope.cradminBulkFileUploadFiles.length > 0
            $scope._uploadFiles()

        $scope._uploadFiles = () ->
          progressInfo = $scope.inProgressOrFinishedScope.addFileInfoList({
            percent: 0
            files: $scope.cradminBulkFileUploadFiles.slice()
          })
          $scope.formController.addInProgress()

          $scope.upload = $upload.upload({
            url: $scope.uploadUrl
            method: 'POST'
            data: {
              collectionid: $scope.collectionid
            }
            file: $scope.cradminBulkFileUploadFiles  # single file or a list of files. list is only for html5
            fileFormDataName: 'file'  # The form field name
            headers: {
              'X-CSRFToken': $cookies.csrftoken
              'Content-Type': 'multipart/form-data'
            }
          }).progress((evt) ->
            progressInfo.updatePercent(parseInt(100.0 * evt.loaded / evt.total))
          ).success((data, status, headers, config) ->
            $scope._setCollectionId(data.collectionid)
            progressInfo.finish(data.temporaryfiles)
            $scope.formController.removeInProgress()
          ).error((data) ->
            progressInfo.setErrors(data)
            $scope.formController.removeInProgress()
          )

        $scope._setCollectionId = (collectionid) ->
          $scope.collectionid = collectionid
          $scope.fileUploadFieldScope.setCollectionId(collectionid)

        return

      link: (scope, element, attr, formController) ->
        scope.uploadUrl = attr.djangoCradminBulkfileupload
        scope.formController = formController
        return
    }
])


.directive('djangoCradminBulkProgress', [
  'cradminBulkfileupload', '$http', '$cookies'
  (cradminBulkfileupload, $http, $cookies) ->
    return {
      restrict: 'AE'
      require: '^djangoCradminBulkfileupload'
      templateUrl: 'bulkfileupload/progress.tpl.html'
      scope: {}

      controller: ($scope) ->
        $scope.fileInfoLists = []
#        $scope.fileInfoLists = [
#          new cradminBulkfileupload.createFileInfoList({
#            percent: 10
#            files: [{
#              name: 'test.txt'
#            }, {
#              name: 'test2.txt'
#            }]
#          }),
#          new cradminBulkfileupload.createFileInfoList({
#            percent: 100
#            finished: true
#            files: [{
#              name: 'Some kind of test.txt'
#            }]
#          }),
#          new cradminBulkfileupload.createFileInfoList({
#            percent: 90
#            finished: true
#            files: [{
#              name: 'mybigfile.txt'
#            }]
#            hasErrors: true
#            errors: {
#              file: [{
#                message: 'File is too big'
#              }]
#            }
#          }),
#        ]

        $scope._findFileInfo = (fileInfo) ->
          if not fileInfo.temporaryfileid?
            throw new Error("Can not remove files without a temporaryfileid")
          for fileInfoList in $scope.fileInfoLists
            fileInfoIndex = fileInfoList.indexOf(fileInfo)
            if fileInfoIndex != -1
              return {
                fileInfoList: fileInfoList
                index: fileInfoIndex
              }
          throw new Error("Could not find requested fileInfo with temporaryfileid=#{fileInfo.temporaryfileid}.")

        @removeFile = (fileInfo) ->
          console.log 'Removing', fileInfo
          fileInfoLocation = $scope._findFileInfo(fileInfo)
          fileInfo.markAsIsRemoving()
          $scope.$apply()

          $http({
              url: $scope.uploadController.getUploadUrl()
              method: 'DELETE'
              headers:
                'X-CSRFToken': $cookies.csrftoken
              data:
                collectionid: $scope.uploadController.getCollectionId()
                temporaryfileid: fileInfo.temporaryfileid
            })
            .success((data, status, headers, config) ->
              console.log 'success', data
              fileInfoLocation.fileInfoList.remove(fileInfoLocation.index)
            ).
            error((data, status, headers, config) ->
              console?.error? 'ERROR', data
              alert('An error occurred while removing the file. Please try again.')
              fileInfo.markAsIsNotRemoving()
            )

        $scope.addFileInfoList = (options) ->
          fileInfoList = cradminBulkfileupload.createFileInfoList(options)
          $scope.fileInfoLists.push(fileInfoList)
          return fileInfoList

        return

      link: (scope, element, attr, uploadController) ->
        scope.uploadController = uploadController
        uploadController.setInProgressOrFinishedScope(scope)
        return
    }
])


.directive('djangoCradminBulkFileInfoList', [
  ->
    return {
      restrict: 'AE'
      scope: {
        fileInfoList: '=djangoCradminBulkFileInfoList'
      }
      templateUrl: 'bulkfileupload/fileinfolist.tpl.html'
      transclude: true

      controller: ($scope) ->
        @close = ->
          $scope.element.remove()
        return

      link: (scope, element, attr) ->
        scope.element = element
        return
    }
])


.directive('djangoCradminBulkfileuploadErrorCloseButton', [
  ->
    return {
      restrict: 'A'
      require: '^djangoCradminBulkFileInfoList'
      scope: {}

      link: (scope, element, attr, fileInfoListController) ->
        element.on 'click', (evt) ->
          evt.preventDefault()
          fileInfoListController.close()
        return
    }
])


.directive('djangoCradminBulkfileuploadRemoveFileButton', [
  ->
    return {
      restrict: 'A'
      require: '^djangoCradminBulkProgress'
      scope: {
        'fileInfo': '=djangoCradminBulkfileuploadRemoveFileButton'
      }

      link: (scope, element, attr, progressController) ->
        element.on 'click', (evt) ->
          evt.preventDefault()
          progressController.removeFile(scope.fileInfo)
        return
    }
])


.directive('djangoCradminBulkfileuploadCollectionidField', [
  ->
    return {
      require: '^djangoCradminBulkfileupload'
      restrict: 'AE'
      scope: {}

      controller: ($scope) ->
        $scope.setCollectionId = (collectionid) ->
          $scope.element.val("#{collectionid}")
        return

      link: (scope, element, attr, uploadController) ->
        scope.element = element
        uploadController.setFileUploadFieldScope(scope)
        return
    }
])


.directive('djangoCradminBulkfileuploadAdvancedWidget', [
  ->
    return {
      require: '^djangoCradminBulkfileupload'
      restrict: 'AE'
      scope: {}

      link: (scope, element, attr, uploadController) ->
        scope.hide = ->
          element.css('display', 'none')

        uploadController.setAdvancedWidgetScope(scope)
        return
    }
])


.directive('djangoCradminBulkfileuploadSimpleWidget', [
  ->
    return {
      require: '^djangoCradminBulkfileupload'
      restrict: 'AE'
      scope: {}

      link: (scope, element, attr, uploadController) ->
        scope.hide = ->
          element.css('display', 'none')

        uploadController.setSimpleWidgetScope(scope)

        return
    }
])
