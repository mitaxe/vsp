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

// humanize date
app.filter('prettyDate', function() {
    return function(time,toDay) {
        var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400),
            years_diff = Math.floor(diff / 31536000);

        if ( isNaN(day_diff) || day_diff < 0 ) {
            return;
        }

        if (toDay && day_diff < 1) {
            return "Сегодня";
        } else {
            return day_diff === 0 && (
                    diff < 60 && "Только что" ||
                    diff < 120 && "1 минуту назад" ||
                    diff < 3600 && Math.floor( diff / 60 ) + " минут назад" ||
                    diff < 7200 && "1 час назад" ||
                    diff < 86400 && Math.floor( diff / 3600 ) + " часов назад") ||
                day_diff < 1 && today && "Сегодня" ||
                day_diff == 1 && "Вчера" ||
                day_diff < 7 && day_diff + " дней назад" ||
                day_diff < 31 && Math.ceil( day_diff / 7 ) + " недель назад" ||
              years_diff < 1 && Math.ceil( day_diff / 30 ) + " месяц назад" ||
              years_diff == 1 && years_diff + " год назад" ||
              years_diff > 1 && years_diff + " лет назад" ||
              'неизвестная дата';
        }
    };
});

// format time in seconds
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

// trim text filter
app.filter('trimText', function () {
    return function (text, length, backwards) {
        if (text === null) {
            return '';
        } else if (backwards) {
            return '...' + text.slice(length);
        } else if (text.length > length) {
            return text.slice(0, length) + "...";
        }
        return text;
    };
});
