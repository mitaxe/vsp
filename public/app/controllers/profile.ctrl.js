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
            function () {
                console.log('error');
            }
        );
    };

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
