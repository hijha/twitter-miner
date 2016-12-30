'use strict';

var app = angular.module('twitter-miner');

app.controller('InputController', ['$scope', '$http', function($scope, $http) {
    $scope.twitterHandle = "";
    $scope.numOfWords;
    $scope.thresholdDate;
    $scope.topWords = [];
    
    $scope.submit = function() {
        return $http({
            method: 'POST',
            url : '/topWords',
            data : {handle : $scope.twitterHandle, number : $scope.numOfWords, date : $scope.thresholdDate}
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
    $scope.updateMessage = "";

    $scope.submit = function() {
        return $http({
            method: 'POST',
            url : '/unfollowed',
            data : {handle : $scope.twitterHandle}
        }).then (
        function success(response) {
            $scope.unfollowers = response.data.unfollowers;
            if ($scope.unfollowers.length == 0) {
                if (response.data.firstLogin)
                    $scope.updateMessage = "First login"
                else
                    $scope.updateMessage = "No unfollowers"
            } else {
                $scope.updateMessage = ""
            }
        },
        function error(response) {
            console.log("Error connecting : " + response);
        });
    }
}]);
