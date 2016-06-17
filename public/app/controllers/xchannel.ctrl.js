angular.module("MainApp")
.controller('xChannelCtrl', ['$scope', '$stateParams', 'mainChannel', 'factory' , function($scope, $stateParams, mainChannel, factory) {

    // for (var i = 0; i < $scope.channels.length; i++) {
    //     if ($scope.channels[i].url === $stateParams.url) {
    //         $scope.content = $scope.channels[i];
    //     }
    // }

    $scope.sortTypes = [
        'По дате добавления [новые]',
        'По дате добавления [старые]'
    ];

    $scope.selectedSortType = $scope.sortTypes[0];

    $scope.content = mainChannel.data.data;

    factory.getChannelVideos($stateParams.id).success(function(response) {
        $scope.channelVideos = response.data;
        console.log('related videos ', $scope.channelVideos);
    });
    
    $scope.sortReverse = true;

    $scope.sortBy = function(index) {
        $scope.sortReverse = index === 0 ? true : false;
    };

}]);
