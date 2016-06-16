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

        // new videos page
        factory.getNewVideosData = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/new/videos?offset=' + offset);
        };

        // ratings page
        factory.getRatingsVideos = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/ratings/videos?offset=' + offset);
        };
        factory.getRatingsChannels = function(offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/ratings/channels?offset=' + offset);
        };

        // video page
        factory.getVideoPageMainVideos = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id);
        };
        factory.getVideoPageComments = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id + '/comments');
        };
        factory.getRelatedVideos = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id + '/related_videos');
        };
        factory.getRelatedChannels = function(id) {
            return $http.get('http://vsponline.qa/videos/' + id + '/related_channels');
        };

        // blog page
        factory.getBlogData = function() {
            return $http.get('./assets/js/data.json');
        };

        // history page
        factory.getHistoryData = function() {
            return $http.get('./assets/js/data.json');
        };

        // default test
        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // factory.postVideos = function() {
        //
        // };

        return factory;

});
