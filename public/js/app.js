var app = angular.module('twitter-miner', []);

app.controller('InputController', ['$scope', '$http', function($scope, $http) {
    $scope.twitterHandle = "";
    $scope.numOfTweets;
    
    $scope.submit = function() {
        return $http({
            method: 'POST',
            url : '/',
            data : {handle : $scope.twitterHandle, number : $scope.numOfTweets}
        }).then (
        function success(response) {
            console.log(response.data);
        },
        function error(response) {
            console.log("Error connecting : " + response);
        });
    }
}]);
