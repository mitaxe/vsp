angular.module("MainApp")
.directive('tabs', function($rootScope) {
    return {
        restrict:'E',
        replace: true,
        scope: {
            notifications: '=notifications'
        },
        link: function(scope, element, att) {

            scope.underline = element[0].querySelector('.tabs__underline');
            scope.links = element[0].querySelectorAll('a');
            // scope.activeLink;

            function setActiveLink() {
                for (var i = 0; i < scope.links.length; i++) {
                    if (scope.links[i].className === 'active') {
                        scope.activeLink = scope.links[i];
                    }
                }
            }

            function renderUnderline() {
                var currentLeft = !scope.notifications ?
                angular.element(scope.activeLink).prop('offsetLeft') - 8 :
                angular.element(scope.activeLink).prop('offsetLeft') - 15;
                var currentWidth = scope.activeLink.clientWidth;
                angular.element(scope.underline).css({
                    'left': currentLeft + 'px',
                    'width': currentWidth + 'px',
                    'transition': '0.3s'
                });
            }

            if (!scope.notifications) {
                setTimeout(function() {
                    setActiveLink();
                    renderUnderline();
                    $rootScope.$on('$stateChangeSuccess', function() {
                        // console.log('state changed');
                        setTimeout(function(){
                            setActiveLink();
                            renderUnderline();
                        }, 10);
                    });
                }, 75);
            } else {
                scope.activeLink = scope.links[0];
                renderUnderline();
                for (var i = 0; i < scope.links.length; i++) {
                    (function(index) {
                        scope.links[i].onclick = function() {
                            scope.activeLink = scope.links[index];
                            renderUnderline();
                        };
                    })(i);
                }
            }

            scope.$on('resize::resize', function() {
                renderUnderline();
            });

        }
    };
});
