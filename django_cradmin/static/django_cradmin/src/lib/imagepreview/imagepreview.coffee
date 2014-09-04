angular.module('djangoCradmin.imagepreview', [])

.directive 'djangoCradminImagePreview', ->
  return {
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      @setImg = (imgScope) ->
        $scope.img = imgScope
      @previewFile = (file) ->
        $scope.img.previewFile(file)
      return
  }

.directive 'djangoCradminImagePreviewImg', ->
  return {
    require: '^djangoCradminImagePreview'
    restrict: 'A'
    scope: {}

    controller: ($scope) ->
      $scope.previewFile = (file) ->
        reader = new FileReader()
        reader.onload = (evt) ->
          $scope.element.attr('height', '')  # Unset height to avoid stretching the image
          $scope.element[0].src = evt.target.result
        reader.readAsDataURL(file)
      return

    link: (scope, element, attrs, previewCtrl) ->
      scope.element = element
      previewCtrl.setImg(scope)
      return
  }

.directive 'djangoCradminImagePreviewFilefield', ->
  return {
    require: '^djangoCradminImagePreview'
    restrict: 'A'
    scope: {}

    link: (scope, element, attrs, previewCtrl) ->
      scope.previewCtrl = previewCtrl
      scope.element = element
      element.bind 'change', (evt) ->
        if evt.target.files?
          file = evt.target.files[0]
          scope.previewCtrl.previewFile(file)
      return
  }
