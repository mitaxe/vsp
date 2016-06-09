angular.module("MainApp")
.factory('prettyDate', function($http) {

    return function(time,toDay) {
        var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400),
            years_diff = Math.floor(diff / 31536000);

        if ( isNaN(day_diff) || day_diff < 0 )
            return;

        if (toDay && day_diff < 1) {
            return "Сегодня";
        } else {
            return day_diff == 0 && (
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
