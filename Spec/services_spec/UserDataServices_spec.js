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

        describe('FetchAUser: ', function () {
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

        describe('FetchList: ', function () {
            var FetchList;

            beforeEach(inject(function(_FetchList_){
                FetchList =  _FetchList_;
            }));

            it('should exist and be a function.', function(){
                expect(typeof FetchList).toEqual('function')
            });
        });
    });


    //--------------Mid Point Services -------------------//
    describe('UserDataServices checks on none root services:', function(){
        describe('IsListCurrent: ', function(){
            var IsListCurrent, mocklistStatusAndStorage;

            beforeEach(function () {
                module('UserDataServices');
                module(function($provide){
                    $provide.value("FindMostRecentTemplate", function(){
                        var refObj = {};
                        refObj.FindMostRecentTemplateisCalled = true;
                        refObj.FindMostRecentTemplateisCalledWith = arguments;
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

                expect(mocklistStatusAndStorage.db.listTemplats.message).toEqual('No active Templates found.');
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
            var FindMostRecentTemplate, mocklistStatusAndStorage, localSpy, mockNow, mockHours, mockMins;

            beforeEach(function () {
                module('UserDataServices');
                module(function($provide){
                    $provide.value("UpDateAndArchiveCurrent", function(userID, listStatusAndStorage){
                        localSpy = {};
                        localSpy.UpDateAndArchiveCurrentisCalled = true;
                        localSpy.UpDateAndArchiveCurrentisCalledWith = arguments;
                    });
                });


            });

            beforeEach(function () {
                mockNow = new Date(2015, 10, 4, 13, 20);
                mockHours = mockNow.getHours();
                mockMins = Math.floor(mockNow.getMinutes() / 10) * 10;
                spyOn(window,"Date").and.returnValue(mockNow);
                spyOn(window, "alert");

                mocklistStatusAndStorage = {
                    'db':{
                        "current":{},
                        "isUpToDate":true
                    },
                };
            });



            beforeEach(inject(function(_FindMostRecentTemplate_){
                FindMostRecentTemplate =  _FindMostRecentTemplate_;
            }));

            afterEach(inject(function(){

                //Clear Data after every use.
                mockdata = {};
            }));

            it('should exist and be a function.', function () {
                expect(typeof FindMostRecentTemplate).toEqual('function');
            });

            describe('Pass Checks. Should not Run until Both perquisites are ready. ', function () {
                it('should pass on running if FetchListTemplatesDone: false but IsListCurrentDone: true.', function () {
                    var result

                    mocklistStatusAndStorage.FetchListTemplatesDone = false;
                    mocklistStatusAndStorage.IsListCurrentDone = true;
                    result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                    expect(result).toEqual('pass: FetchListTemplatesDone: false IsListCurrentDone: true');

                });

                it('should pass on running if FetchListTemplatesDone: true but IsListCurrentDone: false.', function () {
                    var result

                    mocklistStatusAndStorage.FetchListTemplatesDone = true;
                    mocklistStatusAndStorage.IsListCurrentDone = false;
                    result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                    expect(result).toEqual('pass: FetchListTemplatesDone: true IsListCurrentDone: false');
                });

                it('should pass on running if FetchListTemplatesDone: false and IsListCurrentDone: false.', function () {
                    var result

                    mocklistStatusAndStorage.FetchListTemplatesDone = false;
                    mocklistStatusAndStorage.IsListCurrentDone = false;
                    result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                    expect(result).toEqual('pass: FetchListTemplatesDone: false IsListCurrentDone: false');
                });

                it('should run if FetchListTemplatesDone: true and IsListCurrentDone: true.', function () {
                    var result

                    mocklistStatusAndStorage = {
                        db:{
                            listTemplats:{
                                message: 'No active Templates found.'
                            }
                        }
                    }

                    mocklistStatusAndStorage.FetchListTemplatesDone = true;
                    mocklistStatusAndStorage.IsListCurrentDone = true;
                    result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                    expect(result).toBeFalsy();
                });
            });

            it('should find only the newest list for today, that is not older then 12 hours, and has a start hour no later then the current hour. ', function () {
                var result;
                mocklistStatusAndStorage = {
                        IsListCurrentDone: true,
                        FetchListTemplatesDone: true,
                        db:{
                            listTemplats:{
                                "n934tbg1d":{
                                    startHour:mockHours,
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
                                },
                                "b7af6dn3g84":{
                                    startHour:mockHours - 12,
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
                                "h7afh62h5j":{
                                    startHour:mockHours - 5,
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
                                "h82h1h62h8h0":{
                                    startHour:mockHours,
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
                                },
                                "n8ayudn3g03":{
                                    //this is the one that should be found
                                    startHour:mockHours,
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
                            }
                        }
                    };

                    result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                    expect(mocklistStatusAndStorage.newList.ID).toEqual('n8ayudn3g03');
                    expect(result).toBeFalsy();
            });

            it('should set newList as undefined and add a Message to db.listTemplats.message for later use. ', function  () {
                var result;
                mocklistStatusAndStorage = {
                    IsListCurrentDone: true,
                    FetchListTemplatesDone: true,
                    db:{
                        listTemplats:{
                            "n934tbg1d":{
                                startHour:mockHours + 1,
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
                            "3n5n8tbg1d":{
                                startHour:mockHours - 12,
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
                        }
                    }
                };


                result = FindMostRecentTemplate('z1', mocklistStatusAndStorage);

                expect(mocklistStatusAndStorage.newList.ID).toEqual('empty');
                expect(mocklistStatusAndStorage.db.listTemplats.message).toEqual('No active Templates found.');
                expect(result).toBeFalsy();

            });
        });

        describe('UpDateAndArchiveCurrent: ', function () {
            var UpDateAndArchiveCurrent, mocklistStatusAndStorage, localSpy;

            beforeEach(function () {
                module('UserDataServices');
            });

            beforeEach(function () {
                refSpy = undefined;
            });



            beforeEach(inject(function(_UpDateAndArchiveCurrent_){
                UpDateAndArchiveCurrent =  _UpDateAndArchiveCurrent_;
                FirebaseReal = Firebase;
                Firebase = mockFirebase;
            }));

            afterEach(inject(function(){
                Firebase = FirebaseReal;

                //Clear Data after every use.
                mockdata = {};
            }));

            it('should exist and be a function.', function () {
                expect(typeof UpDateAndArchiveCurrent).toEqual('function');
            });

            it('should archive the current List if it is getting replaced. ', function () {
                mocklistStatusAndStorage = {
                    "db":{
                        "listTemplats":{

                        },
                        "current":{
                            "ID":"m9n55f9nms8"
                        },
                        "isUpToDate":false
                    },
                    "newList":{
                        "ID":"m9n55f9nms8"
                    }
                };



                UpDateAndArchiveCurrent("z1", mocklistStatusAndStorage);
                expect(refSpy.pushisCaled).toEqual(true);
                expect(refSpy.pushisCalledWith.ID).toEqual('m9n55f9nms8');

            });

            it('should not replace the current template if the newList has the same ID as the Current List and the Current List is not Expired. ', function () {
                var stub;

                mocklistStatusAndStorage = {
                    "db":{
                        "listTemplats":{

                        },
                        "current":{
                            "ID":"tf55f9nn6"
                        },
                        "isUpToDate":true
                    },
                    "newList":{
                        "ID":"tf55f9nn6"
                    }
                };



                UpDateAndArchiveCurrent("z1", mocklistStatusAndStorage);
                expect(refSpy).toBeFalsy();


            });

            it('should replace the Current List if a new one is found with a different ID even if the current is UpTodate. ', function () {
                mocklistStatusAndStorage = {
                    "db":{
                        "listTemplats":{
                        },
                        "current":{
                            "ID":"m9n55f9nms8"
                        },
                        "isUpToDate":true
                    },
                    "newList":{
                        "ID":"tf55f9nn6"
                    },
                };



                UpDateAndArchiveCurrent("z1", mocklistStatusAndStorage);
                expect(refSpy.setisCaled).toEqual(true);
                expect(refSpy.setisCalledWith.ID).toEqual('tf55f9nn6');

            });

            it('should replace the current List if the Current List is expired even if the IDs match .', function () {
                mocklistStatusAndStorage = {
                    "db":{
                        "listTemplats":{

                        },
                        "current":{
                            "ID":"m9n55f9nms8"
                        },
                        "isUpToDate":false
                    },
                    "newList":{
                        "ID":"m9n55f9nms8"
                    }
                };

                UpDateAndArchiveCurrent("z1", mocklistStatusAndStorage);
                expect(refSpy.setisCaled).toEqual(true);
                expect(refSpy.setisCalledWith.ID).toEqual('m9n55f9nms8');

            });

            it('should replace the current List with an empty list if the Current List is expired but no replacement template is found. ', function () {
                mocklistStatusAndStorage = {
                    "db":{
                        "listTemplats":{

                        },
                        "current":{
                            "ID":"empty"
                        },
                        "isUpToDate":false
                    },
                    "newList":{
                        "ID":"empty"
                    }
                };

                UpDateAndArchiveCurrent("z1", mocklistStatusAndStorage);
                expect(refSpy.setisCaled).toEqual(true);
                expect(refSpy.setisCalledWith.ID).toEqual('empty');

            });

        });
    });
});