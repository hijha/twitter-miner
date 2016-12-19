'use strict';

var app = angular.module('twitter-miner', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('topWords', {
            url : '/topWords',
            templateUrl : 'views/topWords.html',
            controller : 'InputController'
        })

        .state('unfollowed', {
            url : '/unfollowed',
            templateUrl : 'views/unfollowed.html',
            controller : 'Unfollowers'
        })
    $urlRouterProvider.otherwise('/topWords');
}]);
