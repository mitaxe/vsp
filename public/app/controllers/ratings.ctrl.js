angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'factory', 'ratingsVideos', function ($scope, factory, ratingsVideos) {

    // get first portion of ratings videos from route resolve
    $scope.ratingsVideos = [];
    console.log('after init empty array');
    console.log($scope.ratingsVideos);


    $scope.ratingsVideos = ratingsVideos.data.data;
    console.log('set data to array');
    console.log($scope.ratingsVideos);

    // get offset number
    $scope.initialOffset = ratingsVideos.data.meta.count;

    var offset = 0;

    // loading indicator
    $scope.loading = false;

    // load more videos
    $scope.loadMore = function() {
        $scope.loading = true;
        offset += $scope.initialOffset;

        console.log('offset request - ' + offset); //---
        console.time('ratingsRequestTime');

        factory.getRatingsVideos(offset).success(function(response){

            if(response.data != null) {
                console.timeEnd('ratingsRequestTime');
                console.log('videos received - ' + response.data.length); //---
                $scope.ratingsVideos.push.apply($scope.ratingsVideos, response.data);
                $scope.loading = false;
            } else {
                $scope.loading = false;
            }

        });

    };

    // video categories
    $scope.categories = [
        'JOD',
        'Adamantio 993'
    ];

}]);
