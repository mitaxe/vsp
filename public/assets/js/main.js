var app = angular.module("MainApp", ['ui.router', 'angular-loading-bar', 'ngAnimate', 'ngTouch', 'angular-sortable-view', 'ngSanitize', 'ngMessages']);


app.run(["$rootScope", "$document", "$locale", "$state", function($rootScope, $document, $locale, $state){

    // scroll ng view top on enter
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        // prevent child states form scrolling top
        if (!(
            (from.name.indexOf('user.') >= 0 &&
            to.name.indexOf('user.') >= 0) ||
            (from.name.indexOf('channels.') >= 0 &&
            to.name.indexOf('channels.') >= 0)
        )) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });

    // replace angular number comma separator with space
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
    $locale.NUMBER_FORMATS.DECIMAL_SEP = ".";

}]);

angular.module("MainApp")
.config(["$stateProvider", "$urlRouterProvider", "cfpLoadingBarProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, $locationProvider) {

    // configure loading bar and spinner
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.includeSpinner = false;

    // fix /# url
    // $locationProvider.html5Mode({
    //     enabled : true,
    //     requireBase : false
    // });

    // redirects
    $urlRouterProvider.otherwise("/");

    $urlRouterProvider
    .when("/history", "/history/viewed")
    .when("/ratings", "/ratings/videos")
    // .when("/user/:url", "/user/:url/all")
    .when('/search', '/search/all')
    .when("/channels/:id", "/channels/:id/all")
    .when('/settings', '/settings/main')
    .when('/edit-channel/:id', '/edit-channel/:id/main');

    // states
    $stateProvider

    // home
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: 'HomeCtrl',
        resolve: {
            homeVideos: ["factory", function(factory) {
                console.time('homeRequestTime');
                return factory.getHomeData();
            }]
        }
    })

    // exclusive
    .state('exclusive', {
        url: "/exclusive",
        templateUrl: "app/views/exclusive.html",
        controller: 'ExclusiveCtrl',
        resolve: {
            exclusiveVideos: ["factory", function(factory) {
                return factory.getExclusiveData();
            }]
        }
    })

    // ratings
    .state('ratings', {
        url: "/ratings",
        templateUrl: "app/views/ratings/ratings.html",
        controller: 'RatingsCtrl',
        resolve: {
            ratingsVideos: ["factory", function(factory) {
                return factory.getRatingsVideos();
            }],
            ratingsChannels: ["factory", function(factory) {
                return factory.getRatingsChannels();
            }]
        }
    })
    .state('ratings.videos', {
        url: "/videos",
        templateUrl: "app/views/ratings/ratings-videos.html"
    })
    .state('ratings.channels', {
        url: "/channels",
        templateUrl: "app/views/ratings/ratings-channels.html"
    })

    // registration/sign-in
    .state('login', {
        url : '/login',
        templateUrl : 'app/views/auth/login.html'
    })

    // search
    .state('search', {
        url : '/search',
        templateUrl : 'app/views/search/search.html',
        redirectTo : 'search.all',
        controller : 'SearchCtrl'
    })
    .state('search.all', {
        url : '/all/:key',
        templateUrl : 'app/views/search/search-all.html'
    })
    .state('search.videos', {
        url : '/video/:key',
        templateUrl : 'app/views/search/search-video.html'
    })
    .state('search.channels', {
        url : '/channel/:key',
        templateUrl : 'app/views/search/search-channels.html'
    })
    .state('search.articles', {
        url : '/articles/:key',
        templateUrl : 'app/views/search/search-articles.html'
    })

    // new videos
    .state('newVideos', {
        url : '/new-videos',
        templateUrl : 'app/views/new-videos.html',
        controller: 'NewVideosCtrl',
        resolve: {
            newVideos: ["factory", function(factory) {
                return factory.getNewVideosData();
            }]
        }
    })

    // blog
    .state('blog', {
        url: "/blog",
        templateUrl: "app/views/blog.html",
        resolve: {
            blogData: ["factory", function(factory) {
                return factory.getBlogData();
            }]
        },
        controller: ["$scope", "blogData", function($scope, blogData) {
            $scope.blogData = blogData.data.data;
        }]
    })
    .state('article', {
        url: "/blog/:id",
        templateUrl: 'app/views/article.html',
        resolve: {
            articleData: ["factory", "$stateParams", function(factory, $stateParams) {
                return factory.getArticleData($stateParams.id);
            }],
            otherArticles: ["factory", "$stateParams", function(factory, $stateParams) {
                return factory.getOtherArticles($stateParams.id);
            }]
        },
        controller: ["$scope", "articleData", "otherArticles", function($scope, articleData, otherArticles) {
            $scope.article = articleData.data.data;
            $scope.articles = otherArticles.data.data;
        }]
    })

    // history
    .state('history', {
        url: "/history",
        templateUrl: "app/views/history/history.html",
        controller: 'HistoryCtrl',
        resolve: {
            historyData: ["factory", function(factory) {
                return factory.getHistoryData();
            }]
        }
    })
    .state('history.viewed', {
        url: "/viewed",
        templateUrl: "app/views/history/history-viewed.html"
    })
    .state('history.liked', {
        url: "/liked",
        templateUrl: "app/views/history/history-liked.html"
    })

    // user
    // .state('user', {
    //     url: "/user/:url",
    //     templateUrl: "app/views/channels/channel.html",
    //     controller: 'ChannelCtrl'
    // })
    // .state('user.all', {
    //     url: '/all',
    //     templateUrl: 'app/views/channels/channel-all.html'
    // })
    // .state('user.liked', {
    //     url: '/liked',
    //     templateUrl: 'app/views/channels/channel-liked.html'
    // })
    // .state('user.shop', {
    //     url: '/shop',
    //     templateUrl: 'app/views/channels/channel-shop.html'
    // })

    // profile
    .state('profile', {
        url: '/profile/:id',
        templateUrl: 'app/views/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve:  {
            userData: ["factory", "$stateParams", function(factory, $stateParams) {
                return factory.getUserData($stateParams.id);
            }]
        }
    })
    .state('profile-edit', {
        url: '/profile-edit/:id',
        templateUrl: 'app/views/profile/profile-edit.html',
        controller: 'ProfileCtrl',
        resolve:  {
            userData: ["factory", "$stateParams", function(factory, $stateParams) {
                return factory.getUserData($stateParams.id);
            }]
        }
    })

    // add channel
    .state('add-channel' ,{
        url: '/add-channel',
        templateUrl: 'app/views/add-channel.html'
    })

    // video settings
    .state('video-edit', {
        url: '/video-edit',
        templateUrl: 'app/views/settings/video-settings.html',
        controller: 'VideoSettingsCtrl'
    })

    // notifications and comments
    .state('notifications-comments', {
        url: '/notifications/comments',
        templateUrl: 'app/views/notifications/notifications-comments.html'
    })
    .state('notifications-all', {
        url: '/notifications/all',
        templateUrl: 'app/views/notifications/notifications-all.html'
    })

    // channels
    .state('channels', {
        url: '/channels/:id',
        templateUrl: "app/views/channels/xchannel.html",
        controller: 'xChannelCtrl',
        scope: {
            content: '='
        },
        resolve:  {
            mainChannel: ["factory", "$stateParams", function(factory, $stateParams) {
                return factory.getChannelData($stateParams.id);
            }]
        }
    })
    .state('channels.all', {
        url: '/all',
        templateUrl: 'app/views/channels/xchannel-all.html'
    })
    .state('channels.playlist', {
        url: '/playlist',
        templateUrl: 'app/views/channels/xchannel-playlists.html'
    })
    .state('playlist', {
        url: '/playlists/:id',
        templateUrl: 'app/views/channels/playlist.html',
        controller: 'PlaylistCtrl',
        resolve:  {
            mainPlaylist: ["factory", "$stateParams", function(factory, $stateParams) {
                return factory.getPlaylistData($stateParams.id);
            }]
        }
    })
    .state('channels.shop', {
        url: '/shop',
        templateUrl: 'app/views/channels/xchannel-shop.html'
    })

    // channel settings
    .state('edit-channel', {
        url: '/edit-channel/:id',
        templateUrl: 'app/views/settings/settings.html',
        controller: 'SettingsCtrl'
    })
    .state('edit-channel.main', {
        url: '/main',
        templateUrl: 'app/views/settings/settings-main.html',
        controller: 'SettingsCtrl'
    })
    .state('edit-channel.playlists', {
        url: '/playlists',
        templateUrl: 'app/views/settings/settings-video.html',
        controller: 'SettingsCtrl'
    })

    // shop detailed page
    .state('shop-detailed', {
        url: '/shop/:itemId',
        templateUrl: 'app/views/channels/shop-detail.html',
        controller: 'ShopDetailCtrl'
    })

    // video page
    .state('videos', {
        url: "/videos/:id",
        templateUrl: 'app/views/videopage.html',
        scope: {
            content: '='
        },
        controller: 'VideoPageCtrl',
        resolve:  {
          mainVideos: ["factory", "$stateParams", function(factory, $stateParams) {
              // console.log($stateParams);
              return factory.getVideoPageMainVideos($stateParams.id);
          }]
        }
    })

    // test page
    .state('test', {
        url: '/test',
        templateUrl: 'app/views/test.html'
    });

}]);

