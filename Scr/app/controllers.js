'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['ManualDbUpdate', '$scope', 'FetchUsers',   function (ManualDbUpdate, $scope, FetchUsers) {
    $scope.userList = FetchUsers();
    //ManualDbUpdate('z1', 'dibaco39g02')

}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', 'ListUpdateTrigger', 'FetchCurrentList', function($scope, $routeParams, FetchAUser, ListUpdateTrigger, FetchCurrentList){

    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';
    ListUpdateTrigger($routeParams.userID, $scope.listStatusAndStorage);
    FetchCurrentList($scope, $routeParams.userID);

}]);

//admin Home Controller
app.controller('AdminHomeCtrl', ['$scope', 'FetchUsers', function ($scope, FetchUsers) {
    $scope.userList = FetchUsers();
}]);


app.controller('UserAdminCtrl', ['$scope','$routeParams','FetchAUser', 'FetchAUsersListData', 'UpdateCurrentListTotalTokens',  function($scope, $routeParams, FetchAUser, FetchAUsersListData, UpdateCurrentListTotalTokens){

    $scope.data = FetchAUser($routeParams.userID);
    FetchAUsersListData($scope, $routeParams.userID);
    $scope.newTotal = {};

    $scope.localTime = function (utcTime) {
        var dateTime, displayString;

        dateTime = new Date(utcTime);

        displayString = dateTime.getDate() + '/' + dateTime.getMonth() + '/' + dateTime.getFullYear() + '  at: ' + dateTime.getHours() + ':' + dateTime.getMinutes();

        return displayString
    }


    $scope.updateTotal = function (list, testValue, isNotInit ) {

        UpdateCurrentListTotalTokens(list, testValue, isNotInit);
        UpdateCurrentListTotalTokens($scope.newTotal, testValue, isNotInit);

    }


}]);