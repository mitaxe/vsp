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

        // channel page
        factory.getChannelData = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id);
        };
        factory.getChannelVideos = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id + '/videos');
        };
        factory.getChannelPlaylists = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id + '/playlists');
        };
        factory.getChannelGoods = function(id) {
            return $http.get('http://vsponline.qa/channels/' + id + '/goods');
        };

        // playlist page
        factory.getPlaylistData = function(id) {
            return $http.get('http://vsponline.qa/playlists/' + id);
        };
        factory.getPlaylistVideos = function(id, offset) {
            offset = offset || '';
            return $http.get('http://vsponline.qa/playlists/' + id + '/videos?offset=' + offset);
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

        // search
        // factory.getSearch = function(keyword) {
        //     return $http.get('http://vsponline.qa/index/search?key=' + keyword);
        // };
        factory.getSearchVideos = function(keyword,offset) {
            console.log(keyword,offset);
            return $http.get('http://vsponline.qa/index/search/videos?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchChannels = function(keyword,offset) {
            console.log(keyword,offset);
            return $http.get('http://vsponline.qa/index/search/channels?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchArticles = function(keyword,offset) {
            return $http.get('http://vsponline.qa/index/search/articles?q=' + keyword + '&offset=' + offset);
        };

        // factory.postVideos = function() {
        //
        // };

        return factory;

});
