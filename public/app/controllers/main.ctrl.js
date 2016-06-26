angular.module("MainApp")
.controller('MainCtrl', ['$scope', '$sce', 'factory', '$location', function ($scope, $sce, factory, $location) {

    // remove element
    $scope.remove = function(array,item) {
        if (item !== undefined) {
            if (item === 'all') {
                array.length = 0;
            } else {
                array.splice(array.indexOf(item),1);
            }
        }
    };

    // search
    $scope.search = function() {
        console.log('search key - ',$scope.searchKey);
        if (!$scope.searchKey) return;
        if ($scope.searchData) delete $scope.searchData;
        if ($scope.searchMetaData) delete $scope.searchMetaData;

        $scope.searching = true;

        factory.getSearch($scope.searchKey).success(function(response) {
            console.log('search response - ',response);
            document.getElementById('search-form').blur();
            $scope.searchActive = false;
            $scope.searching = false;
            $scope.searchTitle = $scope.searchKey;
            $scope.searchKey = null;
            $scope.searchData = response.data;
            $scope.searchMetaData = response.meta;
            $location.url('/search');
        });
    };



    /* Test Data */

    // current user test
    $scope.currentUser = {
        "name": "Current User",
        "url": "CurrUser",
        "avatar": "https://yt3.ggpht.com/-fGQ0wMqcQ2E/AAAAAAAAAAI/AAAAAAAAAAA/DJ1UmcmYRMI/s100-c-k-no-rj-c0xffffff/photo.jpg",
        "cover": "https://yt3.ggpht.com/-n5hYQ4Nf_Uk/VQsVarAAlgI/AAAAAAAAKhM/U3WIG__7xQs/w2120-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no/Never-Stop-Learning-Social_YouTube%2B%25281%2529.png",
        "description": "This is user channel description test test test test test test test test test test test test test test test test.",
        "subscr_counter" : 18358461
    };

    // factory test data
    factory.getVideos().success(function(response) {
        $scope.blogs = response.videos;
        $scope.videos = response.videos;
        $scope.pins = response.pins;
        $scope.channels = response.channels;
        $scope.goods = response.goods;
        $scope.notifications = response.notifications;
        $scope.comments = response.comments;
        // console.log($scope.videos)
    });

    // test limits and loadMore
    $scope.limits = {
        videos:  4,
        channels: 6,
        blogs: 6,
        comments: 2,
        reqCnt : 0
    };

    $scope.categories = [
        'Adamantio 993',
        'JOD'
    ];

}]);
