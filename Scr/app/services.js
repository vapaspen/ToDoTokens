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

//function to Check if Current List in Data base is current. This updates
UserDataServices.factory('IsListCurrent', ['DBURL', function(DBURL){
    return function(userID, listStatusAndStorage){
        var listURL = DBURL+'lists/'+userID+'/current';

        var listRef = new Firebase(listURL);

        //make a Reference so we can detach it later
        listStatusAndStorage.IsListCurrent = listRef.on('value', function(snap){
            listStatusAndStorage.db.current = snap.val()

            if(snap.val() !== undefined && snap.val() !== null){
                var timeDif =  new Date().getTime()- snap.val().createdOn;
                if(timeDif < 86400000){
                    listStatusAndStorage.db.isUpToDate = true;
                }
                else{
                    listStatusAndStorage.db.isUpToDate = false;
                }
            }
            else{
                listStatusAndStorage.db.isUpToDate = false;
            }
        });
    };
}]);


UserDataServices.factory('ListUpdateRouter', [function(){
    return function(updatedListStatus){
            //alert(updatedListStatus.db.isUpToDate)
        }
}])



//Local Function used to send updates to the DB as its being Made.
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
