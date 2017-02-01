(function () {
    //  "use strict";

    angular.module('CHM').controller('RiskAssessmentSummaryController', RiskAssessmentSummaryController);

    RiskAssessmentSummaryController.$inject = ['$q', '$uibModal', '$window', '$filter', '$stateParams', 'toastr', 'ResidentsService', '$scope', 'onlineStatus', 'CommonService', '$rootScope'];

    function RiskAssessmentSummaryController($q, $uibModal, $window, $filter, $stateParams, toastr, ResidentsService, $scope, onlineStatus, CommonService, $rootScope) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.EditMode = $stateParams.EditMode;

        vm.Resident = {};

        var arryResident_Question_Answers = [];
        var arrySection_Question_Answers = [];
        var arrySection_Questions = [];
        var arrySections = [];
        var arryActions = [];
        var arrySection_Questions_Answers_Tasks = [];
        var arrySection_Intervention = [];
        var arryResidentsByID = [];

        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {

            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.ResidentId = $stateParams.ResidentId;
            vm.EditMode = $stateParams.EditMode;

            vm.Resident = {};

            if ($scope.online == true) {
                if ($rootScope.IsSynchronizing) {
                    $scope.$on('SyncOfData', function (event, args) {
                        if (args.Compleated) {
                            GetPersonalInformation();
                            getNewRequiredAssessmentSummary();
                        }
                    });
                }
                else {
                    GetPersonalInformation();
                    getNewRequiredAssessmentSummary();
                }
            }
            else {
                $rootScope.$broadcast("loader_show");
                var deferredArr = [];
                var deferredResident_Question_Answers = $q.defer();
                var deferredSection_Question_Answers = $q.defer();
                var deferredSection_Questions = $q.defer();
                var deferredSections = $q.defer();
                var deferredActions = $q.defer();
                var deferredSection_Questions_Answers_Tasks = $q.defer();
                var deferredSection_Intervention = $q.defer();
                var deferredResidentsByID = $q.defer();


                arryResident_Question_Answers = [];
                arrySection_Question_Answers = [];
                arrySection_Questions = [];
                arrySections = [];
                arryActions = [];
                arrySection_Questions_Answers_Tasks = [];
                arrySection_Intervention = [];
                arryResidentsByID = [];


                deferredArr.push(deferredResident_Question_Answers.promise);
                deferredArr.push(deferredSection_Question_Answers.promise);
                deferredArr.push(deferredSection_Questions.promise);
                deferredArr.push(deferredSections.promise);
                deferredArr.push(deferredActions.promise);
                deferredArr.push(deferredSection_Questions_Answers_Tasks.promise);
                deferredArr.push(deferredSection_Intervention.promise);
                deferredArr.push(deferredResidentsByID.promise);



                var renderResident_Question_Answers = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryResident_Question_Answers.push(rs.rows.item(i));
                    }
                    deferredResident_Question_Answers.resolve();
                };

                var renderSection_Question_Answers = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySection_Question_Answers.push(rs.rows.item(i));
                    }
                    deferredSection_Question_Answers.resolve();
                };

                var renderSection_Questions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySection_Questions.push(rs.rows.item(i));
                    }
                    deferredSection_Questions.resolve();
                };

                var renderSection_Questions_Answers_Tasks = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySection_Questions_Answers_Tasks.push(rs.rows.item(i));
                    }
                    deferredSection_Questions_Answers_Tasks.resolve();
                };

                var renderSection_Intervention = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySection_Intervention.push(rs.rows.item(i));

                    }
                    deferredSection_Intervention.resolve();
                };

                var renderActions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryActions.push(rs.rows.item(i));
                    }
                    deferredActions.resolve();
                };

                var renderSections = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySections.push(rs.rows.item(i));
                    }
                    deferredSections.resolve();
                };

                var renderResidentsByID = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryResidentsByID.push(rs.rows.item(i));
                    }
                    deferredResidentsByID.resolve();
                };


                function GetAllOfflineData() {
                    app.GetOfflineResidents_Questions_Answers(renderResident_Question_Answers, vm.ResidentId);
                    app.GetOfflineSections_Questions_Answers(renderSection_Question_Answers);
                    app.GetOfflineSections_Questions(renderSection_Questions);
                    app.GetOfflineSections(renderSections);
                    app.GetOfflineActions(renderActions);
                    app.GetOfflineSections_Questions_Answers_Tasks(renderSection_Questions_Answers_Tasks);
                    app.GetOfflineSection_Interventions(renderSection_Intervention);
                    app.GetOfflineResidentsByID(renderResidentsByID, vm.ResidentId);
                }

                function GetPersonalInformation_Offline() {
                    GetAllOfflineData();
                    $q.all(deferredArr).then(
                            function (response) {

                                LoadOffline();
                                $rootScope.$broadcast("loader_hide");
                            },
                            function (err) {

                            }
                        );
                }

                GetPersonalInformation_Offline();
            }

        });


        vm.PrintElem = function (elem) {
            Popup($(elem).html());
        }

        function Popup(data) {
            var Name = vm.Resident.FirstName + ' ' + vm.Resident.LastName;
            var mywindow = window.open('', '', 'height=400,width=600');
            mywindow.document.write('<html><head><title> ' + Name + ' </title>');
            /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
            mywindow.document.write('</head><body >');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10

            mywindow.print();
            mywindow.close();

            return true;
        }


        vm.OpenOnlyOneSection = false;
        vm.Sections = [];
        vm.AssessmentSummary = [];

        //DOB Datepicker Settings
        vm.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBOpened = true;
        };

        vm.AcceptAsResident = function () {
            if ($scope.online == true) {
                ResidentsService.AcceptAsResident(vm.ResidentId).then(
             function (response) {
                 CommonService.UpdateAcceptAsResident(app.db, vm.ResidentId).then(function (response) {
                 },
                               function (err) {
                                   toastr.error('An error occured while updating offline Prospect accepted as a resident.');
                               })
                 toastr.success('Prospect accepted as a resident.');

                 vm.Resident.IsAccepted = true;

             },
                 function (err) {
                     toastr.error('An error occurred while accepting as resident.');
                 }
            );
            }
            else {
                CommonService.UpdateAcceptAsResident(app.db, vm.ResidentId).then(function (succ) {
                    vm.Resident.IsAccepted = true;
                    toastr.success('Prospect accepted as a resident.');
                }, function err(error) {
                    console.log("error");
                });
            }
        }

        var GetPersonalInformation = function () {
            ResidentsService.GetPersonalInformation(vm.ResidentId).then(
                function (response) {
                    vm.Resident = response.data.Resident;
                },
                function (err) {
                    toastr.error('An error occurred while retrieving resident information.');
                }
            );
        }

        function getNewRequiredAssessmentSummary() {

            ResidentsService.getNewRequiredAssessmentSummary(vm.ResidentId).then(
            function (response) {
                vm.AssessmentSummary = response.data;
                GetAssessementSummary(vm.AssessmentSummary);
            },
            function (err) {
                toastr.error('An error occurred while retrieving assessment answers.');
            }
        );
        }



        var GetAssessementSummary = function (obj) {
            ResidentsService.GetActiveSections().then(
            function (response) {
                vm.Sections = response.data;

                for (var i = 0; i < vm.Sections.length; i++) {
                    vm.Sections[i].Assessment = [];
                    for (var j = 0; j < obj.length; j++) {
                        if (obj[j].SectionID == vm.Sections[i].ID) {
                            var Summary = { Question: "", LabelTxt: "", DisplayOrder: 0, Intervention: [] };
                            Summary.Question = obj[j].Question;
                            Summary.LabelTxt = obj[j].LabelTxt;
                            Summary.DisplayOrder = obj[j].DisplayOrder;

                            if (obj[j].lstGroupIntervention != null) {
                                for (var m = 0; m < obj[j].lstGroupIntervention.length; m++) {

                                    var interventiondata = { InterventionName: "", Occurrence: "", Type: "", startDate: "" };

                                    if (obj[j].lstGroupIntervention[m].InterventionName != null)
                                        interventiondata.InterventionName = obj[j].lstGroupIntervention[m].InterventionName;

                                    if (obj[j].lstGroupIntervention[m].Type != null) {
                                        interventiondata.Occurrence = obj[j].lstGroupIntervention[m].Ocuurrence;
                                        interventiondata.Type = obj[j].lstGroupIntervention[m].Type;
                                        interventiondata.startDate = obj[j].lstGroupIntervention[m].StartDate;


                                    }

                                    Summary.Intervention.push(interventiondata);
                                }


                            }




                            vm.Sections[i].Assessment.push(Summary);
                        }
                    }


                    if (vm.Sections[i].Assessment.length > 0)
                        vm.Sections[i].HasAssesment = true;
                    else
                        vm.Sections[i].HasAssesment = false;

                }


            },
            function (err) {
                toastr.error('An error occurred while retrieving assessment answers.');
            }
        );
        }

        vm.BindSectionQuestion = function (objSectionQuestion) {

            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objSectionQuestion.replace("ResidentName", ResidentFullName);
            return res;
        }
        vm.chk = function (obj) {
            var s = obj;
        }

        //////////////////////////////////------Offline Code-------//////////////////////

        var LoadOffline = function () {

            if (arryResidentsByID.length == 1) {
                var objResident = {};
                objResident.FirstName = arryResidentsByID[0].FirstName;
                objResident.LastName = arryResidentsByID[0].LastName;
                if (arryResidentsByID[0].IsAccepted == "true")
                    objResident.IsAccepted = true;
                else
                    objResident.IsAccepted = false;

                vm.Resident = objResident;
            }
            else {
                toastr.error('more than one ResidentsByIDs exist');
            }

            var lstIntervention = []; var lstResidentQuestionAnswer = [];

            var lstResidentAnsweredQuestions = [];//1st loop
            for (var i = 0; i < arryResident_Question_Answers.length; i++) {
                var objResidentAnsweredQuestions = { ResidentQuestionAnswersID: null, Section_Question_AnswerID: null, Section_QuestionID: null };
                objResidentAnsweredQuestions.ResidentQuestionAnswersID = arryResident_Question_Answers[i].ID;
                for (var j = 0; j < arrySection_Question_Answers.length; j++) {
                    if (arrySection_Question_Answers[j].ID == arryResident_Question_Answers[i].Section_Question_AnswerID) {
                        objResidentAnsweredQuestions.Section_Question_AnswerID = arrySection_Question_Answers[j].ID;
                        objResidentAnsweredQuestions.Section_QuestionID = arrySection_Question_Answers[j].Section_QuestionID;
                        objResidentAnsweredQuestions.LabelText = arrySection_Question_Answers[j].LabelText;
                        objResidentAnsweredQuestions.AnswerText = arryResident_Question_Answers[i].AnswerText;
                        objResidentAnsweredQuestions.SectionID = arrySection_Question_Answers[j].SectionID;
                        for (var k = 0; k < arrySection_Questions.length; k++) {
                            if (arrySection_Questions[k].ID == arrySection_Question_Answers[j].Section_QuestionID) {
                                objResidentAnsweredQuestions.Question = arrySection_Questions[k].Question;
                                break;
                            }
                        }
                        break;
                    }
                }
                lstResidentAnsweredQuestions.push(objResidentAnsweredQuestions);
            } //vm.BindSectionQuestion

            var lstSectionQuestionsAnswersTask = [];//2nd loop
            for (var i = 0; i < arrySection_Questions_Answers_Tasks.length; i++) {
                for (var j = 0; j < arrySection_Intervention.length; j++) {
                    // if (arrySection_Questions_Answers_Tasks[i].LabelText=="Always"){
                    if (arrySection_Questions_Answers_Tasks[i].Section_InterventionID == arrySection_Intervention[j].ID) {
                        var objSectionQuestionsAnswersTask = { Section_Question_AnswerID: null, Section_QuestionID: null, Section_InterventionID: null, InterventionTitle: null };
                        objSectionQuestionsAnswersTask.Section_Question_AnswerID = arrySection_Questions_Answers_Tasks[i].Section_Question_AnswerID;
                        objSectionQuestionsAnswersTask.Section_QuestionID = arrySection_Questions_Answers_Tasks[i].Section_QuestionID;
                        objSectionQuestionsAnswersTask.Section_InterventionID = arrySection_Questions_Answers_Tasks[i].Section_InterventionID;
                        objSectionQuestionsAnswersTask.InterventionTitle = arrySection_Intervention[j].InterventionTitle;
                        objSectionQuestionsAnswersTask.MaxScore = arrySection_Intervention[j].MaxScore;
                        objSectionQuestionsAnswersTask.MinScore = arrySection_Intervention[j].MinScore;
                        lstSectionQuestionsAnswersTask.push(objSectionQuestionsAnswersTask);

                    }
                }
            }


            for (var i = 0; i < lstResidentAnsweredQuestions.length; i++) {
                var count1 = [];
                for (var j = 0; j < lstSectionQuestionsAnswersTask.length; j++) {
                    if (lstResidentAnsweredQuestions[i].Section_Question_AnswerID == lstSectionQuestionsAnswersTask[j].Section_Question_AnswerID) {
                        count1.push(lstResidentAnsweredQuestions[i].Section_Question_AnswerID);
                    }
                }
                if (count1.length == 0) {
                    var lstSectionQuestionTask = [];//count2
                    for (var j = 0; j < lstSectionQuestionsAnswersTask.length; j++) {
                        if (lstResidentAnsweredQuestions[i].Section_QuestionID == lstSectionQuestionsAnswersTask[j].Section_QuestionID && lstSectionQuestionsAnswersTask[j].Section_Question_AnswerID == null) {
                            lstSectionQuestionTask.push(lstSectionQuestionsAnswersTask[j]);
                        }
                    }
                    if (lstSectionQuestionTask.length > 0) {
                        for (var j = 0; j < lstSectionQuestionTask.length; j++) {
                            var SectionQuestionIDs = []; var lstSectionQuestionAnswerIds = [];
                            var lstSecQueAnsinResidentAnsIDs = []; var lstSectionQuestionAnsForScore = [];
                            for (var k = 0; k < lstSectionQuestionsAnswersTask.length; k++) {
                                if (lstSectionQuestionsAnswersTask[k].Section_InterventionID == lstSectionQuestionTask[j].Section_InterventionID) {
                                    SectionQuestionIDs.push(lstSectionQuestionsAnswersTask[k].Section_QuestionID);
                                }
                            }
                            for (var k = 0; k < arrySection_Question_Answers.length; k++) {
                                if (SectionQuestionIDs.indexOf(arrySection_Question_Answers[k].Section_QuestionID) > -1) {
                                    lstSectionQuestionAnswerIds.push(arrySection_Question_Answers[k].ID);
                                }
                            }
                            for (var k = 0; k < lstResidentAnsweredQuestions.length; k++) {
                                if (lstSectionQuestionAnswerIds.indexOf(lstResidentAnsweredQuestions[k].Section_Question_AnswerID) > -1) {
                                    lstSecQueAnsinResidentAnsIDs.push(lstResidentAnsweredQuestions[k].Section_Question_AnswerID);
                                }
                            }
                            for (var k = 0; k < arrySection_Question_Answers.length; k++) {
                                if (lstSecQueAnsinResidentAnsIDs.indexOf(arrySection_Question_Answers[k].ID) > -1) {
                                    lstSectionQuestionAnsForScore.push(arrySection_Question_Answers[k]);
                                }
                            }
                            var score = 0;
                            var hasResidentId = 0;
                            var hastask = false;
                            var hasScore = false;

                            for (var k = 0; k < lstSectionQuestionAnsForScore.length; k++) {
                                hasScore = true;
                                score += parseInt(lstSectionQuestionAnsForScore[k].Score);
                                if (lstSectionQuestionAnsForScore[k].ID == lstResidentAnsweredQuestions[i].Section_Question_AnswerID) {
                                    hasResidentId = 1;
                                }
                            }
                            if (hasScore) {
                                if (lstSectionQuestionTask[j].MinScore <= score && (lstSectionQuestionTask[j].MaxScore >= score || lstSectionQuestionTask[j].MaxScore == null)) {
                                    hastask = true;
                                }
                            }
                            if (lstSectionQuestionTask.length > 0 && (hastask || hasResidentId == 1)) {

                                if (hasResidentId == 1 && hastask) {

                                    var objIntervention = {};
                                    objIntervention.ID = lstSectionQuestionTask[j].Section_InterventionID;
                                    objIntervention.InterventionName = lstSectionQuestionTask[j].InterventionTitle;
                                    objIntervention.ResidentQuestionAnsID = lstResidentAnsweredQuestions[i].ResidentQuestionAnswersID;
                                    lstIntervention.push(objIntervention);
                                    lstResidentQuestionAnswer.push(lstResidentAnsweredQuestions[i]);
                                }
                                else {
                                    lstResidentQuestionAnswer.push(lstResidentAnsweredQuestions[i]);
                                }
                            }
                        }
                    }
                }
                if (count1.length > 0) {
                    for (var j = 0; j < lstSectionQuestionsAnswersTask.length; j++) {
                        if (lstResidentAnsweredQuestions[i].Section_Question_AnswerID == lstSectionQuestionsAnswersTask[j].Section_Question_AnswerID) {
                            var objIntervention = {};
                            objIntervention.ID = lstSectionQuestionsAnswersTask[j].Section_InterventionID;
                            objIntervention.InterventionName = lstSectionQuestionsAnswersTask[j].InterventionTitle;
                            objIntervention.ResidentQuestionAnsID = lstResidentAnsweredQuestions[i].ResidentQuestionAnswersID;
                            lstIntervention.push(objIntervention);
                            lstResidentQuestionAnswer.push(lstResidentAnsweredQuestions[i]);
                            break;
                        }
                    }
                }




            }//1st loop for ends
            var DistinctResidentQuestionsAnswers = [];

            for (var i = 0; i < lstResidentQuestionAnswer.length; i++) {
                var doesResidentQuestionAnswersIDExist = false;
                for (var j = 0; j < DistinctResidentQuestionsAnswers.length; j++) {
                    if (DistinctResidentQuestionsAnswers[j].ResidentQuestionAnswersID == lstResidentQuestionAnswer[i].ResidentQuestionAnswersID) {
                        doesResidentQuestionAnswersIDExist = true;
                        break;
                    }
                }
                if (!doesResidentQuestionAnswersIDExist)
                    DistinctResidentQuestionsAnswers.push(lstResidentQuestionAnswer[i]);
            }

            var lstGroupAssessment = [];
            for (var i = 0; i < DistinctResidentQuestionsAnswers.length; i++) {
                var objGroupAssementSummary = {};
                objGroupAssementSummary.Question = DistinctResidentQuestionsAnswers[i].Question;
                if (DistinctResidentQuestionsAnswers[i].LabelText != "FreeText" && DistinctResidentQuestionsAnswers[i].LabelText != "Other") {
                    objGroupAssementSummary.LabelTxt = DistinctResidentQuestionsAnswers[i].LabelText;
                }
                else {
                    objGroupAssementSummary.LabelTxt = DistinctResidentQuestionsAnswers[i].AnswerText;
                }
                objGroupAssementSummary.SectionID = DistinctResidentQuestionsAnswers[i].SectionID;
                var lstGroupIntervention = [];
                for (var j = 0; j < lstIntervention.length; j++) {
                    var objGroupIntervention = {};
                    if (lstIntervention[j].ResidentQuestionAnsID == DistinctResidentQuestionsAnswers[i].ResidentQuestionAnswersID) {
                        objGroupAssementSummary.DisplayOrder = 0;
                        objGroupAssementSummary.InterventionId = lstIntervention[j].ID;
                        objGroupIntervention.InterventionId = lstIntervention[j].ID;
                        objGroupIntervention.InterventionName = lstIntervention[j].InterventionName;
                        var objAction = null;
                        for (var k = 0; k < arryActions.length; k++) {
                            if (arryActions[k].Section_InterventionID == lstIntervention[j].ID && arryActions[k].ResidentID == vm.ResidentId) {
                                objAction = arryActions[k];
                                break;//if not needed then remove this break
                            }
                        }
                        if (objAction != null) {
                            objGroupIntervention.Ocuurrence = parseInt(objAction.Occurrences);
                            objGroupIntervention.Type = objAction.Type;
                            objGroupIntervention.StartDate = objAction.StartDate;
                        }
                        lstGroupIntervention.push(objGroupIntervention);
                    }
                }
                objGroupAssementSummary.lstGroupIntervention = lstGroupIntervention;
                lstGroupAssessment.push(objGroupAssementSummary);
            }//DistinctResidentQuestionsAnswers for loop
            vm.AssessmentSummary = lstGroupAssessment;
            GetAssessementSummary_Offline(lstGroupAssessment);
        }//LoadOffline method ends

        function GetAssessementSummary_Offline(obj) {

            vm.Sections = [];
            if (arrySections.length > 0) {
                vm.Sections = arrySections;
            }

            for (var i = 0; i < vm.Sections.length; i++) {
                vm.Sections[i].Assessment = [];
                for (var j = 0; j < obj.length; j++) {
                    if (obj[j].SectionID == vm.Sections[i].ID) {
                        var Summary = { Question: "", LabelTxt: "", DisplayOrder: 0, Intervention: [] };
                        Summary.Question = obj[j].Question;
                        Summary.LabelTxt = obj[j].LabelTxt;
                        Summary.DisplayOrder = obj[j].DisplayOrder;

                        if (obj[j].lstGroupIntervention != null) {
                            for (var m = 0; m < obj[j].lstGroupIntervention.length; m++) {

                                var interventiondata = { InterventionName: "", Occurrence: "", Type: "", startDate: "" };

                                if (obj[j].lstGroupIntervention[m].InterventionName != null)
                                    interventiondata.InterventionName = obj[j].lstGroupIntervention[m].InterventionName;

                                if (obj[j].lstGroupIntervention[m].Type != null) {
                                    interventiondata.Occurrence = obj[j].lstGroupIntervention[m].Ocuurrence;
                                    interventiondata.Type = obj[j].lstGroupIntervention[m].Type;
                                    interventiondata.startDate = obj[j].lstGroupIntervention[m].StartDate;
                                }
                                Summary.Intervention.push(interventiondata);
                            }
                        }
                        vm.Sections[i].Assessment.push(Summary);
                    }
                }
                if (vm.Sections[i].Assessment.length > 0)
                    vm.Sections[i].HasAssesment = true;
                else
                    vm.Sections[i].HasAssesment = false;
            }
        }
    }
}());