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

    // login button text
    $scope.getLoginBtnText = function() {
        if ($window.innerWidth < 1280) {
            return 'Войти';
        } else {
            return 'Авторизация';
        }
    };

    // login request
    $scope.loginData = {}; // login from data
    $scope.form = {}; // init form object
    $scope.user.unauthorized = true;

    $scope.loginUser = function() {

        // trigger validation of all fields
        angular.forEach($scope.form.login.$error, function (field) {
            angular.forEach(field, function(errorField) {
                errorField.$setTouched();
            });
        });

        // check if valid
        if ($scope.form.login.$invalid) {
            console.log('invalid form');
            return;
        }

        console.log('sending login request for - ',$scope.loginData);

        $scope.logging = true; // adjust button text

        // send login request
        factory.loginUser($scope.loginData).then(
            // success
            function(response) {
                console.log('login response - ',response);
                console.log('Assigned user token - '+response.data.data.token);

                $scope.user.authorized = true; //
                $scope.userData = factory.userCommonData();
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
