
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

    describe('FetchCurrentListTemplates: ', function () {
        var FetchCurrentListTemplates, mocklistStatusAndStorage, mockNow, mockMins, mockHours;

        beforeEach(function () {
            mockNow = new Date();
            mockHours = mockNow.getHours();
            mockMins = Math.floor(mockNow.getMinutes() / 10) * 10;

        });

        beforeEach(inject(function(_FetchCurrentListTemplates_){
            FetchCurrentListTemplates =  _FetchCurrentListTemplates_;
            mocklistStatusAndStorage = {};
        }));

        it('should exist and be a function.', function () {
            expect(typeof FetchCurrentListTemplates).toEqual('function');
        });

        it('should call Firebase with URL including userID', function () {
            FetchCurrentListTemplates('z1', mocklistStatusAndStorage);

            expect(refSpy.FirebaseisCalledWith).toEqual('https://todotokens.firebaseio.com/lists/z1/listtemplats');
        });

        it('should return an error when there not active Lists for a user.', function () {
            mockdata = null;

            FetchCurrentListTemplates('z1', mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.listTemplats.error.message).toEqual('No Active List Templates found for user: z1');
        });

        it('should return an empty array with no error if an Active List is found but no list meet the other criteria.', function(){
            mockdata = {
                "n934tbg1d":{
                    startHour:25,
                    startMin:70,
                    daysOfTheWeek:{
                            w0:false,
                            w1:false,
                            w2:false,
                            w3:false,
                            w4:false,
                            w5:false,
                            w6:false
                    },
                }
            }

            FetchCurrentListTemplates('z1', mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.listTemplats.length).toEqual(0);
            expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Failed at DayOftheWeek.');
        });

        it('should return empty array with no error if Active List and list for the week is found but no list meet the other criteria.', function(){
            mockdata = {
                "n934tbg1d":{
                    startHour:25,
                    startMin:70,
                    daysOfTheWeek:{
                            w0:true,
                            w1:true,
                            w2:true,
                            w3:true,
                            w4:true,
                            w5:true,
                            w6:true,
                    },
                }
            }

            FetchCurrentListTemplates('z1', mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.listTemplats.length).toEqual(0);
            expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Failed at Hours.');
        });

        it('should return empty array with no error if Active List, list for the week, and Hour is found but no list meet the other criteria.', function(){
            mockdata = {
                "n934tbg1d":{
                    startHour:mockHours,
                    startMin:70,
                    daysOfTheWeek:{
                            w0:true,
                            w1:true,
                            w2:true,
                            w3:true,
                            w4:true,
                            w5:true,
                            w6:true,
                    },
                }
            }

            FetchCurrentListTemplates('z1', mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.listTemplats.length).toEqual(0);
            expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Failed at Minuets.');
        });

        it('should add the a list to the array with an ID and no error if a list meets all criteria.', function(){
            mockdata = {
                "n934tbg1d":{
                    startHour:mockHours,
                    startMin:mockMins,
                    daysOfTheWeek:{
                            w0:true,
                            w1:true,
                            w2:true,
                            w3:true,
                            w4:true,
                            w5:true,
                            w6:true
                    },
                }
            }

            FetchCurrentListTemplates('z1', mocklistStatusAndStorage);
            expect(mocklistStatusAndStorage.listTemplats[0].ID).toEqual("n934tbg1d");
            expect(mocklistStatusAndStorage.listTemplats.error).toEqual({});
            expect(mocklistStatusAndStorage.listTemplats.message).toEqual(undefined);
        });

    });

    describe('ListUpdateRouter: ', function(){
        var ListUpdateRouter, mocklistStatusAndStorage;

        beforeEach(inject(function(_ListUpdateRouter_){
            ListUpdateRouter = _ListUpdateRouter_;

        }));

        beforeEach(function (){
            mocklistStatusAndStorage = {
                "db":{}
            };
        });

        it('should exist and be a function.', function () {
            expect(typeof ListUpdateRouter).toEqual('function');
        });

        it('should end with a success message if the DB Current has been found current in all ways.', function(){
            var mockcurrentList, mocklistTemplats, status;

            mockcurrentList = {
                "ID": "n934tbg1d"
            };

            mocklistTemplats = [
                {"ID":"ofirysb945n2w"},
                {"ID":"n934tbg1d"}
            ];

            mocklistStatusAndStorage.db.current = mockcurrentList;
            mocklistStatusAndStorage.db.isUpToDate = true;
            mocklistStatusAndStorage.listTemplats = mocklistTemplats;


            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('Database list is current');

        });

        it('Should call updateCurrentList if listTemplats.length is greater then 0 on  isUpToDate true and false if no ID match was found.', function(){
            var mockcurrentList, mocklistTemplats, status;

            mockcurrentList = {
                "ID": "n934tbg1d"
            };

            mocklistTemplats = [
                {"ID":"n87da3fo76"}
            ];

            mocklistStatusAndStorage.db.current = mockcurrentList;
            mocklistStatusAndStorage.listTemplats = mocklistTemplats;

            mocklistStatusAndStorage.db.isUpToDate = true;
            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('updateCurrentList >> isUpToDate:true');

            mocklistStatusAndStorage.db.isUpToDate = false;
            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('updateCurrentList >> isUpToDate:false');
        });

        it('Should call FindNewCurrentListFromRecent if listTemplats is empty on isUpToDate true and false.', function(){
            var mockcurrentList, mocklistTemplats, status;

            mockcurrentList = {
                "ID": "n934tbg1d"
            };

            mocklistTemplats = [];

            mocklistStatusAndStorage.db.current = mockcurrentList;
            mocklistStatusAndStorage.listTemplats = mocklistTemplats;

            mocklistStatusAndStorage.db.isUpToDate = true;
            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('FindNewCurrentListFromRecent >> isUpToDate:true');

            mocklistStatusAndStorage.db.isUpToDate = false;
            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('FindNewCurrentListFromRecent >> isUpToDate:false');
        });

        it('should call updateCurrentList if db.current is empty and mocklistTemplats is not', function(){
            var mockcurrentList, mocklistTemplats, status;

            mockcurrentList = {};

            mocklistTemplats = [
                {"ID": "n934tbg1d"}
            ];

            mocklistStatusAndStorage.db.current = mockcurrentList;
            mocklistStatusAndStorage.listTemplats = mocklistTemplats;

            mocklistStatusAndStorage.db.isUpToDate = true;
            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('updateCurrentList >> isUpToDate:true');
        });

        it('should call FindNewCurrentListFromRecent if db.current and listTemplats are empty.', function(){
            var mockcurrentList, mocklistTemplats, status;

            mockcurrentList = {};

            mocklistTemplats = [];

            mocklistStatusAndStorage.db.current = mockcurrentList;
            mocklistStatusAndStorage.listTemplats = mocklistTemplats;

            mocklistStatusAndStorage.db.isUpToDate = true;
            status = ListUpdateRouter(mocklistStatusAndStorage);

            expect(status).toEqual('FindNewCurrentListFromRecent >> isUpToDate:true');
        });
    });

});