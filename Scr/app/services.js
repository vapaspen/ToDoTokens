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

//function to Check if Current List in Data base is current.
UserDataServices.factory('IsListCurrent', ['DBURL', function (DBURL) {
    return function (userID, listStatusAndStorage) {
        var listURL = DBURL + 'lists/' + userID + '/current';

        var listRef = new Firebase(listURL);

        //make a Reference so we can detach it later
        listStatusAndStorage.IsListCurrent = listRef.once('value', function (snap) {
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
        });
    };
}]);


UserDataServices.factory('FetchNewCurrent', ['DBURL', function (DBURL) {
    return function (userID, listStatusAndStorage){
        var listTemplatsURL, listTemplatsByDate, listTemplatsDefault, now;

        now = new Date();

        listStatusAndStorage.listTemplatsByDate = []

        listTemplatsURL = DBURL + '/lists/' + userID + '/listtemplats';

        listTemplatsByDate = new Firebase(listTemplatsURL + "/dated");
        listTemplatsDefault = new Firebase(listTemplatsURL + "/defaults");

        listTemplatsByDate.once('value', function (snap) {
            for (var i = 0; i < snap.val().length; i++) {
                var currentSnap = snap.val()[i];
                //add the Ifs for Hours and Minuets
                if (currentSnap.startTime.day == now.getDate()) {
                    if (currentSnap.startTime.month == now.getMonth()) {
                        if (currentSnap.startTime.year == now.getFullYear()) {

                            listStatusAndStorage.listTemplatsByDate.push(currentSnap)
                        }
                    }
                }
            }
        });


    };
}]);

UserDataServices.factory('ListUpdateRouter', [function () {
    return function (updatedListStatus) {
            //alert(updatedListStatus.db.isUpToDate)
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
                        isDefault: true,
                        daysOfTheWeek:{
                            monday: true,
                            tuesday:true
                        },
                        startHour:4,
                        startMin:10
                },
                listtemplats:{
                    dated:[{
                        ID:"h6dls0gk54",
                            createdOn: now,
                            startTime: {
                                min: atime.getMinutes(),
                                hours: atime.getHours(),
                                day: atime.getDate(),
                                month: atime.getMonth(),
                                year: atime.getFullYear()
                            }
                        },
                        {
                        ID:"kf9ame46m7",
                            createdOn: now,
                            startTime: {
                                min: pastTime.getMinutes(),
                                hours: pastTime.getHours(),
                                day: pastTime.getDate(),
                                month: pastTime.getMonth(),
                                year: pastTime.getFullYear()
                            }
                        }],
                    defaults:{
                        n934tbg1d:{
                            ID:"n934tbg1d",
                            createdOn: 1443123299604,
                            isDefault: true,
                            daysOfTheWeek:{
                                monday: true,
                                tuesday:true
                            },
                            startHour:4,
                            startMin:10
                        }
                    }
                }
        });
    }
}]);
