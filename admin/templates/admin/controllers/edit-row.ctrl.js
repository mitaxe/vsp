angular.module("MainApp")
.controller('EditRowCtrl', ['$scope', 'getEditData', '$stateParams', '$filter', function ($scope, getEditData, $stateParams, $filter) {

    $scope.allData = getEditData.data.data;

    $scope.editData = $filter('filter')($scope.allData, {id: $stateParams.id})[0];

    console.log($scope.editData);

    $scope.updateRowData = function($event) {
        $event.preventDefault();
        console.log('save ', $scope.editData);
        // $http.post('#', $scope.editData).success(function(data) {
        //     console.log('saved');
        // });
    };

}]);
