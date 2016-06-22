angular.module("MainApp")
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
         // home
        .state('home', {
            url: "/",
            // template : '<h1>TEST</h1>'
            templateUrl: "views/homepage.html",
            controller : 'HomeCtrl',
            resolve : {
                homeData : function(factory) {
                    return factory.getRatingsVideos(12);
                }
            }
        })
        .state('editRow', {
            url : '/edit/:id',
            templateUrl : 'views/edit-row.html',
            controller : 'EditRowCtrl',
            resolve : {
                getEditData : function(factory, $stateParams) {
                    return factory.getVideo($stateParams.id);
                }
            }
        })
        .state('addRow', {
            url : '/add-row',
            templateUrl : 'views/add-new-row.html',
            controller : 'AddRowCtrl'
        });

});
