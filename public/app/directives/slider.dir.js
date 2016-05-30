angular.module("MainApp")
.directive('slider', function($timeout) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        slidesN: '=slides',
        limitTo: '=limitto',
        perSlide: '=perslide'
    },
    template: '<div class="slider" ng-class="{sliderReady:sliderReady}">' +
                '<div class="slider__box">' +
                    '<div class="slider__inner">' +
                        '<div ng-transclude></div>' +
                    '</div>' +
                '</div>' +
                '<ul class="slider__pager">' +
                    '<li ng-class="{active: isActiveSlide($index)}" ng-model="activeSlide" ng-click="slideTo($index)" ng-repeat="i in pages"></li>' +
                '</ul>' +
                '</div>',
    link: function(scope, element, attrs) {

        // scope.$watch('slidesN', function() {
            var timer = $timeout(function() {

                scope.pages = [];
                scope.activeSlide = 0;

                var perSlide = scope.perSlide || 4;

                var slidesNumber = scope.limitTo ? scope.limitTo : scope.slidesN.length;

                var sliderBox = element[0].querySelector('.slider__inner');
                var slides = element[0].querySelectorAll('.slider__slide');

                for (var i = 0; i < (slidesNumber/perSlide); i++) {
                    scope.pages.push(i);
                }

                sliderBox.style.width = scope.pages.length * 100 + '%';

                for (var i = 0; i < slides.length; i++) {
                    slides[i].style.width = 100 / slidesNumber + '%';
                }

                scope.sliderReady = true;

                scope.slideTo = function(slide) {
                    scope.activeSlide = slide;
                    element[0].querySelector('.slider__inner').style.left = '-' + slide * 100 + '%';
                };

                scope.isActiveSlide = function(i) {
                    if (i === scope.activeSlide) {
                        return true;
                    }
                };

            },0);
        //  }, true);

    }
  };
});
