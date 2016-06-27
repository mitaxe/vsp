angular.module("MainApp")
.controller('SearchCtrl', ['$scope', 'factory', '$stateParams', function ($scope, factory, $stateParams) {

    $scope.requestVideos = factory.getSearchVideos;
    $scope.requestChannels = factory.getSearchChannels;
    $scope.requestArticles = factory.getSearchArticles;

    $scope.searchTitle = $scope.searchKey;

    if ($scope.searchKey) {

        $scope.requestVideos($scope.searchKey).success(function(response) {
            console.log('videos - ',response.data);

            $scope.searchActive = false;
            $scope.searching = false;
            // $scope.searchKey = null;

            $scope.searchVideos = response.data;
            $scope.videosOffset = response.meta.count;
            $scope.videosCount = response.meta.totalCount || 0;
        });

        $scope.requestChannels($scope.searchKey).success(function(response) {
            console.log('channels - ',response);
            $scope.searchChannels = response.data;
            $scope.channelsOffset = response.meta.count;
            $scope.channelsCount = response.meta.totalCount || 0;
        });

        $scope.requestArticles($scope.searchKey).success(function(response) {
            console.log('articles - ',response);
            $scope.searchArticles = response.data;
            $scope.articlesOffset = response.meta.count;
            $scope.articlesCount = response.meta.totalCount || 0;
        });

        $scope.totalCount = function() {
            if ($scope.videosCount >= 0 && $scope.channelsCount >= 0 && $scope.articlesCount >= 0) {
                return $scope.videosCount + $scope.channelsCount + $scope.articlesCount;
            }
        };

        $scope.totalCount();

    }

}]);
