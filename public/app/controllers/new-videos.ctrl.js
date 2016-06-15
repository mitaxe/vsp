angular.module("MainApp")
    .controller('NewVideosCtrl', ['$scope', 'newVideos', '$http', 'factory', function ($scope, newVideos, $http, factory) {

        // get first portion of videos from route resolve
        $scope.newVideos = newVideos.data.data;

        // get offset number
        $scope.initialOffset = newVideos.data.meta.count;

        var offset = 0;

        // loading indicator
        $scope.loading = false;

        // load more videos
        $scope.loadMore = function() {
            $scope.loading = true;
            offset += $scope.initialOffset;

            console.log('offset request - ' + offset); //---
            console.time('exclRequestTime');

            factory.getNewVideosData(offset).success(function(response){
                if(response.data != null) {
                    console.timeEnd('exclRequestTime');
                    console.log('videos received - ' + response.data.length); //---
                    $scope.loading = false;
                    $scope.newVideos.push.apply($scope.newVideos, response.data);
                } else {
                    $scope.loading = false;
                }
                
                
            });

        };

        $scope.categories = [
            'Adamantio 993',
            'JOD'
        ];


    }]);
