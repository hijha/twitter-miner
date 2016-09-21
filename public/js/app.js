var app = angular.module('twitter-miner', []);

app.controller('InputController', ['$scope', '$http', function($scope, $http) {
    $scope.twitterHandle = "";
    $scope.numOfTweets;
    
    $scope.submit = function() {
        $http.post('/', $scope.formData)
            .success(function(data) {
                console.log("print anything");
                console.log(data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            });
    }
}]);
