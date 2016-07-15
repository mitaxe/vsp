angular.module("MainApp")
.factory('factory', function($http) {

        var factory = {};
        var domain = 'http://vsponline.qa';

        // home page
        factory.getHomeData = function() {
            return $http.get('http://vsponline.qa/index/videos');
        };

        // exclusive page
        factory.getExclusiveData = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/exclusive/videos?offset=' + offset);
        };

        // new videos page
        factory.getNewVideosData = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/new/videos?offset=' + offset);
        };

        // ratings page
        factory.getRatingsVideos = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/ratings/videos?offset=' + offset);
        };
        factory.getRatingsChannels = function(offset) {
            offset = offset || '';
            return $http.get(domain + '/ratings/channels?offset=' + offset);
        };

        // video page
        factory.getVideoPageMainVideos = function(id) {
            return $http.get(domain + '/videos/' + id);
        };
        factory.getVideoPageComments = function(id) {
            return $http.get(domain + '/videos/' + id + '/comments');
        };
        factory.getRelatedVideos = function(id) {
            return $http.get(domain + '/videos/' + id + '/related_videos');
        };
        factory.getRelatedChannels = function(id) {
            return $http.get(domain + '/videos/' + id + '/related_channels');
        };

        // channel page
        factory.getChannelData = function(id) {
            return $http.get(domain + '/channels/' + id);
        };
        factory.getChannelVideos = function(id) {
            return $http.get(domain + '/channels/' + id + '/videos');
        };
        factory.getChannelPlaylists = function(id) {
            return $http.get(domain + '/channels/' + id + '/playlists');
        };
        factory.getChannelGoods = function(id) {
            return $http.get(domain + '/channels/' + id + '/goods');
        };

        // playlist page
        factory.getPlaylistData = function(id) {
            return $http.get(domain + '/playlists/' + id);
        };
        factory.getPlaylistVideos = function(id, offset) {
            offset = offset || '';
            return $http.get(domain + '/playlists/' + id + '/videos?offset=' + offset);
        };

        // blog page
        factory.getBlogData = function() {
            return $http.get(domain + '/articles');
        };

        // article data
        factory.getArticleData = function(id) {
            return $http.get(domain + '/articles/' + id);
        };

        // other articles
        factory.getOtherArticles = function(id) {
            return $http.get(domain + '/articles/' + id + '/other');
        };


        // history page
        factory.getHistoryData = function() {
            return $http.get(domain + '/videos/groups/history');
        };

        // default test
        factory.getVideos = function() {
            return $http.get('./assets/js/data.json');
        };

        // search
        factory.getSearchVideos = function(keyword,offset) {
            // offset = offset || '';
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get(domain + '/index/search/videos?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchChannels = function(keyword,offset) {
            // offset = offset || '';
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get(domain + '/index/search/channels?q=' + keyword + '&offset=' + offset);
        };
        factory.getSearchArticles = function(keyword,offset) {
            // offset = offset || '';
            console.log('key - ',keyword,'offset - ',offset);
            return $http.get(domain + '/index/search/articles?q=' + keyword + '&offset=' + offset);
        };

        // LOGIN
        factory.loginUser = function(data) {
            return $http.post(domain + '/users/login', data);
        };

        factory.userCommonData = function (){
            return $http.get(domain + '/users/common');
        };


        factory.getRecommendedChannels = function(){
            return $http.get(domain + '/channels/groups/recommended');
        };

        return factory;

});
