var app = angular.module("MainApp", ['ui.router', 'ngAnimate', 'ngTouch', 'angular-sortable-view']);


app.run(["$rootScope", "$document", "$locale", "$state", function($rootScope, $document, $locale, $state){

    // scroll ng view top on enter
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        // prevent child states form scrolling top
        if (!(
            from.name.indexOf('user.') >= 0 &&
            to.name.indexOf('user.') >= 0
        )) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });

    // replace angular number comma separator with space
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
    $locale.NUMBER_FORMATS.DECIMAL_SEP = ".";

}]);


// filters

    // ng repeat start from
    app.filter('startFrom', function() {
        return function(input, start) {
            if(input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    });


// helpers

    // clone object simple
    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
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
        }
    }

angular.module("MainApp")
.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    // redirects
    $urlRouterProvider
    .when("/history", "/history/viewed")
    .when("/ratings", "/ratings/videos")
    .when("/user/:url", "/user/:url/all")
    .when('/search', '/search/all')
    .when("/xuser/:url", "/xuser/:url/all")
    .when('/settings', '/settings/main');


    $stateProvider

    // home
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: 'HomeCtrl',
        resolve: {
            videos: ["factory", function(factory) {
                return factory.getHomeData();
            }]
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
            historyData: ["factory", function(factory) {
                return factory.getHistoryData();
            }]
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
            exclusiveVideos: ["factory", function(factory) {
                return factory.getExclusiveData();
            }]
        }
    })

    // ratings
    .state('ratings', {
        url: "/ratings",
        templateUrl: "app/views/ratings.html",
        resolve: {
            ratingsData: ["factory", function(factory) {
                return factory.getRatingsData();
            }]
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
            blogData: ["factory", function(factory) {
                return factory.getBlogData();
            }]
        },
        controller: ["$scope", "blogData", function($scope, blogData) {
            $scope.blogData = blogData.data.videos;
        }]
    })
    .state('article', {
        url: "/blog/:url",
        templateUrl: 'app/views/article.html',
        scope: {
            content: '='
        },
        controller: ["$scope", "$stateParams", function($scope, $stateParams) {
            for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].url === $stateParams.url) {
                    $scope.content = $scope.videos[i];
                }
            }
        }]
    })

    // history
    .state('history', {
        url: "/history",
        templateUrl: "app/views/history.html",
        resolve: {
            historyData: ["factory", function(factory) {
                return factory.getHistoryData();
            }]
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
    .state('profile-edit', {
        url : '/profile-edit',
        templateUrl : 'app/views/profile-edit.html'
    })

    //add channel
    .state('add-channel' ,{
        url : '/add-channel',
        templateUrl : 'app/views/add-channel.html'
    })

    //settings
    .state('settings',{
        url : '/settings',
        templateUrl : 'app/views/settings.html',
        controller : 'SettingsCtrl'
    })
    .state('settings.main', {
        url : '/main',
        templateUrl : 'app/views/settings-main.html'
    })
    .state('settings.video', {
        url : '/video',
        templateUrl : 'app/views/settings-video.html'
    })

    //video settings
    .state('video-edit', {
        url : '/video-edit',
        templateUrl : 'app/views/video-settings.html'
    })

    //notifications and comments
    .state('comments', {
        url : '/comments-all',
        templateUrl : 'app/views/comments-all.html'
    })
    .state('notifications', {
        url : '/notifications-all',
        templateUrl : 'app/views/notifications-all.html'
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
    .state('videos', {
        url: "/videos/:id",
        templateUrl: 'app/views/videopage.html',
        scope: {
            content: '='
        },
        controller: ["$scope", "$stateParams", "factory", function($scope, $stateParams, factory) {
            for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].id === $stateParams.id) {
                    $scope.content = $scope.videos[i];
                }
            }
        }]
    })

    // shop detailed page
    .state('test', {
        url: '/test',
        templateUrl: 'app/views/test.html'
    });

}]);

