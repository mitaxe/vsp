app.directive('popoverTrigger', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            $document.on("click", function() {
                if (scope.userActive || scope.notificationActive) {
                    scope.$apply(function () {
                        scope.userActive = false;
                        scope.notificationActive = false;
                    });
                }
            });

            element.on("click", function (evt) {
                if (!scope.userActive || !scope.notificationActive) {
                    evt.stopPropagation();
                }
            });

        }
    };
});
