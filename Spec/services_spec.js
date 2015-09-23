'use strict';
describe('UserDataServices checks: ', function(){
    var FetchAUser, mockfirebaseObject, firebaseObjectSpy


    beforeEach(function(){
        module('UserDataServices');

        module(function($provide){
            $provide.service("$firebaseObject", function(){
                return function(){return {"Keys":"Values"}};
            });
        });

        mockfirebaseObject = $firebaseObject;
    });

    describe('FetchUser Tests: ', function(){

        beforeEach(inject(function(_FetchAUser_, _FetchUsers_, $firebaseObject){
                FetchAUser =  _FetchAUser_;

            }));

        it('should exist and be a function.', function(){
            expect(typeof FetchAUser).toEqual('function')
        });

        it('should call Firebase object.', function(){
            var stuff = FetchAUser(1);


        });
    });
});