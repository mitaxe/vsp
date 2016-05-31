angular.module("MainApp")
.controller('ShopDetailCtrl', ['$scope', '$stateParams', '$window', function($scope, $stateParams, $window) {

    $scope.itemDetails = {
        name : $stateParams.itemId,
        images : [
            'assets/img/tshort1.png',
            'assets/img/tshort2.png',
            'assets/img/tshort3.png'
        ],
        description : 'The CHOPPED Tee shirt is finally here, printed front AND back for maximum choppage! Chopped fingers on the front when they see you coming, then CHOPPED text on the back so fools know they\'ve been CHOPPED when you stride past! - See more at: http://mightycarmods.com/collections/clothing/products/chopped-tee-shirt#sthash.v0DcQcBb.dpuf',
        price: 10
    };

    $scope.mainImageUrl = $scope.itemDetails.images[0];

    $scope.setImage = function(url) {
        $scope.mainImageUrl = url;
    };

    $scope.selectedPreview = 0;
    $scope.setPreview = function(index) {
        $scope.selectedPreview = index;
    };




    /* mobile slider */

    $scope.wrapperWidth = 0;
    $scope.sliderWidth = 0;
    $scope.setWrapperWidth = function(amount) {
        // console.log(document.querySelectorAll('.mb_slider__slide')[0].clientWidth * amount);
        // document.getElementById('sWr').style.width = document.querySelectorAll('.mb_slider__slide')[0].clientWidth * amount + 'px';
        $scope.wrapperWidth = document.querySelectorAll('.mb_slider')[0].clientWidth * amount + 'px';
        $scope.sliderWidth = document.querySelectorAll('.mb_slider')[0].clientWidth + 'px';

        // console.log($scope.sliderWidth + 'aaa');
        // console.log($scope.testWidth)
    };

    $scope.$on('resize::resize', function() {
        // console.log($window.innerWidth);
        // $scope.setWrapperWidth($scope.itemDetails.images.length);
        // console.log(document.querySelectorAll('.mb_slider__slide')[0].clientWidth)
        $scope.setWrapperWidth($scope.itemDetails.images.length);
    });
    $scope.setWrapperWidth($scope.itemDetails.images.length);
    angular.element($window).bind('resize', function() {
        $scope.$apply();
    });
    // $scope.testWidth = document.getElementById('dMobSlider').clientWidth;


    // $scope.direction = 'left';
    $scope.currentIndex = 0;
    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };
    $scope.prevSlide = function () {
        // $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.itemDetails.images.length - 1) ? ++$scope.currentIndex : 0;
        document.getElementById('sWr').style.left = -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex )) + 'px';
        // console.log( 'prev ' + -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex +1)));
        // TweenMax.to(document.getElementById('sWr'), 1, {left : -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex ))});
    };
    $scope.nextSlide = function () {
        // $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.itemDetails.images.length - 1;
        document.getElementById('sWr').style.left = - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex)) + 'px';
        // console.log('next ' + - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex +1)));
        // TweenMax.to(document.getElementById('sWr'), 1, {left : - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex))});
    };

}]);
