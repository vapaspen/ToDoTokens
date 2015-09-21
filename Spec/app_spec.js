 'use strict';

describe('App routing checks: ', function(){
    beforeEach(module('app', 'httpReal'));
    var route, $rootScope, $location;
    beforeEach(inject(function(_$route_, _$location_, _$rootScope_) {
            route = _$route_;
            $rootScope = _$rootScope_;
            $location =_$location_;
        }));

    describe('Home routes:', function(){

        it('Should have a home template with a controller.', function(){
            expect($location.path()).toBe('');
            $rootScope.$digest();
            expect(route.routes['/'].templateUrl).toEqual('templates/default.html');
            expect(route.current.controller).toBe('HomeCtrl');

        });

        it('should redirect to the index path on non-existent route.', function(){
            expect($location.path()).toBe('');

            $location.path('/a/non-existent/route');

            $rootScope.$digest();
            expect($location.path()).toBe( '/' );
            expect(route.current.controller).toBe('HomeCtrl');

        });


    });

    describe('List routes: ', function(){
        beforeEach(inject(function(){
            $location.path('/list/1');
            $rootScope.$digest();
        }))



        it('should have a route to a users List page with a controller.', function(){


            expect($location.path()).toBe('/list/1');

            expect(route.current.templateUrl).toEqual('templates/activeList.html');
            expect(route.current.controller).toBe('ListCtrl');
        })
    });

});