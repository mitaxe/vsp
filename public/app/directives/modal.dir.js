angular.module("MainApp")
.directive('modal', function($timeout) {
  return {
    restrict: 'E',
    transclude: true,
    // {
    //     'title': 'modalTitle',
    //     'body': 'modalBody',
    //     'footer': 'modalFooter'
    // },
    scope: {
        showModal: '=show',
        sandwichCliked: '=position'
    },
    templateUrl: 'app/views/common/modal.html',
    link: function(scope, element, attrs) {

    }
  };
});
