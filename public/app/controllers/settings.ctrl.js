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
