angular.module("MainApp")
.directive('modal', function($timeout) {
  return {
    restrict: 'E',
    transclude: {
        'title': 'modalTitle',
        'body': 'modalBody',
        'footer': 'modalFooter'
    },
    scope: {
        showModal: '=show'
    },
    templateUrl: 'app/views/common/modal.html',
    link: function(scope, element, attrs) {

    }
  };
});
