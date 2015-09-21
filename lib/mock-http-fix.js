angular.module('httpReal', ['ng'])
    .config(['$provide', function($provide) {
        $provide.decorator('$httpBackend', function() {
            return angular.injector(['ng']).get('$httpBackend');
        });
    }])
    .service('httpReal', ['$rootScope', function($rootScope) {
        this.submit = function() {
            $rootScope.$digest();
        };
    }]);