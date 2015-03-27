angular.module('cradminAuthenticate', [])

.directive 'focusonme', ['$timeout', ($timeout) ->
  {
    restrict: 'A',
    link: ($scope, $element) ->
      $timeout () ->
        $element[0].focus()
        return
      return
  }
]


