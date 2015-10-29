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

AdminDataServices.factory('ArchivePendingLists', ['DBURL', 'UpdateTotalTokens', function (DBURL, UpdateTotalTokens) {
    return function (user, lists, key) {
        var list, archivedlists, pendinglists;

        pendinglists = lists.pendinglists
        archivedlists = lists.archivedlists;

        list = pendinglists[key];
        list.Accepted = true;

        UpdateTotalTokens(user, list.listtokens)

        archivedlists[key] = list;
        pendinglists[key] = null;
    };
}]);

AdminDataServices.factory('UpdateTotalTokens', ['DBURL', function (DBURL) {
    return function (user, modToTotal) {
        var totalTokensURL, totalTokensRef, newTotalTokens;

        newTotalTokens = user.tokens + modToTotal;

        totalTokensURL = DBURL + 'users/' + user.ID + '/tokens';

        if (newTotalTokens < 0) {
            alert('Cant not set tokens to less then 0.');
            return modToTotal;
        }
        totalTokensRef = new Firebase(totalTokensURL);
        totalTokensRef.set(newTotalTokens);
        return 0;
    };
}]);

AdminDataServices.factory('FetchAllTemplatesLinked', ['DBURL', '$firebaseObject', function (DBURL, $firebaseObject) {
    return function (scope, userID) {
        var templatesURL, templatesRef, syncObject;

        templatesURL = DBURL + 'lists/' + userID + '/listtemplats';

        templatesRef = new Firebase(templatesURL);
        scope.templatesRef = templatesRef;
        syncObject = $firebaseObject(templatesRef);
        syncObject.$bindTo(scope, "ListTemplats");
    };
}]);


AdminDataServices.factory('AddNewItemToTemplate', ['DBURL', function (DBURL) {
    return function (userID, templatsKey, value) {
        var templatesItemsURL, templatesItemsRef, item;

        if (!value) {
            alert('Please enter an item name');
            return
        }
        item = {
            "label":value,
            "status":false
        }
        templatesItemsURL = DBURL + 'lists/' + userID + '/listtemplats/' + templatsKey + '/items';
        templatesItemsRef = new Firebase(templatesItemsURL);

        templatesItemsRef.push(item);


    };
}]);