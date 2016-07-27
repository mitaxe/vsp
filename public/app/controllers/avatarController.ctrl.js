var mainApp = angular.module('MainApp');

mainApp.controller('avatarController', function($scope) {
    
    $scope.avatar = 0;
    
    $scope.openModal = function() {
        
        $scope.avatar = 1;
    }
});