'use strict';

var UserDataServices = angular.module('UserDataServices', ['firebase']);

UserDataServices.constant('DBURL', 'https://todotokens.firebaseio.com/');

UserDataServices.factory('UpdateCurrentListTotalTokens', [function () {
    return function (bindObj, testValue, isNotInit) {
        if (!bindObj.listtokens) {
            bindObj.listtokens = 0;
        }
        if (testValue) {
            bindObj.listtokens += 1
        } else {
            if (isNotInit) {
                bindObj.listtokens -= 1
            }
        }
    };
}]);

UserDataServices.factory('FetchUsers', ['DBURL', '$firebaseObject', function (DBURL, $firebaseObject) {
    return function () {
        var userRef = DBURL + 'users';
        var fireRef = new Firebase(userRef);
        return $firebaseObject(fireRef);
    };
}]);


UserDataServices.factory('FetchAUser', ['DBURL', '$firebaseObject', function (DBURL, $firebaseObject) {
    return function (ID) {
        var userRef = DBURL + 'users/' + ID;
        var fireRef = new Firebase(userRef);
        return $firebaseObject(fireRef);
    };
}]);

UserDataServices.factory('FetchCurrentList', ['DBURL', '$firebaseObject', function (DBURL, $firebaseObject) {
    return function (scope, userID) {
        var currentListRef, currentListURL, syncObject;

        currentListURL = DBURL + 'lists/' + userID + '/current';
        currentListRef = new Firebase(currentListURL);
        syncObject = $firebaseObject(currentListRef);
        syncObject.$bindTo(scope, "userList");
    };
}]);

UserDataServices.factory('ListUpdateTrigger', ['IsListCurrent', 'FetchListTemplates', '$timeout', function (IsListCurrent, FetchListTemplates, $timeout) {
    return function (userID, listStatusAndStorage) {
        var local;

        local = {};

        local.startUpdate = function () {
            listStatusAndStorage = {
                db:{
                    current:{},
                    isUpToDate:true
                }
            };

            IsListCurrent(userID, listStatusAndStorage);
            FetchListTemplates(userID, listStatusAndStorage);
            local.triggerNext();
            return listStatusAndStorage
        };


        local.triggerNext = function () {
            $timeout(function (userID, listStatusAndStorage) {
            local.startUpdate();
            }, 10000);
        };

        return local.startUpdate();
    };
}]);

//function to Check if Current List in Data base is current.
UserDataServices.factory('IsListCurrent', ['DBURL', 'FindMostRecentTemplate', function (DBURL, FindMostRecentTemplate) {
    return function (userID, listStatusAndStorage) {
        var listURL = DBURL + 'lists/' + userID + '/current';

        listStatusAndStorage.IsListCurrentDone = false;

        var listRef = new Firebase(listURL);

        //make a Reference so we can detach it later
        return listStatusAndStorage.IsListCurrent = listRef.once('value', function (snap) {
            listStatusAndStorage.db.current = snap.val();

            if (snap.val() !== undefined && snap.val() !== null) {
                var timeDif = new Date().getTime() - snap.val().createdOn;
                if (timeDif < 86400000) {
                    listStatusAndStorage.db.isUpToDate = true;
                } else {
                    listStatusAndStorage.db.isUpToDate = false;
                }
            } else {
                listStatusAndStorage.db.isUpToDate = false;
            }
            listStatusAndStorage.IsListCurrentDone = true;
            listStatusAndStorage.userID = userID;

            //move to next step
            FindMostRecentTemplate(userID, listStatusAndStorage);
        });
    };
}]);

UserDataServices.factory('FetchListTemplates', ['DBURL', 'FindMostRecentTemplate', function (DBURL, FindMostRecentTemplate) {
    return function (userID, listStatusAndStorage) {
        var listTemplatsURL, listTemplatsRef;

        listStatusAndStorage.FetchListTemplatesDone = false;
        listTemplatsURL = DBURL + 'lists/' + userID + '/listtemplats';

        listTemplatsRef = new Firebase(listTemplatsURL);

        listTemplatsRef.orderByChild('isActive').equalTo(true).once('value', function (snap) {
            if (!snap.val()) {
                listStatusAndStorage.db.listTemplats = {};
                listStatusAndStorage.db.listTemplats.message = 'No active Templates found.';
            } else {
                listStatusAndStorage.db.listTemplats = snap.val()
            }

            //move to next step.
            listStatusAndStorage.FetchListTemplatesDone = true;
            FindMostRecentTemplate(userID ,listStatusAndStorage);
        });
    };
}]);

