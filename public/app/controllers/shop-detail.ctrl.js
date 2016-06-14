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
        $scope.wrapperWidth = document.querySelectorAll('.mb_slider')[0].clientWidth * amount + 'px';
        $scope.sliderWidth = document.querySelectorAll('.mb_slider')[0].clientWidth + 'px';
    };

    $scope.$on('resize::resize', function() {
        $scope.setWrapperWidth($scope.itemDetails.images.length);
    });

    $scope.setWrapperWidth($scope.itemDetails.images.length);

    angular.element($window).bind('resize', function() {
        $scope.$apply();
    });

    $scope.currentIndex = 0;

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        // $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.itemDetails.images.length - 1) ? ++$scope.currentIndex : 0;
        document.getElementById('sWr').style.left = -(document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex )) + 'px';
    };

    $scope.nextSlide = function () {
        // $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.itemDetails.images.length - 1;
        document.getElementById('sWr').style.left = - (document.querySelectorAll('.mb_slider')[0].clientWidth * ($scope.currentIndex)) + 'px';
    };

}]);
