

describe('UserDataServices checks: ', function(){
'use strict';
    var FetchAUser
    beforeEach(function(){
        module('UserDataServices');

        module(function($provide){
            $provide.service("$firebaseObject", function(){
                 var fbObject = function(stuff){
                    return {"Keys":"Values"}

                 };
                return fbObject;
            });
        });

    });

    describe('FetchUser Tests: ', function(){

        beforeEach(inject(function(_FetchAUser_, _FetchUsers_){
                FetchAUser =  _FetchAUser_;

            }));


        it('should exist and be a function.', function(){
            expect(typeof FetchAUser).toEqual('function')
        });

        it('should call $firebaseObject.', function(){
            var results = FetchAUser(1)
            expect(results).toEqual({"Keys":"Values"})
        });
    });
});