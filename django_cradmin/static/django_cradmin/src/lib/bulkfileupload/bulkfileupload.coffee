
angular.module('djangoCradmin.bulkfileupload', [
  'angularFileUpload', 'ngCookies'
])


.provider 'cradminBulkfileuploadCoordinator', ->
  class FileUploadCoordinator
    constructor: ($window) ->
      @hiddenfieldnameToScopeMap = {}
      @window = $window

    register: (hiddenfieldname, scope) ->
      existingScope = @hiddenfieldnameToScopeMap[hiddenfieldname]
      if existingScope?
        console.error(
          'Trying to register a fieldname that is already registered with ' +
          'cradminBulkfileuploadCoordinator. Fieldname:', hiddenfieldname)
        return
      @hiddenfieldnameToScopeMap[hiddenfieldname] = scope

    unregister: (hiddenfieldname) ->
      scope = @hiddenfieldnameToScopeMap[hiddenfieldname]
      if not scope?
        console.error(
          'Trying to unregister a field that is not registered with ' +
          'cradminBulkfileuploadCoordinator. Fieldname:', hiddenfieldname)
      @hiddenfieldnameToScopeMap[hiddenfieldname] = undefined

  @$get = (['$window', ($window) ->
    return new FileUploadCoordinator($window)
  ])

  return @


.factory 'cradminBulkfileupload', ->
  class FileInfo
    constructor: (options) ->
      @file = options.file
      @temporaryfileid = options.temporaryfileid
      @name = options.name
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
      @rawFiles = options.files
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

    finish: (temporaryfiles, singlemode) ->
      @finished = true

      # Update the client provided filenames with the filename from the server
      index = 0
      @files = []
      for temporaryfile in temporaryfiles
        @files.push(new FileInfo({
          temporaryfileid: temporaryfile.id
          name: temporaryfile.filename
        }))

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
  '$upload', '$cookies', 'cradminDetectize', 'cradminBulkfileuploadCoordinator'
  ($upload, $cookies, cradminDetectize, cradminBulkfileuploadCoordinator) ->
    return {
      require: '^djangoCradminBulkfileuploadForm'
      restrict: 'AE'
      scope: true

      controller: ($scope) ->
        $scope.collectionid = null

        # The scope variable changed when users add files
        $scope.cradminLastFilesSelectedByUser = []

        # Queue of files waiting for upload. Each time $scope.cradminLastFilesSelectedByUser
        # is changed, we add files here and clear $scope.cradminLastFilesSelectedByUser.
        $scope.fileUploadQueue = []

        # This is set to ``true`` when the first upload is in progress.
        # While this is ``true``, we just add files to the $scope.fileUploadQueue
        # but we do not upload the files until it becomes ``false``.
        $scope.firstUploadInProgress = false

        $scope.simpleWidgetScope = null
        $scope.advancedWidgetScope = null
        $scope.rejectedFilesScope = null

        @setInProgressOrFinishedScope = (inProgressOrFinishedScope) ->
          $scope.inProgressOrFinishedScope = inProgressOrFinishedScope

        @setFileUploadFieldScope = (fileUploadFieldScope, fieldname) ->
          $scope.fileUploadFieldScope = fileUploadFieldScope
          cradminBulkfileuploadCoordinator.register(fileUploadFieldScope.fieldname, $scope)

        @setSimpleWidgetScope = (simpleWidgetScope) ->
          $scope.simpleWidgetScope = simpleWidgetScope
          $scope._showAppropriateWidget()

        @setAdvancedWidgetScope = (advancedWidgetScope) ->
          $scope.advancedWidgetScope = advancedWidgetScope
          $scope._showAppropriateWidget()

        @setRejectFilesScope = (rejectedFilesScope) ->
          $scope.rejectedFilesScope = rejectedFilesScope

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

        $scope.filesDropped = (files, evt, rejectedFiles) ->
          if rejectedFiles.length > 0
            $scope.rejectedFilesScope.setRejectedFiles(rejectedFiles)

        $scope.$watch 'cradminLastFilesSelectedByUser', ->
          if $scope.cradminLastFilesSelectedByUser.length > 0
            $scope._addFilesToQueue($scope.cradminLastFilesSelectedByUser.slice())
            $scope.cradminLastFilesSelectedByUser = []

        $scope._addFilesToQueue = (files) ->
          if $scope.apiparameters.singlemode
            $scope.inProgressOrFinishedScope.clear()
          progressInfo = $scope.inProgressOrFinishedScope.addFileInfoList({
            percent: 0
            files: files
          })
          $scope.fileUploadQueue.push(progressInfo)
          if $scope.firstUploadInProgress
            # If the first upload is in progress, we need to postpone subsequent
            # uploads until we get the response from the first upload containing
            # the collectionid.
            return
          if $scope.collectionid == null
            $scope.firstUploadInProgress = true
          $scope._processFileUploadQueue()

        $scope._onFileUploadComplete = ->
          ###
          Called both on file upload success and error
          ###
          $scope.firstUploadInProgress = false
          $scope.formController.removeInProgress()
          if $scope.fileUploadQueue.length > 0
            $scope._processFileUploadQueue()

        $scope._processFileUploadQueue = () ->
          progressInfo = $scope.fileUploadQueue.shift()  # Pop the first element from the queue
          apidata = angular.extend({}, $scope.apiparameters, {collectionid: $scope.collectionid})
          $scope.formController.addInProgress()

          $scope.upload = $upload.upload({
            url: $scope.uploadUrl
            method: 'POST'
            data: apidata
            file: progressInfo.rawFiles
            fileFormDataName: 'file'  # The form field name
            headers: {
              'X-CSRFToken': $cookies.get('csrftoken')
              'Content-Type': 'multipart/form-data'
            }
          }).progress((evt) ->
            progressInfo.updatePercent(parseInt(100.0 * evt.loaded / evt.total))
          ).success((data, status, headers, config) ->
            progressInfo.finish(data.temporaryfiles, $scope.apiparameters.singlemode)
            $scope._setCollectionId(data.collectionid)
            $scope._onFileUploadComplete()
          ).error((data, status) ->
            if status == 503
              progressInfo.setErrors({
                file: [{
                  message: $scope.errormessage503
                }]
              })
            else
              progressInfo.setErrors(data)
            $scope._onFileUploadComplete()
          )

        $scope._setCollectionId = (collectionid) ->
          $scope.collectionid = collectionid
          $scope.fileUploadFieldScope.setCollectionId(collectionid)

        return

      link: ($scope, element, attributes, formController) ->
        $scope.uploadUrl = attributes.djangoCradminBulkfileupload
        $scope.errormessage503 = attributes.djangoCradminBulkfileuploadErrormessage503
        if attributes.djangoCradminBulkfileuploadApiparameters?
          $scope.apiparameters = $scope.$parent.$eval(attributes.djangoCradminBulkfileuploadApiparameters)
          if not angular.isObject($scope.apiparameters)
            throw new Error('django-cradmin-bulkfileupload-apiparameters must be a javascript object.')
        else
          $scope.apiparameters = {}
        $scope.formController = formController

        displaystyle = attributes.djangoCradminBulkfileuploadDisplaystyle
        if displaystyle == 'inline' or displaystyle == 'overlay'
          $scope.displaystyle = displaystyle
        else
          throw new Error('django-cradmin-bulkfileupload-displaystyle must be one of: "inline" or "frame".')
        $scope.$on '$destroy', ->
          if $scope.fileUploadFieldScope?
            cradminBulkfileuploadCoordinator.unregister $scope.fileUploadFieldScope.fieldname

        return
    }
])


