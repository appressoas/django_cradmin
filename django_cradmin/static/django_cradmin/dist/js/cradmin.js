(function() {
  angular.module('djangoCradmin.default', ['ui.bootstrap', 'djangoCradmin.default.menu']);

}).call(this);

(function() {
  angular.module('djangoCradmin.default.menu', []).controller('CradminMenuController', function($scope) {
    $scope.displayMenu = false;
    return $scope.toggleNavigation = function() {
      return $scope.displayMenu = !$scope.displayMenu;
    };
  });

}).call(this);

(function() {
  describe('Menu works', function() {
    return it('should have a dummy test', inject(function() {
      return expect(true).toBeTruthy();
    }));
  });

}).call(this);

(function() {
  angular.module('djangoCradmin.wysihtml', []).directive('djangoCradminWysihtml', function() {
    return {
      restrict: 'A',
      transclude: true,
      template: '<div><p>Stuff is awesome!</p><div ng-transclude></div></div>'
    };
  });

}).call(this);
