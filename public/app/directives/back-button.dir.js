app.directive('backButton', function ($document, $state, $stateParams) {
    return {
        restrict: 'E',
        // scope: {
        //     parameters: '=params'
        // },
        template: '<a ng-click="backButton.goBack()" ng-class="{pointer:backButton.available}">' +
                        '<div class="header__item header__back" ng-class="{searchActive:searchActive}">' +
                            '<div ng-show="backButton.available" class="table-middle">' +
                                '<i class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 28.914 16.998"><path fill-rule="evenodd" clip-rule="evenodd" fill="" d="M28.914 2.857L26.057 0l-11.66 11.66L2.83.093 0 2.924l13.98 13.98.35-.348.44.442"/></svg></i>' +
                                '<span>{{ backButton.text }}</span>' +
                            '</div>' +
                        '</div>' +
                    '</a>',
        link: function (scope, element) {

            scope.backButton = {
                available: true,
                text: '',
                prevState: '',
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
                            this.prevState = 'channels';
                            break;
                        default:
                            this.available = false;
                    }
                },
                goBack: function() {
                    $state.go(this.prevState, {'id': $stateParams.id});
                }
            };

            // on state change
            scope.$on('$stateChangeSuccess', function () {
                scope.backButton.init();
            });

        }
    };
});
