angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'factory', 'exclusiveVideos', function ($scope, factory, exclusiveVideos) {

    // get first portion of videos from route resolve
    $scope.exclusiveVideos = exclusiveVideos.data.data;

    // get offset number
    $scope.initialOffset = exclusiveVideos.data.meta.count;

    var offset = 0;

    // loading indicator
    $scope.loading = false;

    // load more videos
    $scope.loadMore = function() {
        $scope.loading = true;
        offset += $scope.initialOffset;

        console.log('offset request - ' + offset); //---
        console.time('exclRequestTime');

        factory.getExclusiveData(offset).success(function(response){
            if(response.data != null) {
                console.timeEnd('exclRequestTime');
                console.log('videos received - ' + response.data.length); //---

                $scope.loading = false;
                $scope.exclusiveVideos.push.apply($scope.exclusiveVideos, response.data);
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
