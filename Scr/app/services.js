'use strict';

var UserDataServices = angular.module('UserDataServices',['firebase'])
.constant('DBURL','https://todotokens.firebaseio.com/')

UserDataServices.factory('FetchUsers', ['DBURL','$firebaseArray', function(DBURL, $firebaseArray){
    var userRef = DBURL+'users';
    var fireRef = new Firebase(userRef);

    return function(){
        return $firebaseArray(fireRef);
    }
}]);


UserDataServices.factory('FetchAUser', ['DBURL', '$firebaseObject', function(DBURL, $firebaseObject){
    return function(ID){
        var userRef = DBURL+'users';
        var fireRef = new Firebase(userRef);
        var found = fireRef.orderByChild("ID").equalTo(ID).limitToFirst(1);
        return $firebaseObject(found);

    }
}]);

UserDataServices.factory('IsListCurrent', ['DBURL','$firebaseArray', function(DBURL, $firebaseArray){


}]);