angular.module("MainApp")
.controller('ChannelCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    // $scope.channelbgText = false;
    // $scope.changeAvaText = false;
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