angular.module("MainApp")
.factory('factory', ["$http", function($http) {

        var factory = {};

        // home page
        factory.getHomeData = function() {
            // return $http.get('/index/videos');
            return $http.get('./assets/js/test.json');
        };

        // exclusive page
        factory.getExclusiveData = function() {
            return $http.get('./assets/js/data.json');
        };

        // ratings page
        factory.getRatingsData = function() {
            return $http.get('./assets/js/data.json');
        };

        // blog page
        factory.getBlogData = function() {
            return $http.get('./assets/js/data.json');
        };

        // history page
        factory.getHistoryData = function() {
            return $http.get('./assets/js/data.json');
        };

        //
        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // factory.postVideos = function() {
        //
        // };

        return factory;

}]);

angular.module("MainApp")
.factory('prettyDate', ["$http", function($http) {

    return function(time,toDay) {
        var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400),
            years_diff = Math.floor(diff / 31536000);

        if ( isNaN(day_diff) || day_diff < 0 )
            return;

        if (toDay && day_diff < 1) {
            return "Сегодня";
        } else {
            return day_diff == 0 && (
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

}]);

angular.module("MainApp")
.controller('ChannelCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    $scope.content = $scope.currentUser;

    $scope.hoverIn = function(target) {
        if(target == 'ava') {
            $scope.changeAvaText = true;
        } else {
            $scope.channelbgText = true;
        }
    };
    $scope.hoverOut = function(target) {
        if(target == 'ava') {
            $scope.changeAvaText = false;
        } else {
            $scope.channelbgText = false;
        }
    };

    $scope.subscriptions = 116;

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
.controller('ExclusiveCtrl', ['$scope', 'exclusiveVideos', function ($scope, exclusiveVideos) {

    $scope.exclusiveVideos = exclusiveVideos.data.videos; //--

    $scope.categories = [
        'Adamantio 993',
        'JOD'
    ];

}]);

angular.module("MainApp")
.controller('HeaderCtrl', ['$scope', 'factory', function ($scope, factory) {

    

}]);

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

    console.log('init home controller');
    $scope.videos = videos.data.data;

}]);

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
    });


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


}]);

/**
 * Created by exz0N on 26.05.2016.
 */
angular.module("MainApp")
.controller('ProfileCtrl', ['$scope', function($scope) {

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
    }

}]);

angular.module("MainApp")
.controller('RatingsCtrl', ['$scope', 'ratingsData', function ($scope, ratingsData) {

    $scope.ratingsData = ratingsData.data;

    // video categories
    $scope.categories = [
        'JOD',
        'Adamantio 993'
    ];

}]);

