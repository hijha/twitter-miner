var app = angular.module('twitter-miner', []);

app.controller('InputController', ['$scope', '$http', function($scope, $http) {
    $scope.twitterHandle = "";
    $scope.numOfTweets;
    
    $scope.submit = function() {
        $scope.numOfTweets = 100;
        return $http({
            method: 'POST',
            url : '/'
        }).then (
        function success(response) {
            console.log("testing 1");
            console.log(response);
        },
        function error(response) {
            console.log("testing 2");
        });
    }
}]);
