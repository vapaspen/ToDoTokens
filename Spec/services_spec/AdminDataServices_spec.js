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
        describe('FetchAUsersListData', function () {


        });
    });
});