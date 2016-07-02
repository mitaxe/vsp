angular.module("MainApp")
.controller('HistoryCtrl', ['$scope', 'factory', 'historyData', function ($scope, factory, historyData) {

    factory.getHistoryData().success(function(response) {
        $scope.historyData = response.data;
        console.log('History data - ', $scope.historyData);
    });

    // history filter
    $scope.historyFilter = function(array,index,prop) {
        return true;
        if (
            index !== 0 &&
            array[index][prop] === array[index-1][prop]
        ) {
            return true;
        }
    };

}]);
