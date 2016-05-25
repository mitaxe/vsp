angular.module("MainApp")
.controller('HomeCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    // factory data
    factory.getHomePageData().success(function(response) {
        $scope.blogs = response.videos;
        $scope.videos = response.videos;
        $scope.channels = response.channels;
        $scope.goods = response.goods;
    });

}]);
