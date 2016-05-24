angular.module("MainApp")
.controller('HeaderCtrl', ['$scope', 'factory', function ($scope, factory) {

    $scope.removePin = function(pin) {
        var index = $scope.pins.indexOf(pin);
        if (index > -1) {
            $scope.pins.splice(index, 1);
        }
    };

}]);
