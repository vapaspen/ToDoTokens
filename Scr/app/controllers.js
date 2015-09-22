'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['$scope', '$firebaseArray', 'DBURL', 'userList',   function($scope, $firebaseArray, DBURL, userList){
    $scope.userRef = DBURL+'users';
    var fireRef = new Firebase($scope.userRef);

    userList = $firebaseArray(fireRef)
    $scope.userList = userList
}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope', 'userList', function($scope, userList){
    $scope.title = userList[1].firstname + "'s List";
    $scope.firstName = userList[1].firstname;
}]);