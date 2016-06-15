angular.module("MainApp")
.controller('VideoPageCtrl', ['$scope', '$sce', '$window', 'mainVideos', function($scope, $sce, $window, mainVideos) {

    /* Main Video */

    $scope.mainVideos = mainVideos.data.data;

    console.log('1st api response - ', $scope.mainVideos);

    $scope.iframeSrc = function(src) {
        var url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src);
        // console.log(url);
        return url;
    };


    /* Sidebar Tabs */

    var windWidth = window.innerWidth;

    $scope.activeTab = windWidth > 1280 ? 1 : 3;
    $scope.desktop = windWidth > 1280 ? true : false;

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
