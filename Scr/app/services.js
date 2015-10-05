'use strict';

var UserDataServices = angular.module('UserDataServices', ['firebase']);

UserDataServices.constant('DBURL', 'https://todotokens.firebaseio.com/');

UserDataServices.factory('FetchUsers', ['DBURL', '$firebaseArray', function (DBURL, $firebaseArray) {
    return function () {
        var userRef = DBURL + 'users';
        var fireRef = new Firebase(userRef);
        return $firebaseArray(fireRef);
    };
}]);


UserDataServices.factory('FetchAUser', ['DBURL', '$firebaseObject', function (DBURL, $firebaseObject) {
    return function (ID) {
        var userRef = DBURL + 'users';
        var fireRef = new Firebase(userRef).orderByChild("ID").equalTo(ID).limitToFirst(1);
        return $firebaseObject(fireRef);
    };
}]);


UserDataServices.factory('ListUpdateTrigger', ['IsListCurrent', 'FetchCurrentListTemplates', function (IsListCurrent, FetchCurrentListTemplates) {
    return function (userID, listStatusAndStorage) {
        listStatusAndStorage = {
            'db':{
                "current":{},
                "isUpToDate":true
            }
        };

        IsListCurrent(userID, listStatusAndStorage);
        FetchCurrentListTemplates(userID, listStatusAndStorage);
        return listStatusAndStorage
    };
}]);

//function to Check if Current List in Data base is current.
UserDataServices.factory('IsListCurrent', ['DBURL', 'ListUpdateRouter', function (DBURL, ListUpdateRouter) {
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
            ListUpdateRouter(listStatusAndStorage);
        });
    };
}]);


UserDataServices.factory('FetchCurrentListTemplates', ['DBURL', 'ListUpdateRouter', function (DBURL, ListUpdateRouter) {
    return function (userID, listStatusAndStorage) {
        var listTemplatsURL, listTemplatsRef, now, today, error;

        listStatusAndStorage.FetchCurrentListTemplatesDone = false;

        now = new Date();
        today = 'w' + now.getDay();
        listStatusAndStorage.listTemplats = [];

        listTemplatsURL = DBURL + 'lists/' + userID + '/listtemplats';

        listTemplatsRef = new Firebase(listTemplatsURL);

        listTemplatsRef.orderByChild('isActive').equalTo(true).once('value', function (snap) {

            var key, iterator, floorMin, foundList;
            listStatusAndStorage.listTemplats.error = {};
            //if nothing was active return error
            if (!snap.val()) {
                alert('No Active List Templates found for user: ' + userID)
                listStatusAndStorage.listTemplats.error.message = 'No Active List Templates found for user: ' + userID;
            } else {

                floorMin = Math.floor(now.getMinutes() / 10) * 10;

                for (key in snap.val()) {
                    iterator = snap.val()[key];
                    if (iterator.daysOfTheWeek[today] === true) {
                        if (iterator.startHour === now.getHours()) {
                            if (floorMin === iterator.startMin) {
                                foundList = iterator;
                                foundList.ID = key;
                                listStatusAndStorage.listTemplats.push(foundList);
                            } else {

                                listStatusAndStorage.listTemplats.message = 'Failed at Minuets.';
                            }

                        } else {
                            listStatusAndStorage.listTemplats.message = 'Failed at Hours.';
                        }
                    } else {
                       listStatusAndStorage.listTemplats.message = 'Failed at DayOftheWeek.';
                    }
                }
                listStatusAndStorage.FetchCurrentListTemplatesDone = true;
                listStatusAndStorage.userID = userID;
                ListUpdateRouter(listStatusAndStorage);
            }
        });
    };
}]);

//takes a listStatusAndStorage Object. Assumes the listTemplats is undefined until it is done Processing
UserDataServices.factory('ListUpdateRouter', ['updateCurrentList', 'FindNewCurrentListFromRecent', function (updateCurrentList, FindNewCurrentListFromRecent) {
    return function (listStatusAndStorage) {

        if (listStatusAndStorage.FetchCurrentListTemplatesDone) {
            if (listStatusAndStorage.IsListCurrentDone) {
                if (listStatusAndStorage.db.current !== null && listStatusAndStorage.db.current !== {}) {
                    if (listStatusAndStorage.db.isUpToDate === true) {
                        if (listStatusAndStorage.listTemplats.length > 0) {
                            for (var i = 0; i < listStatusAndStorage.listTemplats.length; i++) {
                                if (listStatusAndStorage.listTemplats[i].ID == listStatusAndStorage.db.current.ID) {

                                    return 'Database list is current';
                                }
                            }
                        }
                    }

            }
                //alert(statusTest)
            if (listStatusAndStorage.listTemplats.length > 0) {
                updateCurrentList(listStatusAndStorage);
                return 'updateCurrentList >> isUpToDate:' + listStatusAndStorage.db.isUpToDate;
            }

            FindNewCurrentListFromRecent(listStatusAndStorage);
            return 'FindNewCurrentListFromRecent >> isUpToDate:' + listStatusAndStorage.db.isUpToDate;
            }
            return 'listStatusAndStorage.IsListCurrentDone: ' + listStatusAndStorage.IsListCurrentDone;
        }
        return 'listStatusAndStorage.FetchCurrentListTemplatesDone: ' + listStatusAndStorage.FetchCurrentListTemplatesDone;
    };
}]);


UserDataServices.factory('updateCurrentList', ['DBURL', function (DBURL) {
    return function (listStatusAndStorage) {
        //stub to prove this was called
        alert('updateCurrentList \n\n listStatusAndStorage.IsListCurrentDone: ' + listStatusAndStorage.IsListCurrentDone +'\n\n listStatusAndStorage.FetchCurrentListTemplatesDone: ' + listStatusAndStorage.FetchCurrentListTemplatesDone);
        return listStatusAndStorage.updateCurrentList = 'I was called';
    };
}]);

