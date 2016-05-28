angular.module("MainApp")
.factory('factory', function($http) {

        var factory = {};

        // home page
        factory.getHomePageData = function() {
            return $http.get('./assets/js/data.json');
        };

        // exclusive page
        factory.getExclusiveVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // ratings page
        factory.getRatings = function() {
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
