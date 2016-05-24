var app = angular.module("MainApp", ['ui.router', 'ngAnimate']);


app.run(["$rootScope", "$document", "$locale", "$state", function($rootScope, $document, $locale, $state){

    // scroll ng view top on enter
    $rootScope.$on('$stateChangeSuccess', function() {
       document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    // replace angular number comma separator with space
    // $locale.NUMBER_FORMATS.GROUP_SEP = " ";
    // $locale.NUMBER_FORMATS.DECIMAL_SEP = ".";

    // redirect route to child first state when needed
    $rootScope.$state = $state;

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {location: 'replace'})
      }
    });

}]);


// filters ---------------------------------------------------------------------

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


// helpers ---------------------------------------------------------------------

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

    $stateProvider

    // home
    .state('home', {
        url: "/",
        templateUrl: "app/views/home.html"
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
        controller: ["$scope", "$stateParams", "factory", function($scope, $stateParams, factory) {
            if ($stateParams.url === $scope.currentUser.url) {
                $scope.content = $scope.currentUser;
            } else {
                for (var i = 0; i < $scope.channels.length; i++) {
                    if ($scope.channels[i].url === $stateParams.url) {
                        $scope.content = $scope.channels[i];
                    }
                }
            }
        }]
    })


    // video page
    .state('video', {
        url: "/video/:url",
        templateUrl: 'app/views/videopage.html',
        scope: {
            content: '='
        },
        controller: ["$scope", "$stateParams", "factory", function($scope, $stateParams, factory) {
            for (var i = 0; i < $scope.videos.length; i++) {
                if ($scope.videos[i].url === $stateParams.url) {
                    $scope.content = $scope.videos[i];
                }
            }
        }]
    })

}]);

angular.module("MainApp")
.factory('factory', ["$http", function($http) {

        var factory = {};

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
                    diff < 60 && "Меньше минуты назад" ||
                    diff < 120 && "1 минуту назад" ||
                    diff < 3600 && Math.floor( diff / 60 ) + " минут назад" ||
                    diff < 7200 && "1 час назад" ||
                    diff < 86400 && Math.floor( diff / 3600 ) + " часов назад") ||
                day_diff < 1 && today && "Сегодня" ||
                day_diff == 1 && "Вчера" ||
                day_diff < 7 && day_diff + " дней назад" ||
                day_diff < 31 && Math.ceil( day_diff / 7 ) + " недель назад" ||
                years_diff === 1 && years_diff + " год назад" ||
                years_diff > 1 && years_diff + " лет назад";
        }
    };

}]);

angular.module("MainApp")
.controller('CommentsCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    // comments
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
            var comment = {
                "user": "Current User",
                "text": text,
                "link": "#",
                "img": "assets/img/ball-60.png",
                "date": "16 часов назад",
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

    // trash
    window.showComments = function() {
        console.log($scope.comments);
    };

}]);

angular.module("MainApp")
.controller('HeaderCtrl', ['$scope', 'factory', function ($scope, factory) {

    $scope.removePin = function(pin) {
        var index = $scope.pins.indexOf(pin);
        if (index > -1) {
            $scope.pins.splice(index, 1);
        }
    };

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
        "description": "This is user channel description test test test test test test test test test test test test test test test test."
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

            scope.userActive = false;
            scope.notificationActive = false;

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
.directive('slider', ["prettyDate", function(prettyDate) {
  return {
    restrict: 'E',
    scope: {
        info: '='
    },
    replace: true,
    templateUrl: function(tElement, tAttrs) {
        if (tAttrs) {
            if (tAttrs.type === 'videos') {
                return 'app/views/slider-videos.html';
            }
            if (tAttrs.type === 'channels') {
                return 'app/views/slider-channels.html';
            }
        }
    },
    link: function(scope, element, attrs) {

        scope.slidesN = [0,1,2]; /// ---

        scope.activeSlide = 0;

        scope.slideTo = function(slide) {
            scope.activeSlide = slide;
            element[0].querySelector('.slider__inner').style.left = '-' + slide * 100 + '%';
        };

        scope.isActiveSlide = function(i) {
            if (i === scope.activeSlide) {
                return true;
            }
        };

        scope.getDate = function(date,toDay) {
            return prettyDate(date,toDay);
        };

    }
  };
}]);

angular.module("MainApp")
.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 0 15px 0 !important; padding:0 !important" >' + contents + '</div>');
            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '.3s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})
.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            var myElements = document.querySelectorAll(".slideable");
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if (element.hasClass('active')) {
                    element.parent().find("a").removeClass("active");
                    for (var i = 0; i < myElements.length; i++) {
                        myElements[i].style.height = '0';
                    }
                } else {
                    element.parent().find("a").removeClass("active");
                    var y = content.clientHeight;
                    for (var i = 0; i < myElements.length; i++) {
                        myElements[i].style.height = '0';
                    }
                    target.style.height = y + 15 + 'px';
                    element.addClass('active');
                }
            });
        }
    };
});