UserDataServices.factory('FindNewCurrentListFromRecent', ['DBURL', function(DBURL){
    return function (listStatusAndStorage) {
        var newCurrentListURL, newCurrentListRef, templatesURL, templatesRef, foundTemplate, userID;

        userID = listStatusAndStorage.userID

        templatesURL = DBURL + 'lists/' + userID + '/listtemplats';
        newCurrentListURL = DBURL + 'lists/' + userID + '/current';

        templatesRef = new Firebase(templatesURL);
        newCurrentListRef = new Firebase(newCurrentListURL);

        templatesRef.orderByChild('isActive').equalTo(true).once('value', function (snap) {
            var key, iterator, floorMin, foundList, currentHour, minHour, now, today;
            listStatusAndStorage.listTemplats.error = {};
            //if nothing was active return error
            if (!snap.val()) {
                alert('No Active List Templates found for user: ' + userID)
                listStatusAndStorage.listTemplats.error.message = 'No Active List Templates found for user: ' + userID;
                return
            }


                now = new Date();
                today = 'w' + now.getDay();

                currentHour = now.getHours();

                minHour = currentHour - 12;

                if(minHour < 0 ){
                    minHour = 0;
                }


                for (key in snap.val()) {
                    iterator = snap.val()[key];
                    if (iterator.daysOfTheWeek[today] === true) {
                        if (iterator.startHour <= currentHour && iterator.startHour >= minHour) {
                            if (!foundList) {
                                listStatusAndStorage.listTemplats.message = 'Found first with key: ' + key;
                                foundList = iterator;
                                foundList.ID = key;
                            } else {

                                if (iterator.startHour === foundList.startHour) {
                                    if (iterator.startMin > foundList.startMin) {
                                        listStatusAndStorage.listTemplats.message = 'Found Next by minutes: key: ' + key;
                                        foundList = iterator;
                                        foundList.ID = key;
                                    } else {
                                        listStatusAndStorage.listTemplats.message = 'Passed at greater then mins at key: ' + key;
                                    }

                                } else {
                                    if (iterator.startHour > foundList.startHour) {
                                        listStatusAndStorage.listTemplats.message = 'Found Next by hours: key: ' + key;
                                        foundList = iterator;
                                        foundList.ID = key;
                                    } else {
                                        listStatusAndStorage.listTemplats.message = 'Passed at greater then Hours at key: ' + key;
                                    }
                                }
                            }
                        } else {
                            listStatusAndStorage.listTemplats.message = 'Passed at Hours check.';
                        }
                    } else {
                       listStatusAndStorage.listTemplats.message = 'Failed at DayOftheWeek.';
                       listStatusAndStorage.listTemplats.error.message = 'No Templates found for user: ' + userID + ' for Today.';
                       //alert('No Templates found for user: ' + userID + ' for Today.');
                    }
                }

        });

        //stub to prove this was called
        alert('FindNewCurrentListFromRecent \n\n listStatusAndStorage.IsListCurrentDone: '
        + listStatusAndStorage.IsListCurrentDone +'\n\n listStatusAndStorage.FetchCurrentListTemplatesDone: ' + listStatusAndStorage.FetchCurrentListTemplatesDone);
        return listStatusAndStorage.FindNewCurrentListFromRecent = 'I was called';
    };
}]);



//Local Function used to send updates to the DB as its being Made.
UserDataServices.factory('ManualDbUpdate', ['DBURL', function (DBURL) {
    return function(userID){
        if(!userID){
            alert("ManualDbUpdate not given an ID");
            return false;
        }

        var atime = new Date();
        var pastTime = new Date(2015, 8, 26, 18, 30);
        var now = atime.getTime();

        var listTemplatsURL = DBURL + '/lists/' + userID;

        var listRef = new Firebase(listTemplatsURL);
        listRef.set({
                current:{
                    ID:"n934tbg1d",
                    createdOn: 1443123299604,
                    isActive:true,
                    daysOfTheWeek:{
                        w0:false,
                        w1:true,
                        w2:true,
                        w3:true,
                        w4:true,
                        w5:true,
                        w6:false
                    },
                    startHour:13,
                    startMin:40
                },
                listtemplats:{
                    "n934tbg1d":{
                        createdOn: 1443123299604,
                        isActive:true,
                        daysOfTheWeek:{
                            w0:false,
                            w1:true,
                            w2:true,
                            w3:true,
                            w4:true,
                            w5:true,
                            w6:false
                        },
                        startHour:4,
                        startMin:10
                    },

                    "dibaco39g02":{
                        createdOn: now,
                        isActive:true,
                        daysOfTheWeek:{
                            w0:false,
                            w1:true,
                            w2:true,
                            w3:true,
                            w4:true,
                            w5:true,
                            w6:false
                        },
                        startHour:4,
                        startMin:10
                    }
                }
        });
    }
}]);



/*

    "n934tbg1d":{
                    createdOn: 1443123299604,
                    isActive:true,
                    daysOfTheWeek:{
                        0:false,
                        1:true,
                        3:true,
                        4:true,
                        5:true,
                        6:true,
                        7:false
                    },
                    startHour:4,
                    startMin:10
                },

    "dibaco39g02":{
                    createdOn: now,
                    isActive:false,
                    daysOfTheWeek:{
                        0:false,
                        1:true,
                        3:true,
                        4:true,
                        5:true,
                        6:true,
                        7:false
                    },
                    startHour:4,
                    startMin:10
                }

*/