.directive('djangoCradminBulkfileuploadRejectedFiles', [
  ->
    ###
    This directive is used to show files that are rejected on drop because
    of wrong mimetype. Each time a user drops one or more file with invalid
    mimetype, this template is re-rendered and displayed.
    ###
    return {
      restrict: 'A'
      require: '^djangoCradminBulkfileupload'
      templateUrl: 'bulkfileupload/rejectedfiles.tpl.html'
      transclude: true
      scope: {
        rejectedFileErrorMessage: '@djangoCradminBulkfileuploadRejectedFiles'
      }

      controller: ($scope) ->
        $scope.rejectedFiles = []
        $scope.setRejectedFiles = (rejectedFiles) ->
          $scope.rejectedFiles = rejectedFiles

        $scope.closeMessage = (rejectedFile) ->
          index = $scope.rejectedFiles.indexOf(rejectedFile)
          if index != -1
            $scope.rejectedFiles.splice(index, 1)

      link: (scope, element, attr, bulkfileuploadController) ->
        bulkfileuploadController.setRejectFilesScope(scope)
        return
    }
])


.directive('djangoCradminBulkfileuploadProgress', [
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
          fileInfoLocation = $scope._findFileInfo(fileInfo)
          fileInfo.markAsIsRemoving()
          $scope.$apply()

          $http({
              url: $scope.uploadController.getUploadUrl()
              method: 'DELETE'
              headers:
                'X-CSRFToken': $cookies.get('csrftoken')
              data:
                collectionid: $scope.uploadController.getCollectionId()
                temporaryfileid: fileInfo.temporaryfileid
            })
            .success((data, status, headers, config) ->
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

        $scope.clear = (options) ->
          $scope.fileInfoLists = []

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
      require: '^djangoCradminBulkfileuploadProgress'
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
        scope.fieldname = attr.name
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


.directive('djangoCradminBulkfileuploadShowOverlay', [
  ->
    return {
      restrict: 'AE'
      scope: {}

      link: (scope, element, attr) ->
        console.log 'link djangoCradminBulkfileuploadShowOverlay'
        return
    }
])
