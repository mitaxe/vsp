angular.module("MainApp")
.directive('footerview', function() {
  return {
    restrict: 'E',
    // controller: 'MainCtrl',
    replace: true,
    templateUrl: 'app/views/footer.html'
  };
});
