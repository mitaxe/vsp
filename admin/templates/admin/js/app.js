/**
 * Created by exz0N on 13.06.2016.
 */
var app = angular.module("MainApp", ['ui.router']);

app.directive('headerview', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'views/header.html'
    };
});


app.directive('footerview', function() {
   return {
       restrict : 'E',
       replace : true,
       templateUrl : 'views/footer.html'
   };
});


app.directive('navigationview', function() {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : 'views/nav.html'
    };
});

app.factory('factory', function($http) {
    var factory = {};

    factory.getHomeData = function() {
      return $http.get('js/test.json');
    };

    factory.getRatingsVideos = function(offset) {
        offset = offset || '';
        return $http.get('http://vsponline.qa/ratings/videos?offset=' + offset);
    };

    factory.getVideo = function(id) {
        return $http.get('http://vsponline.qa/videos/' + id);
    };

    return factory;
});
