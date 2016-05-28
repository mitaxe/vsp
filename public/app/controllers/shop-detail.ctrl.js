angular.module("MainApp")
.controller('ShopDetailCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    $scope.test = 'asgasgasg';

    $scope.itemDetails = {
        name : $stateParams.itemId,
        images : [
            'assets/img/tshort1.png',
            'assets/img/tshort2.png'
        ]
    };

    $scope.mainImageUrl = $scope.itemDetails.images[0];

    $scope.setImage = function(url) {
        $scope.mainImageUrl = url;
    };

    $scope.selectedPreview = 0;
    $scope.setPreview = function(index) {
        $scope.selectedPreview = index;
    }
}]);
