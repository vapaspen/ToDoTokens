'use strict';

//main App initializer
var app = angular.module('app',['ngAria','ngRoute', 'ngAnimate','ngSanitize','mgcrea.ngStrap', 'firebase'])
    .config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'templates/default.html',
            controller : 'HomeCtrl'
        })
        .when('/list/:userID', {
            templateUrl : 'templates/activeList.html',
            controller : 'ListCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

.value('DBURL','https://todotokens.firebaseio.com/')

.value('userList', []);