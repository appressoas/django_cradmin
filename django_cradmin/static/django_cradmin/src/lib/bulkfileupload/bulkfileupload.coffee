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
  '$upload', '$cookies', 'cradminDetectize'
  ($upload, $cookies, cradminDetectize) ->
    return {
      require: '^djangoCradminBulkfileuploadForm'
      restrict: 'A'
      scope: true

      controller: ($scope) ->
        $scope.collectionid = null
        $scope.cradminBulkFileUploadFiles = []
        $scope.simpleWidgetScope = null
        $scope.advancedWidgetScope = null

        @setFileUploadFieldScope = (fileUploadFieldScope) ->
          $scope.fileUploadFieldScope = fileUploadFieldScope

        @setSimpleWidgetScope = (simpleWidgetScope) ->
          $scope.simpleWidgetScope = simpleWidgetScope
          $scope._showAppropriateWidget()

        @setAdvancedWidgetScope = (advancedWidgetScope) ->
          $scope.advancedWidgetScope = advancedWidgetScope
          $scope._showAppropriateWidget()

        $scope._showAppropriateWidget = ->
          if $scope.advancedWidgetScope and $scope.simpleWidgetScope
            if cradminDetectize.device.type == 'desktop'
              $scope.simpleWidgetScope.hide()
            else
              $scope.advancedWidgetScope.hide()


        $scope.$watch 'cradminBulkFileUploadFiles', ->
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


.directive('djangoCradminBulkfileuploadAdvancedWidget', [
  ->
    return {
      require: '^djangoCradminBulkfileupload'
      restrict: 'A'
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
      restrict: 'A'
      scope: {}

      link: (scope, element, attr, uploadController) ->
        scope.hide = ->
          element.css('display', 'none')

        uploadController.setSimpleWidgetScope(scope)

        return
    }
])
