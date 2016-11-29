'use strict';

var app = angular.module('twitter-miner', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('topWords', {
            url : '/topWords',
            templateUrl : 'topWords.html',
            controller : 'InputController'
        })

        .state('unfollowed', {
            url : '/unfollowed',
            templateUrl : 'unfollowed.html'
        })
    $urlRouterProvider.otherwise('/topWords');
}]);
