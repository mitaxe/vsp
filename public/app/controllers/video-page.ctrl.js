angular.module("MainApp")
    .controller('VideoPageCtrl', ['$scope', '$window', function($scope, $window) {
        var windWidth = window.innerWidth;

        $scope.activeTab = windWidth > 1280 ? 1 : 3;
        $scope.desktop =  windWidth > 1280 ? true : false;

        $scope.setActiveTab = function(index) {
            $scope.activeTab = index;
        };

        $scope.$on('resize::resize', function() {
            if(window.innerWidth < 1280) {
                $scope.desktop = false;
                $scope.activeTab = 3; //set active comments tab
            } else {
                $scope.desktop = true;
                $scope.activeTab = 1;
            }
        });

        angular.element($window).bind('resize', function() {
            $scope.$apply();
        });
    }]);