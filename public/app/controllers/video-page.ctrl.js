angular.module("MainApp")
.controller('VideoPageCtrl', ['$scope', '$window', 'mainVideos', function($scope, $window, mainVideos) {
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


    $scope.mainVideos = [];
    $scope.mainVideos = mainVideos.data.data;

    $scope.iframeSrc = function(src) {
      return 'https://www.youtube.com/embed/'+ src;
    };

    // console.log($scope.mainVideos);
    
}]);
