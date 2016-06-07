angular.module("MainApp")
    .controller('SettingsCtrl', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {


        $scope.showMainIcon = false;
        $scope.items = [
            {
                name : 'Оригинальные пранки',
                items: ['Пранки','test2','Пранки 2','test4']
            },
            {
                name : 'Лучшие видео',
                items: [1,'Пранк']
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
                $scope.items[outer].items[inner] = angular.element($event.currentTarget).text();
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
