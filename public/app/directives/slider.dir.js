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
            // var timer = $timeout(function() {

                scope.pages = [];
                scope.activeSlide = 0;
                var perSlide = scope.perSlide || 4;
                var videosLength = 12;

                // var slidesNumber = scope.limitTo ? scope.limitTo : scope.slidesN.length;

                // var sliderBox = element[0].querySelector('.slider__inner');
                // var slides = element[0].querySelectorAll('.slider__slide');

                // for (var i = 0; i < (slidesNumber/perSlide); i++) {
                //     scope.pages.push(i);
                // }

                // limit to videosLength videos
                scope.slidesN.length = scope.slidesN.length > videosLength ? videosLength : scope.slidesN.length;

                // console.log('slides - ',scope.slidesN.length);

                // populate pager with links
                for (var i = 0; i < scope.slidesN.length/perSlide; i++) {
                    // if at least 2 slides
                    if (scope.slidesN.length > perSlide) scope.pages.push(i);
                }

                // sliderBox.style.width = scope.pages.length * 100 + '%';

                // for (var k = 0; k < slides.length; k++) {
                //     slides[k].style.width = 100 / slidesNumber + '%';
                // }

                // scope.sliderReady = true;

                scope.slideTo = function(slide) {
                    scope.activeSlide = slide;
                    if (
                        scope.slidesN.length < videosLength && // if slides less than videosLength
                        scope.slidesN.length % perSlide > 0 && // if slides cant be equaly devided by perSlide
                        slide === (scope.pages.length - 1)     // if this is the last slide
                    ) {
                        // set correct length to display last slide properly
                        slide = (slide - 1) + (scope.slidesN.length % perSlide) / perSlide;
                    }
                    element[0].querySelector('.slider__inner').style.left = '-' + slide * 100 + '%';
                };

                scope.isActiveSlide = function(i) {
                    if (i === scope.activeSlide) {
                        return true;
                    }
                };

            // }, 0);
        //  }, true);

    }
  };
});
