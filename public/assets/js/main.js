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
    .when("/user/:url", "/user/:url/all")
    .when('/search', '/search/all')
    .when("/channels/:id", "/channels/:id/all")
    .when('/settings', '/settings/main');

    // states
    $stateProvider

    // home
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: 'HomeCtrl',
        resolve: {
            videos: ["factory", function(factory) {
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
    .state('user', {
        url: "/user/:url",
        templateUrl: "app/views/channels/channel.html",
        controller: 'ChannelCtrl'
    })
    .state('user.all', {
        url: '/all',
        templateUrl: 'app/views/channels/channel-all.html'
    })
    .state('user.liked', {
        url: '/liked',
        templateUrl: 'app/views/channels/channel-liked.html'
    })
    .state('user.shop', {
        url: '/shop',
        templateUrl: 'app/views/channels/channel-shop.html'
    })

    // profile
    .state('profile', {
        url: '/profile',
        templateUrl: 'app/views/profile/profile.html',
        controller: 'ProfileCtrl'
    })
    .state('profile-edit', {
        url: '/profile-edit',
        templateUrl: 'app/views/profile/profile-edit.html'
    })

    // add channel
    .state('add-channel' ,{
        url: '/add-channel',
        templateUrl: 'app/views/add-channel.html'
    })

    // settings
    .state('settings',{
        url: '/settings',
        templateUrl: 'app/views/settings/settings.html',
        controller: 'SettingsCtrl'
    })
    .state('settings.main', {
        url: '/main',
        templateUrl: 'app/views/settings/settings-main.html'
    })
    .state('settings.video', {
        url: '/video',
        templateUrl: 'app/views/settings/settings-video.html'
    })

    // video settings
    .state('video-edit', {
        url: '/video-edit',
        templateUrl: 'app/views/settings/video-settings.html'
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

    // not my channel
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

        if (toDay && day_diff < 1) {
            return "Сегодня";
        } else {
            return day_diff === 0 && (
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
            return '...' + text.slice(text.length = length, length);
        } else if (text.length > length) {
            return text.substr(0, length) + "...";
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

        // home page
        factory.getHomeData = function() {
            return $http.get('http://vsponline.qa/index/videos');
        };

        // exclusive page
        factory.getExclusiveData = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/exclusive/videos?offset=' + offset);
        };

        // new videos page
        factory.getNewVideosData = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/new/videos?offset=' + offset);
        };

        // ratings page
        factory.getRatingsVideos = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/ratings/videos?offset=' + offset);
        };
        factory.getRatingsChannels = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/ratings/channels?offset=' + offset);
        };

        // video page
        factory.getVideoPageMainVideos = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id);
        };
        factory.getVideoPageComments = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id + '/comments');
        };
        factory.getRelatedVideos = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id + '/related_videos');
        };
        factory.getRelatedChannels = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id + '/related_channels');
        };

        // channel page
        factory.getChannelData = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id);
        };
        factory.getChannelVideos = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id + '/videos');
        };
        factory.getChannelPlaylists = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id + '/playlists');
        };
        factory.getChannelGoods = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id + '/goods');
        };

        // playlist page
        factory.getPlaylistData = function(id) {
            return $http.get('http://vsponline.qa/playlists/' + id);
        };
        factory.getPlaylistVideos = function(id, offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/playlists/' + id + '/videos?offset=' + offset);
        };

        // blog page
        factory.getBlogData = function() {
            return $http.get('http://vsponline.qa/articles');
        };

        // article data
        factory.getArticleData = function(id) {
            return $http.get('http://vsponline.qa/articles/' + id);
        };

        // other articles
        factory.getOtherArticles = function(id) {
            return $http.get('http://vsponline.qa/articles/' + id + '/other');
        };    
    
        
    

        // history page
        factory.getHistoryData = function() {
            return $http.get('./assets/js/data.json');
        };

        // default test
        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // search
        factory.getSearchVideos = function(keyword,offset) {
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get('http://vsponline.qa/index/search/videos?q=' + keyword + '&offset=' + offset,  factory.config);
        };
        factory.getSearchChannels = function(keyword,offset) {
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get('http://vsponline.qa/index/search/channels?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchArticles = function(keyword,offset) {
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get('http://vsponline.qa/index/search/articles?q=' + keyword + '&offset=' + offset);
        };

        // LOGIN
        factory.loginUser = function(data) {
            return $http.post('http://vsponline.qa/users/login', data);
        };
    
        factory.userCommonData = function (){
            return $http.get('http://vsponline.qa/users/common');  
        };

        return factory;

}]);

angular.module("MainApp")
.controller('ChannelCtrl', ['$scope', function ($scope) {

    $scope.content = $scope.currentUser;

}]);

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
            var now = $scope.getDate(new Date().toLocaleString());
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
.controller('HistoryCtrl', ['$scope', 'historyData', function ($scope, historyData) {

    $scope.historyData = clone(historyData.data.videos.sort(dynamicSort('date'))).reverse();

    // history filter
    $scope.historyFilter = function(array,index,prop) {
        if (
            index !== 0 &&
            array[index][prop] === array[index-1][prop]
        ) {
            return true;
        }
    };

}]);

