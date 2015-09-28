'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['ManualDbUpdate', '$scope', 'FetchUsers','IsListCurrent','ListUpdateRouter', 'FetchNewCurrent',    function(ManualDbUpdate, $scope,FetchUsers, IsListCurrent, ListUpdateRouter, FetchNewCurrent){
    $scope.userList = FetchUsers();
    $scope.listStatusAndStorage = {
        'db':{
            "current":{},
            "isUpToDate":true
        }
    };

    $scope.$watchCollection('listStatusAndStorage', ListUpdateRouter)

    //IsListCurrent("z1", $scope.listStatusAndStorage);
    //ManualDbUpdate("z1");
    FetchNewCurrent("z1", $scope.listStatusAndStorage);
}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', function($scope, $routeParams, FetchAUser){
    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';

}]);