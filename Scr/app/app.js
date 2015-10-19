'use strict';

//main App initializer
var app = angular.module('app',['ngAria','ngRoute', 'ngAnimate','ngSanitize','mgcrea.ngStrap', 'UserDataServices'])
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
        .when('/admin', {
            templateUrl : 'templates/admindefault.html',
            controller : 'AdminHomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

