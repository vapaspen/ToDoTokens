

describe('UserDataServices checks: ', function(){
'use strict';



    describe('FetchUsers: ', function(){
        beforeEach(function(){
            module('UserDataServices');
            module(function($provide){
                $provide.service("$firebaseArray", function(){
                     var fbObject = function(stuff){
                        return [{"Keys":"Values"}, {"Keys":"Values"}]
                     };
                    return fbObject;
                });
            });
        });

        var FetchUsers;
        beforeEach(inject(function(_FetchUsers_){
            FetchUsers =  _FetchUsers_;
        }));


        it('should exist and be a function.', function(){
            expect(typeof FetchUsers).toEqual('function');
        });

        it('should call $firebaseArray".', function(){
            var results = FetchUsers()
            expect(results).toEqual([{"Keys":"Values"}, {"Keys":"Values"}]);
        });
    });

    describe('FetchAUser: ', function(){
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

        var FetchAUser;
        beforeEach(inject(function(_FetchAUser_){
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

    describe('IsListCurrent: ', function(){
        beforeEach(function(){
            module('UserDataServices');
            /*module(function($provide){
                $provide.service("$firebaseObject", function(){
                     var fbObject = function(stuff){
                        return {"Keys":"Values"}

                     };
                    return fbObject;
                });
            });*/
        });

        var IsListCurrent;
        beforeEach(inject(function(_IsListCurrent_){
            IsListCurrent =  _IsListCurrent_;
        }));

        it('should exist and be a function.', function(){
            expect(typeof IsListCurrent).toEqual('function');
        });

        it('should return false if the username given is not found', function(){
            //var results = IsListCurrent("z1");
            //expect(results).toEqual(false);
        });
    });
});