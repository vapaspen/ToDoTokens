'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['ManualDbUpdate', '$scope', 'FetchUsers','IsListCurrent','ListUpdateRouter', 'FetchCurrentListTemplates',    function(ManualDbUpdate, $scope,FetchUsers, IsListCurrent, ListUpdateRouter, FetchCurrentListTemplates){
    $scope.userList = FetchUsers();
    $scope.listStatusAndStorage = {
        'db':{
            "current":{},
            "isUpToDate":true
        }
    };

    $scope.$watchCollection('listStatusAndStorage', ListUpdateRouter)

    IsListCurrent("z1", $scope.listStatusAndStorage);
    //ManualDbUpdate("z1");
    FetchCurrentListTemplates("z1", $scope.listStatusAndStorage);
}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', function($scope, $routeParams, FetchAUser){
    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';

}]);