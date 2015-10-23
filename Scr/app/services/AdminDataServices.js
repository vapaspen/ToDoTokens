'use strict';

var AdminDataServices = angular.module('AdminDataServices', ['firebase', 'UserDataServices']);

AdminDataServices.factory('FetchAUsersListData', ['DBURL', '$firebaseObject', function (DBURL, $firebaseObject) {
    return function (scope, userID) {
        var listURL, listRef, syncObject;

        listURL = DBURL + 'lists/' + userID;

        listRef = new Firebase(listURL);

        syncObject = $firebaseObject(listRef);
        syncObject.$bindTo(scope, "list");
    };
}]);

AdminDataServices.factory('ArchivePendingLists', ['DBURL', function (DBURL) {
    return function (userID, list) {

    };
}]);