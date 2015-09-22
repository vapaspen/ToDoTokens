'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['$scope', 'FetchUsers',    function($scope,FetchUsers){
    $scope.userList = FetchUsers()
}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope', function($scope){
    $scope.title = "Users's List";
    $scope.firstName = 'Users';
}]);