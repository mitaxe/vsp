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
