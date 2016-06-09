angular.module("MainApp")
.factory('factory', function($http) {

        var factory = {};

        // home page
        factory.getHomeData = function() {
            return $http.get('./assets/js/test.json');
        };

        // exclusive page
        factory.getExclusiveData = function() {
            return $http.get('./assets/js/data.json');
        };

        // ratings page
        factory.getRatingsData = function() {
            return $http.get('./assets/js/data.json');
        };

        // blog page
        factory.getBlogData = function() {
            return $http.get('./assets/js/data.json');
        };

        // history page
        factory.getHistoryData = function() {
            return $http.get('./assets/js/data.json');
        };

        //
        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // factory.postVideos = function() {
        //
        // };

        return factory;

});
