angular.module("MainApp")
.factory('factory', function($http) {

        var factory = {};

        factory.getHomePageData = function() {
            return $http.get('./assets/js/data.json');
        };

        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // factory.postVideos = function() {
        //
        // };

        return factory;

});
