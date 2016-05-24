angular.module("MainApp")
.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 0 15px 0 !important; padding:0 !important" >' + contents + '</div>');
            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '.3s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})
.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            var myElements = document.querySelectorAll(".slideable");
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if (element.hasClass('active')) {
                    element.parent().find("a").removeClass("active");
                    for (var i = 0; i < myElements.length; i++) {
                        myElements[i].style.height = '0';
                    }
                } else {
                    element.parent().find("a").removeClass("active");
                    var y = content.clientHeight;
                    for (var i = 0; i < myElements.length; i++) {
                        myElements[i].style.height = '0';
                    }
                    target.style.height = y + 15 + 'px';
                    element.addClass('active');
                }
            });
        }
    };
});
