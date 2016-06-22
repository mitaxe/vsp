angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'factory', 'ratingsVideos', 'ratingsChannels', function ($scope, factory, ratingsVideos, ratingsChannels) {

    /* Videos */
    $scope.ratingsVideos = ratingsVideos.data.data;
    $scope.videosOffset = ratingsVideos.data.meta.count;
    $scope.videosRequest = factory.getRatingsVideos;

    /* Channels */
    $scope.ratingsChannels = ratingsChannels.data.data;
    $scope.channelsOffset = ratingsChannels.data.meta.count;
    $scope.channelsRequest = factory.getRatingsChannels;

}]);
