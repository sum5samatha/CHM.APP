(function () {
    // "use strict";

    angular.module('CHM').controller('InterventionsController', InterventionsController);

    InterventionsController.$inject = ['$rootScope', '$q', '$window', '$rootScope', '$filter', '$scope', '$location', '$uibModal', 'SweetAlert', 'ngTableParams', 'toastr', 'ResidentsService', 'InterventionsService', 'onlineStatus'];

    function InterventionsController($rootScope, $q, $window, $rootScope, $filter, $scope, $location, $uibModal, SweetAlert, ngTableParams, toastr, ResidentsService, InterventionsService, onlineStatus) {
        var vm = this;
        vm.show = false;
        vm.Residents = [];
        /////////////////////////


        var arrActions = [];
        var arrAction_Days = [];
        var arrInterventions = [];
        var arrSectionInterventions = [];

        var arrResidents = [];




        var deferredArr = [];
        var deferredActions = $q.defer();
        var deferredAction_Days = $q.defer();
        var deferredInterventions = $q.defer();
        var deferredSection_Interventions = $q.defer();
        // var deferredJoinedData = $q.defer();

        deferredArr.push(deferredActions.promise);
        deferredArr.push(deferredAction_Days.promise);
        deferredArr.push(deferredInterventions.promise);
        deferredArr.push(deferredSection_Interventions.promise);
        //deferredArr.push(deferredJoinedData.promise);

        var renderActions = function (tx, rs) {
            arrActions = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrActions.push(rs.rows.item(i));
            }
            deferredActions.resolve();
        };

        var renderAction_Days = function (tx, rs) {
            arrAction_Days = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrAction_Days.push(rs.rows.item(i));
            }
            deferredAction_Days.resolve();
        };

        var renderInterventions = function (tx, rs) {
            arrInterventions = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrInterventions.push(rs.rows.item(i));
            }



            for (var i = 0; i < arrInterventions.length; i++) {
                if (arrInterventions[i].Status == null)
                    arrInterventions[i].Status = "Pending";
                else if (arrInterventions[i].Status == "NotCompleted")
                    arrInterventions[i].Status = "Not Completed";
                else if (arrInterventions.Status == "PartiallyCompleted")
                    arrInterventions[i].Status = "Partially Completed";
                //  arrInterventions.push(rs.rows.item(i));
            }
            deferredInterventions.resolve();
        };

        var renderSection_Interventions = function (tx, rs) {
            arrSectionInterventions = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrSectionInterventions.push(rs.rows.item(i));
            }
            deferredSection_Interventions.resolve();
        };
        //////////////////////////////////////////

        var renderResidents = function (tx, rs) {
           
            arrResidents = [];
            vm.Residents = [];
            $rootScope.$broadcast("loader_show");
            for (var i = 0; i < rs.rows.length; i++) {
                arrResidents.push(rs.rows.item(i));
               
                if (arrResidents.length == rs.rows.length)
                {
                    vm.Residents = arrResidents;
                    $rootScope.$broadcast("loader_hide");
                }
            }
         
        };
      


        var LoadPersonalInforamtion = function () {
            InterventionsService.GetInterventionsForResident(vm.ResidentIDs, vm.todayDate, vm.todayDate).then(
                function (response) {

                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            if (response.data[i].Status == null)
                                response.data[i].Status = "Pending";
                            else if (response.data[i].Status == "NotCompleted")
                                response.data[i].Status = "Not Completed";
                            else if (response.data[i].Status == "PartiallyCompleted")
                                response.data[i].Status = "Partially Completed";
                            else {

                            }

                            var stillUtc = moment.utc(response.data[i].PlannedStartDate).toDate();
                            var localDateTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
                            var starttime = moment(localDateTime).format('HH:mm:ss');
                            var startTimeParts = starttime.split(':');
                            var PlannedStartTime = new Date().setHours(startTimeParts[0], startTimeParts[1]);


                            var stillEndUtc = moment.utc(response.data[i].PlannedEndDate).toDate();
                            var localEndDateTime = moment(stillEndUtc).local().format('YYYY-MM-DD HH:mm:ss');
                            var endtime = moment(localEndDateTime).format('HH:mm:ss');
                            var endTimeParts = endtime.split(':');
                            var PlannedEndTime = new Date().setHours(endTimeParts[0], endTimeParts[1]);
                            response.data[i].PlannedStartDate = PlannedStartTime;
                            response.data[i].PlannedEndDate = PlannedEndTime;
                        }

                      
                    }
                   


                    vm.Interventions = response.data;

                           $scope.AllIntervention.$params.page = 1;
                    $scope.AllIntervention.reload();


                },
                function (err) {
                    toastr.error('An error occurred while retrieving interventions.');
                }
            );

        }


        function GetAllOfflineData() {
            $rootScope.$broadcast("loader_show");
            app.GetOfflineActions(renderActions);
            app.GetOfflineAction_Days(renderAction_Days);
            app.GetOfflineInterventions(renderInterventions);
            app.GetOfflineSection_Interventions(renderSection_Interventions);
            $rootScope.$broadcast("loader_hide");
        }


        $scope.onlineStatus = onlineStatus;
        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;


            vm.online = angular.copy($scope.online);
            vm.ResidentIDs = "";
            vm.InterventionDate = "";
            vm.Interventions = [];
            $scope.AllIntervention.reload();
            vm.ClearDate();
            GetResidentsOnOnlineCondition();

        });




        var LoadOffline = function () {


            vm.FilteredActionsDataArray = [];

            for (var i = 0; i < arrActions.length; i++) {
                if (arrActions[i].ResidentID == vm.ResidentIDs && arrActions[i].IsActive == "true") {

                    vm.FilteredActionsDataArray.push(arrActions[i]);
                }
            }

            vm.FilteredAction_DayssDataArray = [];

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                for (var j = 0; j < arrAction_Days.length; j++) {
                    if (vm.FilteredActionsDataArray[i].ID == arrAction_Days[j].ActionID && arrAction_Days[j].IsActive == "true") {

                        vm.FilteredAction_DayssDataArray.push(arrAction_Days[j]);
                    }
                }

            }

            vm.FilteredInterventions = [];
            var DailyDairyDate = moment(vm.todayDate).format('YYYY-MM-DD');

            for (var i = 0; i < vm.FilteredAction_DayssDataArray.length; i++) {
                for (var j = 0; j < arrInterventions.length; j++) {
                    if (vm.FilteredAction_DayssDataArray[i].ID == arrInterventions[j].Action_DayID && moment(arrInterventions[j].PlannedStartDate).format('YYYY-MM-DD') <= DailyDairyDate && moment(arrInterventions[j].PlannedEndDate).format('YYYY-MM-DD') >= DailyDairyDate && arrInterventions[j].IsActive == "true") {
                        //&& arrInterventions[j].PlannedStartDate <= Date && arrInterventions[j].PlannedEndDate >= Date
                        vm.FilteredInterventions.push(arrInterventions[j]);
                    }
                }

            }


            vm.FilteredSection_Interventions = [];

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                for (var j = 0; j < arrSectionInterventions.length; j++) {
                    if (vm.FilteredActionsDataArray[i].Section_InterventionID == arrSectionInterventions[j].ID && arrSectionInterventions[j].IsActive == "true") {

                        vm.FilteredSection_Interventions.push(arrSectionInterventions[j]);
                    }
                }

            }

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                vm.FilteredActionsDataArray[i].Section_Intervention = {};
                for (var j = 0; j < vm.FilteredSection_Interventions.length; j++) {
                    if (vm.FilteredSection_Interventions[j].ID == vm.FilteredActionsDataArray[i].Section_InterventionID) {
                        vm.FilteredActionsDataArray[i].Section_Intervention = vm.FilteredSection_Interventions[j];
                        break;
                    }
                }
            }

            for (var i = 0; i < vm.FilteredAction_DayssDataArray.length; i++) {
                vm.FilteredAction_DayssDataArray[i].Action = {};
                for (var j = 0; j < vm.FilteredActionsDataArray.length; j++) {
                    if (vm.FilteredActionsDataArray[j].ID == vm.FilteredAction_DayssDataArray[i].ActionID) {
                        vm.FilteredAction_DayssDataArray[i].Action = vm.FilteredActionsDataArray[j];
                        break;
                    }
                }
            }

            for (var i = 0; i < vm.FilteredInterventions.length; i++) {
                vm.FilteredInterventions[i].Actions_Days = {};
                for (var j = 0; j < vm.FilteredAction_DayssDataArray.length; j++) {
                    if (vm.FilteredAction_DayssDataArray[j].ID == vm.FilteredInterventions[i].Action_DayID) {
                        vm.FilteredInterventions[i].Actions_Days = vm.FilteredAction_DayssDataArray[j];
                        break;
                    }
                }
                var stillUtc = moment.utc(vm.FilteredInterventions[i].PlannedStartDate).toDate();
                var localDateTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
                var starttime = moment(localDateTime).format('HH:mm:ss');
                var startTimeParts = starttime.split(':');
                var PlannedStartTime = new Date().setHours(startTimeParts[0], startTimeParts[1]);


                var stillEndUtc = moment.utc(vm.FilteredInterventions[i].PlannedEndDate).toDate();
                var localEndDateTime = moment(stillEndUtc).local().format('YYYY-MM-DD HH:mm:ss');
                var endtime = moment(localEndDateTime).format('HH:mm:ss');
                var endTimeParts = endtime.split(':');
                var PlannedEndTime = new Date().setHours(endTimeParts[0], endTimeParts[1]);

                vm.FilteredInterventions[i].PlannedStartDate = PlannedStartTime;
                vm.FilteredInterventions[i].PlannedEndDate = PlannedEndTime;
            }
           

            vm.Interventions = vm.FilteredInterventions;
            $scope.AllIntervention.$params.page = 1;
            $scope.AllIntervention.reload();
            $rootScope.$broadcast("loader_hide");




        }







        var GetInterventionsListData = function () {
            if ($scope.online == true) {
                LoadPersonalInforamtion();
            }
            else {
                $rootScope.$broadcast("loader_show");
                deferredActions = $q.defer();
                deferredAction_Days = $q.defer();
                deferredInterventions = $q.defer();
                deferredSection_Interventions = $q.defer();

                deferredArr = [];

                deferredArr.push(deferredActions.promise);
                deferredArr.push(deferredAction_Days.promise);
                deferredArr.push(deferredInterventions.promise);
                deferredArr.push(deferredSection_Interventions.promise);



                GetAllOfflineData();

                $q.all(deferredArr).then(
                    function (response) {
                       
                        LoadOffline();
                    },
                    function (err) {
                        console.log('err');
                    }
                );
            }
        };

        //GetInterventionsListData();










        /////////////////////////////////////////

        vm.Interventions = [];
        // vm.InterventionDate = [];
        vm.openIntervention = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            if (vm.ResidentIDs)
                vm.InterventionDateOpened = true;
            else
                toastr.info('Please Choose Resident.');
        };


        var GetResidentsOnOnlineCondition = function () {
            
            if ($scope.online == true) {
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
            else {
               
                app.GetOfflineResidentsIsAccepted(renderResidents);
                
            }
           
        };

        GetResidentsOnOnlineCondition();



        vm.ClearDate = function () {
            vm.InterventionDate = null;
            //vm.Interventions = null;
            vm.show = false;
            //$scope.AllIntervention.$params.page = 1;
            //$scope.AllIntervention.reload();
        }

        vm.GetInterventionDate = function (obj) {
            debugger
            vm.show = true;
            var todayDate = moment(new Date(obj)).format('YYYY-MM-DD');
            vm.todayDate = todayDate;
            GetInterventionsListData();

        }



        vm.EditIntervention = function (obj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/Interventions/EditInterventionList/EditInterventionsList.html?v=1',
                controller: 'EditInterventionsListController',
                controllerAs: 'vm',
                resolve: {
                    Intervention: function () {
                        return obj;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });

            modalInstance.result.then(
            function (response) {
                $q.all(response).then(
                     function (res) {
                         GetResidentsOnOnlineCondition();
                         $scope.AllIntervention.reload();
                         // LoadPersonalInforamtion(vm.todayDate);
                     }

             );
            }, function () {

            });

        }

        vm.ViewIntervention = function (obj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/Interventions/ViewInterventionList/ViewInterventions.html',
                controller: 'ViewInterventionsController',
                controllerAs: 'vm',
                resolve: {
                    Intervention: function () {
                        return obj;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });

            modalInstance.result.then(
            function (response) {
                $q.all(response).then(
                     function (res) {
                         //GetResidentsOnOnlineCondition();
                         //LoadPersonalInforamtion(vm.todayDate);
                     }

             );
            }, function () {

            });
        }

        vm.DeleteIntervention = function (obj) {


            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to mark this Intervention for deletion?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            };

            SweetAlert.swal(sweetAlertOptions,
                function (isConfirm) {
                    if (isConfirm) {

                        if ($scope.online == true) {
                            InterventionsService.DeactiveGeneratedIntervention(obj.ID).then(
                                function () {
                                    toastr.success('Deleted Intervention sucessfully');
                                    vm.ResidentIDs = "";
                                    vm.InterventionDate = "";
                                    vm.Interventions = [];
                                    $scope.AllIntervention.reload();
                                    vm.ClearDate();
                                    GetResidentsOnOnlineCondition();
                                    //  GetResidentsOnOnlineCondition();
                                    // LoadPersonalInforamtion(vm.todayDate);
                                },
                                function (err) {
                                    toastr.error('An error occurred while deleting interventions.');
                                }

                            );
                        }

                        else {
                            //Delete Offline Code
                            app.DeleteOfflineInterventions(obj);
                            toastr.success('Deleted Intervention sucessfully');
                            vm.ResidentIDs = "";
                            vm.InterventionDate = "";
                            vm.Interventions = [];
                            GetResidentsOnOnlineCondition();
                            $scope.AllIntervention.reload();
                            vm.ClearDate();

                            // GetResidentsOnOnlineCondition();
                        }


                    }
                }
            );
        }


        $scope.AllIntervention = new ngTableParams({
            page: 1,            // show first page
            count: 3,          // count per page
            sorting: {
                Author: 'asc'     // initial sorting
            }
        }, {
            total: vm.Interventions.length, // length of data
            counts: [],
            getData: function ($defer, params) {
                var data = vm.Interventions;

                var orderedData = params.sorting() ?
                                    $filter('orderBy')(data, params.orderBy()) :
                                    data;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total(orderedData.length);
            }
        });
        $scope.AllIntervention.settings().$scope = $scope;


    }


}());