var app = angular.module("MainApp", ['ui.router', 'angular-loading-bar', 'ngAnimate', 'ngTouch', 'angular-sortable-view', 'ngSanitize']);


app.run(function($rootScope, $document, $locale, $state){

    // scroll ng view top on enter
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        // prevent child states form scrolling top
        if (!(
            (from.name.indexOf('user.') >= 0 &&
            to.name.indexOf('user.') >= 0) ||
            (from.name.indexOf('channels.') >= 0 &&
            to.name.indexOf('channels.') >= 0)
        )) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });

    // replace angular number comma separator with space
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
    $locale.NUMBER_FORMATS.DECIMAL_SEP = ".";

});
