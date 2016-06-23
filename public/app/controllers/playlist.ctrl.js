angular.module("MainApp")
.controller('PlaylistCtrl', ['$scope', 'mainPlaylist', 'factory', '$stateParams', function ($scope, mainPlaylist, factory, $stateParams) {

    // get first portion of videos from route resolve
    $scope.mainPlaylist = mainPlaylist.data.data;

    // get offset number
    $scope.initialOffset = mainPlaylist.data.meta.count;

    // default request
    $scope.request = factory.getPlaylistData;

    // get the rest of all videos data
    factory.getPlaylistVideos($stateParams.id, $stateParams.offset).success(function(response) {
        $scope.videos = response.data;
    });

    // id
    $scope.id = $stateParams.id;

}]);
