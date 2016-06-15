angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'factory', 'ratingsVideos', 'ratingsChannels', function ($scope, factory, ratingsVideos, ratingsChannels) {


    /* Videos */
    
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
    $scope.noVideo = false;

    // load more videos
    $scope.loadMoreVideos = function() {

        if (!$scope.noVideo) {
            $scope.loading = true;
            offset += $scope.initialOffset;

            console.log('offset request - ' + offset); //---
            console.time('ratingsRequestTime');

            factory.getRatingsVideos(offset).success(function(response){

                if(response.data !== null) {
                    console.timeEnd('ratingsRequestTime');
                    console.log('videos received - ' + response.data.length); //---
                    $scope.ratingsVideos.push.apply($scope.ratingsVideos, response.data);
                    $scope.loading = false;
                } else {
                    $scope.loading = false;
                    $scope.noVideo = true;
                }

            });
        }

    };


    /* Channels */

    $scope.ratingsChannels = ratingsChannels.data.data;

    console.log('channels - ' + $scope.ratingsChannels);

    $scope.loadMoreChannels = function() {

        if (!$scope.noVideo) {
            $scope.loading = true;
            offset += $scope.initialOffset;

            console.log('offset request - ' + offset); //---
            console.time('ratingsRequestTime');

            factory.getRatingsChannels(offset).success(function(response){

                if(response.data !== null) {
                    console.timeEnd('ratingsRequestTime');
                    console.log('videos received - ' + response.data.length); //---
                    $scope.ratingsChannels.push.apply($scope.ratingsChannels, response.data);
                    $scope.loading = false;
                } else {
                    $scope.loading = false;
                    $scope.noVideo = true;
                }

            });
        }

    };


    // video categories
    $scope.categories = [
        'JOD',
        'Adamantio 993'
    ];

}]);