/* filters */

// ng repeat start from
app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; // parse to int
            return input.slice(start);
        }
        return [];
    };
});

// humanize date
app.filter('prettyDate', function() {
    return function(time,toDay) {
        var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400),
            years_diff = Math.floor(diff / 31536000);

        if ( isNaN(day_diff) || day_diff < 0 ) {
            return;
        }

        var formattedDate;

        if (toDay && day_diff < 1) {
            formattedDate =  "Сегодня";
        } else {
            formattedDate = day_diff === 0 && (
                    diff < 60 && "Только что" ||
                    diff < 120 && "1 минуту назад" ||
                    diff < 3600 && Math.floor( diff / 60 ) + " минут назад" ||
                    diff < 7200 && "1 час назад" ||
                    diff < 86400 && Math.floor( diff / 3600 ) + " часов назад") ||
                day_diff < 1 && today && "Сегодня" ||
                day_diff == 1 && "Вчера" ||
                day_diff < 7 && day_diff + " дней назад" ||
                day_diff < 31 && Math.ceil( day_diff / 7 ) + " недель назад" ||
              years_diff < 1 && Math.ceil( day_diff / 30 ) + " месяц назад" ||
              years_diff == 1 && years_diff + " год назад" ||
              years_diff > 1 && years_diff + " лет назад" ||
              'неизвестная дата';
        }

        var thenum = parseInt(formattedDate); // get number from string
        if (thenum) formattedDate = "<span class='thumb__number'>" + thenum + "</span>" + formattedDate.replace(/[0-9]/g, ''); // place number in separate html tag

        return formattedDate;
    };
});

// format time in seconds
app.filter('secondsToTime', function() {

    function padTime(t) {
        return t < 10 ? "0"+t : t;
    }

    return function(_seconds) {
        if (typeof _seconds !== "number" || _seconds < 0)
            return "00:00:00";

        var hours = Math.floor(_seconds / 3600),
            minutes = Math.floor((_seconds % 3600) / 60),
            seconds = Math.floor(_seconds % 60);

        if(hours) {
            return padTime(hours) + ":" + padTime(minutes) + ":" + padTime(seconds);
        } else {
            return  padTime(minutes) + ":" + padTime(seconds);
        }
    };
});

// trim text filter
app.filter('trimText', function () {
    return function (text, length, backwards) {
        if (text === null) {
            return '';
        } else if (backwards) {
            return '...' + text.slice(length);
        } else if (text.length > length) {
            return text.slice(0, length) + "...";
        }
        return text;
    };
});

/* helpers */

