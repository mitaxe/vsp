angular.module("MainApp")
    .controller('SettingsCtrl', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {


        $scope.showMainIcon = false;
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
                inner: [
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
                inner: [
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

        $scope.removeItem = function(outer, inner) {
            // console.log(arguments.length);
            if(arguments.length == 1) {
                //remove outer element
                $scope.items.splice(outer, 1);
            } else {
                //remove inner element
                $scope.items[outer].inner.splice(inner, 1);
            }
        };


        $scope.showInnerIcons = function($event) {
            angular.element($event.currentTarget).parent().addClass('visible');
        };

        $scope.hideInnerICons = function($event) {
            angular.element($event.currentTarget).children().removeClass('visible');
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
                $scope.items[outer].inner[inner].name = angular.element($event.currentTarget).text();
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

        $scope.showHide = function(outer, inner, value) {

            $scope.items[outer].inner[inner].hidden = !value;
           // console.log($scope.items[outer].inner[inner].hidden);
        };
    }]);
