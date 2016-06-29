angular.module("MainApp")
.directive('footerview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/templates/footer.html'
  };
});

angular.module("MainApp")
.directive('headerview', function() {
  return {
    restrict: 'E',
    controller: 'MainCtrl',
    replace: true,
    templateUrl: 'app/views/templates/header.html'
  };
});

angular.module("MainApp")
.directive('sidebarview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/templates/sidebar.html'
  };
});

angular.module("MainApp")
.directive('login', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/auth/login-template.html'
  };
});
