'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['ManualDbUpdate', '$scope', 'FetchUsers',   function (ManualDbUpdate, $scope, FetchUsers) {
    $scope.userList = FetchUsers();
    //ManualDbUpdate('z1', 'dibaco39g02')

}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', 'ListUpdateTrigger', 'FetchList', function($scope, $routeParams, FetchAUser, ListUpdateTrigger, FetchList){

    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';
    ListUpdateTrigger($routeParams.userID, $scope.listStatusAndStorage);
    FetchList($scope, $routeParams.userID);

}]);

//admin Home Controller
app.controller('AdminHomeCtrl', ['$scope', 'FetchUsers', function ($scope, FetchUsers) {
    $scope.userList = FetchUsers();
}]);