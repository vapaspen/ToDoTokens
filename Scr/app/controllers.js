'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['$scope', 'FetchUsers','IsListCurrent',    function($scope,FetchUsers, IsListCurrent){
    $scope.userList = FetchUsers();
    $scope.test = {}

    IsListCurrent("z1", "n934tbg1d", $scope.test);
}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', function($scope, $routeParams, FetchAUser){
    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';

}]);