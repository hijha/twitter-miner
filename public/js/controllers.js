'use strict';

var app = angular.module('twitter-miner');

app.controller('InputController', ['$scope', '$http', function($scope, $http) {
    $scope.twitterHandle = "";
    $scope.numOfTweets;
    $scope.topWords = [];
    
    $scope.submit = function() {
        return $http({
            method: 'POST',
            url : '/topWords',
            data : {handle : $scope.twitterHandle, number : $scope.numOfTweets, startDate : $scope.startDate}
        }).then (
        function success(response) {
            $scope.topWords = response.data;
        },
        function error(response) {
            console.log("Error connecting : " + response);
        });
    }
}]);

app.controller('Unfollowers', ['$scope', '$http', function($scope, $http) {
    $scope.twitterHandle = "";
    $scope.unfollowers = [];

    $scope.submit = function() {
        return $http({
            method: 'POST',
            url : '/unfollowed',
            data : {handle : $scope.twitterHandle}
        }).then (
        function success(response) {
            $scope.unfollowers = response.data;
        },
        function error(response) {
            console.log("Error connecting : " + response);
        });
    }
}]);
