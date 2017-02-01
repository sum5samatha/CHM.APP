(function () {
    // "use strict";

    angular.module('CHM').controller('EditInterventionsController', EditInterventionsController);

    EditInterventionsController.$inject = ['$q', '$sce', '$uibModal', '$window', '$filter','$stateParams', '$uibModalInstance', '$state', 'toastr', 'ResidentsService', 'InterventionsService', 'InterVentionID', 'TaskTitle', 'SectionInterventionID', '$scope', 'onlineStatus', 'CommonService'];

    function EditInterventionsController($q, $sce, $uibModal, $window, $filter, $stateParams, $uibModalInstance, $state, toastr, ResidentsService, InterventionsService, InterVentionID, TaskTitle, SectionInterventionID, $scope, onlineStatus, CommonService) {
        var vm = this;
        vm.TaskName = TaskTitle;
        vm.Interventions = {};
        vm.CarePlan = [];
        vm.ResidentId = $stateParams.ResidentId;
        vm.Statements = [];

        var arryInterventions = [];
        var arryInterventionsByInterventionID = [];
        var arryIntervention_Question_ParentQuestion = [];
        var arryResident_Question_Answers = [];
        var arrySection_Question_Answers = [];
        var arrySection_Questions_Answers_Tasks = [];
        var arrySection_Intervention = [];
        var arryActions = [];
        var arryActions_Days = [];
        var arryIntervention_Question = [];
        var arryIntervention_Question_Answer = [];
        var arryInterventions_Resident_Answers = [];
        var arryResident_Interventions_Questions_Answers = [];
        var arryIntervention_Question_Answer_Task = [];

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {

            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.TaskName = TaskTitle;
            vm.Interventions = {};
            vm.CarePlan = [];
            vm.ResidentId = $stateParams.ResidentId;
            vm.Statements = [];

            if ($scope.online == true) {
                GetInterventionByID(InterVentionID);
                InterventionQuestionParentQuestion();
                InterventionForInterventionQuestion();
                GetSectionInterventionSummary(SectionInterventionID);
            }
            else {
                var deferredArr = [];
                var deferredInterventions = $q.defer();
                var deferredInterventionsByInterventionID = $q.defer();
                var deferredIntervention_Question_ParentQuestion = $q.defer();
                var deferredResident_Question_Answers = $q.defer();
                var deferredSection_Question_Answers = $q.defer();
                var deferredSection_Questions_Answers_Tasks = $q.defer();
                var deferredSection_Intervention = $q.defer();
                var deferredActions = $q.defer();
                var deferredActions_Days = $q.defer();
                var deferredIntervention_Question = $q.defer();
                var deferredIntervention_Question_Answer = $q.defer();
                var deferredInterventions_Resident_Answers = $q.defer();
                var deferredResident_Interventions_Questions_Answers = $q.defer();
                var deferredIntervention_Question_Answer_Task = $q.defer();



                arryInterventions = [];
                arryInterventionsByInterventionID = [];
                arryIntervention_Question_ParentQuestion = [];
                arryResident_Question_Answers = [];
                arrySection_Question_Answers = [];
                arrySection_Questions_Answers_Tasks = [];
                arrySection_Intervention = [];
                arryActions = [];
                arryActions_Days = [];
                arryIntervention_Question = [];
                arryIntervention_Question_Answer = [];
                arryInterventions_Resident_Answers = [];
                arryResident_Interventions_Questions_Answers = [];
                arryIntervention_Question_Answer_Task = [];



                deferredArr.push(deferredInterventions.promise);
                deferredArr.push(deferredInterventionsByInterventionID.promise);
                deferredArr.push(deferredIntervention_Question_ParentQuestion.promise);
                deferredArr.push(deferredResident_Question_Answers.promise);
                deferredArr.push(deferredSection_Question_Answers.promise);
                deferredArr.push(deferredSection_Questions_Answers_Tasks.promise);
                deferredArr.push(deferredSection_Intervention.promise);
                deferredArr.push(deferredActions.promise);
                deferredArr.push(deferredActions_Days.promise);
                deferredArr.push(deferredIntervention_Question.promise);
                deferredArr.push(deferredIntervention_Question_Answer.promise);
                deferredArr.push(deferredInterventions_Resident_Answers.promise);
                deferredArr.push(deferredResident_Interventions_Questions_Answers.promise);
                deferredArr.push(deferredIntervention_Question_Answer_Task.promise);

                var renderInterventionsByInterventionID = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryInterventionsByInterventionID.push(rs.rows.item(i));
                    }
                    deferredInterventionsByInterventionID.resolve();
                };


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

                var renderInterventions_Resident_Answers = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        arryInterventions_Resident_Answers.push(rs.rows.item(i));
                    }
                    deferredInterventions_Resident_Answers.resolve();
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



                function GetAllOfflineData() {
                    app.GetOfflineInterventionsByInterventionID(renderInterventionsByInterventionID, InterVentionID);
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
                    var objInterventions_Resident_Answers = {};
                    objInterventions_Resident_Answers.InterventionID = InterVentionID;
                    objInterventions_Resident_Answers.ResidentID = vm.ResidentId;
                    app.GetOfflineInterventions_Resident_Answers(renderInterventions_Resident_Answers, objInterventions_Resident_Answers);
                    app.GetOfflineResident_Interventions_Questions_Answers(renderResident_Interventions_Questions_Answers, vm.ResidentId);
                    app.GetOfflineIntervention_Question_Answer_Task(renderIntervention_Question_Answer_Task);
                }



                function GetInterventionByID_Offline() {
                    GetAllOfflineData();
                    $q.all(deferredArr).then(function () {
                        vm.Interventions = arryInterventionsByInterventionID[0];
                        if (vm.Interventions.MoodAfter) {
                            vm.Mood = vm.Interventions.MoodAfter;
                        }

                        if (vm.Interventions.MoodDuring) {
                            vm.Mood = vm.Interventions.MoodDuring;
                        }

                        if (vm.Interventions.MoodBefore) {
                            vm.Mood = vm.Interventions.MoodBefore;
                        }
                        vm.QuestionParentQuestion = arryIntervention_Question_ParentQuestion;
                        vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
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



        var GetSectionInterventionSummary = function (SectionInterventionID) {
            ResidentsService.getSectionInterventionStatementsID(SectionInterventionID).then(
                function (response) {
                    vm.Statements = response.data;
                }, function (err) {

                })
        }

        var GetInterventionByID = function (InterVentionID) {
            InterventionsService.GetInterventions(InterVentionID).then(function (response) {
                vm.Interventions = response.data;
                if (vm.Interventions.MoodAfter) {
                    vm.Mood = vm.Interventions.MoodAfter;
                }

                if (vm.Interventions.MoodDuring) {
                    vm.Mood = vm.Interventions.MoodDuring;
                }

                if (vm.Interventions.MoodBefore) {
                    vm.Mood = vm.Interventions.MoodBefore;
                }
            },
          function (err) {
              toastr.error('An error occurred while retrieving sections.');
          }
          );
        }

        vm.SaveStatus = function () {
            if (vm.Mood != null) {
                if (vm.Interventions.Status == 'Completed') {
                    vm.Interventions.MoodAfter = vm.Mood;
                    vm.Interventions.MoodDuring = null;
                    vm.Interventions.MoodBefore = null;
                }
                else if (vm.Interventions.Status == 'PartiallyCompleted') {
                    vm.Interventions.MoodDuring = vm.Mood;
                    vm.Interventions.MoodBefore = null;
                    vm.Interventions.MoodAfter = null;
                }
                else {
                    vm.Interventions.MoodBefore = vm.Mood;
                    vm.Interventions.MoodAfter = null;
                    vm.Interventions.MoodDuring = null;
                }

                if ($scope.online) {
                    InterventionsService.UpdateInterventionsStatus(vm.Interventions).then(
                   function (response) {
                       SaveAssessmentData(vm.CarePlan);
                       var lstCarePlan = [];
                       lstCarePlan = response.data;

                       CommonService.UpdateInterventionsStatus(app.db, lstCarePlan).then(function (response) {
                           toastr.success('Intervention  updated sucessfully in offline.');

                       },
                                 function (err) {
                                     toastr.error('An error occured while deleting Intervention offline.');
                                 })

                       toastr.success('Intervention updated successfully.');
                       $uibModalInstance.close(true);
                       
                   },
                   function (err) {
                       toastr.error('An error occured while saving Intervention Status.');
                   }
               );
                }
                else {
                    var objInterventions = {};
                    objInterventions.ID = vm.Interventions.ID;
                    objInterventions.Comments = vm.Interventions.Comments ? vm.Interventions.Comments : null;
                    objInterventions.MoodAfter = vm.Interventions.MoodAfter ? vm.Interventions.MoodAfter : null;
                    objInterventions.OutCome = vm.Interventions.OutCome ? vm.Interventions.OutCome : null;
                    objInterventions.Status = vm.Interventions.Status ? vm.Interventions.Status : null;
                    objInterventions.Time_Span = vm.Interventions.Time_Span ? vm.Interventions.Time_Span : null;
                    objInterventions.MoodDuring = vm.Interventions.MoodDuring ? vm.Interventions.MoodDuring : null;
                    objInterventions.MoodBefore = vm.Interventions.MoodBefore ? vm.Interventions.MoodBefore : null;
                    objInterventions.Exception = vm.Interventions.Exception ? vm.Interventions.Exception : null;
                    objInterventions.IsHandOverNotes = vm.Interventions.IsHandOverNotes ? vm.Interventions.IsHandOverNotes : null
                    CommonService.UpdateInterventionsStatus(app.db, objInterventions).then(function (response) {
                        SaveAssessmentData(vm.CarePlan);
                        toastr.success('Intervention updated successfully.');
                        $uibModalInstance.close(true);
                       
                    }, function err(error) {
                        toastr.error('An error occured while saving Intervention Status.');
                    });
                }

            }
            else {
                toastr.error('Please fill Mandatory Fields.');
            }
        }





        vm.CancelStatus = function () {
            $uibModalInstance.dismiss('cancel');
        }


        //Code Start
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
                 vm.InterventionCarePlan.push(objCarePlan);
             }
         }, function (err) {
             toastr.error('An error occurred while retrieving assessment answers.');
         })
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
                vm.InterventionCarePlan.push(objCarePlan);

            }

        }//func ends





        function InterventionQuestionParentQuestion() {
            ResidentsService.InterventionQuestionParentQuestion().then(function (response) {
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

        var GetAllActiveSection = function () {
            ResidentsService.GetOnlyAssessmentSummary(vm.ResidentId, SectionInterventionID).then(
            function (response) {
                GetAllActiveSectionWRTOnlineOffline(response.data);
            },
            function (err) {
                toastr.error('An error occurred while retrieving task titles.');
            }
        );

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

        //Newlyadded
        vm.copySumofScore = 0;
        //

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
        //Code End





        var SaveAssessmentData = function (obj) {
            var lstResidents_Questions_Answers = [];
            for (var z = 0; z < vm.CarePlan.length; z++) {

                var objSection = vm.CarePlan[z];
                for (var i = 0; i < objSection.QuestionIntervention.length; i++) {
                    var objResidents_Questions_Answers = {};
                    if (objSection.QuestionIntervention[i].ChosenAnswer != null || objSection.QuestionIntervention[i].LastQuestionInset == true) {
                        objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                        objResidents_Questions_Answers.InterventionID = InterVentionID;
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

                            objResidents_Questions_Answers.InterventionID = InterVentionID;
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
                    objResidents_Questions_Answers.InterventionID = InterVentionID;
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
                ResidentsService.SaveInterventionAnswerAssessmentData(vm.ResidentId, lstResidents_Questions_Answers).then(
               function (response) {
                 
                   toastr.success('Intervention Resident Answers updated successfully.');
                   var lstInterventionsResidentAnswersData = [];
                   lstInterventionsResidentAnswersData = response.data;
                   var lstInsertInterventionsResidentAnswers = [];

                   CommonService.DeleteAllInterventions_Resident_AnswersRecords(app.db).then(function (response) {

                       for (var i = 0; i < lstInterventionsResidentAnswersData.length; i++) {
                           lstInterventionsResidentAnswersData.IsSyncnised = true;
                           lstInterventionsResidentAnswersData.IsCreated = false;

                           lstInsertInterventionsResidentAnswers.push(lstInterventionsResidentAnswersData[i]);
                       }

                       if (lstInsertInterventionsResidentAnswers.length > 60) {
                           var i, j, temparray, chunk = 60;
                           for (i = 0, j = lstInsertInterventionsResidentAnswers.length; i < j; i += chunk) {
                               temparray = lstInsertInterventionsResidentAnswers.slice(i, i + chunk);

                               CommonService.insertInterventions_Resident_Answers(app.db, temparray).then(function () {

                               },
                               function (err) {
                                   toastr.error('An error occurred while updating Intervention_Resident_Answers');
                               });
                           }
                       }
                   }),
                               function (err) {
                                   toastr.error('An error occurred while deleting Intervention_Resident_Answers.');
                               }




               },
               function (err) {
                   toastr.error('An error occurred while updating assessment data.');
               }
           );
            }
            else {
                for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
                    var objResidents_Questions_Answers = {};
                    objResidents_Questions_Answers.InterventionID = lstResidents_Questions_Answers[i].InterventionID;
                    objResidents_Questions_Answers.ResidentID = lstResidents_Questions_Answers[i].ResidentId;
                    CommonService.UpdateInterventions_Resident_AnswersIsActive(app.db, objResidents_Questions_Answers).then(function (response) {

                        toastr.success('Intervention Resident Answers updated successfully.');
                    }, function err(error) {

                        toastr.error('An error occurred while updating assessment data.');
                    });
                    break;
                }
                var lstCreateResidents_Questions_Answers = [];
                for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
                    var objResidents_Questions_Answers = {};
                    objResidents_Questions_Answers = lstResidents_Questions_Answers[i];
                    //[Created,CreatedBy,Modified,ModifiedBy]
                    objResidents_Questions_Answers.ResidentID = lstResidents_Questions_Answers[i].ResidentId;
                    objResidents_Questions_Answers.IsSyncnised = false;
                    objResidents_Questions_Answers.IsActive = true;
                    objResidents_Questions_Answers.IsCreated = true;
                    objResidents_Questions_Answers.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    objResidents_Questions_Answers.CreatedBy = $rootScope.UserInfo.UserID;
                    objResidents_Questions_Answers.Modified = null;
                    objResidents_Questions_Answers.ModifiedBy = null;
                    objResidents_Questions_Answers.ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                    lstCreateResidents_Questions_Answers.push(objResidents_Questions_Answers);
                }
                if (lstCreateResidents_Questions_Answers.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstCreateResidents_Questions_Answers.length; i < j; i += chunk) {
                        temparray = lstCreateResidents_Questions_Answers.slice(i, i + chunk);
                        CommonService.insertInterventions_Resident_Answers(app.db, temparray).then(function () {

                        },
                        function (err) {

                        });
                    }
                }
                else {
                    CommonService.insertInterventions_Resident_Answers(app.db, lstCreateResidents_Questions_Answers).then(function () {

                    },
                    function (err) {

                    });
                }
            }

        };


        var GetAssessmentAnswers = function () {
            if ($scope.online) {
                ResidentsService.getInterventionResidentAnswerAssessmentData(vm.ResidentId, InterVentionID).then(
                function (response) {
                    GetAssessmentData(response.data);
                },
                function (err) {
                    toastr.error('An error occurred while retrieving assessment answers.');
                }
            );
            }
            else {
                for (var i = 0; i < arryInterventions_Resident_Answers.length; i++) {
                    arryInterventions_Resident_Answers[i].Intervention_Question_Answer = [];
                    for (var j = 0; j < arryIntervention_Question_Answer.length; j++) {
                        if (arryInterventions_Resident_Answers[i].Intervention_Question_AnswerID == arryIntervention_Question_Answer[j].ID) {
                            arryIntervention_Question_Answer[j].Intervention_Question = [];
                            for (var k = 0; k < arryIntervention_Question.length; k++) {
                                if (arryIntervention_Question_Answer[j].Intervention_QuestionID == arryIntervention_Question[k].ID) {
                                    arryIntervention_Question_Answer[j].Intervention_Question.push(arryIntervention_Question[k]);
                                }
                            }
                            arryInterventions_Resident_Answers[i].Intervention_Question_Answer = arryIntervention_Question_Answer[j];
                        }
                    }
                }
                var lstResidentWithFile = [];
                for (var i = 0; i < arryInterventions_Resident_Answers.length; i++) {
                    var objResidentWithFile = {};
                    objResidentWithFile.ResidentQuestionAnswer = arryInterventions_Resident_Answers[i];
                    objResidentWithFile.ResidentFile = null;
                    lstResidentWithFile.push(objResidentWithFile);
                }
                GetAssessmentData(lstResidentWithFile);
            }

        };

        function GetAssessmentData(objAssessmentData) {
            var lstAssessmentData = objAssessmentData;

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
                                vm.Sections[i].Intervention_Question[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;

                                var filename = lstAssessmentData[k].ResidentFile.split('/');
                                vm.Sections[i].Intervention_Question[j].ChosenFileName = filename[5];
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
                                    //if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {
                                    //    vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    //}
                                }
                                //vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                //vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

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
                                    answers[i].childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;

                                    var filename = lstAssessmentData[k].ResidentFile.split('/');
                                    answers[i].childQuestion[j].ChosenFileName = filename[5];
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





        //newly Added Start 4/5/2016 11:55 am

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
                            answers.childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;

                            var filename = lstAssessmentData[k].ResidentFile.split('/');
                            answers.childQuestion[j].ChosenFileName = filename[5];
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
                        arrySection_Questions_Answers_Tasks[i].Section_Intervention = arrySection_Intervention[j];
                    }
                }
            }

            for (var i = 0; i < arrySection_Questions_Answers_Tasks.length; i++) {
                for (var j = 0; j < arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions.length; j++) {
                    arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].Actions_Days = [];
                    for (var k = 0; k < arryActions_Days.length; k++) {
                        if (arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].ID == arryActions_Days[k].ActionID) {
                            arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].Actions_Days.push(arryActions_Days[k]);
                        }
                    }
                }
                for (var j = 0; j < arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question.length; j++) {
                    arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question[j].Intervention_Question_Answer = [];
                    for (var k = 0; k < arryIntervention_Question_Answer.length; k++) {
                        if (arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question[j].ID == arryIntervention_Question_Answer[k].Intervention_QuestionID) {
                            arrySection_Questions_Answers_Tasks[i].Section_Intervention.Intervention_Question[j].Intervention_Question_Answer.push(arryIntervention_Question_Answer[k]);
                        }
                    }
                }
            }

            for (var i = 0; i < arrySection_Questions_Answers_Tasks.length; i++) {
                for (var j = 0; j < arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions.length; j++) {
                    for (var k = 0; k < arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].Actions_Days.length; k++) {
                        arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].Actions_Days[k].Intervention = [];
                        for (var l = 0; l < arryInterventions.length; l++) {
                            if (arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].Actions_Days[k].ID == arryInterventions[l].Action_DayID) {
                                arrySection_Questions_Answers_Tasks[i].Section_Intervention.Actions[j].Actions_Days[k].Intervention.push(arryInterventions[l]);
                            }
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


            for (var i = 0; i < SectionQuestionAnserTaskGroupByIntervention.length; i++) {
                var score = 0;
                var hasScore = false;
                var objIntervention;
                for (var j = 0; j < lstResidentAnsweredQuestions.length; j++) {
                    if (lstResidentAnsweredQuestions[j].Section_QuestionID == SectionQuestionAnserTaskGroupByIntervention[i].Section_QuestionID) {
                        hasScore = true;
                        score += parseInt(lstResidentAnsweredQuestions[j].Score);
                    }
                    objIntervention = SectionQuestionAnserTaskGroupByIntervention[i].Section_Intervention;
                }
                if (hasScore) {
                    if (objIntervention.MinScore <= score && (objIntervention.MaxScore >= score || objIntervention.MaxScore == null))
                        GetlstResidentSectionQuestionAnsTask.push(objIntervention);
                }
            }




            var DistinctListSectionIntervention = [];
            var Distinctitems = [];

            for (var i = 0; i < GetlstResidentSectionQuestionAnsTask.length; i++) {
                var doesListSection_InterventionIDExist = false;
                for (var j = 0; j < DistinctListSectionIntervention.length; j++) {
                    if (DistinctListSectionIntervention[j].ID == GetlstResidentSectionQuestionAnsTask[i].ID) {
                        doesListSection_InterventionIDExist = true;
                        break;
                    }
                }
                if (!doesListSection_InterventionIDExist)
                    DistinctListSectionIntervention.push(GetlstResidentSectionQuestionAnsTask[i]);
            }
            for (var i = 0; i < DistinctListSectionIntervention.length; i++) {
                if (DistinctListSectionIntervention[i].ID == SectionInterventionID) {
                    Distinctitems.push(DistinctListSectionIntervention[i]);
                }
            }

            GetAllActiveSectionWRTOnlineOffline(Distinctitems);
        }//method end




        var GetAllActiveSectionWRTOnlineOffline = function (objIntervention) {


            if (objIntervention.length > 0) {
                //Code To Display Question 
                vm.Sections = objIntervention;
                vm.CopyallSectionsQuestion = objIntervention;
                vm.MainQuestion = [];
                vm.SubQuestion = [];
                vm.AllSection = [];


                //To get All Section
                for (var x = 0; x < objIntervention.length; x++) {

                    vm.AllSection.push(objIntervention[x]);
                }

                for (var p = 0; p < objIntervention.length; p++) {

                    for (var q = 0; q < objIntervention[p].Intervention_Question.length; q++) {
                        var z = 0;
                        for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {


                            if (vm.QuestionParentQuestion[r].InterventionQuestionID == objIntervention[p].Intervention_Question[q].ID) {
                                z++;
                            }



                        }

                        if (z == 0) {
                            if (objIntervention[p].Intervention_Question[q].IsInAssessment == false || objIntervention[p].Intervention_Question[q].IsInAssessment == "false")
                                vm.MainQuestion.push(objIntervention[p].Intervention_Question[q]);

                        }
                        else {
                            if (objIntervention[p].Intervention_Question[q].IsInAssessment == false || objIntervention[p].Intervention_Question[q].IsInAssessment == "false")
                                vm.SubQuestion.push(objIntervention[p].Intervention_Question[q]);
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
                                    SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
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

                //vm.CarePlan = [];
                for (var i = 0; i < vm.Sections.length; i++) {


                    var objCarePlan = {};
                    objCarePlan.TaskTitle = vm.Sections[i].InterventionTitle;
                    objCarePlan.Section_Question_Answer_TaskID = vm.Sections[i].ID;
                    objCarePlan.QuestionIntervention = vm.Sections[i].Intervention_Question;
                    objCarePlan.IsRecurrencePatternShown = false;
                    if (SectionInterventionID == vm.Sections[i].ID) {


                        vm.CarePlan.push(objCarePlan);

                    }


                }
            }


        }


        var LoadOffline = function () {

        }






    }

}());