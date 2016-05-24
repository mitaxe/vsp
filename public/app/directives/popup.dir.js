angular.module("MainApp")
.directive('overlay', function($interval) {
  return {
    restrict: 'E',
    controller: 'MainCtrl',
    replace: true,
    template: '<div class="overlay" ng-class="{active:popupActive}" ng-click="hidePopup()">'+
                '<div class="modal" ng-include="content"></div>'+
                '</div>',
    link: function($scope, element, attrs) {

        $scope.showPopup = function(content) {
            $scope.content = 'app/views/' + content + '.html';
            $scope.popupActive = true;
        };

        $scope.hidePopup = function() {
            $scope.content = '';
            $scope.popupActive = false;
        };

    }
  };
});
