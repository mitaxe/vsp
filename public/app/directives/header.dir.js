angular.module("MainApp")
.directive('headerview', function() {
  return {
    restrict: 'E',
    controller: 'HeaderCtrl',
    replace: true,
    templateUrl: 'app/views/header.html'
  };
});