// clone object simple
function clone(obj) {
    if (null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

// sort array by obg prop
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}

angular.module("MainApp")
.factory('factory', ["$http", function($http) {

        var factory = {};
        var domain = 'http://vsponline.qa';

        // home page
        factory.getHomeData = function() {
            return $http.get(domain + '/index/videos');
        };

        // exclusive page
        factory.getExclusiveData = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/exclusive/videos?offset=' + offset);
        };

        // new videos page
        factory.getNewVideosData = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/new/videos?offset=' + offset);
        };

        // ratings page
        factory.getRatingsVideos = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/ratings/videos?offset=' + offset);
        };
        factory.getRatingsChannels = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/ratings/channels?offset=' + offset);
        };

        // video page
        factory.getVideoPageMainVideos = function(id) {
            return $http.get(domain + '/videos/' + id);
        };
        factory.getVideoPageComments = function(id) {
            return $http.get(domain + '/videos/' + id + '/comments');
        };
        factory.getRelatedVideos = function(id) {
            return $http.get(domain + '/videos/' + id + '/related_videos');
        };
        factory.getRelatedChannels = function(id) {
            return $http.get(domain + '/videos/' + id + '/related_channels');
        };

        // channel page
        factory.getChannelData = function(id) {
            return $http.get(domain + '/channels/' + id);
        };
        factory.getChannelVideos = function(id) {
            return $http.get(domain + '/channels/' + id + '/videos');
        };
        factory.getChannelPlaylists = function(id) {
            return $http.get(domain + '/channels/' + id + '/playlists');
        };
        factory.getChannelGoods = function(id) {
            return $http.get(domain + '/channels/' + id + '/goods');
        };

        // playlist page
        factory.getPlaylistData = function(id) {
            return $http.get(domain + '/playlists/' + id);
        };
        factory.getPlaylistVideos = function(id, offset) {
            offset = offset || '';
            return $http.get(domain + '/playlists/' + id + '/videos?offset=' + offset);
        };

        // blog page
        factory.getBlogData = function() {
            return $http.get(domain + '/articles');
        };

        // article data
        factory.getArticleData = function(id) {
            return $http.get(domain + '/articles/' + id);
        };

        // other articles
        factory.getOtherArticles = function(id) {
            return $http.get(domain + '/articles/' + id + '/other');
        };


        // history page
        factory.getHistoryData = function() {
            return $http.get(domain + '/videos/groups/history');
        };

        // default test
        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // search
        factory.getSearchVideos = function(keyword,offset) {
            // offset = offset || '';
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get(domain + '/index/search/videos?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchChannels = function(keyword,offset) {
            // offset = offset || '';
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get(domain + '/index/search/channels?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchArticles = function(keyword,offset) {
            // offset = offset || '';
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get(domain + '/index/search/articles?q=' + keyword + '&offset=' + offset);
        };

        // LOGIN
        factory.loginUser = function(data) {
            return $http.post(domain + '/users/login', data);
        };

        factory.userCommonData = function (){
            return $http.get(domain + '/users/common');
        };


        factory.getRecommendedChannels = function(){
            return $http.get(domain + '/channels/groups/recommended');
        };

        factory.getUserData = function (id) {
            return $http.get(domain + '/users/' + id);
        }

        factory.getUserChannels = function (id) {
            return $http.get(domain + '/users/' + id + '/channels');
        }

        factory.updateUserProfile = function (id, data) {
            return $http.put(domain + '/users/' + id, data);
        }

        return factory;

}]);

// angular.module("MainApp")
// .controller('ChannelCtrl', ['$scope', function ($scope) {
//
//     $scope.content = $scope.currentUser;
//
// }]);

angular.module("MainApp")
.controller('CommentsCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    $scope.commentsLength = function() {
        if ($scope.comments) {
            var commentsNumber = 0;
            for (var i = 0; i < $scope.comments.length; i++) {
                commentsNumber += 1;
                for (var j = 0; j < $scope.comments[i].responses.length; j++) {
                    commentsNumber += 1;
                }
            }
            return commentsNumber;
        }
    };

    $scope.allowInput = function(parentIndex,index) {
        for (var i = 0; i < $scope.comments.length; i++) {
            $scope.comments[i].inputAllowed = false;
            for (var j = 0; j < $scope.comments[i].responses.length; j++) {
                $scope.comments[i].responses[j].inputAllowed = false;
            }
        }
        if (parentIndex !== undefined && index === undefined) {
            $scope.comments[parentIndex].inputAllowed = true;
        } else if (parentIndex !== undefined && index !== undefined) {
            $scope.comments[parentIndex].responses[index].inputAllowed = true;
        }
    };

    $scope.isInputAllowed = function(parentIndex,index) {
        if (parentIndex !== undefined && index === undefined) {
            return $scope.comments[parentIndex].inputAllowed;
        } else if (parentIndex !== undefined && index !== undefined) {
            return $scope.comments[parentIndex].responses[index].inputAllowed;
        }
    };

    $scope.addComment = function(text,commentIndex,responseIndex) {
        if (text) {
            var now = new Date().toLocaleString();
            var comment = {
                "user": $scope.currentUser.name,
                "text": text,
                "link": "#",
                "img": $scope.currentUser.avatar,
                "date": now,
                "likes": 0,
                "responses": []
            };
            if (responseIndex !== undefined) {
                comment.text = $scope.comments[commentIndex].responses[responseIndex].user + ', ' + comment.text;
                $scope.comments[commentIndex].responses.splice(responseIndex+1,0,comment);
                // $scope.comments[commentIndex].responses.unshift(comment);
            } else if (commentIndex !== undefined) {
                $scope.comments[commentIndex].responses.unshift(comment);
            } else {
                $scope.comments.unshift(comment);
            }
        }
    };

}]);

angular.module("MainApp")
.controller('ExclusiveCtrl', ['$scope', 'factory', 'exclusiveVideos', function ($scope, factory, exclusiveVideos) {

    // get first portion of videos from route resolve
    $scope.exclusiveVideos = exclusiveVideos.data.data;

    // get offset number
    $scope.initialOffset = exclusiveVideos.data.meta.count;

    // default request
    $scope.request = factory.getExclusiveData;

}]);

// angular.module("MainApp")
// .controller('HeaderCtrl', ['$scope', 'factory', function ($scope, factory) {
//
//
//
// }]);

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

angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'homeVideos', function ($scope, homeVideos) {

    console.timeEnd('homeRequestTime');

    $scope.homeVideos = homeVideos.data.data;

    // function isBigEnough() {
    //     for (var i = 0; i < $scope.videos.length; i++) {
    //         if ($scope.videos[i].blockId === 2) {
    //             console.log($scope.videos[i]);
    //         }
    //     }
    // }
    //
    // isBigEnough();

    // Сейчас смотрят = 0
    // Новые видео = 1
    // Популярные видео = 2
    // Custom block = 3
    // Эксклюзивные видео = 4
    // Custom block 2 = 5
    // Custom block 3 = 6

    // console.log(
    //     $scope.videos.filter(function (el) {
    //       return el.blockId === 1;
    //     })
    // );

}]);

