angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'factory', 'exclusiveVideos', '$http', function ($scope, factory, exclusiveVideos, $http) {


    // $http.get('./assets/js/test.json').success(function(response) {
    //     $scope.exclusiveVideos = response.data;
    //     console.log($scope.exclusiveVideos);
    // });
    if($scope.limits.reqCnt) {
        factory.getExclusiveData($scope.limits.reqCnt).success(function(response){
            $scope.exclusiveVideos = response.data;
        });
    } else {
        $scope.exclusiveVideos = exclusiveVideos.data;
    }
    

    $scope.categories = [
        'Adamantio 993',
        'JOD'
    ];
    
    
    // console.log(exclusiveVideos.data.videos);

    $scope.loadMoreVideos = function() {
        $scope.limits.reqCnt += 12;
        $scope.limits.videos += 4;
        // factory.getExclusiveData(offset).success(function(response){
        //     console.log(response);
        // });
        $http({
            method: 'GET',
            url: '/exclusive/videos?offset='+ $scope.limits.reqCnt +''
        }).then(function successCallback(response) {
            console.log(response);
            $scope.exclusiveVideos.push(response);
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
        });
    };

}]);
