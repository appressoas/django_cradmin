angular.module('djangoCradmin.bulkfileupload', ['angularFileUpload', 'ngCookies'])


.directive('djangoCradminBulkfileuploadForm', [
  ->
    ###
    A form containing ``django-cradmin-bulkfileupload`` fields
    must use this directive.
    ###
    return {
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        return

      link: (scope, element, attr, uploadController) ->
        scope.element = element
        return
    }
])


.directive('djangoCradminBulkfileupload', [
  '$upload', '$cookies'
  ($upload, $cookies) ->
    return {
      require: '^djangoCradminBulkfileuploadForm'
      restrict: 'A'
      scope: true

      controller: ($scope) ->
        $scope.collectionid = null
        $scope.cradminBulkFileUploadFiles = []

        @setFileUploadFieldScope = (fileUploadFieldScope) ->
          $scope.fileUploadFieldScope = fileUploadFieldScope

        $scope.$watch 'cradminBulkFileUploadFiles', ->
#          for file in $scope.cradminBulkFileUploadFiles
          if $scope.cradminBulkFileUploadFiles.length > 0
            $scope._uploadFiles()

        $scope._uploadFiles = (file) ->
          console.log 'Upload with collectionid=', $scope.collectionid
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
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name)
          ).success((data, status, headers, config) ->
            # file is uploaded successfully
            console.log('file ' + config.file.name + 'is uploaded successfully. Response: ')
            console.log data
            $scope._setCollectionId(data.collectionid)
          )

        $scope._setCollectionId = (collectionid) ->
          $scope.collectionid = collectionid
          $scope.fileUploadFieldScope.setCollectionId(collectionid)

        return

      link: (scope, element, attr) ->
        scope.uploadUrl = attr.djangoCradminBulkfileupload
        return
    }
])


.directive('djangoCradminBulkfileuploadCollectionidField', [
  ->
    return {
      require: '^djangoCradminBulkfileupload'
      restrict: 'A'
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


.directive('djangoCradminBulkfileuploadFileselectButton', [
  '$parse', '$timeout', '$compile'
  ($parse, $timeout, $compile) ->
    return {
      require: '?ngModel'
      restrict: 'A'
      scope: {}

      controller: ($scope) ->
        return

      link: (scope, element, attr, fileSelectController) ->
        scope.element = element

        if attr.ngMultiple && $parse(attr.ngMultiple)(scope)
          element.attr('multiple', 'true')
          attr['multiple'] = 'true'

        accept = attr.ngAccept && $parse(attr.ngAccept)(scope)
        if accept
          element.attr('accept', accept)
          attr['accept'] = accept

        fileElem = angular.element('<input type="file">')
        if attr['multiple']
          fileElem.attr('multiple', attr['multiple'])
        if attr['accept']
          fileElem.attr('accept', attr['accept'])
        fileElem.css('width', '1px').css('height', '1px').css('opacity', 0)
            .css('position', 'absolute').css('filter', 'alpha(opacity=0)')
            .css('padding', 0).css('margin', 0).css('overflow', 'hidden')
            .attr('tabindex', '-1').attr('ng-file-generated-elem', true)
        element.append(fileElem)
        element.__afu_fileClickDelegate__ = ->
          fileElem[0].click()
        element.bind('click', element.__afu_fileClickDelegate__)
        element.css('overflow', 'hidden')
        origElem = element
        element = fileElem

        if (attr['ngFileSelect'] != '')
          attr.ngFileChange = attr.ngFileSelect

        if $parse(attr.resetOnClick)(scope) != false
          if navigator.appVersion.indexOf("MSIE 10") != -1
            # fix for IE10 cannot set the value of the input to null programmatically by replacing input
            replaceElem = (evt) ->
              inputFile = element.clone()
              inputFile.val('')
              element.replaceWith(inputFile)
              $compile(inputFile)(scope)
              fileElem = inputFile
              element = inputFile
              element.bind('change', onChangeFn)
              element.unbind('click')
              element[0].click()
              element.bind('click', replaceElem)
              evt.preventDefault()
              evt.stopPropagation()
            element.bind('click', replaceElem)
          else
            element.bind 'click', (evt) ->
              element[0].value = null

        onChangeFn = (evt) ->
          files = []
          fileList = evt.__files_ || evt.target.files
          updateModel(fileList, attr, ngModel, scope, evt)
        element.bind('change', onChangeFn)

        updateModel = (fileList, attr, ngModel, change, scope, evt) ->
          files = []
          for fileListItem in fileList
            files.push(fileListItem)

          if ngModel
            scope[attr.ngModel] ? scope[attr.ngModel].value = files : scope[attr.ngModel] = files
            ngModel && ngModel.$setViewValue(files != null && files.length == 0 ? '' : files)

          if attr.ngFileChange && attr.ngFileChange != ""
            $timeout ->
              $parse(attr.ngFileChange)(scope, {
                $files: files
                $event: evt
              })

        return
    }
])
