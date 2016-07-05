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

    // back button
    $scope.backButton = {
        available: true,
        text: '',
        prevState: '',
        paramsId: '',
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
                    this.paramsId = $scope.userData.channel.id;
                    this.prevState = 'channels';
                    console.log('this is channel page');
                    break;
                default:
                    this.available = false;
            }
        },
        goBack: function() {
            $state.go(this.prevState, {'id': this.paramsId});
        }
    };

    // on state change
    $scope.$on('$stateChangeSuccess', function () {
        // show login modal on login page
        if ($state.includes('login')) {
            $scope.showloginModal = true;
        }

        // init back button
        $scope.backButton.init();
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
                    console.log('User common data - ', $scope.userData);
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
