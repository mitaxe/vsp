angular.module("MainApp")
.directive('accordion', function($timeout) {
    return {
        restrict: 'C',
        transclude: true,
        template: '<div ng-transclude></div>',
        link: function(scope, element, attrs) {

            $timeout(function() {

                var togglers = angular.element(element[0].querySelectorAll('[toggler]'));
                var pannels = angular.element(element[0].querySelectorAll('.accordion__pannel'));
                var contents = angular.element(element[0].querySelectorAll('.accordion__content'));
                angular.forEach(togglers, function(toggler,index) {
                    toggler.onclick = function() {
                        if (toggler.className.indexOf('active') != -1) {

                            toggler.className = toggler.className.replace(/\bactive\b/,'');
                            console.log(toggler.className);
                            angular.forEach(pannels, function(el) {
                                el.style.height = '0';
                            });
                        } else {
                            angular.forEach(pannels, function(el) {
                                el.style.height = '0';
                            });
                            angular.forEach(togglers, function(el) {
                                el.className = el.className.replace(/\bactive\b/,'');
                            });
                            var y = contents[index].clientHeight;
                            pannels[index].style.height = y + 15 + 'px';
                            toggler.className += ' active';
                        }
                    };
                });

            }, 0);

        }
    }
});
