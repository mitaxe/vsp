angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'factory', 'videos', function ($scope, factory, videos) {

    console.log('init home controller');
    $scope.videos = videos.data.data;

}]);
