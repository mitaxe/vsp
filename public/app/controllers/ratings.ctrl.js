angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'ratingsData', function ($scope, ratingsData) {

    $scope.ratingsData = ratingsData.data;

    // video categories
    $scope.categories = [
        'JOD',
        'Adamantio 993'
    ];

}]);