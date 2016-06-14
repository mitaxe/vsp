angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'factory', 'videos', function ($scope, factory, videos) {

    console.log('init home controller');
    $scope.videos = videos.data.data;

    // console.log($scope.videos);

    // Сейчас смотрят = 0
    // Новые видео = 1
    // Популярные видео = 2
    // Custom block = 3
    // Блог = null
    // Эксклюзивные видео = 4
    // Custom block 2 = 5
    // Custom block 3 = 6

}]);
