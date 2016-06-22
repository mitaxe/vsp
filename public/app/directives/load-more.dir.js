app.directive('loadMore', function ($document) {
    return {
        restrict: 'E',
        scope: {
            parameters: '=params'
        },
        template: '<a class="btn btn-more">' + '{{ getButtonText() }} ' + '</a>',
        link: function (scope, element) {

            function loadMore(request,array,offset,id) {
                scope.offset = scope.offset || 0;

                if (!scope.noMoreResponse) {
                    scope.loadingMore = true;
                    scope.offset += offset;
                    var params = id ? [id, scope.offset].join() : scope.offset;

                    request(params).success(function(response) {
                        scope.loadingMore = false;
                        if (response.data !== null) {
                            array.push.apply(array, response.data);
                        } else {
                            scope.noMoreResponse = true;
                        }
                    });
                }
            }

            scope.getButtonText = function() {
                var text;
                if (scope.loadingMore && !scope.noMoreResponse) {
                    text = "идет загрузка...";
                } else if (!scope.loadingMore && !scope.noMoreResponse) {
                    text = "загрузить еще";
                } else {
                    text = "все данные загружены";
                }
                return text;
            };

            element.on("click", function(evt) {
                loadMore.apply(this, scope.parameters);
            });

        }
    };
});
