 'use strict';

 describe('Controller Tests:', function(){
    beforeEach(module('app'));
    var $controller, $rootScope;

    beforeEach(inject(function(_$controller_, _$rootScope_){
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    describe('Home Controller tests:', function(){
        var $scope = {};
        beforeEach(inject(function($controller){
            $controller('HomeCtrl', {'$scope' : $scope});
        }));

        it('Should have a userRef to be the firebase database URL.', function(){
            expect($scope.userRef).toEqual('https://todotokens.firebaseio.com/users')
        });


    });
});