var app = angular.module("MainApp", ['ui.router', 'ngAnimate', 'ngTouch', 'angular-sortable-view']);


app.run(function($rootScope, $document, $locale, $state){

    // scroll ng view top on enter
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        // prevent child states form scrolling top
        if (!(
            from.name.indexOf('user.') >= 0 &&
            to.name.indexOf('user.') >= 0
        )) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });

    // replace angular number comma separator with space
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
    $locale.NUMBER_FORMATS.DECIMAL_SEP = ".";

});

// filters


    // ng repeat start from
    app.filter('startFrom', function() {
        return function(input, start) {
            if(input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        };
    });


    //video length formatter
    app.filter('secondsToTime', function() {

        function padTime(t) {
            return t < 10 ? "0"+t : t;
        }

        return function(_seconds) {
            if (typeof _seconds !== "number" || _seconds < 0) {
                return "00:00:00";
            }

            var hours = Math.floor(_seconds / 3600),
                minutes = Math.floor((_seconds % 3600) / 60),
                seconds = Math.floor(_seconds % 60);

            if(hours) {
                return padTime(hours) + ":" + padTime(minutes) + ":" + padTime(seconds);
            } else {
                return  padTime(minutes) + ":" + padTime(seconds);
            }
        };
    });


    //description filter
    app.filter('descriptionFormatter', function() {
        return function(text, limit) {
            var words = text.split(' '),
                wordsToShow = 0, //how much words need to show
                counter = 0; //letter counter

            for (var i = 0; i <= words.length; i++) {
                if(counter < limit) {
                    counter += words[i].length; //count letters length
                    // console.log('counter ' + counter);
                } else {
                    wordsToShow = i -1; //index of last word
                    // console.log('words ' + wordsToShow);
                    break;
                }
            }
            
           // console.log('words length ' + words.length + ' ned to show  ' + wordsToShow + ' have to slice ' + (words.length - wordsToShow))

           // console.log(words.splice(0,words.length - wordsToShow).length);

            return words.splice(0, wordsToShow).join(' ') + ' ...';
        };
    });


// helpers

    // clone object simple
    function clone(obj) {
        if (null === obj || "object" !== typeof obj) {
            return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    }

    // sort array by obg prop
    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }
