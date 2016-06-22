angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'factory', 'exclusiveVideos', function ($scope, factory, exclusiveVideos) {

    // get first portion of videos from route resolve
    $scope.exclusiveVideos = exclusiveVideos.data.data;

    // get offset number
    $scope.initialOffset = exclusiveVideos.data.meta.count;

    // default request
    $scope.request = factory.getExclusiveData;

}]);
