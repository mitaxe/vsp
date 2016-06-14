angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'factory', 'ratingsVideos', function ($scope, factory, ratingsVideos) {

    // get first portion of ratings videos from route resolve
    $scope.ratingsVideos = ratingsVideos.data.data;

    // get offset number
    $scope.initialOffset = ratingsVideos.data.meta.count;

    var offset = $scope.initialOffset;

    // load more videos
    $scope.loadMore = function() {
        offset += $scope.initialOffset;
        console.log('offset request - ' + offset); //---
        console.time('ratingsRequestTime');
        factory.getRatingsVideos(offset).success(function(response){
            console.timeEnd('ratingsRequestTime');
            console.log('videos received - ' + response.data.length); //---
            $scope.ratingsVideos.push.apply($scope.ratingsVideos, response.data);
        });
    };

    // video categories
    $scope.categories = [
        'JOD',
        'Adamantio 993'
    ];

}]);