angular.module("MainApp")
.controller('MainCtrl', ['$scope', '$sce', 'factory', '$state', '$window', '$http', '$timeout',
function ($scope, $sce, factory, $state, $window, $http, $timeout) {

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
    $scope.goSearch = function() {
        // console.log('search key - ',$scope.searchKey);
        if (!$scope.searchKey) return;
        $scope.searching = true;
        $scope.searchActive = true;
        $state.go('search.all', {'key': $scope.searchKey}, {reload: true});
    };

    // hide menu on link click mobile
    $scope.hideMenuMob = function() {
        console.log('hide mob');
        if ($window.innerWidth < 768) {
            $scope.sandwichClicked = false;
        }
    };

    // recomended channels sidebar
    factory.getRecommendedChannels().success(function(response) {
        $scope.recommendedChannels = response.data;
        console.log('Recommended channels - ', $scope.recommendedChannels);
    });

    // on state change
    $scope.$on('$stateChangeSuccess', function () {
        // show login modal on login page
        if ($state.includes('login')) {
            $scope.showloginModal = true;
        }
    });


    // LOGIN ----------------------------------------------------------
    $scope.user = {};
    $scope.loginData = {}; // login from data
    $scope.form = {}; // init form object

    // login button text
    $scope.getLoginBtnText = function() {
        if ($window.innerWidth < 1280) {
            return 'Войти';
        } else {
            return 'Авторизация';
        }
    };

    // login request
    function loginRequest() {
        // send login request
        factory.loginUser($scope.loginData).then(
            // success
            function(response) {
                console.log('login response - ',response);
                console.log('Assigned user token - '+response.data.data.token);

                factory.userCommonData().success(function(response) {
                    $scope.userData = response.data;
                    console.log('User common data - ', $scope.userData);
                });

                $scope.user.authorized = true; // user authorized
                localStorage.setItem('userToken', response.data.data.token); // set token to local storage
                localStorage.setItem('loginData', JSON.stringify($scope.loginData)); // set login data to local storage
                $http.defaults.headers.common.Authorization = response.data.data.token; // set http header token
                $scope.userId = response.data.data.vspUserId;
                $scope.logging = false; // adjust button text
                $scope.showloginModal = false; // hide login modal
                console.log('login data', $scope.loginData);
            },
            // error
            function(error) {
                $scope.logging = false; // adjust button text
                $scope.showloginModal = false; // hide login modal
                console.log('error - ', error);
            }
        );
    }

    // if token in local storage, get uset data
    if (localStorage.getItem('userToken')) {
        console.log('token in local storage');
        $scope.loginData = JSON.parse(localStorage.getItem('loginData'));
        $scope.user.authorized = true;
        loginRequest();
    }

    $scope.loginUser = function() {
        // trigger validation of all fields
        angular.forEach($scope.form.login.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });
        // check if form is valid
        if ($scope.form.login.$invalid) {
            console.log('invalid form');
            return;
        }
        console.log('sending login request for - ',$scope.loginData);
        $scope.logging = true; // adjust button text
        loginRequest(); // send login request
    };
    // END LOGIN -----------------------------------------------------------


    // REGISTRATION -------------------------------------------------------
    $scope.registerData = {};

    $scope.registerUser = function() {
        // trigger validation of all fields
        angular.forEach($scope.form.register.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });

        // check if valid
        if ($scope.form.register.$invalid) {
            console.log('registration form invalid');
            return;
        }

        console.log('sending registration request for - ',$scope.registerData);
    };
    // END REGISTRATION ---------------------------------------------------


    // LOGOUT --------------------------------------------------------------
    $scope.logout = function() {
        console.log('logged out');
        $scope.user.authorized = false;
        localStorage.clear();
    };
    // END LOGOUT ----------------------------------------------------------


    // TEST DATA ----------------------------------------------------------

    // factory test data
    factory.getVideos().success(function(response) {
        // $scope.blogs = response.videos;
        $scope.videos = response.videos;
        // $scope.channels = response.channels;
        $scope.goods = response.goods;
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
        'Общее',
        'Машини',
        'Самолеты',
        'Природа'
    ];

}]);

angular.module("MainApp")
.controller('NewVideosCtrl', ['$scope', 'newVideos', 'factory', function ($scope, newVideos, factory) {

    // get first portion of videos from route resolve
    $scope.newVideos = newVideos.data.data;

    // get offset number
    $scope.initialOffset = newVideos.data.meta.count;

    // default request for this controller
    $scope.request = factory.getNewVideosData;

}]);

angular.module("MainApp")
.controller('PlaylistCtrl', ['$scope', 'mainPlaylist', 'factory', '$stateParams', function ($scope, mainPlaylist, factory, $stateParams) {

    // get first portion of videos from route resolve
    $scope.mainPlaylist = mainPlaylist.data.data;

    // request for loadMore
    $scope.request = factory.getPlaylistVideos;

    // get first portion of videos
    $scope.request($stateParams.id).success(function(response) {
        $scope.playlistVideos = response.data;
        // get offset number
        $scope.initialOffset = response.meta.count;
    });

    // id
    $scope.id = $stateParams.id;

}]);

angular.module("MainApp")
.controller('ProfileCtrl', ['$scope', '$stateParams', 'userData', 'factory', function($scope, $stateParams, userData, factory) {

    $scope.saveProfile = function() {
        $scope.formTried = true;
        // trigger validation of all fields
        angular.forEach($scope.form.editProfile.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });
        // check if form is valid
        if ($scope.form.editProfile.$invalid) {
            console.log('form invalid');
            return;
        }
        console.log('saved profile',$scope.profileSettings);
        // $scope.logging = true; // adjust button text

        $scope.saving = true; // send login request

        factory.updateUserProfile($stateParams.id, $scope.profileSettings).then(
            //success
            function () {
                console.log('success',$scope.form.editProfile.$error);
            },
            // error
            function (response) {
                $scope.serverValidations = response.data.data;
                // $scope.serverValidations = {
                //     "email" : [
                //         {"type":"maxlength","message":"Max length is 40 sym"}
                //     ]
                // };
                console.log($scope.serverValidations.email);
                for(var prop in $scope.serverValidations){
                    if($scope.form.editProfile[prop]) {
                        $scope.form.editProfile[prop].$setValidity($scope.serverValidations[prop].type, false);
                        $scope.form.editProfile[prop].$setTouched();
                    }
                }
            }
        );
    };
    //$scope.serverValidations = {"email": {"type": "maxlength","message": "Max length is 40 sym"}};

    // test
    $scope.videosCounter = 110;

    if (userData) {
        $scope.userData = userData.data.data;
    }

    // get channels
    factory.getUserChannels($stateParams.id).success(function(response) {
        $scope.userChannels = response;
        console.log('user channels', response);
    });

    $scope.profile = {
        user : {
            avatar : 'assets/img/prof_img.png',
            name : 'Burav4ik24',
            fbLink : 'http://fb.com/',
            userInfo : '25 лет, Есть свой личный пранк канал. Веду активный способ жизни. мой вебсайт:',
            userWebsite : 'http://google.com',
            userCity : 'Киев',
            userCountry : 'Украина'
        },
        userChannels : 1,
        userAva : 'assets/img/u1.png',
        channel : {
            channelName : 'RomanAtwood',
            channelSubscribers : 18358461
        }
    };

    $scope.profileSettings = {
        "email": "test2@test.com",
        "password": "qwerty12345"
    };

}]);

angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'factory', 'ratingsVideos', 'ratingsChannels', function ($scope, factory, ratingsVideos, ratingsChannels) {

    /* Videos */
    $scope.ratingsVideos = ratingsVideos.data.data;
    $scope.videosOffset = ratingsVideos.data.meta.count;
    $scope.videosRequest = factory.getRatingsVideos;

    /* Channels */
    $scope.ratingsChannels = ratingsChannels.data.data;
    $scope.channelsOffset = ratingsChannels.data.meta.count;
    $scope.channelsRequest = factory.getRatingsChannels;

}]);

angular.module("MainApp")
.controller('SearchCtrl', ['$scope', 'factory', '$stateParams', function ($scope, factory, $stateParams) {

    $scope.requestVideos = factory.getSearchVideos;
    $scope.requestChannels = factory.getSearchChannels;
    $scope.requestArticles = factory.getSearchArticles;

    $scope.searchTitle = $scope.searchKey;

    if ($scope.searchKey) {

        var q = $scope.searchKey;

        // console.log($scope.searchKey);

        $scope.requestVideos(q,$scope.videosOffset).success(function(response) {
            console.log('videos - ',response);

            $scope.searchActive = false;
            $scope.searching = false;
            // $scope.searchKey = null;

            $scope.searchVideos = response.data;
            $scope.videosOffset = response.meta.count || 0;
            // console.log('videos offset - ',$scope.videosOffset);
            $scope.videosCount = response.meta.totalCount || 0;
            // console.log($scope.videosCount);
        });

        $scope.requestChannels(q,$scope.channelsOffset).success(function(response) {
            console.log('channels - ',response);
            $scope.searchChannels = response.data;
            $scope.channelsOffset = response.meta.count || 0;
            $scope.channelsCount = response.meta.totalCount || 0;
        });

        $scope.requestArticles(q,$scope.articlesOffset).success(function(response) {
            console.log('articles - ',response);
            $scope.searchArticles = response.data;
            $scope.articlesOffset = response.meta.count || 0;
            $scope.articlesCount = response.meta.totalCount || 0;
        });

        $scope.totalCount = function() {
            if ($scope.videosCount >= 0 && $scope.channelsCount >= 0 && $scope.articlesCount >= 0) {
                return $scope.videosCount + $scope.channelsCount + $scope.articlesCount;
            }
        };

        // $scope.totalCount();

    }

}]);

angular.module("MainApp")
.controller('SettingsCtrl', ['$scope', '$sce', function ($scope, $sce) {

    $scope.channelSettings = {
        "email": "test@test.com",
        // "password": "qwerty12345"
    };

    // test data for channels accordions
    $scope.channelPlaylists = {
        "playlists": [
            {
                name : 'Оригинальные пранки',
                inner : [
                    {
                        name : 'Пранки',
                        hidden : false
                    },
                    {
                        name : 'test2',
                        hidden : false
                    },
                    {
                        name : 'Пранки 2',
                        hidden : false
                    },
                    {
                        name : 'test4',
                        hidden : false
                    }
                ]
            },
            {
                name : 'Лучшие видео',
                inner : [
                    {
                        name : 1,
                        hidden : false
                    },
                    {
                        name : 'Пранк',
                        hidden : false
                    }
                ]
            },
            {
                name : 'Пантера Шоу',
                inner : [
                    {
                        name : 'Пранк',
                        hidden : false
                    },
                    {
                        name : 'Пранк 2',
                        hidden : false
                    }
                ]
            }
        ]
    };

    $scope.saveChannel = function() {
        $scope.formTried = true;
        // trigger validation of all fields
        angular.forEach($scope.form.channelSettings.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });
        // check if form is valid
        if ($scope.form.channelSettings.$invalid) {
            console.log('form invalid');
            return;
        }
        console.log('saved channels settings',$scope.channelSettings);

        $scope.saving = true; // send login request
        setTimeout(function () { // test
            $scope.saving = false;
            $scope.$apply();
        }, 2000);
    };

    $scope.savePlaylists = function() {
        $scope.formTried = true;
        // trigger validation of all fields
        angular.forEach($scope.form.channelPlaylists.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });
        // check if form is valid
        if ($scope.form.channelPlaylists.$invalid) {
            console.log('form invalid');
            return;
        }
        console.log('saved playlists',$scope.channelPlaylists);
        // $scope.logging = true; // adjust button text

        $scope.saving = true; // send login request
        setTimeout(function () { // test
            $scope.saving = false;
            $scope.$apply();
        }, 2000);
    };

    // highlight filtered accordion items
    $scope.highlight = function(text, search) {
        if (!search) {
            return $sce.trustAsHtml(text.toString());
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

}]);

angular.module("MainApp")
.controller('ShopDetailCtrl', ['$scope', '$stateParams', '$window', function($scope, $stateParams, $window) {

    $scope.itemDetails = {
        name : $stateParams.itemId,
        images : [
            'assets/img/tshort1.png',
            'assets/img/tshort2.png',
            'assets/img/tshort3.png'
        ],
        description : 'The CHOPPED Tee shirt is finally here, printed front AND back for maximum choppage! Chopped fingers on the front when they see you coming, then CHOPPED text on the back so fools know they\'ve been CHOPPED when you stride past! - See more at: http://mightycarmods.com/collections/clothing/products/chopped-tee-shirt#sthash.v0DcQcBb.dpuf',
        price: 10
    };

    $scope.mainImageUrl = $scope.itemDetails.images[0];

    $scope.setImage = function(url) {
        $scope.mainImageUrl = url;
    };

    $scope.selectedPreview = 0;
    $scope.setPreview = function(index) {
        $scope.selectedPreview = index;
    };

    // mobile slider
    $scope.wrapperWidth = 0;
    $scope.sliderWidth = 0;
    $scope.currentIndex = 0;

    $scope.setWrapperWidth = function(amount) {
        $scope.wrapperWidth = document.querySelectorAll('.mb_slider')[0].clientWidth * amount + 'px';
        $scope.sliderWidth = document.querySelectorAll('.mb_slider')[0].clientWidth + 'px';
    };

    $scope.$on('resize::resize', function() {
        $scope.setWrapperWidth($scope.itemDetails.images.length);
    });

    $scope.setWrapperWidth($scope.itemDetails.images.length);

    angular.element($window).bind('resize', function() {
        $scope.$apply();
    });

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        // $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.itemDetails.images.length - 1) ? ++$scope.currentIndex : 0;
        document.getElementById('sWr').style.left = -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex )) + 'px';
    };

    $scope.nextSlide = function () {
        // $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.itemDetails.images.length - 1;
        document.getElementById('sWr').style.left = - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex)) + 'px';
    };

}]);

