angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'factory', 'exclusiveVideos', function ($scope, factory, exclusiveVideos) {

    // get first portion of videos from route resolve
    $scope.exclusiveVideos = exclusiveVideos.data.data;

    // get offset number
    $scope.initialOffset = exclusiveVideos.data.meta.count;

    var offset = $scope.initialOffset;

    // load more videos
    $scope.loadMore = function() {
        offset += $scope.initialOffset;
        console.log('offset request - ' + offset); //---
        console.time('exclRequestTime');
        factory.getExclusiveData(offset).success(function(response){
            console.timeEnd('exclRequestTime');
            console.log('videos received - ' + response.data.length); //---
            $scope.exclusiveVideos.push.apply($scope.exclusiveVideos, response.data);
        });

    };

    $scope.categories = [
        'Adamantio 993',
        'JOD'
    ];

}]);
