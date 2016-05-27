angular.module("MainApp")
    .controller('xChannelCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

        $scope.sortTypes = [
            'По дате добавления [сначала новые]',
            'По дате добавления [сначала старые]'
        ];
        $scope.xUser = {
            "name": $stateParams.url,
            "url": $stateParams.url,
            "avatar": "https://yt3.ggpht.com/-fGQ0wMqcQ2E/AAAAAAAAAAI/AAAAAAAAAAA/DJ1UmcmYRMI/s100-c-k-no-rj-c0xffffff/photo.jpg",
            "cover": "https://yt3.ggpht.com/-n5hYQ4Nf_Uk/VQsVarAAlgI/AAAAAAAAKhM/U3WIG__7xQs/w2120-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no/Never-Stop-Learning-Social_YouTube%2B%25281%2529.png",
            "description": "This is user channel description test test test test test test test test test test test test test test test test.",
            "subscr_counter" : 18358461
        };
        
        $scope.sortReverse = undefined;
        $scope.sortBy = function(index) {
            
                $scope.sortReverse = index == 0 ? true : false;
        };

        // console.log($stateParams.url);
    }]);