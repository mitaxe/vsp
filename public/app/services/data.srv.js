angular.module("MainApp")
.factory('factory', function($http) {

        var factory = {};

        // home page
        factory.getHomeData = function() {
            // return $http.get('./assets/js/test.json');
            return $http.get('/index/videos');
        };

        // exclusive page
        factory.getExclusiveData = function(offset) {
            // return $http.get('./assets/js/data.json');
            if (offset) {
                return $http.get('/exclusive/videos?offset=' + offset);
            }
            return $http.get('/exclusive/videos');
        };

        // ratings page
        factory.getRatingsData = function() {
            // return $http.get('./assets/js/data.json');
            return $http.get('/ratings/videos');
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
