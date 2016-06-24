angular.module("MainApp")
.directive('headerview', function() {
  return {
    restrict: 'E',
    controller: 'MainCtrl',
    replace: true,
    templateUrl: 'app/views/templates/header.html'
  };
});
