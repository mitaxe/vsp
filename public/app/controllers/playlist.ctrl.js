angular.module("MainApp")
.controller('PlaylistCtrl', ['$scope', 'mainPlaylist', 'factory', '$stateParams', function ($scope, mainPlaylist, factory, $stateParams) {

    // get first portion of videos from route resolve
    $scope.mainPlaylist = mainPlaylist.data.data;

    // request for loadMore
    $scope.request = factory.getPlaylistVideos;

    // get first portion of videos
    $scope.request($stateParams.id).success(function(response) {
        $scope.playlistVideos = response.data;
        // get offset number
        $scope.initialOffset = response.meta.count;
    });

    // id
    $scope.id = $stateParams.id;

}]);
