angular.module("MainApp")
.factory('factory', function($http) {

        var factory = {};

        // home page
        factory.getHomeData = function() {
            return $http.get('http://vsponline.qa/index/videos');
        };

        // exclusive page
        factory.getExclusiveData = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/exclusive/videos?offset=' + offset);
        };

        //new videos page
        factory.getNewVideosData = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/new/videos?offset=' + offset);
        };

        // ratings page
        factory.getRatingsVideos = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/ratings/videos?offset=' + offset);
        };

        factory.getRatingsChannels = function() {
          return $http.get('http://vsponline.qa/ratings/channels');
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
