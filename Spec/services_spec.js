
test = function () {

}


describe('UserDataServices checks: ', function () {
'use strict';
    var refSpy, FirebaseReal, mockdata, mockfirebaseArrayData, mockfirebaseObjectData

    var mockSnap = {
        val:function () {
            return mockdata;
        }
    }
    var DBref = {
        on:function (str, callback) {
            DBref.onisCalled = true;
            DBref.onisCalledWith = arguments;
            callback(mockSnap);
        },
        orderByChild:function (args) {
            DBref.orderByChildisCalled = true;
            DBref.orderByChildisCalledWith = args;

            return DBref;
        },
        equalTo:function (args) {
            DBref.equalToisCalled = true;
            DBref.equalToisCalledWith = args;
            return DBref;
        },
        limitToFirst:function (args) {
            DBref.limitToFirstisCalled = true;
            DBref.limitToFirstisCalledWith = args;
            return DBref;
        }

    };

    var mockFirebase = function (url) {
        var refObj = DBref;
        refObj.FirebaseisCalled = true;
        refObj.FirebaseisCalledWith = url;
        refSpy = refObj;
        return refObj;
    };

    beforeEach(function () {
        module('UserDataServices');
        module(function($provide){
                $provide.service("$firebaseArray", function () {
                     var fbObject = function (refObj) {
                        refObj.firebaseArrayisCalled = true;
                        mockfirebaseArrayData.args = refObj;
                        return mockfirebaseArrayData;
                     };
                    return fbObject;
                });
            });
        mockfirebaseArrayData = [];

        module(function($provide){
            $provide.service("$firebaseObject", function () {
                 var fbObject = function (refObj) {
                    refObj.firebaseObjectisCalled = true;
                    mockfirebaseObjectData.args = refObj
                    return mockfirebaseObjectData;

                 };
                return fbObject;
            });
        });
    })


    beforeEach(inject(function(){
        FirebaseReal = Firebase;
        Firebase = mockFirebase;
    }));
    afterEach(inject(function(){
        Firebase = FirebaseReal;

        //Clear Data after every use.
        mockdata = {};
        mockfirebaseArrayData = [];
        mockfirebaseObjectData = {};
    }));

    describe('FetchUsers: ', function(){

        var FetchUsers;
        beforeEach(inject(function(_FetchUsers_){
            FetchUsers =  _FetchUsers_;
        }));


        it('should exist and be a function.', function () {
            expect(typeof FetchUsers).toEqual('function');
        });

        it('should call Firebase and $firebaseArray.', function () {
            mockfirebaseArrayData = [{"key":'value'}, {"key":'value'}];
            var results = FetchUsers();
            expect(refSpy.FirebaseisCalled).toBeTruthy();
            expect(results.args.firebaseArrayisCalled).toEqual(true);
        });
    });

    describe('FetchAUser: ', function(){

        var FetchAUser;
        beforeEach(inject(function(_FetchAUser_){
            FetchAUser =  _FetchAUser_;
        }));




        it('should exist and be a function.', function(){
            expect(typeof FetchAUser).toEqual('function')
        });

        it('should call orderByChild and equalTo with a given ID.', function(){
            var results = FetchAUser("z1")

            expect(refSpy.orderByChildisCalled).toBeTruthy();
            expect(refSpy.equalToisCalledWith).toEqual("z1");
        });
    });

    describe('IsListCurrent: ', function(){
        var mocklistStatusAndStorage = {
            'db':{
                "current":{},
                "isUpToDate":true
            }
        }
        var IsListCurrent;
        beforeEach(inject(function(_IsListCurrent_){
            IsListCurrent =  _IsListCurrent_;
        }));

        it('should exist and be a function.', function(){
            expect(typeof IsListCurrent).toEqual('function');
        });

        it('should call Firebase with URL including userID.', function(){

            IsListCurrent("z1", mocklistStatusAndStorage);
            expect(refSpy.FirebaseisCalledWith).toEqual('https://todotokens.firebaseio.com/lists/z1/current');
        });

        it('should set db.isUpToDate to false if Current is Null or undefined.', function () {
            mockdata = undefined;
            IsListCurrent("z1", mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.db.isUpToDate).toEqual(false);

        });

        it('should set db.isUpToDate to false if createdOn is more the 24 hours old', function () {
            var mockTime = new Date().getTime() - 86400009;

            mockdata = {
                createdOn: mockTime
            }

            IsListCurrent("z1", mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.db.isUpToDate).toEqual(false);
        });
    });

});