angular.module("MainApp")
.controller('VideoPageCtrl', ['$scope', '$sce', '$window', 'factory', '$stateParams', 'mainVideos', '$rootScope',
function($scope, $sce, $window, factory, $stateParams, mainVideos, $rootScope) {

    /* Main Video */

    $scope.mainVideos = mainVideos.data.data;
    console.log('main videos', mainVideos);

    // for back button
    $rootScope.videoPageChannel = mainVideos.data.data[0];

    // console.log('1st api response - ', $scope.mainVideos);

    // get trusted iframe url
    $scope.iframeSrc = function(src) {
        var url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src);
        return url;
    };


    //comments
    factory.getVideoPageComments($stateParams.id).success(function(response) {
        $scope.comments = response.data.comments;
        console.log('comments ', $scope.comments);
    });

    //related videos
    factory.getRelatedVideos($stateParams.id).success(function(response) {
        $scope.relatedVideos = response.data;
        console.log('related videos ', $scope.relatedVideos);
    });

    //related channels
    factory.getRelatedChannels($stateParams.id).success(function(response) {
        $scope.relatedChannels = response.data;
        console.log('relatedChannels ', $scope.relatedChannels);
    });


    /* Sidebar Tabs */

    var windWidth = window.innerWidth;

    $scope.activeTab = windWidth > 1280 ? 1 : 3;
    $scope.desktop = windWidth > 1280 ? true : false;

    $scope.setActiveTab = function(index) {
        $scope.activeTab = index;
    };

    $scope.$on('resize::resize', function() {
        if(window.innerWidth < 1280) {
            $scope.desktop = false;
            $scope.activeTab = 3; //set active comments tab
        } else {
            $scope.desktop = true;
            $scope.activeTab = 1;
        }
    });

    angular.element($window).bind('resize', function() {
        $scope.$apply();
    });

}]);

angular.module("MainApp")
.controller('VideoSettingsCtrl', ['$scope', function ($scope) {

    $scope.videoSettings = {
        "url": "https://www.youtube.com/watch?v=HQx5Be9g16U",
        "title": "10 Amazing Science Tricks Using Liquid!",
        "description": "Add me on Facebook (click LIKE on Facebook to add me) - http://www.facebook.com/brusspup Download the music in this video: Song #1: Abyss - iTunes: https://itunes.apple.com/us/album/aby.",
        "img": "assets/img/video-img.png",
        "show": "true",
        "playlists": [
            { name: 'Все видео', selected: true },
            { name: 'Пранк шоу', selected: false },
            { name: 'Видеобаттлы с другими каналами', selected: true },
            { name: 'История одного дня', selected: false }
        ],
        "category": ""
    };

    $scope.saveVideoSettings = function() {
        $scope.formTried = true;
        // trigger validation of all fields
        angular.forEach($scope.form.videoSettings.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });
        // check if form is valid
        if ($scope.form.videoSettings.$invalid) {
            console.log('form invalid');
            return;
        }
        console.log('saved video settings',$scope.videoSettings);

        $scope.saving = true; // send login request
        setTimeout(function () { // test
            $scope.saving = false;
            $scope.$apply();
        }, 2000);
    };


}]);

angular.module("MainApp")
.controller('xChannelCtrl', ['$scope', '$stateParams', 'mainChannel', 'factory', '$window', function($scope, $stateParams, mainChannel, factory, $window) {

    // get main channel data
    $scope.content = mainChannel.data.data;

    // get the rest of all videos data
    factory.getChannelVideos($stateParams.id).success(function(response) {
        $scope.channelVideos = response.data;
        console.log('related videos ', $scope.channelVideos);
    });

    // get the rest of playlists data
    factory.getChannelPlaylists($stateParams.id).success(function(response) {
        $scope.channelPlaylists = response.data;
        console.log('channels playlists ', $scope.channelPlaylists);
    });

    // get channel's goods
    factory.getChannelGoods($stateParams.id).success(function(response) {
        $scope.channelGoods = response.data;
        console.log('channels goods ', $scope.channelGoods);
    });

    // sort channels
    $scope.sortTypes = [
        'По дате добавления [новые]',
        'По дате добавления [старые]'
    ];

    $scope.selectedSortType = $scope.sortTypes[0];

    $scope.sortReverse = true;

    $scope.sortBy = function(index) {
        $scope.sortReverse = index === 0 ? true : false;
    };

}]);

angular.module("MainApp")
.directive('accordion', ["$timeout", function($timeout) {
    return {
        restrict: 'C',
        transclude: true,
        template: '<div ng-transclude></div>',
        link: function(scope, element, attrs) {

            function accordionCode() {
                var togglers = angular.element(element[0].querySelectorAll('[toggler]'));
                var pannels = angular.element(element[0].querySelectorAll('.accordion__pannel'));
                var contents = angular.element(element[0].querySelectorAll('.accordion__content'));

                angular.forEach(togglers, function(toggler,index) {

                    toggler.onclick = function() {
                        // if ( toggler.className.match(/\bactive\b/) ) {
                        //     var yy = contents[index].clientHeight;
                        //     pannels[index].style.height = yy + 15 + 'px';
                        // }
                            // console.log('click');
                        if (toggler.className.indexOf('active') != -1) {
                            toggler.className = toggler.className.replace(/\bactive\b/,'');
                            console.log(toggler.className);
                            // angular.forEach(pannels, function(el) {
                            //     el.style.height = '0';
                            // });
                        } else {
                            // angular.forEach(pannels, function(el) {
                            //     el.style.height = '0';
                            // });
                            angular.forEach(togglers, function(el) {
                                el.className = el.className.replace(/\bactive\b/,'');
                            });
                            var y = contents[index].clientHeight;
                            // pannels[index].style.height = y + 15 + 'px';
                            toggler.className += ' active';
                        }
                    };
                });
            }

            // $timeout(function() {
                accordionCode();
            // }, 1000);

            scope.$watch(
                function() {
                    return element[0].querySelectorAll('[toggler]').length;
                },
                function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        accordionCode();
                    }
                }
            );

        }
    };
}]);

