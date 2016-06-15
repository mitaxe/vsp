angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'factory', 'videos', function ($scope, factory, videos) {

    console.timeEnd('homeRequestTime');
    $scope.videos = videos.data.data;

    // console.log(
    //     $scope.videos.filter(function (el) {
    //       return el.blockId === 1;
    //     })
    // );

    // Сейчас смотрят = 0
    // Новые видео = 1
    // Популярные видео = 2
    // Custom block = 3
    // Эксклюзивные видео = 4
    // Custom block 2 = 5
    // Custom block 3 = 6

}]);
