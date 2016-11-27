'use strict';

var app = angular.module('twitter-miner', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/topWords', {
            templateUrl : 'topWords.html',
            controller : 'InputController'
        })

        .when('/unfollowed', {
            template : '<p>hello </p>',
        })

        .otherwise('/followers');
});
