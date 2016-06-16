angular.module("MainApp")
.controller('VideoPageCtrl', ['$scope', '$sce', '$window', 'factory', '$stateParams', 'mainVideos',  function($scope, $sce, $window, factory, $stateParams, mainVideos) {

    /* Main Video */

    $scope.mainVideos = mainVideos.data.data;

    // console.log('1st api response - ', $scope.mainVideos);

    $scope.iframeSrc = function(src) {
        var url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src);
        // console.log(url);
        return url;
    };


    //comments
    $scope.comments = [];
    factory.getVideoPageComments($stateParams.id).success(function(response) {
        $scope.comments = response.data.comments;
        console.log('comments ', $scope.comments);
    });
    
    //related videos
    $scope.relatedVideos = [];
    factory.getRelatedVideos($stateParams.id).success(function(response) {
        $scope.relatedVideos = response.data;
        console.log('related videos ', $scope.relatedVideos);
    });
    
    //related channels 
    $scope.relatedChannels = [];
    factory.getRelatedChannels($stateParams.id).success(function(response) {
        $scope.relatedChannels = response.data;
        console.log('relatedChannels ', $scope.relatedChannels);
    });



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
