angular.module('djangoCradmin.imagepreview', [])

.directive 'djangoCradminImagePreview', ->
  ###
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
  ###
  controller = ($scope) ->
    @setImg = (imgscope) ->
      $scope.cradminImagePreviewImage = imgscope
    @previewFile = (file) ->
      $scope.cradminImagePreviewImage.previewFile(file)
    return
  return {
    restrict: 'A'
    controller: controller
  }

.directive 'djangoCradminImagePreviewImg', ->
  onFilePreviewLoaded = ($scope, srcData) ->
    $scope.element.attr('height', '')  # Unset height to avoid stretching
    $scope.element[0].src = srcData
    $scope.element.removeClass('ng-hide')

  controller = ($scope) ->
    $scope.previewFile = (file) ->
      reader = new FileReader()
      reader.onload = (evt) ->
        onFilePreviewLoaded($scope, evt.target.result)
      reader.readAsDataURL(file)
    return

  link = ($scope, element, attrs, previewCtrl) ->
    $scope.element = element
    previewCtrl.setImg($scope)
    if not element.attr('src')? or element.attr('src') == ''
      element.addClass('ng-hide')
    return

  return {
    require: '^djangoCradminImagePreview'
    restrict: 'A'
    scope: {}
    controller: controller
    link: link
  }

.directive 'djangoCradminImagePreviewFilefield', ->
  link = ($scope, element, attrs, previewCtrl) ->
    $scope.previewCtrl = previewCtrl
    $scope.element = element
    $scope.wrapperelement = element.parent()
    element.bind 'change', (evt) ->
      if evt.target.files?
        file = evt.target.files[0]
        $scope.previewCtrl.previewFile(file)
    element.bind 'mouseover', ->
      $scope.wrapperelement.addClass('django-cradmin-filewidget-field-and-overlay-wrapper-hover')
    element.bind 'mouseleave', ->
      $scope.wrapperelement.removeClass('django-cradmin-filewidget-field-and-overlay-wrapper-hover')
    return

  return {
    require: '^djangoCradminImagePreview'
    restrict: 'A'
    scope: {}
    link: link
  }
