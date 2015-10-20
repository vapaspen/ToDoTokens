'use strict';

//main App initializer
var app = angular.module('app',['ngAria','ngRoute', 'ngAnimate','ngSanitize','mgcrea.ngStrap', 'UserDataServices', 'AdminDataServices'])
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
            templateUrl : 'templates/admin/admindefault.html',
            controller : 'AdminHomeCtrl'
        })
        .when('/useradmin/:userID', {
            templateUrl : 'templates/admin/useradmin.html',
            controller : 'UserAdminCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

