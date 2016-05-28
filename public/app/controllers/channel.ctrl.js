angular.module("MainApp")
.controller('ChannelCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    $scope.content = $scope.currentUser;

    $scope.hoverIn = function(target) {
        if(target == 'ava') {
            $scope.changeAvaText = true;
        } else {
            $scope.channelbgText = true;
        }
    };
    $scope.hoverOut = function(target) {
        if(target == 'ava') {
            $scope.changeAvaText = false;
        } else {
            $scope.channelbgText = false;
        }
    };

    $scope.subscriptions = 116;

}]);
