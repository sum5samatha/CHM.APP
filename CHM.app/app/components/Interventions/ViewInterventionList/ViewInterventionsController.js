(function () {
    // "use strict";

    angular.module('CHM').controller('ViewInterventionsController', ViewInterventionsController);

    ViewInterventionsController.$inject = ['$rootScope', '$q', '$filter', '$scope', '$location', '$uibModalInstance', 'ngTableParams', 'toastr', 'ResidentsService', 'InterventionsService', 'Intervention'];

    function ViewInterventionsController($rootScope, $q, $filter, $scope, $location, $uibModalInstance, ngTableParams, toastr, ResidentsService, InterventionsService, Intervention) {
        var vm = this;



        var stillUtc = moment.utc(Intervention.PlannedStartDate).toDate();
        var localDateTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
        var starttime = moment(localDateTime).format('HH:mm:ss');
        var startTimeParts = starttime.split(':');
        var PlannedStartTime = new Date().setHours(startTimeParts[0], startTimeParts[1]);


        var stillEndUtc = moment.utc(Intervention.PlannedEndDate).toDate();
        var localEndDateTime = moment(stillEndUtc).local().format('YYYY-MM-DD HH:mm:ss');
        var endtime = moment(localEndDateTime).format('HH:mm:ss');
        var endTimeParts = endtime.split(':');
        var PlannedEndTime = new Date().setHours(endTimeParts[0], endTimeParts[1]);
       Intervention.PlannedStartDate = PlannedStartTime;
       Intervention.PlannedEndDate = PlannedEndTime;

        vm.ViewIntervention = Intervention;
       
        

        vm.CloseRecurrencePattern = function () {
            $uibModalInstance.dismiss();
        };
    }


}());
