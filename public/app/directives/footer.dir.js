angular.module("MainApp")
.directive('footerview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/templates/footer.html'
  };
});