UserDataServices.factory('FindMostRecentTemplate', ['UpDateAndArchiveCurrent', function (UpDateAndArchiveCurrent) {
    return function (userID, listStatusAndStorage) {
        if (!listStatusAndStorage.FetchListTemplatesDone || !listStatusAndStorage.IsListCurrentDone) {
            return 'pass: FetchListTemplatesDone: ' + listStatusAndStorage.FetchListTemplatesDone + ' IsListCurrentDone: ' + listStatusAndStorage.IsListCurrentDone;
        }

        var now, today, currentHour, minHour, iterator, found;

        if (listStatusAndStorage.db.listTemplats.message !== 'No active Templates found.') {
            now = new Date();
            today = 'w' + now.getDay();

            currentHour = now.getHours();

            minHour = currentHour - 11;

            if(minHour < 0 ){
                minHour = 0;
            }

            listStatusAndStorage.newList = {};

            for (var key in listStatusAndStorage.db.listTemplats) {
                iterator = listStatusAndStorage.db.listTemplats[key];
                if (iterator.daysOfTheWeek[today] === true) {
                    if (iterator.startHour <= currentHour && iterator.startHour >= minHour) {
                        if (!found) {

                            found = iterator;
                            found.ID = key;
                        } else {
                            if (iterator.startHour > found.startHour) {
                                found = iterator;
                                found.ID = key;
                            } else {
                                if (iterator.startHour === found.startHour && iterator.startMin > found.startMin) {
                                    found = iterator;
                                    found.ID = key;
                                }
                            }
                        }
                    }
                }
            }
            listStatusAndStorage.newList = found;

            if (!listStatusAndStorage.newList) {
                listStatusAndStorage.db.listTemplats.message = 'No active Templates found.';
                listStatusAndStorage.newList = {
                    "ID":"empty"
                }
            }
        }

        //move to next step.
        UpDateAndArchiveCurrent(userID, listStatusAndStorage);
    };
}]);

UserDataServices.factory('UpDateAndArchiveCurrent', ['DBURL', function (DBURL) {
    return function (userID, listStatusAndStorage) {
        var processUpdate, archiveURL, archiveRef, currentURL, currentRef;
        processUpdate = false;
        if (!listStatusAndStorage.db.isUpToDate || listStatusAndStorage.db.current.ID !== listStatusAndStorage.newList.ID) {
            processUpdate = true;
        }


        if (processUpdate) {
            if (listStatusAndStorage.db.current.ID !== 'empty') {
                archiveURL = DBURL + 'lists/' + userID + '/pendinglists/';
                archiveRef = new Firebase(archiveURL);
                archiveRef.push(listStatusAndStorage.db.current);
            }

            currentURL = DBURL + 'lists/' + userID + '/current';
            currentRef = new Firebase(currentURL);
            listStatusAndStorage.newList.createdOn = new Date().getTime()
            currentRef.set(listStatusAndStorage.newList)

        }
    };
}]);

//Local Function used to send updates to the DB as its being Made.
UserDataServices.factory('ManualDbUpdate', ['DBURL', function (DBURL) {
    return function(userID, templateID){
        if(!userID){
            alert("ManualDbUpdate not given an ID");
            return false;
        }

        var atime = new Date();
        var pastTime = new Date(2015, 8, 26, 18, 30);
        var now = atime.getTime();

        var listTemplatsURL = DBURL + '/lists/' + userID + '/listtemplats/' + templateID;

        var listRef = new Firebase(listTemplatsURL);
        listRef.set({
            "items": {
                "nouij5f4":{
                    "label":"Eat Breakfeast",
                    "status":false
                },
                "abgouh":{
                    "label":"Get Dressed",
                    "status":false
                }
            },
            isActive:true,
            daysOfTheWeek:{
                w0:true,
                w1:true,
                w2:true,
                w3:true,
                w4:true,
                w5:true,
                w6:true,
            },
            startHour:14,
            startMin:10

        });
    }
}]);



/*


    "dibaco39g02":{
                    createdOn: now,
                    "items": {
                        "nouij5f4":{
                            "label":"Eat Breakfeast",
                            "status":false
                        },
                        "abgouh":{
                            "label":"Get Dressed",
                            "status":false
                        }
                    },
                    isActive:true,
                    daysOfTheWeek:{
                        w0:true,
                        w1:true,
                        w2:true,
                        w3:true,
                        w4:true,
                        w5:true,
                        w6:true,
                    },
                    startHour:14,
                    startMin:10
                }

*/