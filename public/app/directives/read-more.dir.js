angular.module("MainApp")
.directive('readMore', function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            content: '=text'
        },
        template: '<div ng-show="content.length > 0" >' +
                    '<span class="block-with-text" ng-class="{expanded:expanded}">' +
                        '<span class="block-with-text__content" ng-bind-html="content"></span>' +
                    '</span>' +
                    '<span class="block-with-text__read-more" ng-click="expanded = !expanded" ng-class="{expanded:expanded}" ng-show="showReadMore">' +
                        '<span>{{ expanded ? "Скрыть" : "Читаь далее" }}</span>' +
                        '<i class="svg"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 28.914 16.998"><path fill-rule="evenodd" clip-rule="evenodd" fill="" d="M28.914 2.857L26.057 0l-11.66 11.66L2.83.093 0 2.924l13.98 13.98.35-.348.44.442"/></svg></i>' +
                    '</span>' +
                '</div>',
        link: function(scope, element, attrs) {

            $timeout(function () {

                var block = element[0].getElementsByClassName('block-with-text');
                var content = element[0].getElementsByClassName('block-with-text__content');

                console.log(block[0].clientHeight, content[0].clientHeight);
                console.log(block);

                if (block[0].clientHeight < content[0].clientHeight) {
                    console.log('hidden');
                    scope.showReadMore = true;
                }

            }, 0);

        }
    };
});
