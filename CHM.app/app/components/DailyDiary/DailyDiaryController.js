(function () {
    //"use strict";

    angular.module('CHM').controller('DailyDiaryController', DailyDiaryController);

    DailyDiaryController.$inject = ['$q', '$sce', '$uibModal', '$window', '$rootScope', '$filter', '$stateParams', 'toastr', 'InterventionsService', 'ResidentsService', '$scope', 'onlineStatus'];

    function DailyDiaryController($q, $sce, $uibModal, $window, $rootScope, $filter, $stateParams, toastr, InterventionsService, ResidentsService, $scope, onlineStatus) {


        var vm = this;

        vm.ReadHide = true;
        vm.PersonalInformation = { open: true };
        vm.ResidentId = $stateParams.ResidentId;
        vm.Interventions = [];
        vm.ResidentSummary = [];
        vm.FilterSummary = [];



        var arrActions = [];
        var arrAction_Days = [];
        var arrInterventions = [];
        var arrSectionInterventions = [];
        var arrResidents = [];
        var arrInterventionsResidentAnswers = [];


        //////////////////////////////////

        vm.DairyDate = new Date();



        var deferredArr = [];
        var deferredActions = $q.defer();
        var deferredAction_Days = $q.defer();
        var deferredInterventions = $q.defer();
        var deferredSection_Interventions = $q.defer();
        var defferedInterventions_Resident_Answers = $q.defer();

        // var deferredJoinedData = $q.defer();

        deferredArr.push(deferredActions.promise);
        deferredArr.push(deferredAction_Days.promise);
        deferredArr.push(deferredInterventions.promise);
        deferredArr.push(deferredSection_Interventions.promise);
        deferredArr.push(defferedInterventions_Resident_Answers.promise);
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
            deferredInterventions.resolve();
        };

        var renderSection_Interventions = function (tx, rs) {
            arrSectionInterventions = [];
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


        function GetAllOfflineData() {
            app.GetOfflineActions(renderActions);
            app.GetOfflineAction_Days(renderAction_Days);
            app.GetOfflineInterventions(renderInterventions);
            app.GetOfflineSection_Interventions(renderSection_Interventions);
            app.GetOfflineInterventionsResidentAnswers(renderInterventionsResidentAnswers);
        }

        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            if (vm.online == true) {
                if ($rootScope.IsSynchronizing) {
                    $scope.$on('SyncOfData', function (event, args) {
                        if (args.Compleated) {
                            LoadDailyDairy();
                            GetSummaryForOnline();
                        }
                    });
                }
                else {
                    LoadDailyDairy();
                    GetSummaryForOnline();
                }
            }
            else {
                GetOfflineData();
            }
        });

        var GetOfflineData = function () {
            GetAllOfflineData();
            $q.all(deferredArr).then(
                function (response) {
                    // console.log('all completed');
                    LoadOffline();
                },
                function (err) {
                    console.log('err');
                }
            );

            var renderResidents = function (tx, rs) {
                arrResidents = [];
                for (var i = 0; i < rs.rows.length; i++) {
                    if (rs.rows.item(i).ID == vm.ResidentId) {
                        arrResidents.push(rs.rows.item(i));

                    }
                }
                vm.Resident = arrResidents[0];
            };

            app.GetOfflineResidents(renderResidents);

            deferredArray = [];
            deferredSections_Questions_Answers = $q.defer();
            deferredSections_Questions_Answers_Summary = $q.defer();
            deferredSection_Summary = $q.defer();
            deferredResidents_Questions_Answers = $q.defer();
            // var deferredJoinedData = $q.defer();

            deferredArray.push(deferredSections_Questions_Answers.promise);
            deferredArray.push(deferredSections_Questions_Answers_Summary.promise);
            deferredArray.push(deferredSection_Summary.promise);
            deferredArray.push(deferredResidents_Questions_Answers.promise);

            FunctionToGetSummary();

            $q.all(deferredArray).then(
                function (response) {
                    console.log('all completed');
                    FunctionForLoops();
                    // LoadOffline();
                },
                function (err) {
                    console.log('err');
                }
            );
        }

        vm.ReadMoreClick = function () {
            vm.ReadHide = false;
        }
        vm.ReadLessClick = function () {
            vm.ReadHide = true;
        }

        //Dairy Date Datepicker Settings
        vm.openDairyDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.DairyDateOpened = true;
        };

        vm.GetDailyDairy = function (DairyDate) {
            GetDailyDairyData();
        }

        var LoadDailyDairy = function () {

            var DailyDairyDate = moment(vm.DairyDate).format('YYYY-MM-DD');
            InterventionsService.GetInterventionsForResident(vm.ResidentId, DailyDairyDate, DailyDairyDate).then(
                   function (response) {
                       vm.Interventions = response.data;
                       if (vm.Interventions.length > 0) {
                           for (var i = 0; i < vm.Interventions.length; i++) {
                               var objAnswerText = '';
                               if (vm.Interventions[i].Interventions_Resident_Answers.length > 0) {
                                   for (var j = 0; j < vm.Interventions[i].Interventions_Resident_Answers.length; j++) {
                                       if (vm.Interventions[i].Interventions_Resident_Answers[j].AnswerText != null && vm.Interventions[i].Interventions_Resident_Answers[j].IsActive == true)
                                           objAnswerText += vm.Interventions[i].Interventions_Resident_Answers[j].AnswerText + ',';
                                   }
                               }
                               vm.Interventions[i].Summary = objAnswerText.substring(0, objAnswerText.length - 1);;
                           }
                           vm.ResidentIntervention.push(vm.Interventions);
                       }
                   },
               function (err) {
                   toastr.error('An error occurred while retrieving interventions.');
               }
           );
        }


        var LoadOffline = function () {

            vm.FilteredActionsDataArray = [];
            for (var i = 0; i < arrActions.length; i++) {
                if (arrActions[i].ResidentID == vm.ResidentId && arrActions[i].IsActive == "true") {
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

            //Intervention_Resident_Answers
            vm.FilteredIntervention_Resident_AnswersDataArray = [];
            for (var i = 0; i < arrInterventionsResidentAnswers.length; i++) {
                if (arrInterventionsResidentAnswers[i].ResidentID == vm.ResidentId && arrInterventionsResidentAnswers[i].IsActive == "true") {
                    vm.FilteredIntervention_Resident_AnswersDataArray.push(arrInterventionsResidentAnswers[i]);
                }
            }

            vm.FilteredInterventions = [];
            var DailyDairyDate = moment(vm.DairyDate).format('YYYY-MM-DD');

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

            ////////////for interventions and Intervention_Resident_Answers

            for (var i = 0; i < vm.FilteredInterventions.length; i++) {
                vm.FilteredInterventions[i].Interventions_Resident_Answers = [];
                for (var j = 0; j < vm.FilteredIntervention_Resident_AnswersDataArray.length; j++) {
                    if (vm.FilteredIntervention_Resident_AnswersDataArray[j].InterventionID == vm.FilteredInterventions[i].ID) {
                        vm.FilteredInterventions[i].Interventions_Resident_Answers.push(vm.FilteredIntervention_Resident_AnswersDataArray[j]);
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
            }

            var objAnswerText = '';
            for (var i = 0; i < vm.FilteredInterventions.length; i++) {
                //  var Intervention = vm.Interventions[i].Interventions_Resident_Answers;
                for (var j = 0; j < vm.FilteredInterventions[i].Interventions_Resident_Answers.length; j++) {
                    if (vm.FilteredInterventions[i].Interventions_Resident_Answers.length > 0) {
                        if (vm.FilteredInterventions[i].Interventions_Resident_Answers[j].AnswerText != null && vm.FilteredInterventions[i].Interventions_Resident_Answers[j].IsActive == "true")
                            objAnswerText += vm.FilteredInterventions[i].Interventions_Resident_Answers[j].AnswerText + ',';
                    }
                    vm.FilteredInterventions[i].Summary = objAnswerText.substring(0, objAnswerText.length - 1);
                }
                console.log(vm.Interventions);
            }
            vm.Interventions = vm.FilteredInterventions;
        }

        var GetDailyDairyData = function () {
            if ($scope.online == true) {
                LoadDailyDairy();
            }
            else {
                GetOfflineData();
            }
        };
        GetDailyDairyData();


        var GetSummaryForOnline = function () {

            ResidentsService.GetPersonalInformation(vm.ResidentId).then(
             function (response) {
                 vm.Resident = response.data.Resident;
                 vm.PhotoUrl = response.data.PhotoUrl;
             },
             function (err) {
                 toastr.error('An error occurred while retrieving resident information.');
             }
             );


            // Summary Note

            ResidentsService.GetResidentSummaryByID(vm.ResidentId).then(
              function (response) {


                  vm.Summarydata = response.data;
                  GetDataOnAnswersForSummary();
                  vm.Summary = response.data;


              },
              function (err) {
                  toastr.error('An error occurred while retrieving resident summary.');
              }
              );
        }

        vm.BindSummaary = function (objSectionQuestion) {


            if (objSectionQuestion.Summary.indexOf('ResidentName') >= 0 || objSectionQuestion.Summary.indexOf('XYZ') >= 0 || objSectionQuestion.Summary.indexOf('XXXX') >= 0) {
                var FullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
                var res = objSectionQuestion.Summary.replace("ResidentName", FullName);
                for (var k = 0; k < vm.SummaryQuestion.length; k++) {

                    if (vm.SummaryQuestion[k].Id == objSectionQuestion.ID) {

                        if (vm.SummaryQuestion[k].Ans1 != "" && vm.SummaryQuestion[k].Ans2 != "") {
                            var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                            var ans2 = ans1.replace(/XXXX/g, vm.SummaryQuestion[k].Ans2);
                            return ans2;
                        }
                        else {
                            if (vm.SummaryQuestion[k].Ans1 != "") {
                                var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                                return ans1;
                            }
                            if (vm.SummaryQuestion[k].Ans2 != "") {
                                var ans1 = res.replace("XXXX", vm.SummaryQuestion[k].Ans2);
                                return ans1;
                            }
                        }
                        break;
                    }
                }
                return res;
            }
            else {
                return objSectionQuestion.Summary;
            }



        }
        vm.SummaryQuestion = [];
        var GetDataOnAnswersForSummary = function () {




            for (var i = 0; i < vm.Summarydata.length; i++) {

                if (vm.Summarydata[i].Summary.indexOf('XYZ') >= 0 || vm.Summarydata[i].Summary.indexOf('XXXX') >= 0) {

                    var summarydata = { Id: "", Ans1: "", Ans2: "" }
                    summarydata.Id = vm.Summarydata[i].ID;

                    ResidentsService.GetResidentSummaryDataofAnswers(vm.Summarydata[i].Sections_Questions_Answers_Summary[0].Section_QuestionID, vm.ResidentId).then(
                  function (response) {

                      var score = "";
                      var AnsText = "";
                      for (var m = 0; m < response.data.length; m++) {

                          if (response.data[m].AnswerText)
                              score = response.data[m].AnswerText;

                          if (response.data[m].AnswerText == null) {
                              AnsText += response.data[m].Sections_Questions_Answers.LabelText + ','
                          }
                      }


                      summarydata.Ans1 = score;
                      summarydata.Ans2 = AnsText.replace(/,\s*$/, "");
                      vm.SummaryQuestion.push(summarydata);
                  },
                  function (err) {
                      toastr.error('An error occurred while retrieving resident summary.');
                  });

                }

            }
        }


        vm.ViewSummary = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/Interventions/ResidentSummary/ResidentSummary.html',
                controller: 'ResidentSummaryController',
                controllerAs: 'vm',
                resolve: {
                    ResidentID: function () {
                        return vm.ResidentId;
                    }

                },
                backdrop: 'static'
            });
            modalInstance.result.then(
                    function (response) {
                        $q.all(response).then(
                             function () {

                             }
                         );
                    }, function () {

                    }
               );
        }

        ////////For Summary////////////////////////////////////////////

        var arrSections_Questions_Answers = [];
        var arrSections_Questions_Answers_Summary = []
        var arrSection_Summary = [];
        var arrResidents_Questions_Answers = [];


        var deferredArray = [];
        var deferredSections_Questions_Answers = $q.defer();
        var deferredSections_Questions_Answers_Summary = $q.defer();
        var deferredSection_Summary = $q.defer();
        var deferredResidents_Questions_Answers = $q.defer();
        // var deferredJoinedData = $q.defer();

        deferredArray.push(deferredSections_Questions_Answers.promise);
        deferredArray.push(deferredSections_Questions_Answers_Summary.promise);
        deferredArray.push(deferredSection_Summary.promise);
        deferredArray.push(deferredResidents_Questions_Answers.promise);

        var renderSections_Questions_Answers = function (tx, rs) {
            arrSections_Questions_Answers = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrSections_Questions_Answers.push(rs.rows.item(i));
            }
            deferredSections_Questions_Answers.resolve();



        };
        var renderSections_Questions_Answers_Summary = function (tx, rs) {
            arrSections_Questions_Answers_Summary = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrSections_Questions_Answers_Summary.push(rs.rows.item(i));
            }
            deferredSections_Questions_Answers_Summary.resolve();



        };
        var renderSection_Summary = function (tx, rs) {
            arrSection_Summary = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrSection_Summary.push(rs.rows.item(i));
            }
            deferredSection_Summary.resolve();



        };
        var renderResidents_Questions_Answers = function (tx, rs) {
            arrResidents_Questions_Answers = [];

            for (var i = 0; i < rs.rows.length; i++) {
                if (rs.rows.item(i).ResidentID == vm.ResidentId)
                    arrResidents_Questions_Answers.push(rs.rows.item(i));
            }

            deferredResidents_Questions_Answers.resolve();


        };

        function FunctionToGetSummary() {
            app.GetOfflineSections_Questions_Answers(renderSections_Questions_Answers);
            app.GetOfflineSections_Questions_Answers_Summary(renderSections_Questions_Answers_Summary);
            app.GetOfflineSection_Summary(renderSection_Summary);
            app.GetOfflineResidents_Questions_Answers(renderResidents_Questions_Answers, vm.ResidentId);
        }

        var FunctionForLoops = function () {
            var lstFormedArray = [];
            //1st loop for all  Section_Summary
            for (var i = 0; i < arrSection_Summary.length; i++) {
                var arrToBePushed = { SummaryID: '', Summary: '', MaxScore: '', MinScore: '', Section_QuestionID: [], Section_Question_AnswerID: [] }
                arrToBePushed.SummaryID = arrSection_Summary[i].ID;
                arrToBePushed.Summary = arrSection_Summary[i].Summary;
                arrToBePushed.MaxScore = arrSection_Summary[i].MaxScore;
                arrToBePushed.MinScore = arrSection_Summary[i].MinScore;


                //Second loop for Sections_Questions_Answers_Summary

                for (var j = 0; j < arrSections_Questions_Answers_Summary.length; j++) {

                    if (arrSections_Questions_Answers_Summary[j].SectionSummaryID == arrSection_Summary[i].ID) {
                        if (arrSections_Questions_Answers_Summary[j].Section_QuestionID != null) {
                            arrToBePushed.Section_QuestionID.push(arrSections_Questions_Answers_Summary[j].Section_QuestionID);
                        }
                        else {
                            //Do Nothing
                        }
                        if (arrSections_Questions_Answers_Summary[j].Section_Question_AnswerID != null) {
                            arrToBePushed.Section_Question_AnswerID.push(arrSections_Questions_Answers_Summary[j].Section_Question_AnswerID);
                        }
                        else {
                            //Do Nothing
                        }

                    }

                }
                lstFormedArray.push(arrToBePushed);
            }


            var arrWithAnswerID = []
            var arrWithoutAnswerID = [];
            var arrWithoutAll = [];
            for (var i = 0; i < lstFormedArray.length; i++) {
                if (lstFormedArray[i].Section_Question_AnswerID.length > 0 && lstFormedArray[i].Section_QuestionID.length > 0) {

                    arrWithAnswerID.push(lstFormedArray[i]);
                }
                else {
                    //do nothing      
                }
                if (lstFormedArray[i].Section_Question_AnswerID.length == 0 && lstFormedArray[i].Section_QuestionID.length > 0) {
                    arrWithoutAnswerID.push(lstFormedArray[i]);
                }
                else {
                    //do nothing
                }
                if (lstFormedArray[i].Section_Question_AnswerID.length == 0 && lstFormedArray[i].Section_QuestionID.length == 0) {
                    arrWithoutAll.push(lstFormedArray[i]);
                }
                else {
                    //do nothing
                }

            }





            var lstResidentsQAarray = [];
            for (var i = 0; i < arrResidents_Questions_Answers.length; i++) {
                var arrForResidentsQA = { ResidentID: '', Section_Question_AnswerID: '', AnswerText: '', Score: '' }
                arrForResidentsQA.ResidentID = arrResidents_Questions_Answers[i].ResidentID;
                arrForResidentsQA.Section_Question_AnswerID = arrResidents_Questions_Answers[i].Section_Question_AnswerID;
                arrForResidentsQA.AnswerText = arrResidents_Questions_Answers[i].AnswerText;
                for (var j = 0; j < arrSections_Questions_Answers.length; j++) {

                    if (arrSections_Questions_Answers[j].ID == arrResidents_Questions_Answers[i].Section_Question_AnswerID)
                        arrForResidentsQA.Score = arrSections_Questions_Answers[j].Score;
                }
                lstResidentsQAarray.push(arrForResidentsQA);
            }

            var objSummary = [];
            for (var i = 0; i < arrWithAnswerID.length; i++) {

                for (var j = 0; j < arrWithAnswerID[i].Section_Question_AnswerID.length; j++) {

                    for (var k = 0; k < arrResidents_Questions_Answers.length; k++) {
                        if (arrWithAnswerID[i].Section_Question_AnswerID[j] == arrResidents_Questions_Answers[k].Section_Question_AnswerID) {
                            if (arrWithAnswerID[i].Summary == "") {
                                arrWithAnswerID[i].Summary = arrResidents_Questions_Answers[k].AnswerText;
                            }
                            objSummary.push(arrWithAnswerID[i])

                        }

                    }

                }
            }





            var FormedArray = [];
            for (var i = 0; i < arrWithoutAnswerID.length; i++) {
                var a = { Summary: '', MaxScore: '', MinScore: '', Answers: [] }
                a.Summary = arrWithoutAnswerID[i].Summary;
                a.MaxScore = arrWithoutAnswerID[i].MaxScore;
                a.MinScore = arrWithoutAnswerID[i].MinScore;
                for (var j = 0; j < arrWithoutAnswerID[i].Section_QuestionID.length; j++) {
                    for (var k = 0; k < arrSections_Questions_Answers.length; k++) {

                        if (arrSections_Questions_Answers[k].Section_QuestionID == arrWithoutAnswerID[i].Section_QuestionID[j]) {
                            var b = { Section_Question_AnswerID: '', Score: '', LabelText: '' }
                            b.Section_Question_AnswerID = arrSections_Questions_Answers[k].ID;
                            b.Score = arrSections_Questions_Answers[k].Score;
                            b.LabelText = arrSections_Questions_Answers[k].LabelText;
                            a.Answers.push(b);
                        }


                    }

                }

                FormedArray.push(a)
            }




            var arrSummaryArray = [];
            for (var i = 0; i < FormedArray.length; i++) {
                var Score = 0;
                var hasSummary = false;
                for (var j = 0; j < FormedArray[i].Answers.length; j++) {

                    for (var k = 0; k < arrResidents_Questions_Answers.length; k++) {
                        if (arrResidents_Questions_Answers[k].Section_Question_AnswerID == FormedArray[i].Answers[j].Section_Question_AnswerID) {
                            if (FormedArray[i].Answers[j].Score != null) {
                                hasSummary = true;
                                Score += parseInt(FormedArray[i].Answers[j].Score);
                            }
                            else {
                                //do nothing
                            }
                        }
                    }
                }
                if (hasSummary) {
                    if (FormedArray[i].MinScore <= Score && (FormedArray[i].MaxScore >= Score || FormedArray[i].MaxScore == null)) {

                        arrSummaryArray.push(FormedArray[i]);
                    }
                }
            }


            for (var k = 0; k < objSummary.length; k++) {
                if (objSummary[k].Summary == null) {
                    var residentAns = _.where(arrResidents_Questions_Answers, { Section_Question_AnswerID: objSummary[k].Section_Question_AnswerID[0] });
                    if (residentAns.length > 0) {
                        objSummary[k].Summary = residentAns[0].AnswerText;
                    }
                }

            }




            //////New code
            var WithScoresAndAnswers = [];
            for (var i = 0; i < objSummary.length; i++) {
                var a = { Summary: '', MaxScore: '', MinScore: '', Answers: [], Section_QuestionID: [], Section_Question_AnswerID: [], SummaryID: '' }

                a.Summary = objSummary[i].Summary;
                a.MaxScore = objSummary[i].MaxScore;
                a.MinScore = objSummary[i].MinScore;
                a.Section_QuestionID = objSummary[i].Section_QuestionID;
                a.Section_Question_AnswerID = objSummary[i].Section_Question_AnswerID;
                a.SummaryID = objSummary[i].SummaryID;

                for (var j = 0; j < arrWithAnswerID[i].Section_QuestionID.length; j++) {
                    for (var k = 0; k < arrSections_Questions_Answers.length; k++) {

                        if (arrSections_Questions_Answers[k].Section_QuestionID == arrWithAnswerID[i].Section_QuestionID[j]) {
                            var b = { Score: '', LabelText: '' }
                            b.Score = arrSections_Questions_Answers[k].Score;
                            b.LabelText = arrSections_Questions_Answers[k].LabelText;
                            a.Answers.push(b);
                        }


                    }

                }
                WithScoresAndAnswers.push(a);
            }
            ////



            var SpliceFunction = function (i) {
                WithScoresAndAnswers.splice(i, 1);
            }


            for (var i = 0; i < WithScoresAndAnswers.length; i++) {
                if (i != 0) {
                    if (WithScoresAndAnswers[i].SummaryID == WithScoresAndAnswers[i - 1].SummaryID) {
                        SpliceFunction(i);
                    }
                }
            }


            var SplicearrSummaryArrayFunction = function (i) {
                arrSummaryArray.splice(i, 1);
            }


            for (var i = 0; i < arrSummaryArray.length; i++) {
                if (i != 0) {
                    if (arrSummaryArray[i].Summary == arrSummaryArray[i - 1].Summary) {
                        SpliceFunction(i);
                    }
                }
            }

            var arrFinalArray = WithScoresAndAnswers.concat(arrSummaryArray);

            for (var i = 0; i < arrFinalArray.length; i++) {

                var FreeTextSummaryContains = arrFinalArray[i].Summary.indexOf('FREETEXT');
                var XYZContains = arrFinalArray[i].Summary.indexOf('XYZ');
                var XXXXContains = arrFinalArray[i].Summary.indexOf('XXXX');

                if (arrFinalArray[i].Answers != undefined) {
                    var lblAid = '';
                    for (var l = 0; l < arrFinalArray[i].Answers.length; l++) {
                        lblAid += arrFinalArray[i].Answers[l].LabelText + ',';
                    }
                }
                var Aidname = lblAid;
                var carrercount = "2";

                if (XYZContains != -1 && XXXXContains == -1) {
                    var output1 = arrFinalArray[i].Summary.replace("XYZ", Aidname);
                    arrFinalArray[i].Summary = output1;
                }
                else if (XXXXContains != -1 && XYZContains == -1) {
                    var output2 = arrFinalArray[i].Summary.replace("XXXX", carrercount);
                    arrFinalArray[i].Summary = output2;
                }
                else if (XYZContains != -1 && XXXXContains != -1) {
                    var output1 = arrFinalArray[i].Summary.replace("XYZ", Aidname);
                    var output2 = output1.replace("XXXX", carrercount);
                    arrFinalArray[i].Summary = output2;
                }
                else {
                    var output1 = arrFinalArray[i].Summary.replace("XXXX", "1");
                    var output2 = output1.replace("XYZ", "None");
                    arrFinalArray[i].Summary = output2;
                }

                if (FreeTextSummaryContains >= 0) {
                    var lbltxt = '';
                    for (var j = 0; j < arrFinalArray[i].Answers.length; j++) {
                        lbltxt += arrFinalArray[i].Answers[j].LabelText + ',';
                    }
                    var freetextlbl = lbltxt;
                    var a = arrFinalArray[i].Summary.replace("FREETEXT", freetextlbl);
                    arrFinalArray[i].Summary = a;
                }

            }




            vm.Summary = arrFinalArray;


        }

    }

}());