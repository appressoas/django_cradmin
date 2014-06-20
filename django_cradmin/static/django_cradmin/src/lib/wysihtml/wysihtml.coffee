wysiapp = angular.module 'django_cradmin.wysihtml', []

wysiapp.directive 'djangoCradminWysihtml', () ->
    return {
        restrict: 'A'
        transclude: true
        template: '<div><p>Stuff is awesome!</p><div ng-transclude></div></div>'
    }
