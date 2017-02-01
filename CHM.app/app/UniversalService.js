(function () {
    "use strict";

    angular.module('CHM').factory('CommonService', CommonService);

    CommonService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function CommonService($rootScope, $q, $http, $window) {

        var objCommonService = {};

        objCommonService.GetActiveResidents = getActiveResidents;

        return objCommonService;

        

    }

}());