angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'homeVideos', function ($scope, homeVideos) {

    console.timeEnd('homeRequestTime');

    $scope.homeVideos = homeVideos.data.data;

    // function isBigEnough() {
    //     for (var i = 0; i < $scope.videos.length; i++) {
    //         if ($scope.videos[i].blockId === 2) {
    //             console.log($scope.videos[i]);
    //         }
    //     }
    // }
    //
    // isBigEnough();

    // Сейчас смотрят = 0
    // Новые видео = 1
    // Популярные видео = 2
    // Custom block = 3
    // Эксклюзивные видео = 4
    // Custom block 2 = 5
    // Custom block 3 = 6

    // console.log(
    //     $scope.videos.filter(function (el) {
    //       return el.blockId === 1;
    //     })
    // );

}]);
