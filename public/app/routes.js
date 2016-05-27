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
        templateUrl: "app/views/channel.html",
        redirectTo: 'user.all',
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
    .state('user.all', {
        url : '/all',
        templateUrl: 'app/views/channel-all.html'
    })
    .state('user.liked', {
        url : '/liked',
        templateUrl: 'app/views/channel-liked.html'
    })
        
        
    //not my channel
        
    .state('xuser', {
        url : '/xuser/:url',
        templateUrl : "app/views/xchannel.html",
        redirectTo: 'xuser.all',
        controller : 'xChannelCtrl'
    })
    .state('xuser.all', {
        url : '/all',
        templateUrl: 'app/views/xchannel-all.html'
    })
    .state('xuser.playlist', {
        url : '/playlist',
        templateUrl: 'app/views/xchannel-liked.html'
    })
    .state('xuser.shop', {
        url : '/shop',
        templateUrl: 'app/views/xchannel-shop.html'
    })

    //shop detailed page
    .state('shop-detailed', {
        url : '/shop/:itemId',
        templateUrl: 'app/views/shop-detail.html',
        controller : 'shopDetailCtrl'
    })



    //profile
    .state('profile', {
        url : '/profile',
        templateUrl : 'app/views/profile.html',
        controller : 'ProfileCtrl'
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
    });

});