app.directive('backButton', ["$document", "$state", "$stateParams", "$rootScope", function ($document, $state, $stateParams, $rootScope) {
    return {
        restrict: 'E',
        // scope: {
        //     parameters: '=params'
        // },
        template: '<div a ng-click="backButton.goBack()" class="header__item header__back" ng-class="{searchActive:searchActive, pointer:backButton.available, videopage:videopage}">' +
                    '<div ng-show="backButton.available" class="table-middle">' +
                        '<i class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 28.914 16.998"><path fill-rule="evenodd" clip-rule="evenodd" fill="" d="M28.914 2.857L26.057 0l-11.66 11.66L2.83.093 0 2.924l13.98 13.98.35-.348.44.442"/></svg></i>' +
                        '<p ng-bind-html="backButton.text"></p>' +
                    '</div>' +
                '</div>',
        link: function (scope, element) {

            console.log(scope.videoPageChannel);

            scope.backButton = {
                available: false,
                text: '',
                prevState: '',
                id: $stateParams.id,
                init: function() {
                    // console.log('back button click');
                    switch (true) {
                        case ($state.includes('article')):
                            this.available = true;
                            this.text = 'Блог';
                            this.prevState = 'blog';
                            break;
                        case ($state.includes('profile')):
                            this.available = true;
                            this.text = 'Назад';
                            this.prevState = '';
                            break;
                        case ($state.includes('shop-detailed')):
                            this.available = true;
                            this.text = 'Магазин';
                            this.prevState = 'shop-detailed';
                            break;
                        case ($state.includes('search')):
                            this.available = true;
                            this.text = 'Назад';
                            this.prevState = 'home';
                            break;
                        case ($state.includes('edit-channel')):
                            this.available = true;
                            this.text = 'Назад';
                            this.prevState = 'channels';
                            break;
                        case ($state.includes('videos')):
                            this.available = true;
                            scope.videopage = true;
                            this.text = '<img src="' +
                                            $rootScope.videoPageChannel.img +
                                        '"/>' +
                                        '<div>' +
                                            $rootScope.videoPageChannel.user +
                                            '<br>' +
                                            '<span class="subscription"><span>Подписаться</span>' +
                                                '1 000 000' +
                                            '</span>' +
                                        '</div>';
                            this.prevState = 'channels';
                            this.id = $rootScope.videoPageChannel.channelId;
                            break;
                        default:
                            this.available = false;
                            scope.videopage = false;
                    }
                },
                goBack: function() {
                    $state.go(this.prevState, {'id': this.id});
                }
            };

            // on state change
            scope.$on('$stateChangeSuccess', function () {
                scope.backButton.init();
            });

        }
    };
}]);

app.directive('focusMe', ["$timeout", function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) {
          console.log('value=',value);
          $timeout(function() {
            element[0].focus();
            // scope[attrs.focusMe] = false;
        }, 100);
        }
      });
    }
  };
}]);

app.directive('loadMore', ["$document", function ($document) {
    return {
        restrict: 'E',
        scope: {
            parameters: '=params'
        },
        template: '<a class="btn btn-more">' + '{{ getButtonText() }} ' + '</a>',
        link: function (scope, element) {

            scope.offset = 0;

            function loadMore(request,array,offset,id) {
                if (!scope.noMoreResponse) {
                    scope.loadingMore = true;
                    scope.offset += offset;
                    id = id || scope.offset;

                    request(id,scope.offset).success(function(response) {
                        // console.log('loadmore offset - ',scope.offset);
                        console.log('loadmore response - ',response);
                        scope.loadingMore = false;
                        if (response.data !== null) {
                            array.push.apply(array, response.data);
                            console.log('items loaded already - ',array.length);
                            if (response.data.length < offset) {
                                scope.noMoreResponse = true;
                            }
                        } else {
                            scope.noMoreResponse = true;
                        }
                    });
                }
            }

            scope.getButtonText = function() {
                var text;
                if (scope.loadingMore && !scope.noMoreResponse) {
                    text = "идет загрузка...";
                } else if (!scope.loadingMore && !scope.noMoreResponse) {
                    text = "загрузить еще";
                } else {
                    // text = "все данные загружены";
                    element[0].style.display = 'none';
                }
                return text;
            };

            element.on("click", function(evt) {
                loadMore.apply(this, scope.parameters);
            });

        }
    };
}]);

angular.module("MainApp")
.directive('modal', ["$timeout", function($timeout) {
  return {
    restrict: 'E',
    transclude: true,
    // {
    //     'title': 'modalTitle',
    //     'body': 'modalBody',
    //     'footer': 'modalFooter'
    // },
    scope: {
        showModal: '=show',
        sandwichCliked: '=position'
    },
    templateUrl: 'app/views/common/modal.html',
    link: function(scope, element, attrs) {

    }
  };
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

// app.directive('popoverTrigger', function ($document) {
//     return {
//         restrict: 'A',
//         link: function (scope, element) {
//
//             $document.on("click", function() {
//                 if (scope.userActive || scope.notificationActive) {
//                     scope.$apply(function () {
//                         scope.userActive = false;
//                         scope.notificationActive = false;
//                     });
//                 }
//             });
//
//             element.on("click", function (evt) {
//                 if (!scope.userActive || !scope.notificationActive) {
//                     evt.stopPropagation();
//                 }
//             });
//
//         }
//     };
// });

angular.module("MainApp")
.directive('overlay', ["$interval", function($interval) {
  return {
    restrict: 'E',
    controller: 'MainCtrl',
    replace: true,
    template: '<div class="overlay" ng-class="{active:popupActive}" ng-click="hidePopup()">'+
                '<div class="modal" ng-include="content"></div>'+
                '</div>',
    link: function($scope, element, attrs) {

        $scope.showPopup = function(content) {
            $scope.content = 'app/views/' + content + '.html';
            $scope.popupActive = true;
        };

        $scope.hidePopup = function() {
            $scope.content = '';
            $scope.popupActive = false;
        };

    }
  };
}]);

angular.module("MainApp")
.directive('readMore', ["$timeout", function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            content: '=text'
        },
        template: '<div ng-show="content.length > 0" >' +
                    '<span class="block-with-text" ng-class="{expanded:expanded}">' +
                        '<span class="block-with-text__content" ng-bind-html="content"></span>' +
                    '</span>' +
                    '<span class="block-with-text__read-more" ng-click="expanded = !expanded" ng-class="{expanded:expanded}" ng-show="showReadMore">' +
                        '<span>{{ expanded ? "Скрыть" : "Читаь далее" }}</span>' +
                        '<i class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 28.914 16.998"><path fill-rule="evenodd" clip-rule="evenodd" fill="" d="M28.914 2.857L26.057 0l-11.66 11.66L2.83.093 0 2.924l13.98 13.98.35-.348.44.442"/></svg></i>' +
                    '</span>' +
                '</div>',
        link: function(scope, element, attrs) {

            $timeout(function () {

                var block = element[0].getElementsByClassName('block-with-text');
                var content = element[0].getElementsByClassName('block-with-text__content');

                console.log(block[0].clientHeight, content[0].clientHeight);
                console.log(block);

                if (block[0].clientHeight < content[0].clientHeight) {
                    console.log('hidden');
                    scope.showReadMore = true;
                }

            }, 0);

        }
    };
}]);

