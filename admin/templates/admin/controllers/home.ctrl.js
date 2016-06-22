angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'homeData', function ($scope, homeData) {

    $scope.tableData = homeData.data.data;
    console.log($scope.tableData);


    // $scope.showEdit = -1;
    // $scope.showHideEdit = function(index) {
    //     if(index !== undefined) {
    //         $scope.showEdit = index;
    //     } else {
    //         $scope.showEdit = -1;
    //     }
    // };
}]);
