'use strict';

var UserDataServices = angular.module('UserDataServices',['firebase'])
.value('DBURL','https://todotokens.firebaseio.com/')

UserDataServices.factory('FetchUsers', ['DBURL','$firebaseArray', function(DBURL, $firebaseArray){
    var userRef = DBURL+'users';
    var fireRef = new Firebase(userRef);

    return function(){
        return $firebaseArray(fireRef);
    }
}]);

UserDataServices.factory('FetchAUser', ['DBURL','$firebaseObject', function(DBURL, $firebaseObject){
    return function(ID){
            var userRef = DBURL+'users' + ID;
            var fireRef = new Firebase(userRef);
            return $firebaseObject(fireRef);

    }
}]);

UserDataServices.factory('IsListCurrent', ['DBURL','$firebaseArray', function(DBURL, $firebaseArray){


}]);