angular.module("MainApp")
.directive('slider', ["$timeout", function($timeout) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        slidesN: '=slides',
        limitTo: '=limitto',
        perSlide: '=perslide'
    },
    template: '<div class="slider" ng-class="{sliderReady:sliderReady}">' +
                '<div class="slider__box">' +
                    '<div class="slider__inner">' +
                        '<div ng-transclude></div>' +
                    '</div>' +
                '</div>' +
                '<ul class="slider__pager">' +
                    '<li ng-class="{active: isActiveSlide($index)}" ng-model="activeSlide" ng-click="slideTo($index)" ng-repeat="i in pages"></li>' +
                '</ul>' +
                '</div>',
    link: function(scope, element, attrs) {

        // scope.$watch('slidesN', function() {
            var timer = $timeout(function() {

                scope.pages = [];
                scope.activeSlide = 0;
                var perSlide = scope.perSlide || 4;
                var videosLength = 12;

                // var slidesNumber = scope.limitTo ? scope.limitTo : slides.length;

                // var sliderBox = element[0].querySelector('.slider__inner');
                var slides = element[0].querySelectorAll('.slider__slide');

                // for (var i = 0; i < (slidesNumber/perSlide); i++) {
                //     scope.pages.push(i);
                // }

                // limit to videosLength videos
                slides.length = slides.length > videosLength ? videosLength : slides.length;

                // console.log('slides - ',slides.length);

                // populate pager with links
                for (var i = 0; i < slides.length/perSlide; i++) {
                    // if at least 2 slides
                    if (slides.length > perSlide) scope.pages.push(i);
                }

                // sliderBox.style.width = scope.pages.length * 100 + '%';

                // for (var k = 0; k < slides.length; k++) {
                //     slides[k].style.width = 100 / slidesNumber + '%';
                // }

                // scope.sliderReady = true;

                scope.slideTo = function(slide) {
                    scope.activeSlide = slide;
                    if (
                        slides.length < videosLength && // if slides less than videosLength
                        slides.length % perSlide > 0 && // if slides cant be equaly devided by perSlide
                        slide === (scope.pages.length - 1)     // if this is the last slide
                    ) {
                        // set correct length to display last slide properly
                        slide = (slide - 1) + (slides.length % perSlide) / perSlide;
                    }
                    element[0].querySelector('.slider__inner').style.left = '-' + slide * 100 + '%';
                };

                scope.isActiveSlide = function(i) {
                    if (i === scope.activeSlide) {
                        return true;
                    }
                };

            }, 0);
        //  }, true);

    }
  };
}]);

angular.module("MainApp")
.directive('subscribe', ["$window", function($window) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            subscriber: '=subscribeTo'
        },
        template: '<div class="subscribe_box">' +
                    '<span ng-click="subscribe()" class="green_btn" ng-class="{subscribed:subscribed}" ng-mouseover="hoverIn()" ng-mouseleave="hoverOut()">' +
                    ' {{ getButtonText() }} ' +
                    '</span>' +
                    '<span class="counter subscribe">{{ subscriber | number }}</span>' +
                '</div>',
        link: function(scope, element, attrs) {

            scope.subscribe = function() {
                scope.subscribed = !scope.subscribed;
                if (scope.subscribed) {
                    scope.subscriber += 1;
                } else {
                    scope.subscriber -= 1;
                }
            };

            scope.hoverIn = function() {
                scope.subsButtonHovered = true;
            };

            scope.hoverOut = function() {
                scope.subsButtonHovered = false;
            };

            scope.getButtonText = function() {
                var text = 'Подписаться';
                if (scope.subscribed) {
                    text = 'Подписка оформлена';
                    if (scope.subsButtonHovered) {
                        text = 'Отменить подписку';
                    }
                    if ($window.innerWidth < 1280) {
                        text = 'Отменить подписку';
                    }
                    if ($window.innerWidth < 768) {
                        text = 'Отписаться';
                    }
                }
                return text;
            };

        }
    };
}]);

angular.module("MainApp")
.directive('tabs', ["$rootScope", function($rootScope) {
    return {
        restrict:'E',
        replace: true,
        scope: {
            notifications: '=notifications'
        },
        link: function(scope, element, att) {

            // scope.underline = element[0].querySelector('.tabs__underline');
            // scope.links = element[0].querySelectorAll('a');
            // // scope.activeLink;
            //
            // function setActiveLink() {
            //     for (var i = 0; i < scope.links.length; i++) {
            //         if (scope.links[i].className === 'active') {
            //             scope.activeLink = scope.links[i];
            //         }
            //     }
            // }
            //
            // function renderUnderline() {
            //     var currentLeft = !scope.notifications ?
            //     angular.element(scope.activeLink).prop('offsetLeft') - 8 :
            //     angular.element(scope.activeLink).prop('offsetLeft') - 15;
            //     var currentWidth = scope.activeLink.clientWidth;
            //     angular.element(scope.underline).css({
            //         'left': currentLeft + 'px',
            //         'width': currentWidth + 'px',
            //         // 'transition': '0.3s'
            //     });
            // }
            //
            // if (!scope.notifications) {
            //     setTimeout(function() {
            //         setActiveLink();
            //         renderUnderline();
            //         $rootScope.$on('$stateChangeSuccess', function() {
            //             // console.log('state changed');
            //             setTimeout(function(){
            //                 setActiveLink();
            //                 renderUnderline();
            //             }, 10);
            //         });
            //     }, 75);
            // } else {
            //     scope.activeLink = scope.links[0];
            //     renderUnderline();
            //     for (var i = 0; i < scope.links.length; i++) {
            //         (function(index) {
            //             scope.links[i].onclick = function() {
            //                 scope.activeLink = scope.links[index];
            //                 renderUnderline();
            //             };
            //         })(i);
            //     }
            // }
            //
            // scope.$on('resize::resize', function() {
            //     renderUnderline();
            // });

        }
    };
}]);

angular.module("MainApp")
.directive('footerview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/templates/footer.html'
  };
});

angular.module("MainApp")
.directive('headerview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/templates/header.html'
  };
});

angular.module("MainApp")
.directive('sidebarview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/templates/sidebar.html'
  };
});

angular.module("MainApp")
.directive('login', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/auth/login-template.html'
  };
});

app.directive('resize', ["$window", function($window) {
  return {
    link: function(scope) {
      function onResize(e) {
        // Namespacing events with name of directive + event to avoid collisions
        scope.$broadcast('resize::resize');
      }

      function cleanUp() {
        angular.element($window).off('resize', onResize);
      }

      angular.element($window).on('resize', onResize);
      scope.$on('$destroy', cleanUp);
    }
  };
}]);
