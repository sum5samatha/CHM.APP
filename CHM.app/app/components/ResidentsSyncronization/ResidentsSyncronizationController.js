(function () {
    //"use strict";

    angular.module('CHM').controller('ResidentsSyncronizationController', ResidentsSyncronizationController);

    ResidentsSyncronizationController.$inject = ['$scope', '$rootScope', '$q', '$window', '$uibModalInstance', '$filter', '$location', 'toastr', 'residentId', 'ResidentsService', 'InterventionsService', 'onlineStatus'];

    function ResidentsSyncronizationController($scope, $rootScope, $q, $window, $uibModalInstance, $filter, $location, toastr, residentId, ResidentsService, InterventionsService, onlineStatus) {
        var vm = this;

        ResidentsService.GetActiveResidents().then(
                   function (response) {
                       vm.AllResidents = response.data;
                       vm.Residents = [];
                       for (var i = 0; i < vm.AllResidents.length; i++) {
                           vm.Residents.push(vm.AllResidents[i].Resident);

                       }
                   },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })


    }

}());