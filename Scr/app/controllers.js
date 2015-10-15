'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['ManualDbUpdate', '$scope', 'FetchUsers',   function (ManualDbUpdate, $scope, FetchUsers) {
    $scope.userList = FetchUsers();

}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', 'ListUpdateTrigger', '$firebaseObject', 'DBURL', function($scope, $routeParams, FetchAUser, ListUpdateTrigger, $firebaseObject, DBURL){
    var currentListRef, currentListURL, syncObject;

    currentListURL = DBURL + 'lists/' + $routeParams.userID + '/current';
    currentListRef = new Firebase(currentListURL);
    syncObject = $firebaseObject(currentListRef);
    syncObject.$bindTo($scope, "userList")

    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';
    $scope.listStatusAndStorage = ListUpdateTrigger($routeParams.userID, $scope.listStatusAndStorage);

}]);