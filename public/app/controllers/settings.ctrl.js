angular.module("MainApp")
    .controller('SettingsCtrl', ['$scope', function ($scope) {


        $scope.items = [
            {
                name : 'Оригинальные пранки',
                items: [1,2,3,4]
            },
            {
                name : 'Лучшие видео',
                items: [1,2]
            },
            {
                name : 'Пантера Шоу',
                items: [1,2,3,4,5]
            }

        ];

        $scope.removeItem = function(outer, inner) {
            // console.log(arguments.length);
            if(arguments.length == 1) {
                //remove outer element
                $scope.items.splice(outer, 1);
            } else {
                //remove inner element
                $scope.items[outer].items.splice(inner, 1);
            }
        };


        $scope.showInnerIcons = function($event) {
            angular.element($event.currentTarget).parent().addClass('visible');
        };

        $scope.hideInnerICons = function($event) {
            angular.element($event.currentTarget).children().removeClass('visible')
        }
    }]);
