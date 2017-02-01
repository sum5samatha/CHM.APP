(function () {
    //  "use strict";

    angular.module('CHM').controller('HandOverNotesController', HandOverNotesController);

    HandOverNotesController.$inject = ['$q', '$sce', '$uibModal', '$window', '$filter', '$state', '$stateParams', 'toastr', 'ResidentsService', 'InterventionsService', '$rootScope', 'SweetAlert', '$scope', 'onlineStatus'];

    function HandOverNotesController($q, $sce, $uibModal, $window, $filter, $state, $stateParams, toastr, ResidentsService, InterventionsService, $rootScope, SweetAlert, $scope, onlineStatus) {

        var vm = this;
        vm.Residents = [];
        vm.AllActiveResidents = [];

        vm.IsSecondaryReadonly = $rootScope.IsSecondaryRead;
        var render1Count = 0;

        vm.openHandOverNotes = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.HandOverNotesOpened = true;
        };


        vm.HandOverNotesDate = new Date();

        var getAllResidents = function () {
            //ResidentsService.GetActiveResidents().then(
            ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(

                function (response) {
                    vm.AllActiveResidents = response.data;
                    if (response.data.length > 0)
                        LoadHandOverNote(vm.HandOverNotesDate);

                },
                function (err) {
                    toastr.error('An error occurred while retrieving Residents.');
                }
            );
        };

        vm.GetHandOverNote = function (HandOverNoteDate) {

            var HandOverNoteDate = moment(new Date(HandOverNoteDate)).format('YYYY-MM-DD');
            vm.HandOverNoteDate = HandOverNoteDate;
            GetResidentsByDate();
        }

        var LoadHandOverNote = function (HandOverNoteDate) {

            vm.ResidentIntervention = [];
            var HandOverNoteDate = moment(new Date(HandOverNoteDate)).format('YYYY-MM-DD');


            vm.AllActiveResidents.forEach(function (item, index) {

                var arrResidentIntervention = { Name: "", lstarryIntervention: [], lstSummary: [] };
                arrResidentIntervention.Name = item.Resident.FirstName + " " + item.Resident.LastName;

                InterventionsService.GetStartedInterventionForResident(item.Resident.ID, HandOverNoteDate, HandOverNoteDate).then(
             function (response) {
                 arrResidentIntervention.lstarryIntervention = response.data;
                 if (arrResidentIntervention.lstarryIntervention.length > 0) {
                     for (var i = 0; i < arrResidentIntervention.lstarryIntervention.length; i++) {
                         var objAnswerText = '';
                         if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers.length > 0) {
                             for (var j = 0; j < arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers.length; j++) {
                                 if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText != null && arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].IsActive == true)
                                     objAnswerText += arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText + ',';
                             }
                         }
                         arrResidentIntervention.lstarryIntervention[i].Summary = objAnswerText.substring(0, objAnswerText.length - 1);;
                     }
                     vm.ResidentIntervention.push(arrResidentIntervention);
                 }
             },
             function (err) {
                 toastr.error('An error occurred while retrieving interventions.');
             }
              );

            });

        }

        var ResidentSummary = function (ResidentID, arrResidentIntervention) {

            ResidentsService.GetResidentSummaryByID(ResidentID).then(
    function (response) {
        vm.ResidentSummary = response.data;

        if (vm.ResidentSummary.length > 0) {
            LoadResidentSummary(vm.ResidentSummary, arrResidentIntervention.lstSummary);

        }
    },
    function (err) {
        toastr.error('An error occurred while retrieving resident summary.');
    }


    );
        }




        //var deferredArr = [];
        //var deferredResidents = $q.defer();
        //var deferredActions = $q.defer();
        //var deferredAction_Days = $q.defer();
        //var deferredInterventions = $q.defer();
        //var deferredSection_Interventions = $q.defer();
        //var defferedInterventions_Resident_Answers = $q.defer();


        var arryResidents = [];
        var arrActions = [];
        var arrAction_Days = [];
        var arrInterventions = [];
        var arrSectionInterventions = [];
        var arrInterventionsResidentAnswers = [];



        //deferredArr.push(deferredResidents.promise);
        //deferredArr.push(deferredActions.promise);
        //deferredArr.push(deferredAction_Days.promise);
        //deferredArr.push(deferredInterventions.promise);
        //deferredArr.push(deferredSection_Interventions.promise);
        //deferredArr.push(defferedInterventions_Resident_Answers.promise);


        //var renderResidents = function (tx, rs) {
        //    arryResidents = [];
        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arryResidents.push(rs.rows.item(i));
        //    }

        //    deferredResidents.resolve();
        //};

        //var renderActions = function (tx, rs) {
        //    arrActions = [];

        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arrActions.push(rs.rows.item(i));
        //    }

        //    deferredActions.resolve();
        //};

        //var renderAction_Days = function (tx, rs) {

        //    arrAction_Days = [];
        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arrAction_Days.push(rs.rows.item(i));
        //    }

        //    deferredAction_Days.resolve();
        //};

        //var renderInterventions = function (tx, rs) {
        //    arrInterventions = [];

        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arrInterventions.push(rs.rows.item(i));
        //    }

        //    deferredInterventions.resolve();
        //};

        //var renderSection_Interventions = function (tx, rs) {
        //    arrSectionInterventions = [];

        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arrSectionInterventions.push(rs.rows.item(i));
        //    }

        //    deferredSection_Interventions.resolve();
        //};

        //var renderInterventionsResidentAnswers = function (tx, rs) {
        //    arrInterventionsResidentAnswers = [];
        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arrInterventionsResidentAnswers.push(rs.rows.item(i));
        //    }
        //    defferedInterventions_Resident_Answers.resolve();
        //};


        //var renderInterventionsResidentAnswers = function (tx, rs) {
        //    arrInterventionsResidentAnswers = [];
        //    for (var i = 0; i < rs.rows.length; i++) {
        //        arrInterventionsResidentAnswers.push(rs.rows.item(i));
        //    }
        //    defferedInterventions_Resident_Answers.resolve();
        //};



        $scope.onlineStatus = onlineStatus;


        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;
            if ($scope.online == true) {
                getAllResidents();
            }
            else {

                GetOfflineData();
            }
        });


        var GetOfflineData = function () {

            arryResidents = [];
            arrActions = [];
            arrAction_Days = [];
            arrInterventions = [];
            arrSectionInterventions = [];
            arrInterventionsResidentAnswers = [];

            deferredResidents = $q.defer();
            deferredActions = $q.defer();
            deferredAction_Days = $q.defer();
            deferredInterventions = $q.defer();
            deferredSection_Interventions = $q.defer();
            defferedInterventions_Resident_Answers = $q.defer();

            deferredArr = [];
            deferredArr.push(deferredResidents.promise);
            deferredArr.push(deferredActions.promise);
            deferredArr.push(deferredAction_Days.promise);
            deferredArr.push(deferredInterventions.promise);
            deferredArr.push(deferredSection_Interventions.promise);
            deferredArr.push(defferedInterventions_Resident_Answers.promise);


            var renderResidents = function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    arryResidents.push(rs.rows.item(i));
                }
                deferredResidents.resolve();
            };

            var renderActions = function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    arrActions.push(rs.rows.item(i));
                }
                deferredActions.resolve();
            };

            var renderAction_Days = function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    arrAction_Days.push(rs.rows.item(i));
                }
                deferredAction_Days.resolve();
            };

            var renderInterventions = function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    arrInterventions.push(rs.rows.item(i));
                }
                deferredInterventions.resolve();
            };

            var renderSection_Interventions = function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    arrSectionInterventions.push(rs.rows.item(i));
                }
                deferredSection_Interventions.resolve();
            };

            var renderInterventionsResidentAnswers = function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    arrInterventionsResidentAnswers.push(rs.rows.item(i));
                }
                defferedInterventions_Resident_Answers.resolve();
            };

            $q.all(deferredArr).then(function (response) {
                LoadOffline();
            },
            function (err) {
            });

            function GetAllOfflineData() {
                app.GetOfflineResidents(renderResidents);
                app.GetOfflineActions(renderActions);
                app.GetOfflineAction_Days(renderAction_Days);
                app.GetOfflineInterventions(renderInterventions);
                app.GetOfflineSection_Interventions(renderSection_Interventions);
                app.GetOfflineInterventionsResidentAnswers(renderInterventionsResidentAnswers);
            }
            GetAllOfflineData();
        }


        var LoadOffline = function () {

            //Residents
            vm.FilteredResidentsDataArray = angular.copy(arryResidents);

            //Actions
            vm.FilteredActionsDataArray = angular.copy(arrActions);

            //Actions and Action_Days

            vm.FilteredAction_DayssDataArray = [];

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                for (var j = 0; j < arrAction_Days.length; j++) {
                    if (vm.FilteredActionsDataArray[i].ID == arrAction_Days[j].ActionID && arrAction_Days[j].IsActive == 'true') {

                        vm.FilteredAction_DayssDataArray.push(arrAction_Days[j]);
                    }
                }
            }

            //Intervention_Resident_Answers
            vm.FilteredInterventionResidentAnswersDataArray = angular.copy(arrInterventionsResidentAnswers);


            //Action_Days and Interventions
            vm.FilteredInterventions = [];
            var HandOverNotes = moment(vm.HandOverNotesDate).format('YYYY-MM-DD');

            for (var i = 0; i < vm.FilteredAction_DayssDataArray.length; i++) {
                for (var j = 0; j < arrInterventions.length; j++) {
                    if (vm.FilteredAction_DayssDataArray[i].ID == arrInterventions[j].Action_DayID && moment(arrInterventions[j].PlannedStartDate).format('YYYY-MM-DD') <= HandOverNotes && moment(arrInterventions[j].PlannedEndDate).format('YYYY-MM-DD') >= HandOverNotes && arrInterventions[j].IsActive == 'true' && arrInterventions[j].Status != null && arrInterventions[j].IsHandOverNotes == 'True') {
                        //&& arrInterventions[j].PlannedStartDate <= Date && arrInterventions[j].PlannedEndDate >= Date
                        vm.FilteredInterventions.push(arrInterventions[j]);
                    }
                }
            }

            //Actions and Section_Interventions
            vm.FilteredSection_Interventions = [];

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                for (var j = 0; j < arrSectionInterventions.length; j++) {
                    if (vm.FilteredActionsDataArray[i].Section_InterventionID == arrSectionInterventions[j].ID && arrSectionInterventions[j].IsActive == 'true') {
                        vm.FilteredSection_Interventions.push(arrSectionInterventions[j]);
                    }
                }


            }


            ////////////for interventions and action days
            for (var i = 0; i < vm.FilteredInterventions.length; i++) {
                vm.FilteredInterventions[i].Actions_Days = {};
                for (var j = 0; j < vm.FilteredAction_DayssDataArray.length; j++) {
                    if (vm.FilteredAction_DayssDataArray[j].ID == vm.FilteredInterventions[i].Action_DayID) {
                        vm.FilteredInterventions[i].Actions_Days = vm.FilteredAction_DayssDataArray[j];
                        break;
                    }
                }
            }


            ////////////for interventions and Intervention_Resident_Answers

            for (var i = 0; i < vm.FilteredInterventions.length; i++) {
                vm.FilteredInterventions[i].Interventions_Resident_Answers = [];
                for (var j = 0; j < vm.FilteredInterventionResidentAnswersDataArray.length; j++) {
                    if (vm.FilteredInterventionResidentAnswersDataArray[j].InterventionID == vm.FilteredInterventions[i].ID) {
                        vm.FilteredInterventions[i].Interventions_Resident_Answers.push(vm.FilteredInterventionResidentAnswersDataArray[j]);
                    }
                }
            }


            //////////////////for action days and actions/////
            for (var i = 0; i < vm.FilteredAction_DayssDataArray.length; i++) {
                vm.FilteredAction_DayssDataArray[i].Action = {};
                for (var j = 0; j < vm.FilteredActionsDataArray.length; j++) {
                    if (vm.FilteredActionsDataArray[j].ID == vm.FilteredAction_DayssDataArray[i].ActionID) {
                        vm.FilteredAction_DayssDataArray[i].Action = vm.FilteredActionsDataArray[j];
                        break;
                    }
                }
            }





            ///////for Actions and section_interventions////
            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                vm.FilteredActionsDataArray[i].Section_Intervention = {};
                for (var j = 0; j < vm.FilteredSection_Interventions.length; j++) {
                    if (vm.FilteredSection_Interventions[j].ID == vm.FilteredActionsDataArray[i].Section_InterventionID) {
                        vm.FilteredActionsDataArray[i].Section_Intervention = vm.FilteredSection_Interventions[j];
                        break;
                    }
                }

            }



            vm.Interventions = vm.FilteredInterventions;
            console.log(vm.Interventions);

            vm.ResidentIntervention = [];
            for (var g = 0; g < vm.FilteredResidentsDataArray.length; g++) {

                var arrResidentIntervention = { Name: "", lstarryIntervention: [], lstSummary: [] };

                for (var i = 0; i < vm.FilteredInterventions.length; i++) {

                    if (vm.FilteredInterventions[i].Actions_Days.Action.ResidentID == vm.FilteredResidentsDataArray[g].ID) {
                        arrResidentIntervention.Name = vm.FilteredResidentsDataArray[g].FirstName + "" + vm.FilteredResidentsDataArray[g].LastName;
                        arrResidentIntervention.lstarryIntervention.push(vm.FilteredInterventions[i]);
                    }
                }

                if (arrResidentIntervention.lstarryIntervention.length > 0) {
                    for (var i = 0; i < arrResidentIntervention.lstarryIntervention.length; i++) {
                        var objAnswerText = '';
                        if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers.length > 0) {
                            for (var j = 0; j < arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers.length; j++) {
                                if (arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText != null && arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].IsActive == "true")
                                    objAnswerText += arrResidentIntervention.lstarryIntervention[i].Interventions_Resident_Answers[j].AnswerText + ',';
                            }
                        }
                        arrResidentIntervention.lstarryIntervention[i].Summary = objAnswerText.substring(0, objAnswerText.length - 1);;
                    }
                    vm.ResidentIntervention.push(arrResidentIntervention);
                }
            }
            //  vm.Interventions = [];
            vm.Interventions = vm.ResidentIntervention;
            console.log(vm.Interventions);

        }

        vm.ResidentList = function () {
            $rootScope.UserFirstLogin = false;
            $state.go('Residents');
        }

        var LoadResidentSummary = function (objResidentSummary, lstSummary) {

            for (var i = 0; i < objResidentSummary.length; i++) {
                if (objResidentSummary[i].Sections_Questions_Answers) {
                    for (var j = 0; j < objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary.length; j++) {
                        if (objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary[j].IsAnswerText) {
                            objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary[j].Summary = objResidentSummary[i].AnswerText;
                        }
                        lstSummary.push(objResidentSummary[i].Sections_Questions_Answers.Sections_Questions_Answers_Summary[j]);
                    }
                }
            }
        }


        var GetResidentsByDate = function () {
            if ($scope.online == true) {
                getAllResidents();
            }
            else {
                GetOfflineData();
            }
        };
        GetResidentsByDate();

    }
}());




