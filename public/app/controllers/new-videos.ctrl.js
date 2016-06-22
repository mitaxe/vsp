angular.module("MainApp")
.controller('NewVideosCtrl', ['$scope', 'newVideos', 'factory', function ($scope, newVideos, factory) {

    // get first portion of videos from route resolve
    $scope.newVideos = newVideos.data.data;

    // get offset number
    $scope.initialOffset = newVideos.data.meta.count;

    // default request for this controller
    $scope.request = factory.getNewVideosData;

}]);
