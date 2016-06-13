angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'factory', 'exclusiveVideos', '$http', function ($scope, factory, exclusiveVideos, $http) {

    $scope.exclusiveVideos = exclusiveVideos.data.videos;

    $scope.categories = [
        'Adamantio 993',
        'JOD'
    ];

    // console.log(exclusiveVideos.data.videos);

    $scope.videos = 12;

    $scope.loadMoreVideos = function() {
        $scope.videos += 12;
        $scope.limits.videos += 4;
        // factory.getExclusiveData(offset).success(function(response){
        //     console.log(response);
        // });
        $http({
            method: 'GET',
            url: '/exclusive/videos?offset='+ $scope.videos +''
        }).then(function successCallback(response) {
            console.log(response);
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
        });
    };

}]);
