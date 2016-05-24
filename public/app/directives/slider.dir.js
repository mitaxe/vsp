angular.module("MainApp")
.directive('slider', function(prettyDate) {
  return {
    restrict: 'E',
    scope: {
        info: '='
    },
    replace: true,
    templateUrl: function(tElement, tAttrs) {
        if (tAttrs) {
            if (tAttrs.type === 'videos') {
                return 'app/views/slider-videos.html';
            }
            if (tAttrs.type === 'channels') {
                return 'app/views/slider-channels.html';
            }
        }
    },
    link: function(scope, element, attrs) {

        scope.slidesN = [0,1,2]; /// ---

        scope.activeSlide = 0;

        scope.slideTo = function(slide) {
            scope.activeSlide = slide;
            element[0].querySelector('.slider__inner').style.left = '-' + slide * 100 + '%';
        };

        scope.isActiveSlide = function(i) {
            if (i === scope.activeSlide) {
                return true;
            }
        };

        scope.getDate = function(date,toDay) {
            return prettyDate(date,toDay);
        };

    }
  };
});
