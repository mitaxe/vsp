angular.module("MainApp")
    .controller('NewVideosCtrl', ['$scope', 'newVideos', '$http', function ($scope, newVideos, $http) {

        $scope.newVideos = newVideos.data.videos; //--

        if($scope.limits.reqCnt) {
            factory.getNewVideosData($scope.limits.reqCnt).success(function(response){
                $scope.newVideos = response.data;
            });
        } else {
            $scope.newVideos = newVideos.data;
        }

        $scope.categories = [
            'Adamantio 993',
            'JOD'
        ];

        // console.log(exclusiveVideos.data.videos);

        $scope.videos = 12;
        $scope.loadMoreVideos = function() {
            $scope.videos += 12;
            $scope.limits.videos+=4;
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
