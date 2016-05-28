angular.module("MainApp")
.controller('xChannelCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

    for (var i = 0; i < $scope.channels.length; i++) {
        if ($scope.channels[i].url === $stateParams.url) {
            $scope.content = $scope.channels[i];
        }
    }

    $scope.sortTypes = [
        'По дате добавления [новые]',
        'По дате добавления [старые]'
    ];

    $scope.selectedSortType = $scope.sortTypes[0];

    $scope.xUser = {
        "cover": "https://yt3.ggpht.com/-n5hYQ4Nf_Uk/VQsVarAAlgI/AAAAAAAAKhM/U3WIG__7xQs/w2120-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no/Never-Stop-Learning-Social_YouTube%2B%25281%2529.png",
        "description": "This is user channel description test test test test test test test test test test test test test test test test.",
        "subscr_counter" : 18358461
    };

    $scope.sortReverse = true;

    $scope.sortBy = function(index) {
        $scope.sortReverse = index == 0 ? true : false;
    };

    // console.log($stateParams.url);

}]);
