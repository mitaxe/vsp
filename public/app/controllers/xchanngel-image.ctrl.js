//IMAGE RESIZE

var mainApp = angular.module("MainApp");

mainApp.controller('ImageResize', function($scope) {
    $scope.myCroppedImage='';
    $scope.myImage= '';

    $scope.blockingObject = {block:true};
    $scope.callTestFuntion = function(){
      $scope.blockingObject.render(function(dataURL){
        console.log('via render');
        console.log(dataURL.length);
      });
    }
    $scope.blockingObject.callback=function(dataURL){
      console.log('via function');
      console.log(dataURL.length);
    }

  
    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
      angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect); 
}); 