angular.module("MainApp")
.controller('SearchCtrl', ['$scope', 'historyData', function ($scope, historyData) {

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
    .controller('SettingsCtrl', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {


        $scope.showMainIcon = false;
        $scope.items = [
            {
                name : 'Оригинальные пранки',
                items: {
                    innerName : ['Пранки','test2','Пранки 2','test4'],
                    hidden : false
                }
            },
            {
                name : 'Лучшие видео',
                items: {
                    innerName : [1,'Пранк'],
                    hidden : false
                }
            },
            {
                name : 'Пантера Шоу',
                items: {
                    innerName : [1,2,3,4,5],
                    hidden : false
                }
            }

        ];

        $scope.removeItem = function(outer, inner) {
            // console.log(arguments.length);
            if(arguments.length == 1) {
                //remove outer element
                $scope.items.splice(outer, 1);
            } else {
                //remove inner element
                $scope.items[outer].items.innerName.splice(inner, 1);
            }
        };


        $scope.showInnerIcons = function($event) {
            angular.element($event.currentTarget).parent().addClass('visible');
        };

        $scope.hideInnerICons = function($event) {
            angular.element($event.currentTarget).children().removeClass('visible')
        };


        $scope.editableIndex = -1;
        $scope.editMode = function(index) {
            $scope.editableIndex = index;

            // $timeout(function() {
            //     document.getElementById('test').focus();
            // }, 500);
        };
        $scope.disableAndUpdate = function(outer, inner, $event) {

            if($scope.editableIndex != -1) {// edit now
                // $scope.items[outer].items[inner] = angular.element($event.currentTarget).val();
                $scope.items[outer].items.innerName[inner] = angular.element($event.currentTarget).text();
            }
            $scope.editableIndex = -1;
            // console.log(angular.element($event.currentTarget).html());
        };
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




    /* mobile slider */

    $scope.wrapperWidth = 0;
    $scope.sliderWidth = 0;
    $scope.setWrapperWidth = function(amount) {
        // console.log(document.querySelectorAll('.mb_slider__slide')[0].clientWidth * amount);
        // document.getElementById('sWr').style.width = document.querySelectorAll('.mb_slider__slide')[0].clientWidth * amount + 'px';
        $scope.wrapperWidth = document.querySelectorAll('.mb_slider')[0].clientWidth * amount + 'px';
        $scope.sliderWidth = document.querySelectorAll('.mb_slider')[0].clientWidth + 'px';

        // console.log($scope.sliderWidth + 'aaa');
        // console.log($scope.testWidth)
    };

    $scope.$on('resize::resize', function() {
        // console.log($window.innerWidth);
        // $scope.setWrapperWidth($scope.itemDetails.images.length);
        // console.log(document.querySelectorAll('.mb_slider__slide')[0].clientWidth)
        $scope.setWrapperWidth($scope.itemDetails.images.length);
    });
    $scope.setWrapperWidth($scope.itemDetails.images.length);
    angular.element($window).bind('resize', function() {
        $scope.$apply();
    });
    // $scope.testWidth = document.getElementById('dMobSlider').clientWidth;


    // $scope.direction = 'left';
    $scope.currentIndex = 0;
    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };
    $scope.prevSlide = function () {
        // $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.itemDetails.images.length - 1) ? ++$scope.currentIndex : 0;
        document.getElementById('sWr').style.left = -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex )) + 'px';
        // console.log( 'prev ' + -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex +1)));
        // TweenMax.to(document.getElementById('sWr'), 1, {left : -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex ))});
    };
    $scope.nextSlide = function () {
        // $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.itemDetails.images.length - 1;
        document.getElementById('sWr').style.left = - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex)) + 'px';
        // console.log('next ' + - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex +1)));
        // TweenMax.to(document.getElementById('sWr'), 1, {left : - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex))});
    };

}]);

angular.module("MainApp")
    .controller('VideoPageCtrl', ['$scope', '$window', function($scope, $window) {
        var windWidth = window.innerWidth;

        $scope.activeTab = windWidth > 1280 ? 1 : 3;
        $scope.desktop =  windWidth > 1280 ? true : false;

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

angular.module("MainApp")
.directive('accordion', ["$timeout", function($timeout) {
    return {
        restrict: 'C',
        transclude: true,
        template: '<div ng-transclude></div>',
        link: function(scope, element, attrs) {

            $timeout(function() {

                var togglers = angular.element(element[0].querySelectorAll('[toggler]'));
                var pannels = angular.element(element[0].querySelectorAll('.accordion__pannel'));
                var contents = angular.element(element[0].querySelectorAll('.accordion__content'));
                angular.forEach(togglers, function(toggler,index) {
                    toggler.onclick = function() {
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

            }, 0);

        }
    }
}]);

angular.module("MainApp")
.directive('footerview', function() {
  return {
    restrict: 'E',
    // controller: 'MainCtrl',
    replace: true,
    templateUrl: 'app/views/footer.html'
  };
});

angular.module("MainApp")
.directive('headerview', function() {
  return {
    restrict: 'E',
    controller: 'HeaderCtrl',
    replace: true,
    templateUrl: 'app/views/header.html'
  };
});

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

app.directive('popoverTrigger', ["$document", function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            $document.on("click", function() {
                if (scope.userActive || scope.notificationActive) {
                    scope.$apply(function () {
                        scope.userActive = false;
                        scope.notificationActive = false;
                    })
                }
            });

            element.on("click", function (evt) {
                if (!scope.userActive || !scope.notificationActive) {
                    evt.stopPropagation();
                }
            });

        }
    };
}]);

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
.directive('sidebarview', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/views/sidebar.html'
  };
});

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

                for (var i = 0; i < slides.length; i++) {
                    slides[i].style.width = 100 / slidesNumber + '%';
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
  }
}]);
