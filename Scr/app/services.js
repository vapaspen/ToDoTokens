'use strict';

var UserDataServices = angular.module('UserDataServices',['firebase'])
.constant('DBURL','https://todotokens.firebaseio.com/')

UserDataServices.factory('FetchUsers', ['DBURL','$firebaseArray', function(DBURL, $firebaseArray){
    return function(){
        var userRef = DBURL+'users';
        var fireRef = new Firebase(userRef);
        return $firebaseArray(fireRef);
    }
}]);


UserDataServices.factory('FetchAUser', ['DBURL', '$firebaseObject', function(DBURL, $firebaseObject){
    return function(ID){
        var userRef = DBURL+'users';
        var fireRef = new Firebase(userRef).orderByChild("ID").equalTo(ID).limitToFirst(1);
        return $firebaseObject(fireRef);
    };
}]);

//check if their is current List displaying, if there is a List in the Current List DataBase, and if all are up to date
//Stats:
//0 Displayed List need update, Current List - out of Date
//1 Displayed List need update, Current List - Current
//2 Displayed List OK, Current List - Current
//3 Displayed List OK, Current List - out of Date <--- we bypas this case
UserDataServices.factory('IsListCurrent', ['DBURL','$window', function(DBURL, $window){
    return function(userID, listID, Obj){
        var listURL = DBURL+'lists/'+userID+'/current';

        var listRef = new $window.Firebase(listURL);

        listRef.on('value', function(snap){
            var results = snap.val()

            if(results !== undefined && results !== null){
                var timeDif =  new Date().getTime()- results.createdOn;
                if(listID == results.ID && timeDif < 86400000){
                    Obj.result = true
                }
            }
        });


    };
}]);

UserDataServices.factory('ManualDbUpdate', ['DBURL', function(DBURL){
    return function(){
        var now = new Date().getTime();
        var listRef = new Firebase(listURL);
        listRef.set({
            z1:{
                current:{
                    ID:"n934tbg1d",
                    createdOn: 1443123299604
                }
            }
        });
    }
}]);
