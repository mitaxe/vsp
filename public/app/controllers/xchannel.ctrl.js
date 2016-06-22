angular.module("MainApp")
.controller('xChannelCtrl', ['$scope', '$stateParams', 'mainChannel', 'factory' , function($scope, $stateParams, mainChannel, factory) {

    // get main channel data
    $scope.content = mainChannel.data.data;


    // get the rest of channel data
    factory.getChannelVideos($stateParams.id).success(function(response) {
        $scope.channelVideos = response.data;
        console.log('related videos ', $scope.channelVideos);
    });

    // get the rest of channel data
    factory.getChannelPlaylists($stateParams.id).success(function(response) {
        $scope.channelPlaylists = response.data;
        console.log('channels playlists ', $scope.channelPlaylists);
    });    


    // subscribe
    $scope.subscribe = function() {
        $scope.subscribed = !$scope.subscribed;
        if ($scope.subscribed) {
            $scope.content.statSubscribers += 1;
        } else {
            $scope.content.statSubscribers -= 1;
        }
    };


    // sort channels
    $scope.sortTypes = [
        'По дате добавления [новые]',
        'По дате добавления [старые]'
    ];

    $scope.selectedSortType = $scope.sortTypes[0];

    $scope.sortReverse = true;

    $scope.sortBy = function(index) {
        $scope.sortReverse = index === 0 ? true : false;
    };

}]);
