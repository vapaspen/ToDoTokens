'use strict';

describe('All AdminDataServices checks: ', function(){
    var refSpy, FirebaseReal, mockdata, mockfirebaseArrayData, mockfirebaseObjectData, mockFirebase, DBref, mockSnap;
    beforeEach(function(){
        //--------------Mock DataBase elements---------------//

        mockSnap = {
            val:function () {
                return mockdata;
            }
        }
        DBref = {
            on:function (str, callback) {
                DBref.onisCalled = true;
                DBref.onisCalledWith = arguments;
                callback(mockSnap);
            },
            once:function (str, callback) {
                DBref.onceisCalled = true;
                DBref.onceisCalledWith = arguments;
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

        mockFirebase = function (url) {
            var refObj = DBref;
            refObj.FirebaseisCalled = true;
            refObj.FirebaseisCalledWith = url;
            refObj.push = function (args) {
                refObj.pushisCaled = true;
                refObj.pushisCalledWith = args;

            }
            refObj.set = function (args){
                refObj.setisCaled = true;
                refObj.setisCalledWith = args;
            }
            refSpy = refObj;
            return refObj;
        };
        //--------------Mock DataBase elements---------------//
    });


    describe('Single depth services: ', function () {
        beforeEach(function () {
            module('AdminDataServices');
            mockfirebaseObjectData = {}
            module(function($provide){
                $provide.service("$firebaseObject", function () {
                     var fbObject = function (refObj) {
                        refObj.firebaseObjectisCalled = true;
                        mockfirebaseObjectData.args = refObj
                        return mockfirebaseObjectData;

                     };

                     mockfirebaseObjectData["$bindTo"] = function (Obj, bindRef) {
                        Obj[bindRef] = mockdata;
                     }
                    return fbObject;
                });
            });
        });

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

        describe('FetchAUsersListData', function () {
            var FetchAUsersListData, mockScope;

            beforeEach(inject(function(_FetchAUsersListData_){
                FetchAUsersListData =  _FetchAUsersListData_;
            }));

            it('should exist and be a function.', function(){
                expect(typeof FetchAUsersListData).toEqual('function');
            });

            it('should get a object that contains all ListData from the database and bind it to the given object.', function () {
                mockdata = {
                    moredata:'stuff'
                }
                mockScope = {}

                FetchAUsersListData(mockScope, 'z1');
                expect(refSpy.FirebaseisCalledWith).toEqual('https://todotokens.firebaseio.com/lists/z1')
                expect(mockScope.list.moredata).toEqual('stuff')
            });
        });

        describe('ArchivePendingLists', function () {
            var ArchivePendingLists;

            beforeEach(inject(function(_ArchivePendingLists_){
                ArchivePendingLists =  _ArchivePendingLists_;
            }));

            it('should exist and be a function.', function(){
                expect(typeof ArchivePendingLists).toEqual('function');
            });

            //it('should update the total tokens based on given tokens on this list.', function () {

            //});

            //it('should send a copy of this list to the archive list', function () {

            //});

            //it('should remove this list from the pending list.', function () {

            //});

        });
    });
});