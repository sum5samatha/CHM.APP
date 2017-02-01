(function () {
    // "use strict";

    angular.module('CHM').controller('EditInterventionsListController', EditInterventionsListController);

    EditInterventionsListController.$inject = ['$rootScope', '$q', '$filter', '$scope', '$location', '$uibModalInstance', 'ngTableParams', 'toastr', 'ResidentsService', 'InterventionsService', 'Intervention', 'onlineStatus','CommonService'];

    function EditInterventionsListController($rootScope, $q, $filter, $scope, $location, $uibModalInstance, ngTableParams, toastr, ResidentsService, InterventionsService, Intervention, onlineStatus,CommonService) {
        var vm = this;
        ///////////////////////////////
        $scope.online = onlineStatus.isOnline();
       
        $scope.onlineStatus = onlineStatus;
        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;
            vm.online = angular.copy($scope.online);
         });


        var LoadData = function () {
  
            vm.InterventionData = [];
            var objTiming = { Id: "", Name: "", StartDate: [], StartTime: new Date(), EndTime: new Date() };

            objTiming.Id = Intervention.ID;
            objTiming.Name = Intervention.Actions_Days.Action.Section_Intervention.InterventionTitle;
            objTiming.StartDate = new Date(moment(Intervention.PlannedStartDate));
           
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

            objTiming.StartTime = PlannedStartTime;
            objTiming.EndTime = PlannedEndTime;
            vm.InterventionData.push(objTiming);
        }

        LoadData();
        vm.OpenRecurrenceStartDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.InteventionDateOpened = true;
        }

        vm.CloseRecurrencePattern = function () {
            $uibModalInstance.dismiss();
        };

        vm.UpdateIntervention = function (obj) {
         var deferredArr = [];
            var deferredActions = $q.defer();
            deferredArr.push(deferredActions.promise);
            if ($scope.online == true) {
                var objUpdateIntervention = { Id: "", Name: "", StartDate: [], StartTime: "", EndTime: "" };
                objUpdateIntervention.Id = obj.Id;
                objUpdateIntervention.Name = obj.Name;
                objUpdateIntervention.StartDate = obj.StartDate;
                objUpdateIntervention.StartTime = moment(obj.StartTime).format('HH:mm:ss');
                objUpdateIntervention.EndTime = moment(obj.EndTime).format('HH:mm:ss');
             
                InterventionsService.UpdategeneratedInterventions(objUpdateIntervention).then(
                    function (response) {
               
                        var interventions = response.data;

                        CommonService.UpdateInterventions(app.db, interventions).then(function (response) {
                            toastr.success('Intervention deleted successfully in offline.');

                        },
                        function (err) {
                            toastr.error('An error occured while deleting  UpdateOfflineInterventionsAdhocInterventions offline AdhocIntervention.');
                        })
                        toastr.success('Updated Intervention sucessfully');
                        // deferredActions.resolve();

                        $uibModalInstance.close(deferredArr);
                    },
                    function (err) {
                        toastr.error('An error occured while updating Intervention.');

                    }

                    );

            }
            else {
                var objUpdateIntervention = { Id: "", Name: "", StartDate: [], StartTime: "", EndTime: "" };
                objUpdateIntervention.Id = obj.Id;
                objUpdateIntervention.Name = obj.Name;
                objUpdateIntervention.StartDate = obj.StartDate;
                var RequiredDate = moment(obj.StartDate).format('YYYY-MM-DD');// obj.StartDate;
                objUpdateIntervention.StartTime = RequiredDate + " " + moment(obj.StartTime).format('HH:mm:ss');
                objUpdateIntervention.EndTime = RequiredDate + " " + moment(obj.EndTime).format('HH:mm:ss');




                CommonService.UpdateInterventions(app.db, objUpdateIntervention).then(function (response) {
                    
                    toastr.success('Intervention deleted successfully in offline.');

                },
                         function (err) {
                             toastr.error('An error occured while deleting  UpdateOfflineInterventionsInterventions offline AdhocIntervention.');
                         })
                toastr.success('Updated Intervention sucessfully');
                $uibModalInstance.close(deferredArr);
            }



        }

    }


}());
