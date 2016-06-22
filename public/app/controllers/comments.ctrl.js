angular.module("MainApp")
.controller('CommentsCtrl', ['$scope', '$sce', 'factory', function ($scope, $sce, factory) {

    $scope.commentsLength = function() {
        if ($scope.comments) {
            var commentsNumber = 0;
            for (var i = 0; i < $scope.comments.length; i++) {
                commentsNumber += 1;
                for (var j = 0; j < $scope.comments[i].responses.length; j++) {
                    commentsNumber += 1;
                }
            }
            return commentsNumber;
        }
    };

    $scope.allowInput = function(parentIndex,index) {
        for (var i = 0; i < $scope.comments.length; i++) {
            $scope.comments[i].inputAllowed = false;
            for (var j = 0; j < $scope.comments[i].responses.length; j++) {
                $scope.comments[i].responses[j].inputAllowed = false;
            }
        }
        if (parentIndex !== undefined && index === undefined) {
            $scope.comments[parentIndex].inputAllowed = true;
        } else if (parentIndex !== undefined && index !== undefined) {
            $scope.comments[parentIndex].responses[index].inputAllowed = true;
        }
    };

    $scope.isInputAllowed = function(parentIndex,index) {
        if (parentIndex !== undefined && index === undefined) {
            return $scope.comments[parentIndex].inputAllowed;
        } else if (parentIndex !== undefined && index !== undefined) {
            return $scope.comments[parentIndex].responses[index].inputAllowed;
        }
    };

    $scope.addComment = function(text,commentIndex,responseIndex) {
        if (text) {
            var now = $scope.getDate(new Date().toLocaleString());
            var comment = {
                "user": $scope.currentUser.name,
                "text": text,
                "link": "#",
                "img": $scope.currentUser.avatar,
                "date": now,
                "likes": 0,
                "responses": []
            };
            if (responseIndex !== undefined) {
                comment.text = $scope.comments[commentIndex].responses[responseIndex].user + ', ' + comment.text;
                $scope.comments[commentIndex].responses.splice(responseIndex+1,0,comment);
                // $scope.comments[commentIndex].responses.unshift(comment);
            } else if (commentIndex !== undefined) {
                $scope.comments[commentIndex].responses.unshift(comment);
            } else {
                $scope.comments.unshift(comment);
            }
        }
    };

}]);
