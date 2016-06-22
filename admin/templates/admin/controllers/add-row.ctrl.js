angular.module("MainApp")
    .controller('AddRowCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.newRow = {};

        $scope.addNewRow = function($event) {
            $event.preventDefault();

            console.log($scope.newRow);

            // $http.post('#', $scope.newRow).success(function(data) {
            //     console.log('added');
            // });

        };
    }]);