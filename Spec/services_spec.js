'use strict';

describe('All UserDataServices checks: ', function(){
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
            refSpy = refObj;
            return refObj;
        };
        //--------------Mock DataBase elements---------------//

    });

    //--------------End Point Services -------------------//
    describe('UserDataServices checks on endpoint modules: ', function () {

        beforeEach(function () {
            mockfirebaseArrayData = [];
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

            module(function($provide){
                $provide.service("mockedService", function () {
                     return function (refObj) {
                        return refObj.mockedServiceisCalled = true;
                     };
                    fbObject;
                });
            });

            spyOn(window, 'alert');
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
    });


    //--------------Mid Point Services -------------------//
    describe('UserDataServices checks on none root services:', function(){
        describe('IsListCurrent: ', function(){
            var IsListCurrent, mocklistStatusAndStorage;

            beforeEach(function () {
                module('UserDataServices');
                mockfirebaseArrayData = [];
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

                module(function($provide){
                    $provide.value("ListUpdateRouter", function(){
                        var refObj = {};
                        refObj.ListUpdateRouterisCalled = true;
                        refObj.ListUpdateRouterisCalledWith = arguments;
                    });
                });
            });

            beforeEach(function () {
                mocklistStatusAndStorage = {
                    'db':{
                        "current":{},
                        "isUpToDate":true
                    },
                };
            });



            beforeEach(inject(function(_IsListCurrent_){
                IsListCurrent =  _IsListCurrent_;
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

        describe('FetchListTemplates: ', function(){
            var FetchListTemplates, mocklistStatusAndStorage, localSpy;

            beforeEach(function () {
                module('UserDataServices');

                module(function($provide){
                    $provide.value("FindMostRecentTemplate", function(){
                        localSpy = {};
                        localSpy.FindMostRecentTemplateisCalled = true;
                        localSpy.FindMostRecentTemplateisCalledWith = arguments;
                    });
                });
            });

            beforeEach(function () {
                mocklistStatusAndStorage = {
                    'db':{
                        "current":{},
                        "isUpToDate":true
                    },
                };
            });



            beforeEach(inject(function(_FetchListTemplates_){
                FetchListTemplates =  _FetchListTemplates_;
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



            it('should exist and be a function.', function () {
                expect(typeof FetchListTemplates).toEqual('function');
            });

            it('should call Firebase with URL including userID', function () {
                FetchListTemplates('t2', mocklistStatusAndStorage);
                expect(refSpy.FirebaseisCalledWith).toEqual('https://todotokens.firebaseio.com/lists/t2/listtemplats');
            });

            it('should call orderByChild isActive and equalTo with True.', function () {
                FetchListTemplates('t2', mocklistStatusAndStorage);

                expect(refSpy.orderByChildisCalledWith).toEqual("isActive");
                expect(refSpy.equalToisCalledWith).toEqual(true);
            });

            it('should set listTemplats to empty array if there are not templates found.', function () {
                mockdata = null;
                FetchListTemplates('t2', mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.db.listTemplats).toEqual({});
            });

            it('should set listTemplats to empty array if there are not templates found.', function () {
                mockdata = {
                    'nh5j8skw3':{
                    'createdOn': 1443123299604,
                    }
                };
                FetchListTemplates('t2', mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.db.listTemplats.nh5j8skw3.createdOn).toEqual(1443123299604);
            });

            it('should call FindMostRecentTemplate with Done as true. ', function () {
                mockdata = null;
                FetchListTemplates('t2', mocklistStatusAndStorage);

                expect(localSpy.FindMostRecentTemplateisCalled).toEqual(true);
                expect(localSpy.FindMostRecentTemplateisCalledWith[0]).toEqual('t2');
                expect(localSpy.FindMostRecentTemplateisCalledWith[1].FetchListTemplatesDone).toEqual(true);
            });
        });

        describe('FindMostRecentTemplate: ', function(){
            var FindMostRecentTemplate, mocklistStatusAndStorage, localSpy;

            beforeEach(function () {
                module('UserDataServices');

                module(function($provide){
                    $provide.value("UpDateAndArchiveCurrent", function(){
                        localSpy = {};
                        localSpy.UpDateAndArchiveCurrentisCalled = true;
                        localSpy.UpDateAndArchiveCurrentisCalledWith = arguments;
                    });
                });
            });

            beforeEach(function () {
                mocklistStatusAndStorage = {
                    'db':{
                        "current":{},
                        "isUpToDate":true
                    },
                };
            });



            beforeEach(inject(function(_FindMostRecentTemplate_){
                FindMostRecentTemplate =  _FindMostRecentTemplate_;
                FirebaseReal = Firebase;
                Firebase = mockFirebase;
            }));

            afterEach(inject(function(){
                Firebase = FirebaseReal;

                //Clear Data after every use.
                mockdata = {};
            }));

            it('should exist and be a function.', function () {
                expect(typeof FindMostRecentTemplate).toEqual('function');
            });

            it('should pass on running if either FetchListTemplates, or IsListCurrent is not finished', function () {
                var result

                mocklistStatusAndStorage.FetchListTemplatesDone = false;
                mocklistStatusAndStorage.IsListCurrentDone = false;
                result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                expect(result).toEqual('pass: FetchListTemplatesDone: false IsListCurrentDone: false')

                mocklistStatusAndStorage.FetchListTemplatesDone = true;
                mocklistStatusAndStorage.IsListCurrentDone = false;
                result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                expect(result).toEqual('pass: FetchListTemplatesDone: true IsListCurrentDone: false')

                mocklistStatusAndStorage.FetchListTemplatesDone = false;
                mocklistStatusAndStorage.IsListCurrentDone = true;
                result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                expect(result).toEqual('pass: FetchListTemplatesDone: false IsListCurrentDone: true')

                mocklistStatusAndStorage.FetchListTemplatesDone = true;
                mocklistStatusAndStorage.IsListCurrentDone = true;
                result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                expect(result).not.toBeTruthy();
            });
        });

//_________________OLD_-----------------------________-
        describe('FetchCurrentListTemplates: ', function () {
            var FetchCurrentListTemplates, mocklistStatusAndStorage, mockNow, mockMins, mockHours, mockedService;

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

                module(function($provide){
                    $provide.value("ListUpdateRouter", function(){
                        var refObj = {};
                        refObj.ListUpdateRouterisCalled = true;
                        refObj.ListUpdateRouterisCalledWith = arguments;
                    });
                });
            });

            beforeEach(function () {
                mockNow = new Date();
                mockHours = mockNow.getHours();
                mockMins = Math.floor(mockNow.getMinutes() / 10) * 10;
                mocklistStatusAndStorage = {};
                spyOn(window, 'alert');
            });



            beforeEach(inject(function(_FetchCurrentListTemplates_){
                FetchCurrentListTemplates =  _FetchCurrentListTemplates_;
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

            it('should exist and be a function.', function () {
                expect(typeof FetchCurrentListTemplates).toEqual('function');
            });

            it('should call Firebase with URL including userID', function () {
                FetchCurrentListTemplates('t2', mocklistStatusAndStorage);
                expect(refSpy.FirebaseisCalledWith).toEqual('https://todotokens.firebaseio.com/lists/t2/listtemplats');
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
                };


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
            beforeEach(function () {
                module('UserDataServices');
                module(function($provide){
                    $provide.value("updateCurrentList", function () {
                        return;
                    });
                });
                module(function($provide){
                    $provide.value("FindNewCurrentListFromRecent", function () {
                        return;
                    });
                });
            });

            var ListUpdateRouter, mocklistStatusAndStorage;

            beforeEach(inject(function(_ListUpdateRouter_){
                ListUpdateRouter = _ListUpdateRouter_;

            }));

            beforeEach(function (){
                spyOn(window, 'alert');
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
                mocklistStatusAndStorage.IsListCurrentDone = true;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = true;


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

                mocklistStatusAndStorage.IsListCurrentDone = true;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = true;

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

                mocklistStatusAndStorage.IsListCurrentDone = true;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = true;
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
                mocklistStatusAndStorage.IsListCurrentDone = true;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = true;

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
                mocklistStatusAndStorage.IsListCurrentDone = true;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = true;


                mocklistStatusAndStorage.db.isUpToDate = true;
                status = ListUpdateRouter(mocklistStatusAndStorage);

                expect(status).toEqual('FindNewCurrentListFromRecent >> isUpToDate:true');
            });

            it('should not process further if either is not done processing ', function(){
                var mockcurrentList, mocklistTemplats, status;

                mockcurrentList = {};

                mocklistStatusAndStorage.db.current = mockcurrentList;
                mocklistStatusAndStorage.db.isUpToDate = true;
                mocklistStatusAndStorage.listTemplats = mocklistTemplats;
                mocklistStatusAndStorage.IsListCurrentDone = false;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = true;

                status = ListUpdateRouter(mocklistStatusAndStorage);
                expect(status).toEqual('listStatusAndStorage.IsListCurrentDone: false');

                mocklistStatusAndStorage.IsListCurrentDone = true;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = false;

                status = ListUpdateRouter(mocklistStatusAndStorage);
                expect(status).toEqual('listStatusAndStorage.FetchCurrentListTemplatesDone: false');

                mocklistStatusAndStorage.IsListCurrentDone = false;
                mocklistStatusAndStorage.FetchCurrentListTemplatesDone = false;

                status = ListUpdateRouter(mocklistStatusAndStorage);
                expect(status).toEqual('listStatusAndStorage.FetchCurrentListTemplatesDone: false');

            });
        });

        describe('FindNewCurrentListFromRecent: ' , function () {
            var FindNewCurrentListFromRecent, mocklistStatusAndStorage, mockNow, mockHours, mockMins, localSpy;

            beforeEach(function () {
                module('UserDataServices');
                module(function($provide){
                    $provide.value("updateCurrentList", function (Obj) {
                        localSpy = {
                            isCalled:true,
                            isCalledWith: Obj
                        }
                    });
                });

                mockNow = new Date(2015, 10, 4, 13, 20);
                mockHours = mockNow.getHours();
                mockMins = Math.floor(mockNow.getMinutes() / 10) * 10;
                spyOn(window,"Date").and.returnValue(mockNow);
                spyOn(window, "alert");
                mocklistStatusAndStorage = {
                    userID:'z1',
                    listTemplats:[]
                };
                localSpy = {
                    isCalled:false,
                    isCalledWith:{}
                }
            });

            beforeEach(inject(function(_FindNewCurrentListFromRecent_){
                FindNewCurrentListFromRecent = _FindNewCurrentListFromRecent_;
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

            it('should exist and be a function.', function () {
                expect(typeof FindNewCurrentListFromRecent).toEqual('function')
            });

            it('should call orderByChild with isActive.', function () {

                mockdata = null;

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(refSpy.orderByChildisCalled).toBeTruthy();
                expect(refSpy.orderByChildisCalledWith).toEqual("isActive");
            });

            it('should add a template error message if the database call returns null', function () {

                mockdata = null;

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.listTemplats.error.message).toEqual('No Active List Templates found for user: z1');

            });

            it('should add message that it found a template when it has a valid template and there is no other templates Processed after this one. ', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours,
                        startMin: mockMins,
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
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Found first with key: n934tbg1d');

            });

            it('should message that it has found the next template when it has found at least two templates. ', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    },
                        "2n4n5n7n8n":{
                        startHour: mockHours,
                        startMin: mockMins + 1,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    }
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Found Next by minutes: key: 2n4n5n7n8n');

            });

            it('should message that it has passed if on mins the last Template checked matched hours but was equal to, or less then, the number of minutes. ', function () {


                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    },
                        "2n4n5n7n8n":{
                        startHour: mockHours,
                        startMin: mockMins - 1,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    }
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Passed at greater then mins at key: 2n4n5n7n8n');

            });

            it('should message that it has found the next template by hours if it finds a template by greater then Hours. ', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours - 2,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    },
                        "2n4n5n7n8n":{
                        startHour: mockHours - 1,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    }
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);
                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Found Next by hours: key: 2n4n5n7n8n');

            });

            it('should message that it has passed on hours at if the last Template checked was equal to, or less then, the number of hours. ', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours - 1,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    },
                        "2n4n5n7n8n":{
                        startHour: mockHours - 2,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    }
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);
                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Passed at greater then Hours at key: 2n4n5n7n8n');
            });
            it('should message that it has passed on hours at if the last Template checked was great to the current hour, or less than the Min hour. ', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours - 13,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    }
                };
                FindNewCurrentListFromRecent(mocklistStatusAndStorage);
                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Passed on Hours between at: n934tbg1d');

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours + 1,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    }
                };
                FindNewCurrentListFromRecent(mocklistStatusAndStorage);
                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Passed on Hours between at: n934tbg1d');
            });

            it('should message that it passed on DayOfTheWeek when the last item failes the Day of the Week Check. ', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:true,
                                w1:true,
                                w2:true,
                                w3:true,
                                w4:true,
                                w5:true,
                                w6:true
                        }
                    },
                        "2n4n5n7n8n":{
                        startHour: mockHours,
                        startMin: mockMins,
                        daysOfTheWeek:{
                                w0:false,
                                w1:false,
                                w2:false,
                                w3:false,
                                w4:false,
                                w5:false,
                                w6:false
                        }
                    }
                };
                FindNewCurrentListFromRecent(mocklistStatusAndStorage);
                expect(mocklistStatusAndStorage.listTemplats.message).toEqual('Passed on DayOfTheWeek at: 2n4n5n7n8n');
            });

           it('should return a template Error message if there are not active templates found.', function () {

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
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.listTemplats.error.message).toEqual('No Templates found for user: z1');
                expect(localSpy.isCalledWith).toEqual({});
                expect(localSpy.isCalled).toEqual(false);

            });

            it('should call updateCurrentList if a list item is found.', function () {

                mockdata = {
                    "n934tbg1d":{
                        startHour: mockHours,
                        startMin: mockMins,
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
                };

                FindNewCurrentListFromRecent(mocklistStatusAndStorage);

                expect(localSpy.isCalled).toEqual(true);
                expect(localSpy.isCalledWith.listTemplats[0].ID).toEqual('n934tbg1d');

            });

        });
    });
});

