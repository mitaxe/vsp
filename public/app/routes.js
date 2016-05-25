angular.module("MainApp")
.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider

    // home
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: 'HomeCtrl'
    })

    // exclusive
    .state('exclusive', {
        url: "/exclusive",
        templateUrl: "app/views/exclusive.html"
    })

    // ratings
    .state('ratings', {
        url: "/ratings",
        templateUrl: "app/views/ratings.html",
        redirectTo: 'ratings.videos',
    })
    .state('ratings.videos', {
        url: "-videos",
        templateUrl: "app/views/ratings-videos.html"
    })
    .state('ratings.channels', {
        url: "-channels",
        templateUrl: "app/views/ratings-channels.html"
    })

    // blog
    .state('blog', {
        url: "/blog",
        templateUrl: "app/views/blog.html"
    })
    .state('article', {
        url: "/blog/:url",
        templateUrl: 'app/views/article.html',
        scope: {
            content: '='
        },
        // resolve: {
        //     data: function(factory){
        //         return factory.getVideos();
        //     }
        // },
        controller: function($scope, $stateParams) {
            for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].url === $stateParams.url) {
                    $scope.content = $scope.videos[i];
                }
            }
        }
    })

    // history
    .state('history', {
        url: "/history",
        templateUrl: "app/views/history.html",
        redirectTo: 'history.viewed',
    })
    .state('history.viewed', {
        url: "-viewed",
        templateUrl: "app/views/history-viewed.html"
    })
    .state('history.liked', {
        url: "-liked",
        templateUrl: "app/views/history-liked.html"
    })

    // channel
    .state('user', {
        url: "/user/:url",
        templateUrl: 'app/views/channel.html',
        scope: {
            content: '='
        },
        controller: function($scope, $stateParams, factory) {
            if ($stateParams.url === $scope.currentUser.url) {
                $scope.content = $scope.currentUser;
            } else {
                for (var i = 0; i < $scope.channels.length; i++) {
                    if ($scope.channels[i].url === $stateParams.url) {
                        $scope.content = $scope.channels[i];
                    }
                }
            }
        }
    })


    // video page
    .state('video', {
        url: "/video/:url",
        templateUrl: 'app/views/videopage.html',
        scope: {
            content: '='
        },
        controller: function($scope, $stateParams, factory) {
            for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].url === $stateParams.url) {
                    $scope.content = $scope.videos[i];
                }
            }
        }
    })

});