angular.module("MainApp")
.controller('HomeCtrl', ['$scope', 'factory', 'videos', function ($scope, factory, videos) {

    console.timeEnd('homeRequestTime');

    $scope.videos = videos.data.data;

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
        console.log('search key - ',$scope.searchKey);
        if (!$scope.searchKey) return;
        $scope.searching = true;
        $scope.searchActive = true;
        $state.go('search.all', {'key': $scope.searchKey}, {reload: true});
    };

    // on state change
    $scope.$on('$stateChangeSuccess', function () {
        $scope.showloginModal = false;
        // console.log('state changed');
        if ($state.includes('login')) {
            $scope.showloginModal = true;
        }
    });


    // USER -----------------------------------------------------------

    $scope.user = {};

    // END USER -------------------------------------------------------


    // LOGIN ----------------------------------------------------------
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
                    console.log('User common data' + $scope.userData);
                });

                $scope.user.authorized = true; // user authorized
                localStorage.setItem('userToken', response.data.data.token); // set token to local storage
                localStorage.setItem('loginData', JSON.stringify($scope.loginData)); // set login data to local storage

                $http.defaults.headers.common.Authorization = response.data.data.token; // set http header token
                $scope.logging = false; // adjust button text
                $scope.showloginModal = false; // hide login modal
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


    // REGISTERATION -------------------------------------------------------
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
    // END REGISTERATION ---------------------------------------------------


    // LOGOUT --------------------------------------------------------------
    $scope.logout = function() {
        console.log('logged out');
        $scope.user.authorized = false;
        localStorage.clear();
    };
    // END LOGOUT ----------------------------------------------------------





    // TEST DATA ----------------------------------------------------------

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
        $scope.channels = response.channels;
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
        'Adamantio 993',
        'JOD'
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
.controller('ProfileCtrl', ['$scope', function($scope) {

    // test
    $scope.videosCounter = 110;
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

        console.log($scope.searchKey);

        $scope.requestVideos(q,$scope.videosOffset).success(function(response) {
            console.log('videos - ',response);

            $scope.searchActive = false;
            $scope.searching = false;
            // $scope.searchKey = null;

            $scope.searchVideos = response.data;
            $scope.videosOffset = response.meta.count || 0;
            console.log($scope.videosOffset);
            $scope.videosCount = response.meta.totalCount || 0;
            console.log($scope.videosCount);
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

        $scope.totalCount();

    }

}]);

angular.module("MainApp")
.controller('SettingsCtrl', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {

    // test data for channels accordions
    $scope.items = [
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

    ];

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
.controller('VideoPageCtrl', ['$scope', '$sce', '$window', 'factory', '$stateParams', 'mainVideos',  function($scope, $sce, $window, factory, $stateParams, mainVideos) {

    /* Main Video */

    $scope.mainVideos = mainVideos.data.data;
    console.log('main videos', mainVideos);

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
.controller('xChannelCtrl', ['$scope', '$stateParams', 'mainChannel', 'factory' , function($scope, $stateParams, mainChannel, factory) {

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

    // subscribe
    $scope.subscribe = function() {
        $scope.subscribed = !$scope.subscribed;
        if ($scope.subscribed) {
            $scope.content.statSubscribers += 1;
        } else {
            $scope.content.statSubscribers -= 1;
        }
    };

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

            function accordionCode () {
                var togglers = angular.element(element[0].querySelectorAll('[toggler]'));
                var pannels = angular.element(element[0].querySelectorAll('.accordion__pannel'));
                var contents = angular.element(element[0].querySelectorAll('.accordion__content'));

                angular.forEach(togglers, function(toggler,index) {
                    toggler.onclick = function() {
                        // console.log('click');
                        if (toggler.className.indexOf('active') != -1) {
                            toggler.className = toggler.className.replace(/\bactive\b/,'');
                            console.log(toggler.className);
                            angular.forEach(pannels, function(el) {
                                el.style.height = '0';
                            });
                        } else {
                            angular.forEach(pannels, function(el) {
                                el.style.height = '0';
                            });
                            angular.forEach(togglers, function(el) {
                                el.className = el.className.replace(/\bactive\b/,'');
                            });
                            var y = contents[index].clientHeight;
                            pannels[index].style.height = y + 15 + 'px';
                            toggler.className += ' active';
                        }
                    };
                });
            }

            $timeout(function() {
                accordionCode();
            }, 0);

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
                        console.log('offset - ',scope.offset);
                        console.log('response - ',response);
                        scope.loadingMore = false;
                        if (response.data !== null) {
                            array.push.apply(array, response.data);
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
                    text = "все данные загружены";
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

                var slidesNumber = scope.limitTo ? scope.limitTo : scope.slidesN.length;

                var sliderBox = element[0].querySelector('.slider__inner');
                var slides = element[0].querySelectorAll('.slider__slide');

                for (var i = 0; i < (slidesNumber/perSlide); i++) {
                    scope.pages.push(i);
                }

                sliderBox.style.width = scope.pages.length * 100 + '%';

                for (var k = 0; k < slides.length; k++) {
                    slides[k].style.width = 100 / slidesNumber + '%';
                }

                scope.sliderReady = true;

                scope.slideTo = function(slide) {
                    scope.activeSlide = slide;
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
    controller: 'MainCtrl',
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
