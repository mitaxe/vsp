angular.module("MainApp")
.directive('subscribe', function($timeout, $window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
        subscriber: '=subscribeTo'
    },
    template: '<div class="subscribe_box">' +
                    '<span ng-click="subscribe()" class="green_btn" ng-class="{subscribed:subscribed}" ng-mouseover="hoverIn()" ng-mouseleave="hoverOut()">' +
                        ' {{ getSubscriptionText() }} ' +
                    '</span>' +
                    '<span class="counter subscribe">{{ subscriber | number }}</span>' +
                '</div>',
    link: function(scope, element, attrs) {

        // subscribe
        scope.subscribe = function() {
            scope.subscribed = !scope.subscribed;
            if (scope.subscribed) {
                scope.subscriber += 1;
            } else {
                scope.subscriber -= 1;
            }
        };

        scope.hoverIn = function(){
            scope.subsButtonHovered = true;
        };

        scope.hoverOut = function(){
            scope.subsButtonHovered = false;
        };

        scope.getSubscriptionText = function() {
            var text = 'Подписаться';
            if (scope.subscribed) {
                text = 'Подписка оформлена';
                if (scope.subsButtonHovered) {
                    text = 'Отменить подписку';
                }
                if ($window.innerWidth < 768) {
                    text = 'Отписаться';
                }
            }
            return text;
        };

    }
  };
});
