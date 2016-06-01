angular.module("MainApp")
    .controller('VideoPageCtrl', ['$scope', function($scope) {

        $scope.activeTab = 1;

        $scope.setActiveTab = function(index) {
            $scope.activeTab = index;
        }
    }]);