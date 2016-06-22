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
   } 
});


app.directive('navigationview', function() {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : 'views/nav.html'
    }
});

/* ========================================================
*
* MVP Ready - Lightweight & Responsive Admin Template
*
* ========================================================
*
* File: mvpready-admin.js
* Theme Version: 2.0.0
* Bootstrap Version: 3.3.2
* Author: Jumpstart Themes
* Website: http://mvpready.com
*
* ======================================================== */

var mvpready_admin = function () {

  "use strict"

  var initNavbarNotifications = function () {
    var notifications = $('.navbar-notification')

    notifications.find ('> .dropdown-toggle').click (function (e) {
      if (mvpready_core.isLayoutCollapsed ()) {
        window.location = $(this).prop ('href')
      }
    })

    notifications.find ('.notification-list').slimScroll ({ height: 225 });
  }

  return {
    init: function () {
      // Layouts
      mvpready_core.navEnhancedInit ()
      mvpready_core.navHoverInit ({ delay: { show: 250, hide: 350 } })

      initNavbarNotifications ()
      mvpready_core.initLayoutToggles ()
      mvpready_core.initBackToTop ()

      // Components
      mvpready_helpers.initAccordions ()
      mvpready_helpers.initFormValidation ()
      mvpready_helpers.initTooltips ()
      mvpready_helpers.initLightbox ()
      mvpready_helpers.initSelect ()
      mvpready_helpers.initIcheck ()
      mvpready_helpers.initDataTableHelper ()
      mvpready_helpers.initiTimePicker ()
      mvpready_helpers.initDatePicker ()
    }
  }

}()

$(function () {
  mvpready_admin.init ()
})
angular.module("MainApp")
    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");



        $stateProvider
             // home
            .state('home', {
                url: "/",
                // template : '<h1>TEST</h1>'
                templateUrl: "views/homepage.html",
                controller : 'HomeCtrl'
            })
    }]);