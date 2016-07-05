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
