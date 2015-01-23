angular.module('djangoCradmin.bulkfileupload', ['angularFileUpload', 'ngCookies'])


.directive('djangoCradminBulkfileupload', [
  '$upload', '$cookies'
  ($upload, $cookies) ->
    return {
      restrict: 'A'
      scope: true

      controller: ($scope) ->
        $scope.collectionid = null
        $scope.cradminBulkFileUploadFiles = []

        @setFileUploadFieldScope = (fileUploadFieldScope) ->
          $scope.fileUploadFieldScope = fileUploadFieldScope

        $scope.$watch 'cradminBulkFileUploadFiles', ->
          for file in $scope.cradminBulkFileUploadFiles
            $scope._uploadFile(file)

        $scope._uploadFile = (file) ->
          $scope.upload = $upload.upload({
            url: $scope.uploadUrl
            method: 'POST'
            data: {
              collectionid: $scope.collectionid
            }
            file: file  # single file or a list of files. list is only for html5
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
