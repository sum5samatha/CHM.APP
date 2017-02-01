(function () {
    // "use strict";

    angular.module('CHM').controller('EditCarePlanController', EditCarePlanController);

    EditCarePlanController.$inject = ['$rootScope', '$scope', '$q', '$uibModal', '$state', '$window', '$filter', '$stateParams', '$sce', 'toastr', 'ResidentsService', 'InterventionsService', 'onlineStatus', 'CommonService', '$cordovaFile'];

    function EditCarePlanController($rootScope, $scope, $q, $uibModal, $state, $window, $filter, $stateParams, $sce, toastr, ResidentsService, InterventionsService, onlineStatus, CommonService, $cordovaFile) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.Resident = {};
        vm.CarePlan = [];
        var oldRecurrencePattern = {};
        var modalInstance = null;


        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var weekNumber = new Array(7);
        weekday["Sunday"] = "Sunday";
        weekday["Monday"] = "Monday";
        weekday["Tuesday"] = "Tuesday";
        weekday["Wednesday"] = "Wednesday";
        weekday["Thursday"] = "Thursday";
        weekday["Friday"] = "Friday";
        weekday["Saturday"] = "Saturday";


        vm.DisableGenerateTask = false;

        var arryInterventions = [];
        var arryIntervention_Question_ParentQuestion = [];
        var arryResident_Question_Answers = [];
        var arrySection_Question_Answers = [];
        var arrySection_Questions_Answers_Tasks = [];
        var arrySection_Intervention = [];
        var arryActions = [];
        var arryActions_Days = [];
        var arryIntervention_Question = [];
        var arryIntervention_Question_Answer = [];
        var arryResident_Interventions_Questions_Answers = [];
        var arryIntervention_Question_Answer_Task = [];

        var arryResidentsByID = [];
        var arrySection_Questions = [];
        var arrySections = [];
        var arryInterventionResidentAnswerDocuments = [];

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        $scope.onlineStatus = onlineStatus;


        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.ResidentId = $stateParams.ResidentId;
            vm.Resident = {};
            vm.CarePlan = [];
            var oldRecurrencePattern = {};
            var modalInstance = null;

            vm.DisableGenerateTask = false;

            if ($scope.online == true) {
                if ($rootScope.IsSynchronizing) {
                    $scope.$on('SyncOfData', function (event, args) {
                        if (args.Compleated) {
                            GetPersonalInformation();
                            InterventionQuestionParentQuestion();
                            InterventionForInterventionQuestion();
                        }
                    });
                }
                else {
                    GetPersonalInformation();
                    InterventionQuestionParentQuestion();
                    InterventionForInterventionQuestion();
                }
            }
            else {

                $rootScope.$broadcast("loader_show");
                var deferredArr = [];
                var deferredInterventions = $q.defer();
                var deferredIntervention_Question_ParentQuestion = $q.defer();
                var deferredResident_Question_Answers = $q.defer();
                var deferredSection_Question_Answers = $q.defer();
                var deferredSection_Questions_Answers_Tasks = $q.defer();
                var deferredSection_Intervention = $q.defer();
                var deferredActions = $q.defer();
                var deferredActions_Days = $q.defer();
                var deferredIntervention_Question = $q.defer();
                var deferredIntervention_Question_Answer = $q.defer();
                var deferredResident_Interventions_Questions_Answers = $q.defer();
                var deferredIntervention_Question_Answer_Task = $q.defer();

                var deferredResidentsByID = $q.defer();
                var deferredSection_Questions = $q.defer();
                var deferredSections = $q.defer();
                var deferredInterventionResidentAnswerDocuments = $q.defer();



                arryInterventions = [];
                arryIntervention_Question_ParentQuestion = [];
                arryResident_Question_Answers = [];
                arrySection_Question_Answers = [];
                arrySection_Questions_Answers_Tasks = [];
                arrySection_Intervention = [];
                arryActions = [];
                arryActions_Days = [];
                arryIntervention_Question = [];
                arryIntervention_Question_Answer = [];
                arryResident_Interventions_Questions_Answers = [];
                arryIntervention_Question_Answer_Task = [];

                arryResidentsByID = [];
                arrySection_Questions = [];
                arrySections = [];
                arryInterventionResidentAnswerDocuments = [];


                deferredArr.push(deferredInterventions.promise);
                deferredArr.push(deferredIntervention_Question_ParentQuestion.promise);
                deferredArr.push(deferredResident_Question_Answers.promise);
                deferredArr.push(deferredSection_Question_Answers.promise);
                deferredArr.push(deferredSection_Questions_Answers_Tasks.promise);
                deferredArr.push(deferredSection_Intervention.promise);
                deferredArr.push(deferredActions.promise);
                deferredArr.push(deferredActions_Days.promise);
                deferredArr.push(deferredIntervention_Question.promise);
                deferredArr.push(deferredIntervention_Question_Answer.promise);
                deferredArr.push(deferredResident_Interventions_Questions_Answers.promise);
                deferredArr.push(deferredIntervention_Question_Answer_Task.promise);

                deferredArr.push(deferredResidentsByID.promise);
                deferredArr.push(deferredSection_Questions.promise);
                deferredArr.push(deferredSections.promise);
                deferredArr.push(deferredInterventionResidentAnswerDocuments.promise);





                var renderInterventions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryInterventions.push(rs.rows.item(i));
                    }
                    deferredInterventions.resolve();
                };

                var renderIntervention_Question_ParentQuestion = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryIntervention_Question_ParentQuestion.push(rs.rows.item(i));
                    }
                    deferredIntervention_Question_ParentQuestion.resolve();
                };

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

                var renderActions_Days = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryActions_Days.push(rs.rows.item(i));
                    }
                    deferredActions_Days.resolve();
                };

                var renderIntervention_Question = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryIntervention_Question.push(rs.rows.item(i));
                    }
                    deferredIntervention_Question.resolve();
                };


                var renderIntervention_Question_Answer = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryIntervention_Question_Answer.push(rs.rows.item(i));
                    }
                    deferredIntervention_Question_Answer.resolve();
                };

                var renderResident_Interventions_Questions_Answers = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryResident_Interventions_Questions_Answers.push(rs.rows.item(i));
                    }
                    deferredResident_Interventions_Questions_Answers.resolve();
                };



                var renderIntervention_Question_Answer_Task = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryIntervention_Question_Answer_Task.push(rs.rows.item(i));
                    }
                    deferredIntervention_Question_Answer_Task.resolve();
                };
                //-----------
                var renderResidentsByID = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryResidentsByID.push(rs.rows.item(i));
                    }
                    deferredResidentsByID.resolve();
                };
                var renderSection_Questions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySection_Questions.push(rs.rows.item(i));
                    }
                    deferredSection_Questions.resolve();
                };
                var renderSections = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arrySections.push(rs.rows.item(i));
                    }
                    deferredSections.resolve();
                };
                var renderInterventionResidentAnswerDocuments = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryInterventionResidentAnswerDocuments.push(rs.rows.item(i));
                    }
                    deferredInterventionResidentAnswerDocuments.resolve();
                };


                function GetAllOfflineData() {
                    app.GetOfflineInterventions(renderInterventions);
                    app.GetOfflineIntervention_Question_ParentQuestion(renderIntervention_Question_ParentQuestion);
                    app.GetOfflineResidents_Questions_Answers(renderResident_Question_Answers, vm.ResidentId);
                    app.GetOfflineSections_Questions_Answers(renderSection_Question_Answers);
                    app.GetOfflineSections_Questions_Answers_Tasks(renderSection_Questions_Answers_Tasks);
                    app.GetOfflineSection_Interventions(renderSection_Intervention);
                    app.GetOfflineActionsByResidentID(renderActions, vm.ResidentId);
                    app.GetOfflineActions_Days(renderActions_Days);
                    app.GetOfflineIntervention_Question(renderIntervention_Question);
                    app.GetOfflineIntervention_Question_Answer(renderIntervention_Question_Answer);
                    app.GetOfflineResident_Interventions_Questions_Answers(renderResident_Interventions_Questions_Answers, vm.ResidentId);
                    app.GetOfflineIntervention_Question_Answer_Task(renderIntervention_Question_Answer_Task);
                    //-------------------
                    app.GetOfflineResidentsByID(renderResidentsByID, vm.ResidentId);
                    app.GetOfflineSections_Questions(renderSection_Questions);
                    app.GetOfflineSections(renderSections);
                    app.GetInterventionResidentAnswerDocuments(renderInterventionResidentAnswerDocuments);
                }



                function GetInterventionByID_Offline() {
                    GetAllOfflineData();
                    $q.all(deferredArr).then(function () {
                        $rootScope.$broadcast("loader_hide");
                        vm.QuestionParentQuestion = arryIntervention_Question_ParentQuestion;
                        vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
                        if (arryResidentsByID.length == 1) {
                            var objResident = {};
                            objResident.FirstName = arryResidentsByID[0].FirstName;
                            objResident.LastName = arryResidentsByID[0].LastName;
                            vm.Resident = objResident;
                        }
                        else {
                            toastr.error('more than one ResidentsByIDs exist');
                        }
                        InterventionForInterventionQuestion_Offline();
                        GetAllActiveSection_Offline();
                    },
                    function (err) {
                    }
                );
                }
                GetInterventionByID_Offline();
            }

        });


        var InterventionForInterventionQuestion = function () {
            ResidentsService.getInterventionSummary(vm.ResidentId).then(
         function (response) {

             vm.InterventionCarePlan = [];
             for (var j = 0; j < response.data.length; j++) {

                 var objCarePlan = {};
                 objCarePlan.TaskTitle = response.data[j].Section_Intervention.InterventionTitle;
                 objCarePlan.Section_Question_Answer_TaskID = response.data[j].Section_Intervention.ID;
                 objCarePlan.AnswerID = response.data[j].InterventionAnswerID;
                 objCarePlan.QuestionIntervention = response.data[j].Section_Intervention.Intervention_Question;
                 objCarePlan.IsRecurrencePatternShown = false;

                 if (response.data[j].Section_Intervention.Actions.length > 0) {

                     SetRecurrenceRangeAndPattern(objCarePlan, response.data[j].Section_Intervention.Actions[0]);


                 }
                 else {
                     ResetRecurrencePattern(objCarePlan);
                     ResetRecurrenceRange(objCarePlan);
                 }


                 objCarePlan.OldRecurrence = {};
                 objCarePlan.OldRecurrence = angular.copy(objCarePlan.Recurrence);

                 vm.InterventionCarePlan.push(objCarePlan);

                 //  vm.CarePlan.push(objCarePlan);

             }



         }, function (err) {
             toastr.error('An error occurred while retrieving assessment answers.');
         })


        }

        function InterventionQuestionParentQuestion() {
            ResidentsService.InterventionQuestionParentQuestion().then(
       function (response) {
           vm.QuestionParentQuestion = response.data;
           //newly added 4/14/2016
           vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
           GetAllActiveSection();
       },
       function (err) {
           toastr.error('An error occurred while retrieving QuestionParentQuestion.');
       }
       );
        }

        function InterventionForInterventionQuestion_Offline() {
            var lstResidentAnsweredQuestions = [];
            for (var i = 0; i < arryResident_Interventions_Questions_Answers.length; i++) {
                for (var j = 0; j < arryIntervention_Question_Answer.length; j++) {
                    if (arryResident_Interventions_Questions_Answers[i].Intervention_Question_AnswerID == arryIntervention_Question_Answer[j].ID) {
                        lstResidentAnsweredQuestions.push(arryIntervention_Question_Answer[j]);

                    }
                }
            }
            var lstSectionQuestionsAnswersTask = [];
            var lstSectionQuestionAnswerHasParentAnswerID = [];
            var lstSectionQuestionAnswerHasNoParentAnswerID = [];
            for (var i = 0; i < arryIntervention_Question_Answer_Task.length; i++) {
                if (arryIntervention_Question_Answer_Task[i].InterventionAnswerID != null) {
                    lstSectionQuestionAnswerHasParentAnswerID.push(arryIntervention_Question_Answer_Task[i]);
                }
                else {
                    lstSectionQuestionAnswerHasNoParentAnswerID.push(arryIntervention_Question_Answer_Task[i]);
                }
                arryIntervention_Question_Answer_Task[i].Section_Intervention = [];
                for (var j = 0; j < arrySection_Intervention.length; j++) {
                    if (arryIntervention_Question_Answer_Task[i].Section_InterventionID == arrySection_Intervention[j].ID) {
                        arrySection_Intervention[j].Actions = [];
                        arrySection_Intervention[j].Intervention_Question = [];
                        for (var k = 0; k < arryActions.length; k++) {
                            if (arryActions[k].Section_InterventionID == arrySection_Intervention[j].ID) {
                                arrySection_Intervention[j].Actions.push(arryActions[k]);
                            }
                        }
                        for (var k = 0; k < arryIntervention_Question.length; k++) {
                            if (arryIntervention_Question[k].Section_InterventionID == arrySection_Intervention[j].ID) {
                                arrySection_Intervention[j].Intervention_Question.push(arryIntervention_Question[k]);
                            }
                        }
                        arryIntervention_Question_Answer_Task[i].Section_Intervention = arrySection_Intervention[j];
                    }
                }
            }

            for (var i = 0; i < arryIntervention_Question_Answer_Task.length; i++) {
                if (arryIntervention_Question_Answer_Task[i].Section_Intervention.length == 0) {

                }
                else {
                    for (var j = 0; j < arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions.length; j++) {
                        arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days = [];
                        for (var k = 0; k < arryActions_Days.length; k++) {
                            if (arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].ID == arryActions_Days[k].ActionID) {
                                arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days.push(arryActions_Days[k]);
                            }
                        }
                    }
                    for (var j = 0; j < arryIntervention_Question_Answer_Task[i].Section_Intervention.Intervention_Question.length; j++) {
                        arryIntervention_Question_Answer_Task[i].Section_Intervention.Intervention_Question[j].Intervention_Question_Answer = [];
                        for (var k = 0; k < arryIntervention_Question_Answer.length; k++) {
                            if (arryIntervention_Question_Answer_Task[i].Section_Intervention.Intervention_Question[j].ID == arryIntervention_Question_Answer[k].Intervention_QuestionID) {
                                arryIntervention_Question_Answer_Task[i].Section_Intervention.Intervention_Question[j].Intervention_Question_Answer.push(arryIntervention_Question_Answer[k]);
                            }
                        }
                    }
                }
            }


            var GetlstResidentSectionQuestionAnsTask = [];
            for (var i = 0; i < lstResidentAnsweredQuestions.length; i++) {
                for (var j = 0; j < lstSectionQuestionAnswerHasParentAnswerID.length; j++) {
                    if (lstResidentAnsweredQuestions[i].Intervention_Question_AnswerID == lstSectionQuestionAnswerHasParentAnswerID[j].InterventionAnswerID) {
                        GetlstResidentSectionQuestionAnsTask.push(lstSectionQuestionAnswerHasParentAnswerID[j]);
                    }
                }
            }
            vm.InterventionCarePlan = [];
            for (var j = 0; j < GetlstResidentSectionQuestionAnsTask.length; j++) {

                var objCarePlan = {};
                objCarePlan.TaskTitle = GetlstResidentSectionQuestionAnsTask[j].Section_Intervention.InterventionTitle;
                objCarePlan.Section_Question_Answer_TaskID = GetlstResidentSectionQuestionAnsTask[j].Section_Intervention.ID;
                objCarePlan.AnswerID = GetlstResidentSectionQuestionAnsTask[j].InterventionAnswerID;
                objCarePlan.QuestionIntervention = GetlstResidentSectionQuestionAnsTask[j].Section_Intervention.Intervention_Question;
                objCarePlan.IsRecurrencePatternShown = false;

                if (GetlstResidentSectionQuestionAnsTask[j].Section_Intervention.Actions.length > 0) {
                    SetRecurrenceRangeAndPattern(objCarePlan, GetlstResidentSectionQuestionAnsTask[j].Section_Intervention.Actions[0]);
                }
                else {
                    ResetRecurrencePattern(objCarePlan);
                    ResetRecurrenceRange(objCarePlan);
                }

                objCarePlan.OldRecurrence = {};
                objCarePlan.OldRecurrence = angular.copy(objCarePlan.Recurrence);

                vm.InterventionCarePlan.push(objCarePlan);

            }

        }//func ends


        var uniqueQuestion = function (arr) {
            var newarr = [];
            var unique = {};
            var onlydupiclateid = [];
            arr.forEach(function (item, index) {
                if (!unique[item.InterventionQuestionID]) {
                    newarr.push(item);
                    unique[item.InterventionQuestionID] = item;

                }
                else {
                    onlydupiclateid.push(item);
                }
            });

            //return newarr;
            //newly added 4/14/2016

            return onlydupiclateid;
        }

        var uniqueval = function (arr) {
            var newarr = [];
            var unique = {};
            arr.forEach(function (item, index) {
                if (!unique[item.InterventionQuestionID]) {
                    newarr.push(item);
                    unique[item.InterventionQuestionID] = item;
                }
            });

            return newarr;

        }

        var SubQuestionsAsParent = function (objSubquestion, lstSubQuestions) {
            for (var z = 0; z < objSubquestion.length; z++) {
                objSubquestion[z].childQuestion = [];

                for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                    if (objSubquestion[z].ID == vm.QuestionParentQuestion[n].InterventionParentQuestionID) {
                        for (var p = 0; p < lstSubQuestions.length; p++) {

                            if (lstSubQuestions[p].ID == vm.QuestionParentQuestion[n].InterventionQuestionID) {

                                objSubquestion[z].childQuestion.push(lstSubQuestions[p]);
                                SubQuestionsAsParent(objSubquestion[z].childQuestion, lstSubQuestions);
                            }

                        }
                    }
                }
            }
            //setTimeout(SubQuestionsAsParent, 4000);
        }

        var subQuestionforAnswer = function (objSubquestion, lstSubQuestion) {
            for (var i = 0; i < objSubquestion.length; i++) {

                for (var j = 0; j < objSubquestion[i].Intervention_Question_Answer.length; j++) {
                    objSubquestion[i].Intervention_Question_Answer[j].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (objSubquestion[i].Intervention_Question_Answer[j].ID == vm.QuestionParentQuestion[n].InterventionParentAnswerID) {
                            for (var l = 0; l < lstSubQuestion.length; l++) {


                                if (lstSubQuestion[l].ID == vm.QuestionParentQuestion[n].InterventionQuestionID && objSubquestion[i].Intervention_Question_Answer[j].ID == vm.QuestionParentQuestion[n].InterventionParentAnswerID) {  //newly added
                                    lstSubQuestion[l].InterventionParentAnswerID = objSubquestion[i].Intervention_Question_Answer[j].ID;
                                    //end
                                    objSubquestion[i].Intervention_Question_Answer[j].childQuestion.push(lstSubQuestion[l]);
                                    subQuestionforAnswer(objSubquestion[i].Intervention_Question_Answer[j].childQuestion, lstSubQuestion);
                                }
                            }
                        }


                    }

                }
            }
        }


        var BindCarePaln = function (obj) {
            for (var i = 0; i < obj.length; i++) {

                for (var M = 0; M < obj[i].Intervention_Question_Answer.length; M++) {
                    obj[i].Intervention_Question_Answer[M].CarePlan = [];
                    for (var z = 0; z < vm.InterventionCarePlan.length; z++) {
                        if (obj[i].Intervention_Question_Answer[M].ID == vm.InterventionCarePlan[z].AnswerID) {
                            obj[i].Intervention_Question_Answer[M].CarePlan.push(vm.InterventionCarePlan[z]);
                        }
                    }
                    BindCarePaln(obj[i].Intervention_Question_Answer[M].childQuestion);

                }
            }
        }


        vm.Months = [
            { Name: 'January', Value: 0, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'February', Value: 1, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
            { Name: 'March', Value: 2, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'April', Value: 3, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'May', Value: 4, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'June', Value: 5, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'July', Value: 6, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'August', Value: 7, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'September', Value: 8, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'October', Value: 9, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
            { Name: 'November', Value: 10, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
            { Name: 'December', Value: 11, Dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }
        ];
        vm.Days = [
            { Name: 'Sunday', Value: 0 },
            { Name: 'Monday', Value: 1 },
            { Name: 'Tuesday', Value: 2 },
            { Name: 'Wednesday', Value: 3 },
            { Name: 'Thursday', Value: 4 },
            { Name: 'Friday', Value: 5 },
            { Name: 'Saturday', Value: 6 }
        ];
        vm.Instances = [
            { Name: 'first', Value: 1 },
            { Name: 'second', Value: 2 },
            { Name: 'third', Value: 3 },
            { Name: 'fourth', Value: 4 },
            { Name: 'last', Value: 5 }
        ];


        var ResetRecurrencePattern = function (objCarePlan) {
            objCarePlan.Recurrence = {};
            objCarePlan.Recurrence.RecurrenceType = 'Daily';
            objCarePlan.Recurrence.MonthlyPattern = 'Date';
            objCarePlan.Recurrence.YearlyPattern = 'Date';
            objCarePlan.Recurrence.RecurrenceInterval = 1;
            objCarePlan.Recurrence.RecurrenceDay = vm.Days[0].Value;
            objCarePlan.Recurrence.RecurrenceDate = moment().format('D');
            objCarePlan.Recurrence.RecurrenceMonth = moment().month();
            objCarePlan.Recurrence.Instance = vm.Instances[0].Value;
            objCarePlan.Recurrence.RecurrenceRange = 'NoOfOccurrences';
            objCarePlan.Recurrence.SelectedWeekDays = [moment().day()];

            objCarePlan.Recurrence.SelectedWeekDayTimings = [[{ StartTime: new Date(), EndTime: new Date() }]];
            objCarePlan.Recurrence.Timings = [{ StartTime: new Date(), EndTime: new Date() }];
        };

        var ResetRecurrenceRange = function (objCarePlan) {
            objCarePlan.Recurrence.NoOfOccurrences = 10;
            objCarePlan.Recurrence.RecurrenceStartDate = new Date(moment());//.format($rootScope.DateFormatForMoment);
            objCarePlan.Recurrence.RecurrenceEndDate = new Date(moment().add(10, 'day'));//.format($rootScope.DateFormatForMoment);
        };

        vm.OpenRecurrencePattern = function (objCarePlan) {
            //oldRecurrencePattern = angular.copy(objCarePlan.Recurrence);

            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/CarePlan/_partials/RecurrencePattern.html',
                controller: 'RecurrencePatternController',
                controllerAs: 'vm',
                resolve: {
                    recurrence: function () {
                        return angular.copy(objCarePlan.Recurrence);
                    },
                    title: function () {
                        return objCarePlan.TaskTitle;
                    }
                },
                backdrop: 'static',
                size: 'lg'
            });

            modalInstance.result.then(
                function (response) {
                    objCarePlan.Recurrence = angular.copy(response);
                },
                function () {
                }
            );

            //objCarePlan.IsRecurrencePatternShown = true;
        };

        function GetPersonalInformation() {
            ResidentsService.GetPersonalInformation(vm.ResidentId).then(
            function (response) {
                vm.Resident = response.data.Resident;
            },
            function (err) {
                toastr.error('An error occurred while retrieving resident information.');
            }
        );
        }



        var uniquevalSection = function (arr) {
            var newarr = [];
            var unique = {};
            arr.forEach(function (item, index) {
                if (!unique[item.ID]) {
                    newarr.push(item);
                    unique[item.ID] = item;
                }
            });

            return newarr;

        }

        var GetAllActiveSection = function () {
            ResidentsService.GetAssessmentSummary(vm.ResidentId).then(
            function (response) {
                GetAllActiveSectionWRTOnlineOffline(response.data);
            },
            function (err) {
                toastr.error('An error occurred while retrieving task titles.');
            }
        );
        }

        var SetRecurrenceRangeAndPattern = function (objCarePlan, objAction) {
            objCarePlan.Recurrence = {};

            objCarePlan.Recurrence.RecurrenceStartDate = new Date(objAction.StartDate);
            if (objAction.EndDate) {
                objCarePlan.Recurrence.RecurrenceEndDate = new Date(objAction.EndDate);
                objCarePlan.Recurrence.NoOfOccurrences = 10;
                objCarePlan.Recurrence.RecurrenceRange = 'RecurrenceEndDate';
            }
            else {
                objCarePlan.Recurrence.RecurrenceEndDate = new Date(moment(objCarePlan.Recurrence.StartDate).add(10, 'day'));
                objCarePlan.Recurrence.NoOfOccurrences = objAction.Occurrences;
                objCarePlan.Recurrence.RecurrenceRange = 'NoOfOccurrences';
            }

            if (objAction.Interval)
                objCarePlan.Recurrence.RecurrenceInterval = objAction.Interval;

            if (objAction.Type)
                objCarePlan.Recurrence.RecurrenceType = objAction.Type;

            if (objAction.Month)
                objCarePlan.Recurrence.RecurrenceMonth = objAction.Month;

            if (objAction.Instance)
                objCarePlan.Recurrence.RecurrenceInstance = objAction.Instance;


            switch (objAction.Type) {
                case 'Monthly':
                    objCarePlan.Recurrence.MonthlyPattern = 'Date';
                    break;
                case 'MonthlyNth':
                    objCarePlan.Recurrence.RecurrenceType = 'Monthly';
                    objCarePlan.Recurrence.MonthlyPattern = 'Instance';
                    break;
                case 'Yearly':
                    objCarePlan.Recurrence.YearlyPattern = 'Date';
                    break;
                case 'YearlyNth':
                    objCarePlan.Recurrence.RecurrenceType = 'Yearly';
                    objCarePlan.Recurrence.YearlyPattern = 'Instance';
                    break;
            }

            objCarePlan.Recurrence.SelectedWeekDays = [];
            objCarePlan.Recurrence.SelectedWeekDayTimings = [];
            objCarePlan.Recurrence.Timings = [];
            objCarePlan.Recurrence.Day = null;
            objCarePlan.Recurrence.Date = null;


            if (objAction.Type == 'Weekly') {
                for (var i = 0; i < objAction.Actions_Days.length; i++) {
                    var weekDayIndex = objCarePlan.Recurrence.SelectedWeekDays.indexOf(objAction.Actions_Days[i].Day);

                    if (weekDayIndex == -1) {
                        weekDayIndex = objCarePlan.Recurrence.SelectedWeekDays.push(objAction.Actions_Days[i].Day) - 1;
                        objCarePlan.Recurrence.SelectedWeekDayTimings[weekDayIndex] = [];
                    }

                    var startTimeParts = objAction.Actions_Days[i].StartTime.split(':');
                    var endTimeParts = objAction.Actions_Days[i].EndTime.split(':');
                    if (startTimeParts.length == 3 && endTimeParts.length == 3)
                        objCarePlan.Recurrence.SelectedWeekDayTimings[weekDayIndex].push({ StartTime: new Date().setHours(startTimeParts[0], startTimeParts[1]), EndTime: new Date().setHours(endTimeParts[0], endTimeParts[1]) });

                }
            }
            else {
                for (var i = 0; i < objAction.Actions_Days.length; i++) {
                    objCarePlan.Recurrence.Day = objAction.Actions_Days[i].Day;
                    objCarePlan.Recurrence.Date = objAction.Actions_Days[i].Date;
                    var startTimeParts = objAction.Actions_Days[i].StartTime.split(':');
                    var endTimeParts = objAction.Actions_Days[i].EndTime.split(':');
                    if (startTimeParts.length == 3 && endTimeParts.length == 3)
                        objCarePlan.Recurrence.Timings.push({ StartTime: new Date().setHours(startTimeParts[0], startTimeParts[1]), EndTime: new Date().setHours(endTimeParts[0], endTimeParts[1]) });
                }
            }



        };

        vm.GenerateTasks = function () {
            var arrInterventions = [];
            var lstActions = [];
            vm.DisableGenerateTask = true;

            for (var i = 0; i < vm.CarePlan.length; i++) {
                if (!angular.equals(vm.CarePlan[i].Recurrence, vm.CarePlan[i].OldRecurrence)) {
                    var objAction = {};

                    objAction.ResidentID = vm.ResidentId;
                    // objAction.Resident_Question_AnswerID = vm.CarePlan[i].Resident_Question_AnswerID;
                    objAction.Section_InterventionID = vm.CarePlan[i].Section_Question_Answer_TaskID;
                    objAction.StartDate = new Date(vm.CarePlan[i].Recurrence.RecurrenceStartDate);
                    objAction.EndDate = null;
                    objAction.Occurrences = null;
                    objAction.Actions_Days = [];

                    switch (vm.CarePlan[i].Recurrence.RecurrenceRange) {
                        case 'NoOfOccurrences':
                            objAction.Occurrences = vm.CarePlan[i].Recurrence.NoOfOccurrences;
                            break;
                        case 'RecurrenceEndDate':
                            objAction.EndDate = new Date(vm.CarePlan[i].Recurrence.RecurrenceEndDate);
                            break;
                    }

                    if (vm.CarePlan[i].Recurrence.RecurrenceType == 'Daily') {
                        objAction.Type = 'Daily';
                        objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;
                        objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;
                        objAction.Instance = vm.CarePlan[i].Recurrence.Instance;

                        for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                            var objAction_Day = {};
                            objAction_Day.Day = null;
                            objAction_Day.Date = null;

                            //Convert Time to UTC

                            var Starttime = vm.CarePlan[i].Recurrence.Timings[j].StartTime;
                            var startedtime = moment(Starttime).format();
                            var DateStartTime = moment(startedtime).utc().format("HH:mm:ss");

                            var Endtime = vm.CarePlan[i].Recurrence.Timings[j].EndTime;
                            var endedtime = moment(Endtime).format();
                            var DateEndTime = moment(endedtime).utc().format("HH:mm:ss");

                            objAction_Day.StartTime = DateStartTime;
                            objAction_Day.EndTime = DateEndTime;

                            objAction_Day.Specifications = null;

                            objAction.Actions_Days.push(objAction_Day);
                        }

                    }

                    else if (vm.CarePlan[i].Recurrence.RecurrenceType == 'Weekly') {
                        objAction.Type = 'Weekly';
                        objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;
                        objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;
                        objAction.Instance = vm.CarePlan[i].Recurrence.Instance;
                        objAction.RecurrenceDay = vm.CarePlan[i].Recurrence.SelectedWeekDays.toString();

                        for (var j = 0; j < vm.CarePlan[i].Recurrence.SelectedWeekDays.length; j++) {
                            for (var k = 0; k < vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j].length; k++) {
                                var objAction_Day = {};
                                objAction_Day.Day = vm.CarePlan[i].Recurrence.SelectedWeekDays[j];
                                objAction_Day.Date = null;

                                var Starttime = vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j][k].StartTime;
                                var startedtime = moment(Starttime).format();
                                var DateStartTime = moment(startedtime).utc().format("HH:mm:ss");

                                var Endtime = vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j][k].EndTime;
                                var endedtime = moment(Endtime).format();
                                var DateEndTime = moment(endedtime).utc().format("HH:mm:ss");

                                objAction_Day.StartTime = DateStartTime;
                                objAction_Day.EndTime = DateEndTime;

                                //objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j][k].StartTime).format('HH:mm:ss');
                                //objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.SelectedWeekDayTimings[j][k].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }
                        }

                    }

                    else if (vm.CarePlan[i].Recurrence.RecurrenceType == 'Monthly') {
                        if (vm.CarePlan[i].Recurrence.MonthlyPattern == 'Date') {
                            objAction.Type = 'Monthly';
                            objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;
                            objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;
                            objAction.Instance = vm.CarePlan[i].Recurrence.Instance;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = null;
                                objAction_Day.Date = vm.CarePlan[i].Recurrence.RecurrenceDate;

                                var Starttime = vm.CarePlan[i].Recurrence.Timings[j].StartTime;
                                var startedtime = moment(Starttime).format();
                                var DateStartTime = moment(startedtime).utc().format("HH:mm:ss");

                                var Endtime = vm.CarePlan[i].Recurrence.Timings[j].EndTime;
                                var endedtime = moment(Endtime).format();
                                var DateEndTime = moment(endedtime).utc().format("HH:mm:ss");

                                objAction_Day.StartTime = DateStartTime;
                                objAction_Day.EndTime = DateEndTime;
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }

                        }
                        else {
                            objAction.Type = 'MonthlyNth';
                            objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;
                            objAction.Instance = vm.CarePlan[i].Recurrence.Instance;
                            objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = vm.CarePlan[i].Recurrence.RecurrenceDay;
                                objAction_Day.Date = null;


                                var Starttime = vm.CarePlan[i].Recurrence.Timings[j].StartTime;
                                var startedtime = moment(Starttime).format();
                                var DateStartTime = moment(startedtime).utc().format("HH:mm:ss");

                                var Endtime = vm.CarePlan[i].Recurrence.Timings[j].EndTime;
                                var endedtime = moment(Endtime).format();
                                var DateEndTime = moment(endedtime).utc().format("HH:mm:ss");

                                objAction_Day.StartTime = DateStartTime;
                                objAction_Day.EndTime = DateEndTime;
                                objAction_Day.Specifications = null;
                                objAction.Actions_Days.push(objAction_Day);
                            }
                        }
                    }
                    else {
                        if (vm.CarePlan[i].Recurrence.YearlyPattern == 'Date') {
                            objAction.Type = 'Yearly';
                            objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;
                            objAction.Instance = vm.CarePlan[i].Recurrence.Instance;
                            objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = null;
                                objAction_Day.Date = vm.CarePlan[i].Recurrence.RecurrenceDate;


                                var Starttime = vm.CarePlan[i].Recurrence.Timings[j].StartTime;
                                var startedtime = moment(Starttime).format();
                                var DateStartTime = moment(startedtime).utc().format("HH:mm:ss");

                                var Endtime = vm.CarePlan[i].Recurrence.Timings[j].EndTime;
                                var endedtime = moment(Endtime).format();
                                var DateEndTime = moment(endedtime).utc().format("HH:mm:ss");

                                objAction_Day.StartTime = DateStartTime;
                                objAction_Day.EndTime = DateEndTime;
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }

                        }
                        else {
                            objAction.Type = 'YearlyNth';
                            objAction.Month = vm.CarePlan[i].Recurrence.RecurrenceMonth;
                            objAction.Instance = vm.CarePlan[i].Recurrence.Instance;
                            objAction.Interval = vm.CarePlan[i].Recurrence.RecurrenceInterval;

                            for (var j = 0; j < vm.CarePlan[i].Recurrence.Timings.length; j++) {
                                var objAction_Day = {};
                                objAction_Day.Day = vm.CarePlan[i].Recurrence.RecurrenceDay;
                                objAction_Day.Date = null;



                                var Starttime = vm.CarePlan[i].Recurrence.Timings[j].StartTime;
                                var startedtime = moment(Starttime).format();
                                var DateStartTime = moment(startedtime).utc().format("HH:mm:ss");

                                var Endtime = vm.CarePlan[i].Recurrence.Timings[j].EndTime;
                                var endedtime = moment(Endtime).format();
                                var DateEndTime = moment(endedtime).utc().format("HH:mm:ss");

                                objAction_Day.StartTime = DateStartTime;
                                objAction_Day.EndTime = DateEndTime;
                                //objAction_Day.StartTime = moment(vm.CarePlan[i].Recurrence.Timings[j].StartTime).format('HH:mm:ss');;
                                //objAction_Day.EndTime = moment(vm.CarePlan[i].Recurrence.Timings[j].EndTime).format('HH:mm:ss');
                                objAction_Day.Specifications = null;

                                objAction.Actions_Days.push(objAction_Day);
                            }
                        }
                    }
                    lstActions.push(objAction);
                }
            }

            var InterventionLimit;
            for (var z = 0; z < $rootScope.LimitofInterventions.length; z++) {
                if ($rootScope.OrganizationId == $rootScope.LimitofInterventions[z].OrganizationID && $rootScope.LimitofInterventions[z].ConfigurationKey == 'GenerateInterventionLimit') {
                    InterventionLimit = $rootScope.LimitofInterventions[z].ConfigurationValue;
                    break;
                }
            }

            if (lstActions.length > 0) {
                if ($scope.online == true) {
                    InterventionsService.GenerateInterventions(lstActions, InterventionLimit).then(
                        function (response) {
                            $rootScope.$broadcast("loader_show");
                            var defferedGenerateInterventions = [];
                            CommonService.DeleteAllActionAction_DaysInterventionsRecords(app.db).then(function () {

                                //Insert Actions
                                var lstActionsData = response.data[0].Action;
                                var lstInsertActions = [];
                                for (var i = 0; i < lstActionsData.length; i++) {
                                    lstActionsData[i].IsSyncnised = true;
                                    lstActionsData[i].IsCreated = false;
                                    lstInsertActions.push(lstActionsData[i]);
                                }

                                if (lstInsertActions.length > 40) {
                                    var i, j, temparray, chunk = 40;
                                    for (i = 0, j = lstInsertActions.length; i < j; i += chunk) {
                                        temparray = lstInsertActions.slice(i, i + chunk);
                                        defferedGenerateInterventions.push(CommonService.insertActions(app.db, temparray).then(function () {
                                        }, function (err) {
                                            console.log(err);
                                            toastr.error(err);
                                        }));
                                    }
                                } else {
                                    defferedGenerateInterventions.push(CommonService.insertActions(app.db, lstInsertActions).then(function () {
                                    }, function (err) {
                                        console.log(err);
                                        toastr.error(err);
                                    }));
                                }

                                //Inserting Action Days
                                var lstActions_DaysData = response.data[0].ActionDays;
                                var lstInsertActions_Days = [];
                                for (var i = 0; i < lstActions_DaysData.length; i++) {
                                    lstActions_DaysData[i].IsSyncnised = true;
                                    lstActions_DaysData[i].IsCreated = false;
                                    lstInsertActions_Days.push(lstActions_DaysData[i]);
                                }
                                if (lstInsertActions_Days.length > 50) {
                                    var i, j, temparray, chunk = 50;
                                    for (i = 0, j = lstInsertActions_Days.length; i < j; i += chunk) {
                                        temparray = lstInsertActions_Days.slice(i, i + chunk);
                                        defferedGenerateInterventions.push(CommonService.insertActions_Days(app.db, temparray).then(function () {
                                        }, function (err) {
                                            console.log(err);
                                            toastr.error(err);
                                        }));
                                    }
                                } else {
                                    defferedGenerateInterventions.push(CommonService.insertActions_Days(app.db, lstInsertActions_Days).then(function () {
                                    }, function (err) {
                                        console.log(err);
                                        toastr.error(err);
                                    }));
                                }

                                //Inserting Interventions
                                var lstInterventionsData = response.data[0].lstIntervention;
                                var lstInsertInterventions = [];
                                for (var i = 0; i < lstInterventionsData.length; i++) {
                                    lstInterventionsData[i].IsSyncnised = true;
                                    lstInterventionsData[i].IsCreated = false;
                                    lstInsertInterventions.push(lstInterventionsData[i]);
                                }
                                if (lstInsertInterventions.length > 30) {
                                    var i, j, temparray, chunk = 30;
                                    for (i = 0, j = lstInsertInterventions.length; i < j; i += chunk) {
                                        temparray = lstInsertInterventions.slice(i, i + chunk);
                                        defferedGenerateInterventions.push(CommonService.insertInterventions(app.db, temparray).then(function () {
                                        }, function (err) {
                                            console.log(err);
                                            toastr.error(err);
                                        }));
                                    }
                                } else {
                                    defferedGenerateInterventions.push(CommonService.insertInterventions(app.db, lstInsertInterventions).then(function () {
                                    }, function (err) {
                                        console.log(err);
                                        toastr.error(err);
                                    }));
                                }
                            }, function (err) {
                                console.log(err);
                                toastr.error(err);
                                toastr.error('An error occurred while deleting generate pattern related tables in offline.');
                            });
                            $q.all(defferedGenerateInterventions).then(function () {
                                $rootScope.$broadcast("loader_hide");
                                toastr.success('Interventions generated successfully.');
                                //$state.go('ResidentInterventions');
                            });
                            //$state.go('ResidentInterventions');
                            //lstInterventionsData=[];
                            //vm.DisableGenerateTask = false;
                        }, function (err) {
                            toastr.error('An error occurred while generating interventions.');
                        });
                }
                else {
                    var no = 1;
                    var InterventionLimitDate = new Date(moment(new Date()).add(InterventionLimit, 'days'));
                    //first loop
                    var Section_InterventionIDs = [];
                    for (var i = 0; i < lstActions.length; i++) {

                        Section_InterventionIDs.push(lstActions[i].Section_InterventionID);
                    }

                    var arrInterventionsToBeDeleted = [];
                    for (var i = 0; i < Section_InterventionIDs.length; i++) {
                        for (var j = 0; j < arryActions.length; j++) {
                            if (Section_InterventionIDs[i] == arryActions[j].Section_InterventionID && arryActions[j].ResidentID == vm.ResidentId) {
                                for (var k = 0; k < arryActions_Days.length; k++) {
                                    if (arryActions_Days[k].ActionID == arryActions[j].ID) {
                                        for (var m = 0; m < arryInterventions.length; m++) {
                                            if (arryInterventions[m].Action_DayID == arryActions_Days[k].ID && arryInterventions[m].PlannedStartDate > new Date()) {
                                                arrInterventionsToBeDeleted.push(arryInterventions[m]);
                                            }
                                        }
                                    }
                                }

                            }

                        }
                    }

                    if (arrInterventionsToBeDeleted >= 1) {
                        for (var i = 0; i < arrInterventionsToBeDeleted.length; i++) {
                            app.DeleteExistingInterventions(arrInterventionsToBeDeleted[i]);
                        }
                    }

                    for (var i = 0; i < lstActions.length; i++) {
                        lstActions[i].ID = createGuid();
                        lstActions[i].IsActive = true;
                        lstActions[i].CreatedBy = $rootScope.UserInfo.UserID;
                        lstActions[i].ModifiedBy = $rootScope.UserInfo.UserID;
                        lstActions[i].Created = lstActions[i].Modified = new Date();

                        ///Second Looop
                        for (var j = 0; j < lstActions[i].Actions_Days.length; j++) {

                            lstActions[i].Actions_Days[j].ID = createGuid();
                            lstActions[i].Actions_Days[j].IsActive = true;
                            lstActions[i].Actions_Days[j].CreatedBy = $rootScope.UserInfo.UserID;
                            lstActions[i].Actions_Days[j].ModifiedBy = $rootScope.UserInfo.UserID;
                            lstActions[i].Actions_Days[j].Created = lstActions[i].Actions_Days[j].Modified = new Date();

                            Date.prototype.addDays = function (d) {
                                this.setDate(this.getDate() + d);
                                return this;
                            };
                            // DateTime targetEndDate = DateTime.MinValue;
                            var targetEndDate = null;//new Date(0);
                            var DummyDate = new Date();
                            var maxOccurrences = 0;

                            if (lstActions[i].EndDate == null && lstActions[i].Occurrences == null) {
                                targetEndDate = InterventionLimitDate;
                                //targetEndDate = DummyDate.addDays(30);
                            }
                            else if (lstActions[i].EndDate != null) {
                                //targetEndDate = moment(lstActions[i].EndDate).format('YYYY-MM-DD') > InterventionLimitDate ? InterventionLimitDate : lstActions[i].EndDate;
                                targetEndDate = lstActions[i].EndDate > InterventionLimitDate ? InterventionLimitDate : lstActions[i].EndDate;
                            }
                            else {
                                targetEndDate = InterventionLimitDate;
                                //targetEndDate = null;
                                maxOccurrences = lstActions[i].Occurrences;
                            }



                            //arrInterventions = [];
                            if (lstActions[i].Type == "Daily") {
                                for (var k = 0; ; k++) {
                                    Date.prototype.addDays = function (d) {
                                        this.setDate(this.getDate() + d);
                                        return this;
                                    };

                                    var dt = moment(lstActions[i].StartDate).add((lstActions[i].Interval * k), 'days');
                                    var tsStartTime = lstActions[i].Actions_Days[j].StartTime;
                                    var tsEndTime = lstActions[i].Actions_Days[j].EndTime;

                                    var objIntervention = {};

                                    objIntervention.PlannedStartDate = moment(dt).format('YYYY-MM-DD') + "T" + tsStartTime;
                                    objIntervention.PlannedEndDate = moment(dt).format('YYYY-MM-DD') + "T" + tsEndTime;
                                    objIntervention.ID = createGuid();
                                    objIntervention.IsActive = true;
                                    objIntervention.CreatedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.ModifiedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.Created = objIntervention.Modified = new Date();
                                    objIntervention.Action_DayID = lstActions[i].Actions_Days[j].ID;


                                    // if (lstActions[i].EndDate != null) {
                                    //if (objIntervention.PlannedStartDate >= targetEndDate) {
                                    if (new Date(dt) >= targetEndDate) {
                                        break;
                                    }
                                    if (lstActions[i].Occurrences != null) {
                                        if (maxOccurrences-- <= 0)
                                            break;
                                    }

                                    arrInterventions.push(objIntervention);
                                }
                            }

                            else if (lstActions[i].Type == "Weekly") {
                                for (var k = 0; ; k++) {
                                    Date.prototype.addDays = function (d) {
                                        this.setDate(this.getDate() + d);
                                        return this;
                                    };

                                    var n = weekday[lstActions[i].Actions_Days[j].Day];

                                    // DateTime dt = objAction.StartDate.StartOfWeek((DayOfWeek)objAction_Day.Day).AddDays(objAction.Interval * i * 7);
                                    // var dt = moment(next(lstActions[i].StartDate, n)).add((objAction.Interval * k * 7), 'days');
                                    // var dt = moment(next(lstActions[i].StartDate, n)).add((lstActions[i].Interval * k * 7), 'days');

                                    var DayNumberofSelectedWeek = lstActions[i].Actions_Days[j].Day;
                                  
                                    var StartDateWeekNumber = new Date(lstActions[i].StartDate).getDay();
                                    var DiffbwWeekNumbers = DayNumberofSelectedWeek - StartDateWeekNumber;
                                    if (DiffbwWeekNumbers < 0) {
                                        // ss = (nDayNumber + 7) - nStartDateNumber;
                                        DiffbwWeekNumbers += 7;
                                    }

                                    var stardate = moment(lstActions[i].StartDate).format('YYYY-MM-DD');
                                    var new_date = moment(stardate, "YYYY-MM-DD").add(DiffbwWeekNumbers, 'days').format('YYYY-MM-DD');
                                    var dt = moment(new_date).add((lstActions[i].Interval * k * 7), 'days').format('YYYY-MM-DD');

                                    var tsStartTime = lstActions[i].Actions_Days[j].StartTime;
                                    var tsEndTime = lstActions[i].Actions_Days[j].EndTime;
                                    var objIntervention = {};
                                    objIntervention.PlannedStartDate = moment(dt).format('YYYY-MM-DD') + "T" + tsStartTime;
                                    objIntervention.PlannedEndDate = moment(dt).format('YYYY-MM-DD') + "T" + tsEndTime;
                                    objIntervention.ID = createGuid();
                                    objIntervention.IsActive = true;
                                    objIntervention.CreatedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.ModifiedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.Created = objIntervention.Modified = new Date();
                                    objIntervention.Action_DayID = lstActions[i].Actions_Days[j].ID;


                                    //if (lstActions[i].EndDate != null) {
                                    //if (objIntervention.PlannedStartDate >= targetEndDate) {
                                    if (new Date(dt) >= targetEndDate) {
                                        break;
                                    }
                                    if (lstActions[i].Occurrences != null) {
                                        if (maxOccurrences-- <= 0)
                                            break;
                                    }
                                    arrInterventions.push(objIntervention);
                                }
                            }

                            else if (lstActions[i].Type == "Monthly") {
                                for (var k = 0; ; k++) {
                                    var dt = new Date(0);
                                    if (lstActions[i].Actions_Days[j].Date < lstActions[i].StartDate.getDay()) {
                                        dt = moment(new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].StartDate.getMonth() + 1), lstActions[i].Actions_Days[j].Date)).add((lstActions[i].Interval * k), 'months');
                                    }
                                    else {
                                        dt = moment(new Date(lstActions[i].StartDate.getFullYear(), lstActions[i].StartDate.getMonth(), lstActions[i].Actions_Days[j].Date)).add((lstActions[i].Interval * k), 'months');
                                    }

                                    var tsStartTime = lstActions[i].Actions_Days[j].StartTime;
                                    var tsEndTime = lstActions[i].Actions_Days[j].EndTime;

                                    var objIntervention = {};
                                    objIntervention.PlannedStartDate = moment(dt).format('YYYY-MM-DD') + "T" + tsStartTime;
                                    objIntervention.PlannedEndDate = moment(dt).format('YYYY-MM-DD') + "T" + tsEndTime;
                                    objIntervention.ID = createGuid();
                                    objIntervention.IsActive = true;
                                    objIntervention.CreatedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.ModifiedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.Created = objIntervention.Modified = new Date();
                                    objIntervention.Action_DayID = lstActions[i].Actions_Days[j].ID;

                                    // if (lstActions[i].EndDate != null) {
                                    //if (objIntervention.PlannedStartDate >= targetEndDate) {
                                    if (new Date(dt) >= targetEndDate) {
                                        break;
                                    }
                                    if (lstActions[i].Occurrences != null) {
                                        if (maxOccurrences-- <= 0)
                                            break;
                                    }

                                    arrInterventions.push(objIntervention);
                                }
                            }

                            else if (lstActions[i].Type == "MonthlyNth") {
                                for (var k = 0; ; k++) {
                                    var dtTemp = new Date(0);
                                    //var n = weekday[lstActions[i].Actions_Days[j].Day];
                                    var n = lstActions[i].Actions_Days[j].Day;

                                  
                                    var currentMonthDate = GetDateForWeekDay(n, lstActions[i].Instance, lstActions[i].StartDate.getMonth(), lstActions[i].StartDate.getFullYear());

                                    if (currentMonthDate < lstActions[i].StartDate.getDay()) {

                                        dtTemp = moment(new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].StartDate.getMonth() + 1), 1)).add((lstActions[i].Interval * k), 'months');
                                    }
                                    else {
                                        dtTemp = moment(new Date(lstActions[i].StartDate.getFullYear(), lstActions[i].StartDate.getMonth(), 1)).add((lstActions[i].Interval * k), 'months');
                                    }

                                    var dateForWeekDay = GetDateForWeekDay(n, lstActions[i].Instance, dtTemp.month(), dtTemp.year());

                                    var dt = new Date(dtTemp.year(), dtTemp.month(), dateForWeekDay);

                                    var tsStartTime = lstActions[i].Actions_Days[j].StartTime;
                                    var tsEndTime = lstActions[i].Actions_Days[j].EndTime;

                                    var objIntervention = {};
                                    objIntervention.PlannedStartDate = moment(dt).format('YYYY-MM-DD') + "T" + tsStartTime;
                                    objIntervention.PlannedEndDate = moment(dt).format('YYYY-MM-DD') + "T" + tsEndTime;
                                    objIntervention.ID = createGuid();
                                    objIntervention.IsActive = true;
                                    objIntervention.CreatedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.ModifiedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.Created = objIntervention.Modified = new Date();
                                    objIntervention.Action_DayID = lstActions[i].Actions_Days[j].ID;

                                    // if (lstActions[i].EndDate != null) {
                                    // if (objIntervention.PlannedStartDate >= targetEndDate) {
                                    if (new Date(dt) >= targetEndDate) {
                                        break;
                                    }
                                    if (lstActions[i].Occurrences != null) {
                                        if (maxOccurrences-- <= 0)
                                            break;
                                    }
                                    arrInterventions.push(objIntervention);
                                }
                            }

                            else if (lstActions[i].Type == "Yearly") {
                                for (var k = 0; ; k++) {
                                    var dt = new Date(0);
                                    if (lstActions[i].Actions_Days[j].Date < lstActions[i].StartDate.getDate() && lstActions[i].Month <= lstActions[i].StartDate.getMonth()) {
                                        dt = new Date(moment(new Date((lstActions[i].StartDate.getFullYear() + 1), (lstActions[i].StartDate.getMonth()), lstActions[i].Actions_Days[j].Date)).add(k, 'years'));
                                    }
                                    else {
                                        dt = new Date(moment(new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].StartDate.getMonth()), lstActions[i].Actions_Days[j].Date)).add(k, 'years'));
                                    }
                                    var tsStartTime = lstActions[i].Actions_Days[j].StartTime;
                                    var tsEndTime = lstActions[i].Actions_Days[j].EndTime;

                                    var objIntervention = {};
                                    objIntervention.PlannedStartDate = moment(dt).format('YYYY-MM-DD') + "T" + tsStartTime;
                                    objIntervention.PlannedEndDate = moment(dt).format('YYYY-MM-DD') + "T" + tsEndTime;
                                    objIntervention.ID = createGuid();
                                    objIntervention.IsActive = true;
                                    objIntervention.CreatedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.ModifiedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.Created = objIntervention.Modified = new Date();
                                    objIntervention.Action_DayID = lstActions[i].Actions_Days[j].ID;

                                    //  if (lstActions[i].EndDate != null) {
                                    // if (objIntervention.PlannedStartDate >= targetEndDate) {
                                    if (new Date(dt) >= targetEndDate) {
                                        break;
                                    }
                                    if (lstActions[i].Occurrences != null) {
                                        if (maxOccurrences-- <= 0)
                                            break;
                                    }

                                    arrInterventions.push(objIntervention);
                                }
                            }

                            else if (lstActions[i].Type == "YearlyNth") {
                                for (var k = 0; ; k++) {
                                    var dtTemp = new Date(0);
                                    //var n = weekday[lstActions[i].Actions_Days[j].Day];
                                    var n = lstActions[i].Actions_Days[j].Day;
                                    var currentYearDate = GetDateForWeekDay(n, lstActions[i].Instance, (lstActions[i].Month), lstActions[i].StartDate.getFullYear());

                                    if ((new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].Month), currentYearDate)).getDay() < lstActions[i].StartDate.getDay()) {
                                        dtTemp = moment(new Date(lstActions[i].StartDate.getFullYear() + 1, lstActions[i].Month, 1)).add(k, 'years');
                                    }
                                    else {
                                        dtTemp = moment(new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].Month), 1)).add(k, 'years');
                                    }

                                    var dateForWeekDay = GetDateForWeekDay(n, lstActions[i].Instance, dtTemp.month(), dtTemp.year());

                                    var dt = new Date(dtTemp.year(), dtTemp.month(), dateForWeekDay);

                                    var tsStartTime = lstActions[i].Actions_Days[j].StartTime;
                                    var tsEndTime = lstActions[i].Actions_Days[j].EndTime;

                                    var objIntervention = {};
                                    objIntervention.PlannedStartDate = moment(dt).format('YYYY-MM-DD') + "T" + tsStartTime;
                                    objIntervention.PlannedEndDate = moment(dt).format('YYYY-MM-DD') + "T" + tsEndTime;
                                    objIntervention.ID = createGuid();
                                    objIntervention.IsActive = true;
                                    objIntervention.CreatedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.ModifiedBy = $rootScope.UserInfo.UserID;
                                    objIntervention.Created = objIntervention.Modified = new Date();
                                    objIntervention.Action_DayID = lstActions[i].Actions_Days[j].ID;

                                    //if (lstActions[i].EndDate != null) {
                                    //  if (objIntervention.PlannedStartDate >= targetEndDate) {
                                    if (new Date(dt) >= targetEndDate) {
                                        break;
                                    }
                                    if (objAction.Occurrences != null) {
                                        if (maxOccurrences-- <= 0)
                                            break;
                                    }
                                    arrInterventions.push(objIntervention);
                                }
                            }
                        }                        
                    }
                   
                    var defferedGenerateInterventions = [];

                    var lstInsertActions = [];
                    var lstInsertActions_Days = [];
                    var lstInsertInterventions = [];
                    for (var i = 0; i < lstActions.length; i++) {
                        var objActions = {};

                        objActions.ID = lstActions[i].ID;
                        objActions.ResidentID = lstActions[i].ResidentID;
                        objActions.Section_InterventionID = lstActions[i].Section_InterventionID;
                        objActions.StartDate = moment(lstActions[i].StartDate).format('YYYY-MM-DDTHH:mm:ss');
                        if (lstActions[i].EndDate != null)
                            objActions.EndDate = moment(lstActions[i].EndDate).format('YYYY-MM-DDTHH:mm:ss');
                        else
                            objActions.EndDate = null;
                        if (lstActions[i].Occurrences != null)
                            objActions.Occurrences = lstActions[i].Occurrences;
                        else
                            objActions.Occurrences = null;
                        objActions.Type = lstActions[i].Type;
                        objActions.IsAdhocIntervention = false;
                        objActions.Interval = lstActions[i].Interval;
                        objActions.Instance = lstActions[i].Instance;
                        objActions.Month = lstActions[i].Month;
                        objActions.IsActive = true;
                        objActions.Created = lstActions[i].Created;
                        objActions.CreatedBy = lstActions[i].CreatedBy;
                        objActions.Modified = lstActions[i].Modified;
                        objActions.ModifiedBy = lstActions[i].ModifiedBy;

                        objActions.IsSyncnised = false;
                        objActions.IsCreated = true;
                        lstInsertActions.push(objActions);

                        for (var j = 0; j < lstActions[i].Actions_Days.length; j++) {
                            var objActions_Days = {};
                            objActions_Days.ID = lstActions[i].Actions_Days[j].ID;
                            objActions_Days.ActionID = objActions.ID;
                            objActions_Days.Day = lstActions[i].Actions_Days[j].Day;
                            objActions_Days.Date = lstActions[i].Actions_Days[j].Date;
                            objActions_Days.StartTime = lstActions[i].Actions_Days[j].StartTime;
                            objActions_Days.EndTime = lstActions[i].Actions_Days[j].EndTime;
                            objActions_Days.Specifications = null;
                            objActions_Days.IsActive = true;
                            objActions_Days.Created = lstActions[i].Actions_Days[j].Created;
                            objActions_Days.CreatedBy = lstActions[i].Actions_Days[j].CreatedBy;
                            objActions_Days.Modified = lstActions[i].Actions_Days[j].Modified;
                            objActions_Days.ModifiedBy = lstActions[i].Actions_Days[j].ModifiedBy;

                            objActions_Days.IsSyncnised = false;
                            objActions_Days.IsCreated = true;
                            lstInsertActions_Days.push(objActions_Days);

                        }
                    }

                    for (var k = 0; k < arrInterventions.length; k++) {
                        var objInterventions = {};
                        objInterventions.ID = arrInterventions[k].ID;
                        objInterventions.Action_DayID = arrInterventions[k].Action_DayID;
                        objInterventions.PlannedStartDate = arrInterventions[k].PlannedStartDate;
                        objInterventions.PlannedEndDate = arrInterventions[k].PlannedEndDate;
                        objInterventions.ActualStartDate = null;
                        objInterventions.ActualEndDate = null;
                        objInterventions.Status = null;
                        objInterventions.Comments = null;
                        objInterventions.MoodAfter = null;
                        objInterventions.MoodDuring = null;
                        objInterventions.MoodBefore = null;
                        objInterventions.OutCome = null;
                        objInterventions.Exception = null;
                        objInterventions.Time_Span = null;
                        objInterventions.IsHandOverNotes = null;
                        objInterventions.IsActive = true;
                        objInterventions.Created = arrInterventions[k].Created;
                        objInterventions.CreatedBy = arrInterventions[k].CreatedBy;
                        objInterventions.Modified = arrInterventions[k].Modified;
                        objInterventions.ModifiedBy = arrInterventions[k].ModifiedBy;
                        objInterventions.IsSyncnised = false;
                        objInterventions.IsCreated = true;
                        lstInsertInterventions.push(objInterventions);
                    }

                    //Inserting Action Days
                    if (lstInsertActions_Days.length > 50) {
                        var i, j, temparray, chunk = 50;
                        for (i = 0, j = lstInsertActions_Days.length; i < j; i += chunk) {
                            temparray = lstInsertActions_Days.slice(i, i + chunk);
                            defferedGenerateInterventions.push(CommonService.insertActions_Days(app.db, temparray).then(function () {
                            }, function (err) {
                                console.log(err);
                                toastr.error(err);
                            }));
                        }
                    } else {
                        defferedGenerateInterventions.push(CommonService.insertActions_Days(app.db, lstInsertActions_Days).then(function () {
                        }, function (err) {
                            console.log(err);
                            toastr.error(err);
                        }));
                    }

                    //Insert Actions
                    if (lstInsertActions.length > 40) {
                        var i, j, temparray, chunk = 40;
                        for (i = 0, j = lstInsertActions.length; i < j; i += chunk) {
                            temparray = lstInsertActions.slice(i, i + chunk);
                            defferedGenerateInterventions.push(CommonService.insertActions(app.db, temparray).then(function () {
                            }, function (err) {
                                console.log(err);
                                toastr.error(err);
                            }));
                        }
                    } else {
                        defferedGenerateInterventions.push(CommonService.insertActions(app.db, lstInsertActions).then(function () {
                        }, function (err) {
                            console.log(err);
                            toastr.error(err);
                        }));
                    }
                 
                    //Inserting Interventions
                    if (lstInsertInterventions.length > 30) {
                        var i, j, temparray, chunk = 30;
                        for (i = 0, j = lstInsertInterventions.length; i < j; i += chunk) {
                            temparray = lstInsertInterventions.slice(i, i + chunk);
                            defferedGenerateInterventions.push(CommonService.insertInterventions(app.db, temparray).then(function () {
                            }, function (err) {
                                console.log(err);
                                toastr.error(err);
                            }));
                        }
                    } else {                       
                        defferedGenerateInterventions.push(CommonService.insertInterventions(app.db, lstInsertInterventions).then(function () {
                        }, function (err) {
                            console.log(err);
                            toastr.error(err);
                        }));
                    }

                    $q.all(defferedGenerateInterventions).then(function () {
                        toastr.success('Interventions generated successfully.');
                    });
                }

                //$state.go('ResidentInterventions');
                //arrInterventions=[];
                //vm.DisableGenerateTask = false;


                if (cordova.plugins) {

                    cordova.plugins.notification.local.cancelAll(
                 function () {
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
                     var deferredResidents = $q.defer();

                     deferredArr.push(deferredActions.promise);
                     deferredArr.push(deferredAction_Days.promise);
                     deferredArr.push(deferredInterventions.promise);
                     deferredArr.push(deferredSection_Interventions.promise);
                     deferredArr.push(deferredResidents.promise);

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

                     var renderResidents = function (tx, rs) {
                         arrResidents = [];
                         for (var i = 0; i < rs.rows.length; i++) {
                             arrResidents.push(rs.rows.item(i));
                         }

                         deferredResidents.resolve();
                     };


                     function GetAllOfflineData() {
                         app.GetOfflineActions(renderActions);
                         app.GetOfflineAction_Days(renderAction_Days);
                         app.GetOfflineInterventions(renderInterventions);
                         app.GetOfflineSection_Interventions(renderSection_Interventions);
                         app.GetOfflineResidentsIsAccepted(renderResidents);
                     }
                     GetAllOfflineData();

                     $q.all(deferredArr).then(
                         function (response) {
                             console.log('all completed');
                             LoadData();
                         },
                         function (err) {

                         }
                     );


                     var LoadData = function () {

                         vm.FilteredActionsDataArray = [];

                         for (var i = 0; i < arrActions.length; i++) {
                             if (arrActions[i].IsActive == "true") {
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
                         var StartTodayDate = moment(new Date()).format('YYYY-MM-DD');

                         for (var i = 0; i < vm.FilteredAction_DayssDataArray.length; i++) {
                             for (var j = 0; j < arrInterventions.length; j++) {

                                 if (vm.FilteredAction_DayssDataArray[i].ID == arrInterventions[j].Action_DayID && (moment(arrInterventions[j].PlannedStartDate).format('YYYY-MM-DD') == StartTodayDate && arrInterventions[j].IsActive == "true"))
                                     vm.FilteredInterventions.push(arrInterventions[j]);
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

                         vm.FilteredResidents = [];

                         for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                             for (var j = 0; j < arrResidents.length; j++) {

                                 if (vm.FilteredActionsDataArray[i].ResidentID == arrResidents[j].ID && arrResidents[j].IsActive == "true") {

                                     vm.FilteredResidents.push(arrResidents[j]);
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

                         for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                             vm.FilteredActionsDataArray[i].Resident = {};
                             for (var j = 0; j < vm.FilteredResidents.length; j++) {
                                 if (vm.FilteredResidents[j].ID == vm.FilteredActionsDataArray[i].ResidentID) {
                                     vm.FilteredActionsDataArray[i].Resident = (vm.FilteredResidents[j]);

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
                         }

                         vm.Interventions = vm.FilteredInterventions;


                         for (var i = 0; i < vm.Interventions.length; i++) {

                             var j = i + 1;

                             //////For IOS
                             var InterventionTitle = vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionTitle;
                             var StartDateTime = vm.Interventions[i].PlannedStartDate;
                             var ResidentName = vm.Interventions[i].Actions_Days.Action.Resident.FirstName + vm.Interventions[i].Actions_Days.Action.Resident.LastName;
                             var splittedStartDateTime = StartDateTime.split('T');
                             var startDate = new Date(splittedStartDateTime[0]);
                             var splittedStartTime = splittedStartDateTime[1].split(':');
                             startDate.setHours(splittedStartTime[0], parseInt(splittedStartTime[1]) - 10);
                             var ScheduledTime = moment(StartDateTime).format('LT');
                             var notificationTime = new Date(moment(StartDateTime).subtract(10, 'minutes'));

                             if (startDate > new Date()) {
                                 var options = {
                                     id: j,
                                     at: new Date(startDate),
                                     title: " Intervention: " + InterventionTitle + " " + "at" + ScheduledTime,
                                     text: ResidentName,
                                     sound: null,
                                     badge: 1,
                                     every: 'day'



                                 }
                                 cordova.plugins.notification.local.schedule(options);

                             }

                             //// );

                             // //For Android

                             // var InterventionTitle = vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionTitle;
                             // var StartDateTime = vm.Interventions[i].PlannedStartDate;
                             // var ResidentName = vm.Interventions[i].Actions_Days.Action.Resident.FirstName + vm.Interventions[i].Actions_Days.Action.Resident.LastName;
                             // var notificationTime = new Date(moment(StartDateTime).subtract(10, 'minutes'));
                             // var ScheduledTime = moment(StartDateTime).format('LT');
                             //if (notificationTime > new Date()) {
                             //     var options = {
                             //         id: j,
                             //         at: notificationTime,
                             //         text: " Intervention: " + InterventionTitle + " " + "at" + ScheduledTime,
                             //         title: ResidentName,
                             //         every: 0,
                             //         badge: 1,
                             //         sound: null,
                             //         json: null,
                             //         autoClear: false,
                             //         ongoing: true,
                             //         led: '5cc1af'

                             //     }
                             //     cordova.plugins.notification.local.schedule(options);


                             //}


                         }


                     }
                 }


                  )
                }
                else {

                }
            }
            else {

                toastr.info('To generate pattern please choose the  fields.')
                vm.DisableGenerateTask = false;

            }

        };

        function createGuid() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
            return guid;
        }

        function nextDay(x) {
            var now = new Date();
            now.setDate(now.getDate() + (x + (7 - now.getDay())) % 7);
            return now;
        }

        function next(from, dayofweek) {
            var start = parseInt(from.getDay());
            var target = parseInt(dayofweek);
            if (target < start) {
                target = (target + 7) | 0;
            }
            return new Date(from.valueOf() + Math.round((((target - start) | 0)) * 864e5));

        }

        function GetDateForWeekDay(DesiredDay, Occurrence, Month, Year) {

            //var dtSat = new Date(Year, (Month - 1), 1);
            var dtSat = new Date(Year, (Month), 1);
            var j = 0;
            if (((parseInt(DesiredDay) - parseInt(dtSat.getDay())) | 0) >= 0) {
                j = (((parseInt(DesiredDay) - parseInt(dtSat.getDay())) | 0) + 1) | 0;
            }
            else {
                j = ((((7 - parseInt(dtSat.getDay())) | 0)) + (((parseInt(DesiredDay) + 1) | 0))) | 0;
            }

            var Datee = (j + (((((Occurrence - 1) | 0)) * 7) | 0)) | 0;

            if (!isValidDate(Datee, Month, Year)) {
                Datee = (j + (((((Occurrence - 2) | 0)) * 7) | 0)) | 0;
            }


            return Datee;
        }

        function isValidDate(date, month, year) {
            // var dt = new Date(year, (month-1), date);
            var dt = new Date(year, (month), date);
            //return (dt.getMonth() + 1) === month && dt.getDate() === date;
            return (dt.getMonth()) === month && dt.getDate() === date;
        }

        var BindChosenAnswerID = function (objQuestions) {
            for (var i = 0; i < objQuestions.length; i++) {
                for (var j = 0; j < objQuestions[i].Intervention_Question_Answer.length; j++) {
                    if (objQuestions[i].Intervention_Question_Answer[j].IsDefault) {
                        if (objQuestions[i].Intervention_Question_Answer[j].IsDefault != "false") {
                            objQuestions[i].ChosenAnswerID = objQuestions[i].Intervention_Question_Answer[j].ID;
                        }
                    }
                    if (objQuestions[i].Intervention_Question_Answer[j].childQuestion && objQuestions[i].Intervention_Question_Answer[j].childQuestion.length > 0) {
                        BindChosenAnswerID(objQuestions[i].Intervention_Question_Answer[j].childQuestion);
                    }
                }
            }
        };

        vm.RadioButtonChange = function (objSection_Question) {


            objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;
            //newly added

            objSection_Question.SumofScores = $filter('filter')(objSection_Question.Intervention_Question_Answer, { ID: objSection_Question.ChosenAnswer })[0].Score;

        }

        vm.ToggleSwitchChange = function (objSection_Question) {

            if (objSection_Question.ChosenAnswer == true)
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
            else
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
        }

        vm.copySumofScore = 0;

        vm.CheckBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
            if (!objSection_Question.MulChosenAnswerID)
                objSection_Question.MulChosenAnswerID = [];





            if (!objSection_Question.SumofScores) {

                objSection_Question.SumofScores = 0;
            }

            if (objsectionQuestionAnswer.ChosenAnswer == true) {
                if (objsectionQuestionAnswer.LabelText != 'None') {
                    objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

                    }
                    for (var i = 0; i < objSection_Question.Intervention_Question_Answer.length; i++) {
                        if (objSection_Question.Intervention_Question_Answer[i].LabelText == 'None') {
                            objSection_Question.Intervention_Question_Answer[i].ChosenAnswer = false;
                            var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objSection_Question.Intervention_Question_Answer[i].ID);
                            if (chosenAnswerIndex > -1) {

                                objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
                            }
                        }
                    }

                }
                else {
                    objSection_Question.MulChosenAnswerID = [];
                    objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);

                    objSection_Question.SumofScores = 0;
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

                    }
                    for (var i = 0; i < objSection_Question.Intervention_Question_Answer.length; i++) {
                        if (objSection_Question.Intervention_Question_Answer[i].ID != objsectionQuestionAnswer.ID) {
                            objSection_Question.Intervention_Question_Answer[i].ChosenAnswer = false;
                        }
                    }
                }
            }
            else {
                var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objsectionQuestionAnswer.ID);

                if (chosenAnswerIndex > -1) {

                    objSection_Question.MulChosenAnswerID.splice(chosenAnswerIndex, 1);
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores - objsectionQuestionAnswer.Score;

                    }

                }
            }



        }

        vm.ShowChildQuestionQuestion = function (obj, val) {

            if (obj.childGroupNo != undefined) {
                var SumofScoresofAllQuestion = 0;

                for (var i = 0; i < val.objSection.Intervention_Question.length; i++) {
                    if (val.objSection.Intervention_Question[i].SetGroupNo == obj.childGroupNo) {
                        if (val.objSection.Intervention_Question[i].SumofScores != undefined && val.objSection.Intervention_Question[i].SumofScores > 0) {
                            SumofScoresofAllQuestion += val.objSection.Intervention_Question[i].SumofScores;

                        }
                    }


                }
            }

            if (SumofScoresofAllQuestion > 0) {
                return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
            }
            else {
                return false;
            }

        }

        vm.SaveAssessmentData = function (objSection) {

            var lstResidents_Questions_Answers = [];

            for (var i = 0; i < objSection.QuestionIntervention.length; i++) {
                var objResidents_Questions_Answers = {};
                if (objSection.QuestionIntervention[i].ChosenAnswer != null || objSection.QuestionIntervention[i].LastQuestionInset == true) {
                    objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                    if (objSection.QuestionIntervention[i].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].ChosenAnswer;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'DropDownList') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].ChosenAnswer;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'Yes/No') {
                        if (objSection.QuestionIntervention[i].ChosenAnswer)
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(objSection.QuestionIntervention[i].Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
                        else
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(objSection.QuestionIntervention[i].Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.QuestionIntervention[i].ChosenAnswer;
                    }
                    else if (objSection.QuestionIntervention[i].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.QuestionIntervention[i].ChosenAnswer;
                    }


                    lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
                }

                if (objSection.QuestionIntervention[i].AnswerType == 'CheckBoxList') {
                    for (var k = 0; k < objSection.QuestionIntervention[i].MulChosenAnswerID.length; k++) {
                        var objchkResidents_Questions_Answers = {};
                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                        objchkResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].MulChosenAnswerID[k];
                        if (objSection.QuestionIntervention[i].txtAreaAnswer) {
                            objchkResidents_Questions_Answers.AnswerText = objSection.QuestionIntervention[i].txtAreaAnswer;
                        }

                        lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                    }

                    if (objSection.QuestionIntervention[i].MulChosenAnswerID.length == 0) {
                        for (var k = 0; k < objSection.QuestionIntervention[i].Intervention_Question_Answer.length; k++) {
                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                            objchkResidents_Questions_Answers.Intervention_Question_AnswerID = objSection.QuestionIntervention[i].Intervention_Question_Answer[k].ID;
                            objchkResidents_Questions_Answers.AnswerText = "Deactive";


                            lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                        }
                    }
                }

                if (objSection.QuestionIntervention[i].AnswerType == 'FileUpload' && objSection.QuestionIntervention[i].ChosenAnswer) {

                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(objSection.QuestionIntervention[i].Intervention_Question_Answer, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = objSection.QuestionIntervention[i].ChosenAnswer.file;

                }

                if (objSection.QuestionIntervention[i].MinScore != null) {

                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionQuestion(objSection.QuestionIntervention[i]));

                }
                else {
                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionAnswers(objSection.QuestionIntervention[i].Intervention_Question_Answer));
                }
            }
            UpdateAssessment(lstResidents_Questions_Answers);
        };

        var GetSubQuestionAnswers = function (answers) {
            var lst = [];

            for (var i = 0; i < answers.length; i++) {
                if (answers[i].childQuestion && answers[i].childQuestion.length > 0) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {
                        var objResidents_Questions_Answers = {};
                        if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer != answers[i].childQuestion[j].OldChosenAnswer) {


                            objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                            if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {//newly added 4/19/2016
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                if (answers[i].childQuestion[j].ChosenAnswer)
                                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
                                else
                                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].Intervention_Question_Answer[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                objResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].Intervention_Question_Answer[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                            }


                            lst.push(objResidents_Questions_Answers);
                        }

                        if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                            if (answers[i].childQuestion[j].MulChosenAnswerID != undefined) {
                                for (var k = 0; k < answers[i].childQuestion[j].MulChosenAnswerID.length; k++) {
                                    var objchkResidents_Questions_Answers = {};
                                    objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                                    objchkResidents_Questions_Answers.Intervention_Question_AnswerID = answers[i].childQuestion[j].MulChosenAnswerID[k];

                                    if (answers[i].childQuestion[j].txtAreaAnswer) {
                                        objchkResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].txtAreaAnswer;
                                    }
                                    //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
                                    //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;

                                    lst.push(objchkResidents_Questions_Answers);
                                }
                            }
                        }

                        if (answers[i].childQuestion[j].AnswerType == 'FileUpload' && answers[i].childQuestion[j].ChosenAnswer) {

                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { LabelText: 'Choose Form' })[0].ID;
                            objResidents_Questions_Answers.FileData = answers[i].childQuestion[j].ChosenAnswer.file;
                        }

                        if (answers[i].childQuestion[j].MinScore != null) {

                            lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));

                        }
                        else {
                            lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Intervention_Question_Answer));
                        }
                        //lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Sections_Questions_Answers));
                    }
                }
            }


            return lst;
        };

        var GetSubQuestionQuestion = function (answers) {
            var lst = [];


            for (var j = 0; j < answers.childQuestion.length; j++) {
                var objResidents_Questions_Answers = {};
                if (answers.childQuestion[j].ChosenAnswer != null && answers.childQuestion[j].ChosenAnswer != answers.childQuestion[j].OldChosenAnswer) {


                    objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                    if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                        //newly added 4/19/2016
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                        if (answers.childQuestion[j].ChosenAnswer)
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { LabelText: 'Yes' })[0].ID;
                        else
                            objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { LabelText: 'No' })[0].ID;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].Intervention_Question_Answer[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                    }


                    lst.push(objResidents_Questions_Answers);
                }

                if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                    if (answers.childQuestion[j].MulChosenAnswerID != undefined) {
                        for (var k = 0; k < answers.childQuestion[j].MulChosenAnswerID.length; k++) {
                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                            objchkResidents_Questions_Answers.Intervention_Question_AnswerID = answers.childQuestion[j].MulChosenAnswerID[k];

                            if (answers.childQuestion[j].txtAreaAnswer) {
                                objchkResidents_Questions_Answers.AnswerText = answers.childQuestion[j].txtAreaAnswer;
                            }
                            //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
                            //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;

                            lst.push(objchkResidents_Questions_Answers);
                        }
                    }
                }

                if (answers.childQuestion[j].AnswerType == 'FileUpload' && answers.childQuestion[j].ChosenAnswer) {

                    objResidents_Questions_Answers.Intervention_Question_AnswerID = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = answers.childQuestion[j].ChosenAnswer.file;
                }


                if (answers.childQuestion[j].MinScore != null) {

                    lst = lst.concat(GetSubQuestionQuestion(answers.childQuestion[j]));

                }
                else {
                    lst = lst.concat(GetSubQuestionAnswers(answers.childQuestion[j].Intervention_Question_Answer));
                }



            }



            return lst;
        };

        var UpdateAssessment = function (lstResidents_Questions_Answers) {
            if ($scope.online) {
                var requiredData = [];
                for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
                    if (lstResidents_Questions_Answers[i].FileData) {
                        requiredData.push({ FileData: lstResidents_Questions_Answers[i].FileData });
                    }
                }
                ResidentsService.UpdateInterventionAssessmentData(vm.ResidentId, lstResidents_Questions_Answers).then(function (response) {
                    if (response.data.Files.length > 0) {
                        var folderpath = $rootScope.Path + 'InterventionResidentsQADocuments';
                        var NewDocuments = []; var lstInterventionResidentQAsDocuments = [];
                        var differdArr = [];

                        for (var i = 0; i < response.data.Files.length; i++) {
                            for (var j = 0; j < requiredData.length; j++) {
                                if (requiredData[j].FileData.name == response.data.Files[i].fileName) {
                                    var objNewDoc = {};
                                    objNewDoc.ID = response.data.Files[i].ID;
                                    objNewDoc.NewFileName = response.data.Files[i].fileName;
                                    objNewDoc.File = requiredData[j].FileData;
                                    NewDocuments.push(objNewDoc);
                                    break;
                                }
                            }
                        }
                        NewDocuments.forEach(function (objNewDocuments, i) {
                            var differdArrdifferdArr = $q.defer();
                            differdArr.push(differdArrdifferdArr.promise);

                            $cordovaFile.writeFile(folderpath, objNewDocuments.NewFileName, objNewDocuments.File, true).then(function (success) {
                                var objFile = {};
                                objFile.ID = objNewDocuments.ID;
                                objFile.FileName = objNewDocuments.NewFileName;
                                objFile.ResidentFile = folderpath + '/', objNewDocuments.NewFileName;
                                objFile.IsSyncnised = true;
                                objFile.IsActive = true;
                                objFile.IsCreated = false;
                                objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                objFile.Modified = null;
                                objFile.ModifiedBy = null;
                                lstInterventionResidentQAsDocuments.push(objFile);
                                differdArrdifferdArr.resolve();
                            },
                             function (error) {
                                 if (error.code == 6) {
                                     var objFile = {};
                                     objFile.ID = objNewDocuments.ID;
                                     objFile.FileName = objNewDocuments.NewFileName;
                                     objFile.ResidentFile = folderpath + '/', objNewDocuments.NewFileName;
                                     objFile.IsSyncnised = true;
                                     objFile.IsActive = true;
                                     objFile.IsCreated = false;
                                     objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                     objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                     objFile.Modified = null;
                                     objFile.ModifiedBy = null;
                                     lstInterventionResidentQAsDocuments.push(objFile);
                                     differdArrdifferdArr.resolve();
                                 }
                                 else {
                                     differdArrdifferdArr.reject(error);
                                 }
                             });
                        });
                        $q.all(differdArr).then(function (response) {
                            CommonService.insertInterventionResidentAnswerDocuments(app.db, lstInterventionResidentQAsDocuments).then(function () {

                            },
                            function (err) {

                                toastr.error(err);
                            });
                        },
                        function (err) {
                            toastr.error(err);
                        });
                    }


                    toastr.success('Intervention Assessment updated successfully.');
                    var lstResident_Interventions_Questions_AnswersData = response.data.ResidentInterventionQuestionAnswer;

                    var lstInsertResident_Interventions_Questions_AnswersData = [];
                    CommonService.DeleteAllResident_Interventions_Questions_AnswersRecords(app.db).then(function (response) {

                        for (var i = 0; i < lstResident_Interventions_Questions_AnswersData.length; i++) {

                            //     console.log(lstResidents_Questions_AnswersData);
                            lstResident_Interventions_Questions_AnswersData[i].IsSyncnised = true;
                            lstResident_Interventions_Questions_AnswersData[i].IsCreated = false;
                            lstInsertResident_Interventions_Questions_AnswersData.push(lstResident_Interventions_Questions_AnswersData[i]);
                        }

                        if (lstInsertResident_Interventions_Questions_AnswersData.length > 70) {
                            var i, j, temparray, chunk = 70;
                            for (i = 0, j = lstInsertResident_Interventions_Questions_AnswersData.length; i < j; i += chunk) {
                                temparray = lstInsertResident_Interventions_Questions_AnswersData.slice(i, i + chunk);


                                CommonService.insertResident_Interventions_Questions_Answers(app.db, temparray).then(function () {
                                    //     console.log(temparray);


                                },
                                                   function (err) {
                                                       toastr.error('An error occurred while updating Resident_Interventions_Questions_Answers.');
                                                   });
                            }
                        }
                    }),

                        function (err) {
                            toastr.error('An error occurred while deleting Resident_Interventions_Questions_Answers.');
                        }

                },
               function (err) {
                   toastr.error('An error occurred while updating assessment data.');
               }
            );
            }
            else {
                var lstIntervention_Question_AnswerID = [];
                for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
                    if (lstResidents_Questions_Answers[i].AnswerText) {
                        if (lstResidents_Questions_Answers[i].AnswerText == "Deactive") {
                            lstIntervention_Question_AnswerID.push(lstResidents_Questions_Answers[i].Intervention_Question_AnswerID);
                        }
                    }
                    if (lstIntervention_Question_AnswerID.length > 0) {
                        var lstDeactiveIds = [];
                        for (var j = 0; j < arryResident_Interventions_Questions_Answers.length; j++) {
                            if ((lstIntervention_Question_AnswerID.indexOf(arryResident_Interventions_Questions_Answers[j].Intervention_Question_AnswerID)) && (arryResident_Interventions_Questions_Answers[j].ResidentID == vm.ResidentId)) {
                                lstDeactiveIds.push(arryResident_Interventions_Questions_Answers[j].ID);//------------------------------
                            }
                        }
                        if (lstDeactiveIds.length > 0) {
                            inactivateIntervetnionAssessmentData(lstDeactiveIds);
                        }
                    }
                    var lstAssessmentData = [];
                    for (var j = 0; j < lstResidents_Questions_Answers.length; j++) {
                        if (lstResidents_Questions_Answers[j].AnswerText != "Deactive") {
                            lstAssessmentData.push(lstResidents_Questions_Answers[j]);
                        }
                    }
                    var sections_Questions_AnswersIds = [];
                    for (var j = 0; j < lstAssessmentData.length; j++) {
                        sections_Questions_AnswersIds.push(lstAssessmentData[j].Intervention_Question_AnswerID);
                    }

                    sections_Questions_AnswersIds = sections_Questions_AnswersIds.concat(GetInterventionSubQuestions_AnswersIds(sections_Questions_AnswersIds));
                    var section_QuestionIds = [];
                    for (var j = 0; j < arryIntervention_Question_Answer.length; j++) {
                        if (sections_Questions_AnswersIds.indexOf(arryIntervention_Question_Answer[j].ID) > -1) {
                            section_QuestionIds.push(arryIntervention_Question_Answer[j].Intervention_QuestionID);
                        }
                    }
                    var residents_Questions_AnswersIds = [];
                    var interventionQue = [];
                    for (var j = 0; j < arryResident_Interventions_Questions_Answers.length; j++) {
                        for (var k = 0; k < arryIntervention_Question_Answer.length; k++) {
                            if (arryResident_Interventions_Questions_Answers[j].Intervention_Question_AnswerID == arryIntervention_Question_Answer[k].ID) {
                                for (var l = 0; l < section_QuestionIds.length; l++) {
                                    interventionQue.push(section_QuestionIds[l]);
                                    //if ((section_QuestionIds[l] == arryIntervention_Question_Answer[k].Intervention_QuestionID) && (arryResident_Interventions_Questions_Answers[j].ResidentID == vm.ResidentId)) {
                                    //    residents_Questions_AnswersIds.push(arryResident_Interventions_Questions_Answers[i].ID);
                                    //}
                                }
                            }
                        }
                    }

                    var interventionQuestionAnswer = [];
                    for (var p = 0; p < interventionQue.length; p++) {
                        for (var i = 0; i < arryIntervention_Question_Answer.length; i++) {
                            if (arryIntervention_Question_Answer[i].Intervention_QuestionID == interventionQue[p]) {
                                interventionQuestionAnswer.push(arryIntervention_Question_Answer[i].ID);
                            }
                        }
                    }

                    for (var h = 0; h < interventionQuestionAnswer.length; h++) {
                        for (var i = 0; i < arryResident_Interventions_Questions_Answers.length; i++) {
                            if (interventionQuestionAnswer[h] == arryResident_Interventions_Questions_Answers[i].Intervention_Question_AnswerID && arryResident_Interventions_Questions_Answers[i].ResidentID == vm.ResidentId) {
                                residents_Questions_AnswersIds.push(arryResident_Interventions_Questions_Answers[i].ID);
                            }
                        }
                    }

                    inactivateIntervetnionAssessmentData(residents_Questions_AnswersIds);
                    //---------------------------------------
                    var lstInsertResident_Interventions_Questions_Answers = [];
                    var lstInterventionResidentAnswerDocuments = [];
                    var differdArr = [];
                    for (var i = 0; i < lstAssessmentData.length; i++) {
                        var objResident_Interventions_Questions_Answers = {};
                        objResident_Interventions_Questions_Answers = lstAssessmentData[i];
                        objResident_Interventions_Questions_Answers.ResidentID = lstAssessmentData[i].ResidentId;
                        objResident_Interventions_Questions_Answers.AnswerText = objResident_Interventions_Questions_Answers.AnswerText ? objResident_Interventions_Questions_Answers.AnswerText : null;
                        objResident_Interventions_Questions_Answers.IsSyncnised = false;
                        objResident_Interventions_Questions_Answers.IsActive = true;
                        objResident_Interventions_Questions_Answers.IsCreated = true;
                        objResident_Interventions_Questions_Answers.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                        objResident_Interventions_Questions_Answers.CreatedBy = $rootScope.UserInfo.UserID;
                        objResident_Interventions_Questions_Answers.Modified = null;
                        objResident_Interventions_Questions_Answers.ModifiedBy = null;
                        objResident_Interventions_Questions_Answers.ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                        lstInsertResident_Interventions_Questions_Answers.push(objResident_Interventions_Questions_Answers);

                        if (objResident_Interventions_Questions_Answers.FileData) {
                            if (window.File && window.FileReader && window.FileList && window.Blob) {
                                var differdArrdifferdArr = $q.defer();
                                differdArr.push(differdArrdifferdArr.promise);
                                var reader = new FileReader();
                                reader.onload = function () {
                                    var objFile = {};
                                    objFile.ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                                    objFile.ResidentID = objResident_Interventions_Questions_Answers.ResidentID;
                                    objFile.InterventionResidentQuestionAnswerID = objResident_Interventions_Questions_Answers.ID;
                                    objFile.FileName = null;
                                    objFile.InterventionAnsFile = reader.result;
                                    objFile.IsSyncnised = false;
                                    objFile.IsActive = true;
                                    objFile.IsCreated = true;
                                    objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                    objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                    objFile.Modified = null;
                                    objFile.ModifiedBy = null;
                                    lstInterventionResidentAnswerDocuments.push(objFile);
                                    differdArrdifferdArr.resolve();
                                };
                                reader.onerror = function () {

                                    differdArrdifferdArr.reject();
                                };
                                reader.readAsDataURL(objResident_Interventions_Questions_Answers.FileData);
                            } else {
                                toastr.error('The File APIs are not fully supported by your browser.');
                            }
                        }
                    }//for loop ends
                    if (lstInsertResident_Interventions_Questions_Answers.length > 50) {
                        var i, j, temparray, chunk = 50;
                        for (i = 0, j = lstInsertResident_Interventions_Questions_Answers.length; i < j; i += chunk) {
                            temparray = lstInsertResident_Interventions_Questions_Answers.slice(i, i + chunk);
                            CommonService.insertResident_Interventions_Questions_Answers(app.db, temparray).then(function () {
                                toastr.success('Intervention Assessment updated successfully.');
                            },
                            function (err) {

                            });
                        }
                    }
                    else {
                        CommonService.insertResident_Interventions_Questions_Answers(app.db, lstInsertResident_Interventions_Questions_Answers).then(function () {
                            toastr.success('Intervention Assessment updated successfully.');
                        },
                        function (err) {

                        });
                    }
                    $q.all(differdArr).then(function (response) {
                        if (lstInterventionResidentAnswerDocuments.length > 50) {
                            var i, j, temparray, chunk = 50;
                            for (i = 0, j = lstInterventionResidentAnswerDocuments.length; i < j; i += chunk) {
                                temparray = lstInterventionResidentAnswerDocuments.slice(i, i + chunk);
                                CommonService.insertInterventionResidentAnswerDocuments(app.db, temparray).then(function () {
                                    toastr.success('File Uploaded');
                                },
                                function (err) {

                                });
                            }
                        }
                        else {
                            CommonService.insertInterventionResidentAnswerDocuments(app.db, lstInterventionResidentAnswerDocuments).then(function () {
                                toastr.success('File Uploaded');
                            },
                            function (err) {

                            });
                        }
                    });
                }//main for
            }//else
        }

        function inactivateIntervetnionAssessmentData(residents_Questions_AnswerIds) {
            var lstResidents_Questions_Answers = [];
            for (var i = 0; i < arryResident_Interventions_Questions_Answers.length; i++) {
                arryResident_Interventions_Questions_Answers[i].Intervention_Question_Answer = []
                for (var j = 0; j < arryIntervention_Question_Answer.length; j++) {
                    if (arryResident_Interventions_Questions_Answers[i].Intervention_Question_AnswerID == arryIntervention_Question_Answer[j].ID) {
                        arryResident_Interventions_Questions_Answers[i].Intervention_Question_Answer.push(arryIntervention_Question_Answer[j]);
                        if (residents_Questions_AnswerIds.indexOf(arryResident_Interventions_Questions_Answers[i].ID) > -1) {
                            lstResidents_Questions_Answers.push(arryResident_Interventions_Questions_Answers[i]);
                        }
                    }
                }
            }
            for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
                var objResident_Quesion_Answer = {};
                objResident_Quesion_Answer.ModifiedBy = $rootScope.UserInfo.UserID;
                objResident_Quesion_Answer.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                objResident_Quesion_Answer.ID = lstResidents_Questions_Answers[i].ID;
                CommonService.UpdateResident_Interventions_Questions_Answers(app.db, objResident_Quesion_Answer).then(function () {
                    CommonService.DeleteInterventionResidentAnswerDocuments(app.db, objResident_Quesion_Answer.ID);
                });
            }
            //for (var i = 0; i < arryIntervention_Question_Answer_Task.length; i++) {
            //    arryIntervention_Question_Answer_Task[i].Section_Intervention = [];
            //    for (var j = 0; j < arrySection_Intervention.length; j++) {
            //        if (arryIntervention_Question_Answer_Task[i].Section_InterventionID == arrySection_Intervention[j].ID) {
            //            arrySection_Intervention[j].Actions = [];
            //            for (var k = 0; k < arryActions.length; k++) {
            //                if (arryActions[k].Section_InterventionID == arrySection_Intervention[j].ID) {
            //                    arrySection_Intervention[j].Actions.push(arryActions[k]);
            //                }
            //            }
            //            arryIntervention_Question_Answer_Task[i].Section_Intervention = arrySection_Intervention[j];
            //        }
            //    }
            //}
            //for (var i = 0; i < arryIntervention_Question_Answer_Task.length; i++) {
            //    for (var j = 0; j < arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions.length; j++) {
            //        arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days = [];
            //        for (var k = 0; k < arryActions_Days.length; k++) {
            //            if (arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].ID == arryActions_Days[k].ActionID) {
            //                arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days.push(arryActions_Days[k]);
            //            }
            //        }
            //    }
            //}
            //for (var i = 0; i < arryIntervention_Question_Answer_Task.length; i++) {
            //    for (var j = 0; j < arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions.length; j++) {
            //        for (var k = 0; k < arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days.length; k++) {
            //            arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days[k].Interventions = [];
            //            for (var l = 0; l < arryInterventions.length; l++) {
            //                if (arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days[k].ID == arryInterventions[l].Action_DayID) {
            //                    arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions[j].Actions_Days[k].Interventions.push(arryInterventions[l]);
            //                }
            //            }
            //        }
            //    }
            //}
            //for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
            //    //update Residents_Questions_Answers
            //}
            //for (var i = 0; i < arryIntervention_Question_Answer_Task.length; i++) {
            //    for (var j = 0; j < arryIntervention_Question_Answer_Task[i].Section_Intervention.Actions.length; j++) {
            //        //update actions
            //        //after update ActionDays
            //        //afer update Intervention
            //    }
            //}
        }

        function GetInterventionSubQuestions_AnswersIds(sections_Questions_AnswersIds) {
            var sections_QuestionsIds = [];
            for (var i = 0; i < arryIntervention_Question_Answer.length; i++) {
                if (sections_Questions_AnswersIds.indexOf(arryIntervention_Question_Answer[i].ID) > -1) {
                    sections_QuestionsIds.push(arryIntervention_Question_Answer[i].Intervention_QuestionID);
                }
            }
            var lstAllAnswerIds = [];
            for (var i = 0; i < arryIntervention_Question_Answer.length; i++) {
                if (sections_QuestionsIds.indexOf(arryIntervention_Question_Answer[i].Intervention_QuestionID) > -1) {
                    lstAllAnswerIds.push(arryIntervention_Question_Answer[i].ID);
                }
            }
            var lstSubQuestionIds = [];
            for (var i = 0; i < arryIntervention_Question_ParentQuestion.length; i++) {
                if ((arryIntervention_Question_ParentQuestion[i].InterventionParentAnswerID != null) && (lstAllAnswerIds.indexOf(arryIntervention_Question_ParentQuestion[i].InterventionParentAnswerID) > -1)) {
                    lstSubQuestionIds.push(arryIntervention_Question_ParentQuestion[i].InterventionQuestionID);
                }
            }
            if (lstSubQuestionIds.length > 0) {
                var lstQuestions_AnswersIds = [];
                for (var i = 0; i < arryIntervention_Question_Answer.length; i++) {
                    if (lstSubQuestionIds.indexOf(arryIntervention_Question_Answer[i].Intervention_QuestionID) > -1) {
                        lstQuestions_AnswersIds.push(arryIntervention_Question_Answer[i].ID);
                    }
                }
                return lstQuestions_AnswersIds.concat(GetInterventionSubQuestions_AnswersIds(lstQuestions_AnswersIds))
            }
            else {
                return [];
            }
        }


        var UploadPhoto = function () {
            var deferred = $q.defer();
            var file = vm.ResidentImage.file;
            if (file == undefined) {
                deferred.reject('Please attach an image.');
            }
            else {
                ResidentsService.UploadPhoto(file, vm.ResidentId).success(
                    function (response) {
                        deferred.resolve();
                    },
                    function (err) {
                        deferred.reject('An error occured while uploading the attachment.');
                    }
                );
            }
            return deferred.promise;
        };

        var GetAssessmentAnswers = function () {
            if ($scope.online) {
                ResidentsService.getInterventionAssessmentData(vm.ResidentId).then(function (response) {
                    GetAssessmentData(response.data);
                },
                function (err) {
                    toastr.error('An error occurred while retrieving assessment answers.');
                }
            );
            }
            else {
                for (var i = 0; i < arryResident_Interventions_Questions_Answers.length; i++) {
                    arryResident_Interventions_Questions_Answers[i].Intervention_Question_Answer = [];
                    for (var j = 0; j < arryIntervention_Question_Answer.length; j++) {
                        if (arryResident_Interventions_Questions_Answers[i].Intervention_Question_AnswerID == arryIntervention_Question_Answer[j].ID) {
                            arryIntervention_Question_Answer[j].Intervention_Question = [];
                            for (var k = 0; k < arryIntervention_Question.length; k++) {
                                if (arryIntervention_Question_Answer[j].Intervention_QuestionID == arryIntervention_Question[k].ID) {
                                    arryIntervention_Question_Answer[j].Intervention_Question.push(arryIntervention_Question[k]);
                                }
                            }
                            arryResident_Interventions_Questions_Answers[i].Intervention_Question_Answer = arryIntervention_Question_Answer[j];
                        }
                    }
                }
                var lstResidentWithFile = [];
                for (var i = 0; i < arryResident_Interventions_Questions_Answers.length; i++) {
                    var objResidentWithFile = { ResidentFile: null, ResidentQuestionAnswer: [], FilePath: '' };
                    objResidentWithFile.ResidentQuestionAnswer = arryResident_Interventions_Questions_Answers[i];
                    for (var j = 0; j < arryInterventionResidentAnswerDocuments.length; j++) {
                        if (arryInterventionResidentAnswerDocuments[j].ID == arryResident_Interventions_Questions_Answers[i].ID) {
                            objResidentWithFile.ResidentFile = arryInterventionResidentAnswerDocuments[j].FileName;
                            objResidentWithFile.FilePath = arryInterventionResidentAnswerDocuments[j].ResidentFile;
                            break;
                        }
                    }
                    lstResidentWithFile.push(objResidentWithFile);
                }
                GetAssessmentData(lstResidentWithFile);
            }
        };

        function GetAssessmentData(AssessmentData) {
            var lstAssessmentData = AssessmentData;

            for (var i = 0; i < vm.Sections.length; i++) {
                for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                    vm.Sections[i].Intervention_Question[j].ChosenAnswer = null;
                    vm.Sections[i].Intervention_Question[j].OldChosenAnswer = null;
                    if (!vm.Sections[i].Intervention_Question[j].MulChosenAnswerID)
                        vm.Sections[i].Intervention_Question[j].MulChosenAnswerID = [];

                    //Changes on  4/11/2016
                    if (!vm.Sections[i].Intervention_Question[j].SumofScores)
                        vm.Sections[i].Intervention_Question[j].SumofScores = 0;


                    //newly added on 4/18/2016
                    var lstQueswthnoAnswer = 0;
                    for (var k = 0; k < lstAssessmentData.length; k++) {
                        if (vm.Sections[i].Intervention_Question[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                            lstQueswthnoAnswer++;
                            vm.Sections[i].Intervention_Question[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                            if (vm.Sections[i].Intervention_Question[j].AnswerType == 'RadioButtonList') {
                                vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                //newly added 4/15/2016
                                vm.Sections[i].Intervention_Question[j].SumofScores = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;

                            }
                            else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'DropDownList') {
                                //newly added on 4/19/2016
                                vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                            }
                            else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'Yes/No') {
                                var labelText = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                vm.Sections[i].Intervention_Question[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                vm.Sections[i].Intervention_Question[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

                            }
                            else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'FreeText') {
                                vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                            }
                            else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'Number') {
                                vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Intervention_Question[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                            }
                            else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'FileUpload') {
                                if (vm.online) {
                                    vm.Sections[i].Intervention_Question[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                    var filename = lstAssessmentData[k].ResidentFile ? lstAssessmentData[k].ResidentFile.split('/') : null;
                                    vm.Sections[i].Intervention_Question[j].ChosenFileName = lstAssessmentData[k].ResidentFile ? filename[5] : null;
                                } else {
                                    vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                    vm.Sections[i].Intervention_Question[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                }

                            }
                            else if (vm.Sections[i].Intervention_Question[j].AnswerType == 'CheckBoxList') {
                                vm.Sections[i].Intervention_Question[j].ChosenAnswerID = null;
                                for (var p = 0; p < vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer.length; p++) {
                                    if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID) {

                                        vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].ChosenAnswer = true;
                                        if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                            vm.Sections[i].Intervention_Question[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        }
                                        vm.Sections[i].Intervention_Question[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                        //Chnaged on 4/11/2016
                                        vm.Sections[i].Intervention_Question[j].SumofScores += vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[p].Score;
                                    }
                                }
                            }

                            //newlyaddedd
                            if (vm.Sections[i].Intervention_Question[j].MinScore != null) {
                                EditSubQuestionQuestion(vm.Sections[i].Intervention_Question[j], lstAssessmentData);
                            }
                            else {
                                EditSubQuestion(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData);
                            }
                        }
                    }

                    if (lstQueswthnoAnswer == 0 && vm.Sections[i].Intervention_Question[j].LastQuestionInset == true) {
                        if (vm.Sections[i].Intervention_Question[j].MinScore != null) {
                            EditSubQuestionQuestion(vm.Sections[i].Intervention_Question[j], lstAssessmentData);
                        }
                        else {
                            EditSubQuestion(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData);
                        }
                    }
                }
            }
        }

        var EditSubQuestion = function (answers, lstAssessmentData) {
            for (var i = 0; i < answers.length; i++) {

                if (answers[i].childQuestion != undefined) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {
                        answers[i].childQuestion[j].ChosenAnswer = null;
                        answers[i].childQuestion[j].OldChosenAnswer = null;
                        if (!answers[i].childQuestion[j].MulChosenAnswerID)
                            answers[i].childQuestion[j].MulChosenAnswerID = [];
                        if (!answers[i].childQuestion[j].SumofScores)
                            answers[i].childQuestion[j].SumofScores = 0;

                        //newly added on 4/18/2016
                        var lstQueswthnoAnswer = 0;
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                lstQueswthnoAnswer++;
                                answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {
                                    //newly added 4/19/2016
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                    var labelText = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                    answers[i].childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                    answers[i].childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FileUpload') {
                                    if (vm.online) {
                                        answers[i].childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile ? lstAssessmentData[k].ResidentFile.split('/') : null;
                                        answers[i].childQuestion[j].ChosenFileName = lstAssessmentData[k].ResidentFile ? filename[5] : null;
                                    } else {
                                        answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                        answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                    }
                                }

                                else if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                                    answers[i].childQuestion[j].ChosenAnswerID = null;
                                    // var sumscores1=0
                                    for (var p = 0; p < answers[i].childQuestion[j].Intervention_Question_Answer.length; p++) {



                                        if (answers[i].childQuestion[j].Intervention_Question_Answer[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID) {

                                            answers[i].childQuestion[j].Intervention_Question_Answer[p].ChosenAnswer = true;
                                            if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                answers[i].childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                            }
                                            answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                            answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Intervention_Question_Answer.Score;
                                            // sumscores1 += answers[i].childQuestion[j].Sections_Questions_Answers.Score;
                                        }




                                    }
                                    //if(sumscores > 0)
                                    //vm.copySumofScore = sumscores1;

                                    //answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    //answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                }
                                EditSubQuestion(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData);


                            }

                        }
                        //newly added 4/18/2016
                        if (lstQueswthnoAnswer == 0 && answers[i].childQuestion[j].LastQuestionInset == true) {

                            EditSubQuestion(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData);


                        }

                    }
                }
            }

            return true
        }

        var EditSubQuestionQuestion = function (answers, lstAssessmentData) {


            for (var j = 0; j < answers.childQuestion.length; j++) {
                answers.childQuestion[j].ChosenAnswer = null;
                answers.childQuestion[j].OldChosenAnswer = null;
                if (!answers.childQuestion[j].MulChosenAnswerID)
                    answers.childQuestion[j].MulChosenAnswerID = [];

                if (!answers.childQuestion[j].SumofScores)
                    answers.childQuestion[j].SumofScores = 0;

                //newly added on 4/18/2016
                var lstQueswthnoAnswer = 0;
                for (var k = 0; k < lstAssessmentData.length; k++) {
                    if (answers.childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                        lstQueswthnoAnswer++;
                        answers.childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                        if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                            //4/19/2016
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                            var labelText = $filter('filter')(answers.childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                            answers.childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                            answers.childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'Number') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;

                        }
                        else if (answers.childQuestion[j].AnswerType == 'FileUpload') {
                            if (vm.online) {
                                answers.childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                var filename = lstAssessmentData[k].ResidentFile ? lstAssessmentData[k].ResidentFile.split('/') : null;
                                answers.childQuestion[j].ChosenFileName = lstAssessmentData[k].ResidentFile ? filename[5] : null;
                            } else {
                                answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentFile;
                            }
                        }

                        else if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                            answers.childQuestion[j].ChosenAnswerID = null;
                            var sumscores = 0
                            for (var p = 0; p < answers.childQuestion[j].Intervention_Question_Answer.length; p++) {



                                if (answers.childQuestion[j].Intervention_Question_Answer[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID) {

                                    answers.childQuestion[j].Intervention_Question_Answer[p].ChosenAnswer = true;
                                    if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                        answers.childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    }
                                    answers.childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                    answers.childQuestion[j].SumofScores += answers.childQuestion[j].Intervention_Question_Answer.Score;
                                    //sumscores += answers.childQuestion[j].Sections_Questions_Answers.Score;
                                }




                            }

                            if (sumscores > 0)
                                vm.copySumofScore = sumscores;

                            //answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            //answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                        }


                        if (answers.childQuestion[j].MinScore != null) {


                            EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);



                        }
                        else {
                            EditSubQuestion(answers.childQuestion[j].Intervention_Question_Answer, lstAssessmentData);
                        }





                    }

                }
                //newly added 4/18/2016
                if (lstQueswthnoAnswer == 0 && answers.childQuestion[j].LastQuestionInset == true) {
                    if (answers.childQuestion[j].MinScore != null) {


                        EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);



                    }
                    else {
                        EditSubQuestion(answers.childQuestion[j].Intervention_Question_Answer, lstAssessmentData);
                    }
                }

            }


            return true
        }

        vm.BindSectionQuestion = function (objSectionQuestion, depth) {
            var strChevrons = '';
            for (var i = 0; i <= depth; i++) {
                strChevrons += "<i class='fa fa-chevron-right'></i>";
            }
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objSectionQuestion.replace("ResidentName", ResidentFullName);
            return $sce.trustAsHtml(strChevrons + res);
        }


        vm.ChangeResident = function (objAnswer) {
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objAnswer.replace("ResidentName", ResidentFullName);
            return res;
        }

        //------------------------------------offline----------------


        function GetAllActiveSection_Offline() {

            var lstResidentAnsweredQuestions = [];//1st loop
            for (var i = 0; i < arryResident_Question_Answers.length; i++) {
                for (var j = 0; j < arrySection_Question_Answers.length; j++) {
                    if (arryResident_Question_Answers[i].Section_Question_AnswerID == arrySection_Question_Answers[j].ID) {
                        lstResidentAnsweredQuestions.push(arrySection_Question_Answers[j]);
                    }
                }
            }
            var lstSectionQuestionAnswerHasParentAnswerID = [];
            var lstSectionQuestionAnswerHasNoParentAnswerID = [];
            for (var i = 0; i < arrySection_Questions_Answers_Tasks.length; i++) {//2nd loop
                if (arrySection_Questions_Answers_Tasks[i].Section_Question_AnswerID != null) {
                    lstSectionQuestionAnswerHasParentAnswerID.push(arrySection_Questions_Answers_Tasks[i]);
                }
                else {
                    lstSectionQuestionAnswerHasNoParentAnswerID.push(arrySection_Questions_Answers_Tasks[i]);
                }
                arrySection_Questions_Answers_Tasks[i].Section_Intervention = [];
                for (var j = 0; j < arrySection_Intervention.length; j++) {
                    if (arrySection_Questions_Answers_Tasks[i].Section_InterventionID == arrySection_Intervention[j].ID) {
                        arrySection_Intervention[j].Intervention_Question = [];
                        for (var k = 0; k < arryIntervention_Question.length; k++) {
                            if (arryIntervention_Question[k].Section_InterventionID == arrySection_Intervention[j].ID) {
                                arrySection_Intervention[j].Intervention_Question.push(arryIntervention_Question[k]);
                            }
                        }
                        arrySection_Questions_Answers_Tasks[i].Section_Intervention = arrySection_Intervention[j];
                    }
                }
            }

            for (var i = 0; i < arrySection_Questions_Answers_Tasks.length; i++) {
                for (var j = 0; j < arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question.length; j++) {
                    arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question[j].Intervention_Question_Answer = [];
                    for (var k = 0; k < arryIntervention_Question_Answer.length; k++) {
                        if (arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question[j].ID == arryIntervention_Question_Answer[k].Intervention_QuestionID) {
                            arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question[j].Intervention_Question_Answer.push(arryIntervention_Question_Answer[k]);
                        }
                    }
                }
            }
            var GetlstResidentSectionQuestionAnsTask = [];
            for (var i = 0; i < lstResidentAnsweredQuestions.length; i++) {
                for (var j = 0; j < lstSectionQuestionAnswerHasParentAnswerID.length; j++) {
                    if (lstResidentAnsweredQuestions[i].ID == lstSectionQuestionAnswerHasParentAnswerID[j].Section_Question_AnswerID) {
                        GetlstResidentSectionQuestionAnsTask.push(lstSectionQuestionAnswerHasParentAnswerID[j].Section_Intervention);
                    }
                }
            }

            var SectionQuestionAnserTaskGroupByIntervention = [];

            for (var i = 0; i < lstSectionQuestionAnswerHasNoParentAnswerID.length; i++) {
                var doesSection_InterventionIDExist = false;
                for (var j = 0; j < SectionQuestionAnserTaskGroupByIntervention.length; j++) {
                    if (SectionQuestionAnserTaskGroupByIntervention[j].Section_InterventionID == lstSectionQuestionAnswerHasNoParentAnswerID[i].Section_InterventionID) {
                        doesSection_InterventionIDExist = true;
                        break;
                    }
                }
                if (!doesSection_InterventionIDExist)
                    SectionQuestionAnserTaskGroupByIntervention.push(lstSectionQuestionAnswerHasNoParentAnswerID[i]);
            }


            //for (var i = 0; i < SectionQuestionAnserTaskGroupByIntervention.length; i++) {
            //    var score = 0;
            //    var hasScore = false;
            //    var objIntervention;
            //    for (var j = 0; j < lstResidentAnsweredQuestions.length; j++) {
            //        if (lstResidentAnsweredQuestions[j].Section_QuestionID == SectionQuestionAnserTaskGroupByIntervention[i].Section_QuestionID) {
            //            hasScore = true;
            //            score += parseInt(lstResidentAnsweredQuestions[j].Score);
            //        }
            //        objIntervention = SectionQuestionAnserTaskGroupByIntervention[i].Section_Intervention;
            //    }
            //    if (hasScore) {
            //        if (objIntervention.MinScore <= score && (objIntervention.MaxScore >= score || objIntervention.MaxScore == null))
            //            GetlstResidentSectionQuestionAnsTask.push(objIntervention);
            //    }
            //}

            for (var i = 0; i < lstSectionQuestionAnswerHasNoParentAnswerID.length; i++) {
                var score = 0;
                var hasScore = false;
                var objIntervention;
                for (var j = 0; j < lstResidentAnsweredQuestions.length; j++) {
                    if (lstResidentAnsweredQuestions[j].Section_QuestionID == lstSectionQuestionAnswerHasNoParentAnswerID[i].Section_QuestionID) {
                        hasScore = true;
                        score += parseInt(lstResidentAnsweredQuestions[j].Score);
                    }
                    objIntervention = lstSectionQuestionAnswerHasNoParentAnswerID[i].Section_Intervention;
                }
                if (hasScore) {
                    if (objIntervention.MinScore <= score && (objIntervention.MaxScore >= score || objIntervention.MaxScore == null))
                        GetlstResidentSectionQuestionAnsTask.push(objIntervention);
                }
            }


            var Distinctitems = [];
            var DistinctListSectionIntervention = [];
            var Section_InterventionIDs = [];

            for (var i = 0; i < GetlstResidentSectionQuestionAnsTask.length; i++) {
                var doesListSection_InterventionIDExist = false;
                for (var j = 0; j < Distinctitems.length; j++) {
                    if (Distinctitems[j].ID == GetlstResidentSectionQuestionAnsTask[i].ID) {
                        doesListSection_InterventionIDExist = true;
                        break;
                    }
                }
                if (!doesListSection_InterventionIDExist)
                    Distinctitems.push(GetlstResidentSectionQuestionAnsTask[i]);
            }
            for (var i = 0; i < Distinctitems.length; i++) {
                Distinctitems[i].Intervention_Question_Answer = null;
                for (var j = 0; j < Distinctitems[i].Intervention_Question.length; j++) {
                    Distinctitems[i].Intervention_Question[j].Section_Intervention = null;
                }
                Distinctitems[i].Actions = [];
                DistinctListSectionIntervention.push(Distinctitems[i]);
                Section_InterventionIDs.push(Distinctitems[i].ID);
            }
            var sectionQuestionAnswerTask = [];
            for (var i = 0; i < arrySection_Questions_Answers_Tasks.length; i++) {
                if (Section_InterventionIDs.indexOf(arrySection_Questions_Answers_Tasks[i].Section_InterventionID) > -1) {
                    sectionQuestionAnswerTask.push(arrySection_Questions_Answers_Tasks[i]);
                }
            }
            var DistinctItemsSection1 = [];
            for (var i = 0; i < sectionQuestionAnswerTask.length; i++) {
                var doesSection_InterventionIDExist = false;
                for (var j = 0; j < DistinctItemsSection1.length; j++) {
                    if (DistinctItemsSection1[j].Section_InterventionID == sectionQuestionAnswerTask[i].Section_InterventionID) {
                        doesSection_InterventionIDExist = true;
                        break;
                    }
                }
                if (!doesSection_InterventionIDExist)
                    DistinctItemsSection1.push(sectionQuestionAnswerTask[i]);
            }

            var DistinctSections_Questions_Answers_Tasks = [];
            for (var i = 0; i < DistinctItemsSection1.length; i++) {
                DistinctSections_Questions_Answers_Tasks.push(DistinctItemsSection1[i]);
            }

            //-------------------
            var lstSectionInterventionSection = [];
            for (var i = 0; i < DistinctSections_Questions_Answers_Tasks.length; i++) {
                var objSectionInterventionSection = {};
                if (DistinctSections_Questions_Answers_Tasks[i].Section_Question_AnswerID == null) {
                    for (var j = 0; j < arrySection_Questions.length; j++) {
                        if (arrySection_Questions[j].ID == DistinctSections_Questions_Answers_Tasks[i].Section_QuestionID) {
                            for (var k = 0; k < arrySections.length; k++) {
                                if (arrySection_Questions[j].SectionID == arrySections[k].ID) {
                                    objSectionInterventionSection.sectionName = arrySections[k].Name;
                                    objSectionInterventionSection.ID = arrySections[k].ID;
                                }
                            }
                        }
                    }
                }
                else {
                    for (var j = 0; j < arrySection_Question_Answers.length; j++) {
                        if (arrySection_Question_Answers[j].ID == DistinctSections_Questions_Answers_Tasks[i].Section_Question_AnswerID) {
                            for (var k = 0; k < arrySections.length; k++) {
                                if (arrySection_Question_Answers[j].SectionID == arrySections[k].ID) {
                                    objSectionInterventionSection.sectionName = arrySections[k].Name;
                                    objSectionInterventionSection.ID = arrySections[k].ID;
                                }
                            }
                        }
                    }
                }
                objSectionInterventionSection.section_InterventionID = DistinctSections_Questions_Answers_Tasks[i].Section_InterventionID;
                lstSectionInterventionSection.push(objSectionInterventionSection);
            }
            var objSectionWithSectionIntervention = new Object();
            objSectionWithSectionIntervention.SectionInterventionResponse = DistinctListSectionIntervention;
            objSectionWithSectionIntervention.SectionInterventionSection = lstSectionInterventionSection;
            GetAllActiveSectionWRTOnlineOffline(objSectionWithSectionIntervention);

        }//method end

        function GetAllActiveSectionWRTOnlineOffline(objSectionWithSectionIntervention) {
            if (objSectionWithSectionIntervention.SectionInterventionResponse.length > 0 && objSectionWithSectionIntervention.SectionInterventionSection.length > 0) {
                //Code To Display Question 
                vm.Sections = objSectionWithSectionIntervention.SectionInterventionResponse;
                vm.CopyallSectionsQuestion = objSectionWithSectionIntervention.SectionInterventionResponse;
                vm.MainQuestion = [];
                vm.SubQuestion = [];
                vm.AllSection = [];



                vm.SectionIDs = uniquevalSection(objSectionWithSectionIntervention.SectionInterventionSection);
                var GroupSection = [];
                for (var m = 0; m < vm.SectionIDs.length; m++) {
                    var arrsection = { sectionID: "", sectionName: "", sectionIntervention: [] };
                    for (var z = 0; z < objSectionWithSectionIntervention.SectionInterventionSection.length; z++) {
                        if (vm.SectionIDs[m].ID == objSectionWithSectionIntervention.SectionInterventionSection[z].ID) {
                            arrsection.sectionID = vm.SectionIDs[m].ID;
                            arrsection.sectionName = objSectionWithSectionIntervention.SectionInterventionSection[z].sectionName;
                            arrsection.sectionIntervention.push(objSectionWithSectionIntervention.SectionInterventionSection[z].section_InterventionID);
                        }
                    }
                    GroupSection.push(arrsection);
                }



                //To get All Section
                for (var x = 0; x < objSectionWithSectionIntervention.SectionInterventionResponse.length; x++) {

                    vm.AllSection.push(objSectionWithSectionIntervention.SectionInterventionResponse[x]);
                }

                for (var p = 0; p < objSectionWithSectionIntervention.SectionInterventionResponse.length; p++) {

                    for (var q = 0; q < objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question.length; q++) {
                        var z = 0;
                        for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {


                            if (vm.QuestionParentQuestion[r].InterventionQuestionID == objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q].ID) {
                                z++;
                            }



                        }

                        if (z == 0) {
                            if (objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q].IsInAssessment == true || objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q].IsInAssessment == "true")
                                vm.MainQuestion.push(objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q]);
                        }
                        else {
                            if (objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q].IsInAssessment == true || objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q].IsInAssessment == "true")
                                vm.SubQuestion.push(objSectionWithSectionIntervention.SectionInterventionResponse[p].Intervention_Question[q]);
                        }
                    }


                }

                for (var m = 0; m < vm.MainQuestion.length; m++) {
                    vm.MainQuestion[m].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (vm.MainQuestion[m].ID == vm.QuestionParentQuestion[n].InterventionParentQuestionID) {
                            for (var p = 0; p < vm.SubQuestion.length; p++) {

                                if (vm.SubQuestion[p].ID == vm.QuestionParentQuestion[n].InterventionQuestionID) {

                                    vm.MainQuestion[m].childQuestion.push(vm.SubQuestion[p]);
                                    try {
                                        SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
                                    } catch (e) {
                                        if (e instanceof TypeError) {
                                            // ignore TypeError
                                        }
                                        else if (e instanceof RangeError) {

                                        }
                                        else {
                                            // something else
                                        }
                                    }

                                }

                            }
                        }
                    }


                }

                //Code End


                for (var k = 0; k < vm.MainQuestion.length; k++) {
                    for (var y = 0; y < vm.MainQuestion[k].Intervention_Question_Answer.length; y++) {
                        vm.MainQuestion[k].Intervention_Question_Answer[y].childQuestion = [];
                        for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                            if (vm.MainQuestion[k].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                for (var n = 0; n < vm.SubQuestion.length; n++) {

                                    if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].InterventionQuestionID && vm.MainQuestion[k].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                        vm.SubQuestion[n].InterventionParentAnswerID = vm.MainQuestion[k].Intervention_Question_Answer[y].ID;
                                        vm.MainQuestion[k].Intervention_Question_Answer[y].childQuestion.push(vm.SubQuestion[n]);
                                        subQuestionforAnswer(vm.MainQuestion[k].Intervention_Question_Answer[y].childQuestion, vm.SubQuestion)
                                    }
                                }
                            }


                        }
                    }

                }




                for (var k = 0; k < vm.MainQuestion.length; k++) {
                    for (var i = 0; i < vm.MainQuestion[k].childQuestion.length; i++) {

                        //Start
                        for (var y = 0; y < vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer.length; y++) {
                            vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].childQuestion = [];
                            for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                                if (vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                    for (var n = 0; n < vm.SubQuestion.length; n++) {

                                        if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].InterventionQuestionID && vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].ID == vm.QuestionParentQuestion[m].InterventionParentAnswerID) {
                                            vm.SubQuestion[n].InterventionParentAnswerID = vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].ID;
                                            vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].childQuestion.push(vm.SubQuestion[n]);
                                            subQuestionforAnswer(vm.MainQuestion[k].childQuestion[i].Intervention_Question_Answer[y].childQuestion, vm.SubQuestion)
                                        }
                                    }
                                }


                            }
                        }


                        //End
                    }


                }


                for (var t = 0; t < vm.AllSection.length; t++) {
                    vm.AllSection[t].Intervention_Question = [];
                    for (var s = 0; s < vm.MainQuestion.length; s++) {

                        if (vm.MainQuestion[s].Section_InterventionID == vm.AllSection[t].ID) {
                            vm.AllSection[t].Intervention_Question.push(vm.MainQuestion[s]);
                        }


                    }

                }

                vm.onlyduplicates = uniqueQuestion(vm.CopyQuestionParentQuestion);
                vm.uniqueQuestionIDs = uniqueval(vm.onlyduplicates);


                if (vm.uniqueQuestionIDs.length > 0) {
                    vm.uniqueQuestionIDswithNoParAnsIds = [];

                    for (var k = 0; k < vm.uniqueQuestionIDs.length; k++) {
                        if (vm.uniqueQuestionIDs[k].InterventionParentAnswerID == null) {
                            vm.uniqueQuestionIDswithNoParAnsIds.push(vm.uniqueQuestionIDs[k]);
                        }
                    }



                    if (vm.uniqueQuestionIDswithNoParAnsIds.length > 0) {
                        //Step2:
                        vm.AllParentQuestions = [];
                        for (var j = 0; j < vm.uniqueQuestionIDswithNoParAnsIds.length; j++) {

                            var newarray = { QuestionID: '', SectionQuestion: [] }
                            newarray.QuestionID = vm.uniqueQuestionIDswithNoParAnsIds[j].InterventionQuestionID;
                            for (var m = 0; m < vm.CopyQuestionParentQuestion.length; m++) {
                                if (vm.uniqueQuestionIDswithNoParAnsIds[j].InterventionQuestionID == vm.CopyQuestionParentQuestion[m].InterventionQuestionID) {
                                    if (vm.CopyallSectionsQuestion.length > 0) {
                                        for (var u = 0; u < vm.CopyallSectionsQuestion.length; u++) {
                                            for (var r = 0; r < vm.CopyallSectionsQuestion[u].Intervention_Question.length; r++) {
                                                if (vm.CopyallSectionsQuestion[u].Intervention_Question[r].ID == vm.CopyQuestionParentQuestion[m].InterventionParentQuestionID)
                                                    newarray.SectionQuestion.push(vm.CopyallSectionsQuestion[u].Intervention_Question[r]);
                                            }

                                        }
                                    }

                                }
                            }
                            vm.AllParentQuestions.push(newarray);
                        }

                        if (vm.AllParentQuestions.length > 0) {
                            //step3


                            for (var zz = 0; zz < vm.AllParentQuestions.length; zz++) {


                                var array = [];
                                for (var yy = 0; yy < vm.AllParentQuestions[zz].SectionQuestion.length; yy++) {


                                    array.push(vm.AllParentQuestions[zz].SectionQuestion[yy].DisplayOrder)
                                }

                                var largest = 0;

                                for (i = 0; i <= largest; i++) {
                                    if (array[i] > largest) {
                                        var largest = array[i];
                                    }
                                }





                                for (var mm = 0; mm < vm.AllParentQuestions[zz].SectionQuestion.length; mm++) {

                                    if (vm.AllParentQuestions[zz].SectionQuestion[mm].DisplayOrder == largest) {
                                        vm.AllParentQuestions[zz].SectionQuestion[mm].lastquestion = 1;
                                    }


                                }



                            }

                            //step:4
                            if (vm.AllParentQuestions.length > 0) {

                                vm.AllSetQuestion = [];
                                for (var nn = 0; nn < vm.AllParentQuestions.length; nn++) {

                                    for (var w = 0; w < vm.AllParentQuestions[nn].SectionQuestion.length; w++) {

                                        var arrayMainQuesGroup = { filterdSectionQuestionID: '', GroupNo: '', IsLastQuesInGroup: false }
                                        arrayMainQuesGroup.filterdSectionQuestionID = vm.AllParentQuestions[nn].SectionQuestion[w].ID;
                                        arrayMainQuesGroup.GroupNo = nn;
                                        if (vm.AllParentQuestions[nn].SectionQuestion[w].lastquestion != undefined) {
                                            arrayMainQuesGroup.IsLastQuesInGroup = true;
                                        }
                                        vm.AllSetQuestion.push(arrayMainQuesGroup);
                                    }

                                }


                            }



                            if (vm.AllSetQuestion.length > 0) {

                                for (var q = 0; q < vm.AllSection.length; q++) {



                                    for (var z = 0; z < vm.AllSection[q].Intervention_Question.length; z++) {

                                        for (var L = 0; L < vm.AllSetQuestion.length; L++) {

                                            if (vm.AllSetQuestion[L].filterdSectionQuestionID == vm.AllSection[q].Intervention_Question[z].ID) {
                                                vm.AllSection[q].Intervention_Question[z].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                                                    vm.AllSection[q].Intervention_Question[z].childQuestion = [];
                                                    vm.AllSection[q].Intervention_Question[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                                }
                                                else {
                                                    vm.AllSection[q].Intervention_Question[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                                    if (vm.AllSection[q].Intervention_Question[z].childQuestion.length > 0) {
                                                        for (var c = 0; c < vm.AllSection[q].Intervention_Question[z].childQuestion.length; c++) {

                                                            vm.AllSection[q].Intervention_Question[z].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                        }
                                                    }

                                                }

                                            }


                                        }


                                    }



                                }
                            }
                        }
                    }
                }

                for (var i = 0; i < vm.Sections.length; i++) {
                    for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                        for (var k = 0; k < vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer.length; k++) {
                            vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].CarePlan = [];
                            for (var x = 0; x < vm.InterventionCarePlan.length; x++) {
                                if (vm.InterventionCarePlan[x].AnswerID == vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].ID) {
                                    vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].CarePlan.push(vm.InterventionCarePlan[x]);
                                }
                            }
                            BindCarePaln(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion);
                        }
                    }
                }





                vm.Sections = vm.AllSection;


                for (var i = 0; i < vm.Sections.length; i++) {
                    for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                        for (var k = 0; k < vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer.length; k++) {
                            if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].IsDefault) {
                                if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].IsDefault != "false") {
                                    vm.Sections[i].Intervention_Question[j].ChosenAnswerID = vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].ID;
                                }
                            }
                            if (vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion && vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion.length > 0) {
                                BindChosenAnswerID(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer[k].childQuestion);
                            }
                        }
                    }
                }


                GetAssessmentAnswers();

                // vm.CarePlan = [];
                for (var i = 0; i < vm.Sections.length; i++) {


                    var objCarePlan = {};
                    objCarePlan.Id = vm.Sections[i].ID;
                    objCarePlan.TaskTitle = vm.Sections[i].InterventionTitle;
                    objCarePlan.Section_Question_Answer_TaskID = vm.Sections[i].ID;
                    objCarePlan.QuestionIntervention = vm.Sections[i].Intervention_Question;
                    objCarePlan.IsRecurrencePatternShown = false;

                    if (vm.Sections[i].Actions.length > 0) {

                        SetRecurrenceRangeAndPattern(objCarePlan, vm.Sections[i].Actions[0]);


                    }
                    else {
                        ResetRecurrencePattern(objCarePlan);
                        ResetRecurrenceRange(objCarePlan);
                    }


                    objCarePlan.OldRecurrence = {};
                    objCarePlan.OldRecurrence = angular.copy(objCarePlan.Recurrence);

                    vm.CarePlan.push(objCarePlan);


                }


                vm.SectionCareplan = [];
                if (vm.CarePlan.length > 0) {

                    for (var i = 0; i < GroupSection.length; i++) {
                        var arrsection = { sectionName: "", careplan: [] };
                        arrsection.sectionName = GroupSection[i].sectionName;
                        for (var m = 0; m < GroupSection[i].sectionIntervention.length; m++) {

                            for (var j = 0; j < vm.CarePlan.length; j++) {
                                if (GroupSection[i].sectionIntervention[m] == vm.CarePlan[j].Id) {
                                    arrsection.careplan.push(vm.CarePlan[j]);
                                }
                            }
                        }
                        vm.SectionCareplan.push(arrsection);
                    }

                }
            }
        }

        vm.openFile = function (url) {

            var urlPaths = url.split('/');
            var fileName = urlPaths.length > 0 ? urlPaths[urlPaths.length - 1] : 'downloadedFile.txt';
            var fileNameParts = fileName.split('.');
            var extension = fileNameParts.length > 1 ? '.' + fileNameParts[fileNameParts.length - 1] : '.txt';
            var mimeType = CommonService.getMimeTypeForExtension(extension);

            if (vm.online) {
                var targetPath = $rootScope.Path + 'downloads/' + fileName;

                var options = { withCredentials: true };
                $rootScope.$broadcast("loader_show");
                $cordovaFileTransfer.download($rootScope.RootUrl + url, targetPath, options, true).then(function (result) {

                    $rootScope.$broadcast("loader_hide");
                    $cordovaFileOpener2.open(targetPath, mimeType).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    }, function (err) {
                        $rootScope.$broadcast("loader_hide");
                    });
                }, function (error) {

                    if (error.code == 1) {
                        $cordovaFileOpener2.open(targetPath, mimeType).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        }, function (err) {

                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                    $rootScope.$broadcast("loader_hide");
                }, function (progress) {
                    $timeout(function () {
                        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                    });
                });
            }
            else {
                $rootScope.$broadcast("loader_show");
                $cordovaFileOpener2.open(url, mimeType).then(function () {
                    $rootScope.$broadcast("loader_hide");
                }, function (err) {

                    $rootScope.$broadcast("loader_hide");
                });
            }
        }


    }

}());