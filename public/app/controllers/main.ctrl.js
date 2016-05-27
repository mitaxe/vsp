angular.module("MainApp")
.controller('MainCtrl', ['$scope', '$sce', 'factory', 'prettyDate', function ($scope, $sce, factory, prettyDate) {

    // factory data
    factory.getVideos().success(function(response) {
        $scope.blogs = response.videos;
        $scope.videos = response.videos;
        $scope.pins = response.pins;
        $scope.channels = response.channels;
        $scope.goods = response.goods;
        $scope.notifications = response.notifications;
        $scope.comments = response.comments;

        // console.log($scope.goods);

        // videos sorted by date from most recent
        $scope.videosHistory = clone($scope.videos.sort(dynamicSort('date'))).reverse();
    });

    // video categories
    $scope.categories = [
        'JOD',
        'Adamantio 993'
    ];

    // current user
    $scope.currentUser = {
        "name": "Current User",
        "url": "CurrUser",
        "avatar": "https://yt3.ggpht.com/-fGQ0wMqcQ2E/AAAAAAAAAAI/AAAAAAAAAAA/DJ1UmcmYRMI/s100-c-k-no-rj-c0xffffff/photo.jpg",
        "cover": "https://yt3.ggpht.com/-n5hYQ4Nf_Uk/VQsVarAAlgI/AAAAAAAAKhM/U3WIG__7xQs/w2120-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no/Never-Stop-Learning-Social_YouTube%2B%25281%2529.png",
        "description": "This is user channel description test test test test test test test test test test test test test test test test.",
        "subscr_counter" : 18358461
    };


    // get humanized date format
    $scope.getDate = function(date,toDay) {
        return prettyDate(date,toDay);
    };


    // history filter
    $scope.historyFilter = function(array,index,prop) {
        if (
            index !== 0 &&
            array[index][prop] === array[index-1][prop]
        ) {
            return true;
        }
    };


    // limits and loadMore
    $scope.limits = {
        videos:  4,
        channels: 6,
        blogs: 6,
        comments: 2
    };

    $scope.initialLimits = clone($scope.limits);

    $scope.loadMore = function(prop) {
        $scope.limits[prop] += $scope.initialLimits[prop];
    };


    // remove element function
    $scope.remove = function(array,item) {
        if (item !== undefined) {
            if (item === 'all') {
                array.length = 0;
            } else {
                array.splice(array.indexOf(item),1);
            }
        }
    };


    // trash
    window.showVideos = function() {
        console.log($scope.videos);
    };

}]);
