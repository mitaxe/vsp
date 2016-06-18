/* filters */

// ng repeat start from
app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; // parse to int
            return input.slice(start);
        }
        return [];
    };
});

// video length formatter
app.filter('secondsToTime', function() {

    function padTime(t) {
        return t < 10 ? "0"+t : t;
    }

    return function(_seconds) {
        if (typeof _seconds !== "number" || _seconds < 0)
            return "00:00:00";

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

// text length filter
app.filter('trimText', function() {
    return function(text, limit, backwards) {

        if(!text) {
            return '';
        }

        var words = text.split(' ');
        var wordsToShow = 0; // how much words need to show
        var counter = 0; // letter counter

        for (var i = 0; i < words.length; i++) {
            if(counter < limit) {
                counter += words[i].length; // count letters length
                wordsToShow = i;
            } else {
                wordsToShow = i -1; // index of last word
                break;
            }
        }

        if (backwards) {
            return '...' + words.splice(wordsToShow + 1).join(' ');
        } else if (counter + 10 >= limit) {
            return words.splice(0, wordsToShow).join(' ') + ' ...';
        } else {
            return words.join(' ');
        }

    };
});
