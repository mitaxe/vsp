angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'exclusiveVideos', function ($scope, exclusiveVideos) {

    $scope.exclusiveVideos = exclusiveVideos.data.videos; //--

    $scope.categories = [
        'Adamantio 993',
        'JOD'
    ];

}]);
