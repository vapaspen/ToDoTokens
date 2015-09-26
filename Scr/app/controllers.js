'use strict';

//Controller for Default Page. Used to manage User selection Display
app.controller('HomeCtrl', ['$scope', 'FetchUsers','IsListCurrent','ListUpdateRouter',    function($scope,FetchUsers, IsListCurrent, ListUpdateRouter){
    $scope.userList = FetchUsers();
    $scope.listStatusAndStorage = {
        'db':{
            "current":{},
            "isUpToDate":true
        }
    };

    $scope.$watchCollection('listStatusAndStorage', ListUpdateRouter)

    IsListCurrent("z1", $scope.listStatusAndStorage);
}]);

//Controller for List Page. Used to manage User List page Display
app.controller('ListCtrl', ['$scope','$routeParams','FetchAUser', function($scope, $routeParams, FetchAUser){
    $scope.data = FetchAUser($routeParams.userID);
    $scope.title = "Users's List";
    $scope.firstName = 'Users';

}]);