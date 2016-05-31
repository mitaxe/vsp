angular.module("MainApp")
.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    // redirects
    $urlRouterProvider
    .when("/history", "/history/viewed")
    .when("/ratings", "/ratings/videos")
    .when("/user/:url", "/user/:url/all")
    .when('/search', '/search/all')
    .when("/xuser/:url", "/xuser/:url/all");


    $stateProvider

    // home
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: 'HomeCtrl',
        resolve: {
            homeData: function(factory) {
                return factory.getHomeData();
            }
        },
        controller: function($scope, homeData) {
            $scope.homeData = homeData.data;
        }
    })

    // registration/sign-in
    .state('reg', {
        url : '/reg',
        templateUrl : 'app/views/registration.html'
    })
    .state('sign-in', {
        url : '/sign-in',
        templateUrl : 'app/views/sign-in.html'
    })

    // search
    .state('search', {
        url : '/search',
        templateUrl : 'app/views/search.html',
        redirectTo : 'search.all',
        resolve: {
            historyData: function(factory) {
                return factory.getHistoryData();
            }
        },
        controller : 'SearchCtrl'
    })
    .state('search.all', {
        url : '/all',
        templateUrl : 'app/views/search-all.html'
    })
    .state('search.video', {
        url : '/video',
        templateUrl : 'app/views/search-video.html'
    })
    .state('search.channel', {
        url : '/channel',
        templateUrl : 'app/views/search-channels.html'
    })
    .state('search.articles', {
        url : '/articles',
        templateUrl : 'app/views/search-articles.html'
    })

    // exclusive
    .state('exclusive', {
        url: "/exclusive",
        templateUrl: "app/views/exclusive.html",
        controller: 'ExclusiveCtrl',
        resolve: {
            exclusiveVideos: function(factory) {
                return factory.getExclusiveData();
            }
        }
    })

    // ratings
    .state('ratings', {
        url: "/ratings",
        templateUrl: "app/views/ratings.html",
        resolve: {
            ratingsData: function(factory) {
                return factory.getRatingsData();
            }
        },
        controller: 'RatingsCtrl'
    })
    .state('ratings.videos', {
        url: "/videos",
        templateUrl: "app/views/ratings-videos.html"
    })
    .state('ratings.channels', {
        url: "/channels",
        templateUrl: "app/views/ratings-channels.html"
    })

    // blog
    .state('blog', {
        url: "/blog",
        templateUrl: "app/views/blog.html",
        resolve: {
            blogData: function(factory) {
                return factory.getBlogData();
            }
        },
        controller: function($scope, blogData) {
            $scope.blogData = blogData.data.videos;
        }
    })
    .state('article', {
        url: "/blog/:url",
        templateUrl: 'app/views/article.html',
        scope: {
            content: '='
        },
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
        resolve: {
            historyData: function(factory) {
                return factory.getHistoryData();
            }
        },
        controller: 'HistoryCtrl'
    })
    .state('history.viewed', {
        url: "/viewed",
        templateUrl: "app/views/history-viewed.html"
    })
    .state('history.liked', {
        url: "/liked",
        templateUrl: "app/views/history-liked.html"
    })

    // channel
    .state('user', {
        url: "/user/:url",
        templateUrl: "app/views/channel.html",
        controller: 'ChannelCtrl'
    })
    .state('user.all', {
        url : '/all',
        templateUrl: 'app/views/channel-all.html'
    })
    .state('user.liked', {
        url : '/liked',
        templateUrl: 'app/views/channel-liked.html'
    })

    // profile
    .state('profile', {
        url : '/profile',
        templateUrl : 'app/views/profile.html',
        controller : 'ProfileCtrl'
    })

    // not my channel
    .state('xuser', {
        url: '/xuser/:url',
        templateUrl: "app/views/xchannel.html",
        controller: 'xChannelCtrl'
    })
    .state('xuser.all', {
        url: '/all',
        templateUrl: 'app/views/xchannel-all.html'
    })
    .state('xuser.playlist', {
        url: '/playlist',
        templateUrl: 'app/views/xchannel-liked.html'
    })
    .state('xuser.shop', {
        url: '/shop',
        templateUrl: 'app/views/xchannel-shop.html'
    })

    // shop detailed page
    .state('shop-detailed', {
        url: '/shop/:itemId',
        templateUrl: 'app/views/shop-detail.html',
        controller: 'ShopDetailCtrl'
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
