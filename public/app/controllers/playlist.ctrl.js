angular.module("MainApp")
    .controller('PlaylistCtrl', ['$scope', 'mainPlaylist', 'factory', '$stateParams', function ($scope, mainPlaylist, factory, $stateParams) {

        // get first portion of videos from route resolve
        $scope.mainPlaylist = mainPlaylist.data.data;

        // get offset number
        $scope.initialOffset = mainPlaylist.data.meta.count;

        var offset = 0;

        // loading indicator
        $scope.loading = false;
        $scope.noVideo = false;

        // load more videos
        $scope.loadMore = function () {
            if (!$scope.noVideo) {
                $scope.loading = true;
                offset += $scope.initialOffset;

                console.log('offset request - ' + offset); //---
                console.time('exclRequestTime');

                factory.getPlaylistData($stateParams.id, offset).success(function (response) {

                    if (response.data != null) {
                        console.timeEnd('exclRequestTime');
                        console.log('videos received - ' + response.data.length); //---
                        $scope.loading = false;
                        $scope.mainPlaylist.push.apply($scope.mainPlaylist, response.data);
                    } else {
                        $scope.loading = false;
                        $scope.noVideo = true;
                    }


                });
            }

        };

        $scope.categories = [
            'Adamantio 993',
            'JOD'
        ];


    }]);
