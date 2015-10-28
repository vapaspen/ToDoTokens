'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['ManualDbUpdate', '$scope', 'FetchUsers',   function (ManualDbUpdate, $scope, FetchUsers) {
    $scope.userList = FetchUsers();
    //ManualDbUpdate('z1', 'dinacohfgt2')

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


app.controller('UserAdminCtrl', ['$scope', '$route' ,'$routeParams','FetchAUser', 'FetchAUsersListData', 'UpdateCurrentListTotalTokens', 'ArchivePendingLists', 'UpdateTotalTokens',  function($scope, $route, $routeParams, FetchAUser, FetchAUsersListData, UpdateCurrentListTotalTokens, ArchivePendingLists, UpdateTotalTokens){
    $scope.userID = $routeParams.userID
    $scope.data = FetchAUser($scope.userID);
    FetchAUsersListData($scope, $scope.userID);
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

    $scope.archiveList = function (key) {
        ArchivePendingLists($scope.data, $scope.list, key);

    };

    $scope.tokenUpdate = function (modToTotal) {
        return UpdateTotalTokens($scope.data, modToTotal)
    }

}]);


app.controller('UserAdminTemplateCtrl', ['$scope', 'FetchAllTemplatesLinked', 'AddNewItemToTemplate',  function ($scope, FetchAllTemplatesLinked, AddNewItemToTemplate) {
    FetchAllTemplatesLinked($scope, $scope.userID)

    $scope.getDayName = function (day) {
        var weekday, cleanedDay, foundweekday;

        cleanedDay = Number(day[1]);
        weekday = [];
        weekday[0] =  "Sunday: ";
        weekday[1] = "Monday: ";
        weekday[2] = "Tuesday: ";
        weekday[3] = "Wednesday: ";
        weekday[4] = "Thursday: ";
        weekday[5] = "Friday: ";
        weekday[6] = "Saturday: ";

        foundweekday = weekday[cleanedDay];

        return foundweekday
    }

    $scope.addNewItem = function (templatsKey, value) {
        AddNewItemToTemplate($scope.userID, templatsKey, value)
    };

    $scope.emptyTemplate = {
        isActive:false,
        daysOfTheWeek:{
            w0:false,
            w1:false,
            w2:false,
            w3:false,
            w4:false,
            w5:false,
            w6:false,
        },
        startHour:14,
        startMin:10,
        "items": {
            "nouij5f4":{
                "label":"stub",
                "status":false
            },
        }
    }
}]);