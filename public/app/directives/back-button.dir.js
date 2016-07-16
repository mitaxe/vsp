app.directive('backButton', function ($document, $state, $stateParams, $rootScope) {
    return {
        restrict: 'E',
        // scope: {
        //     parameters: '=params'
        // },
        template: '<div a ng-click="backButton.goBack()" class="header__item header__back" ng-class="{searchActive:searchActive, pointer:backButton.available, videopage:videopage}">' +
                    '<div ng-show="backButton.available" class="table-middle">' +
                        '<i class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 28.914 16.998"><path fill-rule="evenodd" clip-rule="evenodd" fill="" d="M28.914 2.857L26.057 0l-11.66 11.66L2.83.093 0 2.924l13.98 13.98.35-.348.44.442"/></svg></i>' +
                        '<p ng-bind-html="backButton.text"></p>' +
                    '</div>' +
                '</div>',
        link: function (scope, element) {

            console.log(scope.videoPageChannel);

            scope.backButton = {
                available: false,
                text: '',
                prevState: '',
                id: $stateParams.id,
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
                        case ($state.includes('videos')):
                            this.available = true;
                            scope.videopage = true;
                            this.text = '<img src="' +
                                            $rootScope.videoPageChannel.img +
                                        '"/>' +
                                        '<div>' +
                                            $rootScope.videoPageChannel.user +
                                            '<br>' +
                                            '<span class="subscription"><span>Подписаться</span>' +
                                                '1 000 000' +
                                            '</span>' +
                                        '</div>';
                            this.prevState = 'channels';
                            this.id = $rootScope.videoPageChannel.channelId;
                            break;
                        default:
                            this.available = false;
                            scope.videopage = false;
                    }
                },
                goBack: function() {
                    $state.go(this.prevState, {'id': this.id});
                }
            };

            // on state change
            scope.$on('$stateChangeSuccess', function () {
                scope.backButton.init();
            });

        }
    };
});
