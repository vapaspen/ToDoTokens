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
    return function (user, archivedlists, pendinglists, key) {
        var totalTokensURL, totalTokensRef, newTotalTokens, list;

        list = pendinglists[key]

        list.Accepted = true;

        newTotalTokens = user.tokens + list.listtokens;

        totalTokensURL = DBURL + 'users/' + user.ID + '/tokens';


        totalTokensRef = new Firebase(totalTokensURL);
        totalTokensRef.set(newTotalTokens);

        archivedlists[key] = list;
        pendinglists[key] = {}

    };
}]);