(function () {
    //"use strict";

    angular.module('CHM').controller('AdhocInterventionListController', AdhocInterventionListController);

    AdhocInterventionListController.$inject = ['$q', '$sce','$uibModal', '$window', '$rootScope', '$filter', '$stateParams', '$state', 'toastr', 'UsersService', 'ngTableParams', '$scope', 'ResidentsService', 'InterventionsService', 'onlineStatus', 'SweetAlert', 'CommonService'];

    function AdhocInterventionListController($q, $sce, $uibModal, $window, $rootScope, $filter, $stateParams,$state, toastr, UsersService, ngTableParams, $scope, ResidentsService, InterventionsService, onlineStatus, SweetAlert, CommonService) {

        var vm = this;
        vm.AdhocIntervention = [];
        vm.ResidentId = $stateParams.ResidentId;

        var arrActions = [];
        var arrResidents = [];
        var arrSectionInterventions = [];



        var deferredArr = [];
        var deferredActions = $q.defer();
        var deferredResidents = $q.defer();
        var deferredSection_Interventions = $q.defer();
        // var deferredJoinedData = $q.defer();

        deferredArr.push(deferredActions.promise);
        deferredArr.push(deferredResidents.promise);
        deferredArr.push(deferredSection_Interventions.promise);
        //deferredArr.push(deferredJoinedData.promise);

        var renderActions = function (tx, rs) {
            arrActions = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrActions.push(rs.rows.item(i));
            }
            deferredActions.resolve();
        };

        var renderResidents = function (tx, rs) {
            arrResidents = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrResidents.push(rs.rows.item(i));
            }
            deferredResidents.resolve();
        };


        var renderSection_Interventions = function (tx, rs) {
            arrSectionInterventions = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrSectionInterventions.push(rs.rows.item(i));
            }
            deferredSection_Interventions.resolve();
        };

        function GetAllOfflineData() {
            app.GetOfflineActions(renderActions);
            app.GetOfflineResidents(renderResidents);
            app.GetOfflineSection_Interventions(renderSection_Interventions);
        }

        $scope.onlineStatus = onlineStatus;
        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;
            vm.AdhocIntervention = [];
            
                GetadhocInterventionsData();
        
          
            $scope.AllIntervention.reload();
        });




        var GetAdhocIntervention = function () {
            ResidentsService.GetActiveAdhocSectionIntervention($rootScope.OrganizationId).then(
           function (response) {
             
               vm.AdhocIntervention = response.data;
               $scope.AllIntervention.$params.page = 1;
               $scope.AllIntervention.reload();
               $state.go('AdhocIntervention');
           }, function (err) {

           })
        }


        ///Code

        var LoadOffline = function () {


            vm.FilteredActionsDataArray = [];

            for (var i = 0; i < arrActions.length; i++) {
                if (arrActions[i].IsAdhocIntervention == "true" && arrActions[i].IsActive == "true") {

                    vm.FilteredActionsDataArray.push(arrActions[i]);
                }
            }

            vm.FilteredResidentsDataArray = [];

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                for (var j = 0; j < arrResidents.length; j++) {
                    if (vm.FilteredActionsDataArray[i].ResidentID == arrResidents[j].ID && arrResidents[j].IsActive == "true") {

                        vm.FilteredResidentsDataArray.push(arrResidents[j]);
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
            ////////////////////////////////////////////////

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                vm.FilteredActionsDataArray[i].Section_Intervention = {};
                vm.FilteredActionsDataArray[i].Resident = {};
                for (var j = 0; j < vm.FilteredSection_Interventions.length; j++) {
                    if (vm.FilteredSection_Interventions[j].ID == vm.FilteredActionsDataArray[i].Section_InterventionID) {
                        vm.FilteredActionsDataArray[i].Section_Intervention = vm.FilteredSection_Interventions[j];
                        break;
                    }
                }

                for (var k = 0; k < vm.FilteredResidentsDataArray.length; k++) {
                    if (vm.FilteredResidentsDataArray[k].ID == vm.FilteredActionsDataArray[i].ResidentID) {
                        vm.FilteredActionsDataArray[i].Resident = vm.FilteredResidentsDataArray[k];
                        break;
                    }
                }


            }

            vm.AdhocIntervention = vm.FilteredActionsDataArray;

            $scope.AllIntervention.$params.page = 1;
            $scope.AllIntervention.reload();
        }


        var GetadhocInterventionsData = function () {
        
            if ($scope.online == true) {
                vm.AdhocIntervention = [];
                GetAdhocIntervention();
            }
            else {
                deferredActions = $q.defer();
                deferredResidents = $q.defer();
                deferredSection_Interventions = $q.defer();

                deferredArr = [];

                deferredArr.push(deferredActions.promise);
                deferredArr.push(deferredResidents.promise);
                deferredArr.push(deferredSection_Interventions.promise);



                GetAllOfflineData();
             

                $q.all(deferredArr).then(
                    function (response) {
                        LoadOffline();
                    },
                    function (err) {
                       
                    }
                );
            }
        };

        //GetadhocInterventionsData();

        $scope.AllIntervention = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                Created: 'desc'     // initial sorting
            }
        }, {
            total: vm.AdhocIntervention.length, // length of data
            counts: [],
            getData: function ($defer, params) {
                var data = vm.AdhocIntervention;

                var orderedData = params.sorting() ?
                                    $filter('orderBy')(data, params.orderBy()) :
                                    data;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total(orderedData.length);
            }
        });
        $scope.AllIntervention.settings().$scope = $scope;

        vm.GenrateIntervention = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/AdhocIntervention/NewAdhocIntervention/NewAdhocIntervention.html',
                controller: 'NewAdhocInterventionController',
                controllerAs: 'vm',
                resolve: {
                    residentId: function () {
                        return vm.ResidentId;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });
            modalInstance.result.then(
            function (response) {
                $q.all(response).then(
                     function (res) {
                        
                         GetadhocInterventionsData();
                         $scope.AllIntervention.reload();
                     }

             );
            }, function () {

            });




        }

        vm.DeleteAdhocIntervention = function (objAction) {
          
                var sweetAlertOptions = {
                    title: "",
                    text: "Are you sure you want to mark this Adhoc Intervention for deletion?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!"
                };

                SweetAlert.swal(sweetAlertOptions, function (isConfirm) {
                    if (isConfirm) {
                        if ($scope.online == true) {
                            InterventionsService.DeActiveAdhocIntervention(objAction).then(function (response) {
                              
                                     CommonService.UpdateOfflineActionAdhocInterventions(app.db, response.data.ID).then(function (response1) {
                                         var actionDays = [];
                                         var interventions = [];
                                         for (var i = 0; i < response.data.Actions_Days.length; i++) {
                                             actionDays.push(response.data.Actions_Days[i]);
                                             for (var j = 0; j < response.data.Actions_Days[i].Interventions.length; j++) {
                                                 interventions.push(response.data.Actions_Days[i].Interventions[j]);
                                             }
                                         }
                                         if (actionDays.length > 0) {
                                             CommonService.UpdateOfflineActionDaysAdhocInterventions(app.db, actionDays).then(function (response2) {
                                                 //toastr.success('Adhoc Intervention ActionDays deleted successfully in offline.');
                                             },
                                             function (err) {
                                                 toastr.error('An error occured while deleting ActionDays offline AdhocIntervention.');
                                             })
                                         }
                                         if (interventions.length > 0) {
                                             CommonService.UpdateOfflineInterventionsAdhocInterventions(app.db, interventions).then(function (response3) {
                                                 //toastr.success('Adhoc Intervention Interventions deleted successfully in offline.');
                                                 $scope.AllIntervention.reload();
                                                 $state.go('AdhocIntervention');

                                             },
                                            function (err) {
                                                toastr.error('An error occured while deleting AdhocIntervention.');
                                            })
                                         } else {
                                          
                                             $state.go('AdhocIntervention');
                                          
                                         }
                                       
                                        
                                     },
                                     function (err) {
                                         toastr.error('An error occured while deleting offline AdhocIntervention.');
                                     })
                                 }, function (err) {
                                     toastr.error('An error occurred while deleting Ad hoc Intervention.');
                                 })
                          
                        }
                        else {
                            CommonService.DeleteOfflineAdhocInterventions(app.db, objAction).then(function (response) {
                                toastr.success('Deleted Ad hoc Intervention sucessfully');
                                GetadhocInterventionsData();
                                $scope.AllIntervention.reload();
                            }, function error(err) {
                              
                                toastr.error('An error occured while deleting Intervention.');
                            })
                        }
                    }
                })
        }
      }

}());