angular.module("MainApp")
.directive('tabs', function() {
    return {
        restrict:'E',
        replace: true,
        link: function(scope, element, att) {

            scope.underline = element[0].querySelector('.tabs__underline');
            scope.links = element[0].querySelectorAll('a');
            scope.activeLink = scope.links[0];

            function renderUnderline() {
                var currentLeft = angular.element(scope.activeLink).prop('offsetLeft');
                var currentWidth = scope.activeLink.clientWidth;

                angular.element(scope.underline).css({
                    'left': currentLeft - 8 + 'px',
                    'width': currentWidth + 'px'
                });
            }

            renderUnderline();

            for (var i = 0; i < scope.links.length; i++) {
                (function(index) {
                    scope.links[i].onclick = function() {
                        scope.activeLink = scope.links[index];
                        renderUnderline();
                    };
                })(i);
            }

            scope.$on('resize::resize', function() {
                renderUnderline();
            });

        }
    };
});
