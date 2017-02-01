(function () {
    // "use strict";

    angular.module('CHM').controller('ViewCarePlanController', ViewCarePlanController);

    ViewCarePlanController.$inject = ['$rootScope', '$q', '$uibModal', '$window', '$filter', '$stateParams', '$sce', 'toastr', 'ResidentsService', 'InterventionsService', '$scope', 'onlineStatus', 'CommonService', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout'];

    function ViewCarePlanController($rootScope, $q, $uibModal, $window, $filter, $stateParams, $sce, toastr, ResidentsService, InterventionsService, $scope, onlineStatus, CommonService, $cordovaFileTransfer, $cordovaFileOpener2, $timeout) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.Resident = {};
        vm.CarePlan = [];
        var oldRecurrencePattern = {};



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


        //Recurrence Pattern

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

        $scope.onlineStatus = onlineStatus;


        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.ResidentId = $stateParams.ResidentId;
            vm.Resident = {};
            vm.CarePlan = [];
            var oldRecurrencePattern = {};

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
                        console.log('err');
                    }
                );
                }
                GetInterventionByID_Offline();
            }

        });


        var SetRecurrencePattern = function (objCarePlan) {
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

        var SetRecurrenceRange = function (objCarePlan) {
            objCarePlan.Recurrence.NoOfOccurrences = 10;
            objCarePlan.Recurrence.RecurrenceStartDate = new Date(moment());//.format($rootScope.DateFormatForMoment);
            objCarePlan.Recurrence.RecurrenceEndDate = new Date(moment().add(10, 'day'));//.format($rootScope.DateFormatForMoment);
        };

        var GetDateForWeekDay = function (desiredDay, occurrence, month, year) {

            var dt = moment(new Date(year, month, 1));
            var j = 0;
            if (desiredDay - dt.day() >= 0)
                j = desiredDay - dt.day() + 1;
            else
                j = 7 - dt.day() + desiredDay + 1;

            var date = j + (occurrence - 1) * 7;
            if (!isValidDate(date, month, year))
                date = j + (occurrence - 2) * 7;;

            return date;

        }

        var isValidDate = function (date, month, year) {
            var d = new Date(year, month, date);
            return d && d.getMonth() == month && d.getDate() == date;
        }

        vm.ToggleWeekDaySelection = function (objCarePlan, weekDay) {
            var idx = objCarePlan.Recurrence.SelectedWeekDays.indexOf(weekDay);

            // is currently selected
            if (idx > -1) {
                objCarePlan.Recurrence.SelectedWeekDays.splice(idx, 1);
                objCarePlan.Recurrence.SelectedWeekDayTimings.splice(idx, 1);
            }
            else {
                objCarePlan.Recurrence.SelectedWeekDays.push(weekDay);
                objCarePlan.Recurrence.SelectedWeekDayTimings.push([{ StartTime: new Date(), EndTime: new Date() }]);
            }

        };

        vm.OpenRecurrencePattern = function (objCarePlan) {
            oldRecurrencePattern = angular.copy(objCarePlan.Recurrence);
            objCarePlan.IsRecurrencePatternShown = true;
        };

        vm.CloseRecurrencePattern = function (objCarePlan) {
            objCarePlan.IsRecurrencePatternShown = false;
            objCarePlan.Recurrence = angular.copy(oldRecurrencePattern);
            oldRecurrencePattern = {};
        };

        vm.SaveRecurrencePattern = function (objCarePlan) {
            objCarePlan.IsRecurrencePatternShown = false;
            oldRecurrencePattern = {};
        };

        vm.AddTiming = function (objCarePlan) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objCarePlan.Recurrence.Timings.push(objTiming);
        };

        vm.RemoveTiming = function (objCarePlan, $index) {
            objCarePlan.Recurrence.Timings.splice($index, 1);
        }

        vm.AddWeekDayTiming = function (objWeekDayTimings) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objWeekDayTimings.push(objTiming);
        };

        vm.RemoveWeekDayTiming = function (objWeekDayTimings, $index) {
            objWeekDayTimings.splice($index, 1);
        }

        vm.OpenRecurrenceStartDate = function (objCarePlan, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objCarePlan.Recurrence.RecurrenceStartDateOpened = true;
        }
        vm.OpenRecurrenceEndDate = function (objCarePlan, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objCarePlan.Recurrence.RecurrenceEndDateOpened = true;
        }

        //End - Recurrence Pattern


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


        //code for view mode in care plan start

        function InterventionQuestionParentQuestion() {
            ResidentsService.InterventionQuestionParentQuestion().then(
        function (response) {
            vm.QuestionParentQuestion = response.data;
            vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
            GetAllActiveSection();
        },
         function (err) {
             toastr.error('An error occurred while retrieving QuestionParentQuestion.');
         })
        }


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
                if (arryIntervention_Question_Answer_Task[i].Section_Intervention.length == 0) {

                } else {
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
                vm.InterventionCarePlan.push(objCarePlan);
            }

        }//func ends

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

        var GetAssessmentAnswers = function () {
            if ($scope.online) {
                ResidentsService.getInterventionAssessmentData(vm.ResidentId).then(
                  function (response) {
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
                    var lstresidentdata = { ResidentFile: null, ResidentQuestionAnswer: [], FilePath: '' };
                    lstresidentdata.ResidentQuestionAnswer = arryResident_Interventions_Questions_Answers[i];
                    for (var j = 0; j < arryInterventionResidentAnswerDocuments.length; j++) {
                        if (arryInterventionResidentAnswerDocuments[j].ID == arryResident_Interventions_Questions_Answers[i].ID) {
                            lstresidentdata.ResidentFile = arryInterventionResidentAnswerDocuments[j].FileName;
                            lstresidentdata.FilePath = arryInterventionResidentAnswerDocuments[j].ResidentFile;
                            break;
                        }
                    }
                    lstResidentWithFile.push(lstresidentdata);
                }
                GetAssessmentData(lstResidentWithFile);
            }
        };

        function GetAssessmentData(AssessmentData) {
            var lstAssessmentData = AssessmentData;

            for (var i = 0; i < vm.Sections.length; i++) {
                for (var j = 0; j < vm.Sections[i].Intervention_Question.length; j++) {
                    vm.Sections[i].Intervention_Question[j].AnswerText = '-';


                    if (!vm.Sections[i].Intervention_Question[j].MulChosenAnswerID)
                        vm.Sections[i].Intervention_Question[j].MulChosenAnswerID = [];


                    if (!vm.Sections[i].Intervention_Question[j].SumofScores)
                        vm.Sections[i].Intervention_Question[j].SumofScores = 0;



                    if (vm.Sections[i].Intervention_Question[j].AnswerType == 'CheckBoxList') {
                        vm.Sections[i].Intervention_Question[j].ChosenAnswerID = null;
                        for (var m = 0; m < lstAssessmentData.length; m++) {

                            if (vm.Sections[i].Intervention_Question[j].ID == lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {

                                var checkboxAnsTxt = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                if (checkboxAnsTxt.toUpperCase() == 'OTHER') {
                                    checkboxAnsTxt = lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                }
                                //else {
                                //    if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null)
                                //        checkboxAnsTxt += ',' + lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                //}


                                vm.Sections[i].Intervention_Question[j].AnswerText += checkboxAnsTxt + ",";
                                vm.Sections[i].Intervention_Question[j].MulChosenAnswerID.push(lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_AnswerID);
                                vm.Sections[i].Intervention_Question[j].SumofScores += $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;
                                if (vm.Sections[i].Intervention_Question[j].Question == "Falls") {
                                    if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null) {
                                        vm.Sections[i].Intervention_Question[j].SumofScores += parseInt(lstAssessmentData[m].ResidentQuestionAnswer.AnswerText) * 5;

                                    }
                                }

                            }
                        }
                        if (vm.Sections[i].Intervention_Question[j].MinScore == null)
                            ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);
                        else
                            ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);
                    }
                    else {
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (vm.Sections[i].Intervention_Question[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                vm.Sections[i].Intervention_Question[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                vm.Sections[i].Intervention_Question[j].AnswerText = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                    vm.Sections[i].Intervention_Question[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                }

                                if (vm.Sections[i].Intervention_Question[j].AnswerType == 'RadioButtonList') {
                                    vm.Sections[i].Intervention_Question[j].SumofScores = $filter('filter')(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;
                                }

                                if (lstAssessmentData[k].ResidentFile != null) {
                                    if (vm.online) {
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        vm.Sections[i].Intervention_Question[j].AnswerText = filename[5];
                                    }
                                    else {
                                        vm.Sections[i].Intervention_Question[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                        vm.Sections[i].Intervention_Question[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                    }
                                }
                                if (vm.Sections[i].Intervention_Question[j].MinScore == null)
                                    ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question[j].Intervention_Question_Answer, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);
                                else
                                    ViewSubQuestionsAndAnswers(vm.Sections[i].Intervention_Question, lstAssessmentData, vm.Sections[i].Intervention_Question[j].AnswerText);

                            }
                        }
                    }
                }
            }
        }


        var ViewSubQuestionsAndAnswers = function (answers, lstAssessmentData, AnswerText) {
            for (var i = 0; i < answers.length; i++) {
                for (var j = 0; j < answers[i].childQuestion.length; j++) {
                    if (!answers[i].childQuestion[j].MulChosenAnswerID)
                        answers[i].childQuestion[j].MulChosenAnswerID = [];
                    if (!answers[i].childQuestion[j].SumofScores)
                        answers[i].childQuestion[j].SumofScores = 0;

                    if (AnswerText != '-')
                        answers[i].childQuestion[j].AnswerText = '-';
                    else
                        answers[i].childQuestion[j].AnswerText = false;
                    for (var k = 0; k < lstAssessmentData.length; k++) {

                        if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {

                            answers[i].childQuestion[j].ChosenAnswerID = null;
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {

                                if (answers[i].childQuestion[j].AnswerText == '-') {
                                    answers[i].childQuestion[j].AnswerText = " ";
                                }
                                var checkboxAnsTxt = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                if (checkboxAnsTxt.toUpperCase() == 'OTHER') {
                                    checkboxAnsTxt = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                }

                                answers[i].childQuestion[j].AnswerText += checkboxAnsTxt + ",";
                                answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Intervention_QuestionID);
                                answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Intervention_Question_Answer.Score;

                            }

                            if (answers[i].childQuestion[j].MinScore == null) {
                                ViewSubQuestionsAndAnswers(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                            }
                            else {
                                //ViewSubchildQuestionAndAnswers(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                ViewSubQuestionsAndAnswers(answers[i].childQuestion, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                            }
                        }
                        else {
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_Answer.Intervention_QuestionID) {
                                answers[i].childQuestion[j].AnswerText = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].LabelText;
                                answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID;
                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                    answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                }


                                if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                    answers[i].childQuestion[j].SumofScores = $filter('filter')(answers[i].childQuestion[j].Intervention_Question_Answer, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Intervention_Question_AnswerID })[0].Score;
                                }

                                if (lstAssessmentData[k].ResidentFile != null) {
                                    if (vm.online) {
                                        answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        answers[i].childQuestion[j].AnswerText = filename[5];
                                    } else {
                                        answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                        answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                    }

                                }

                                if (answers[i].childQuestion[j].MinScore == null) {
                                    ViewSubQuestionsAndAnswers(answers[i].childQuestion[j].Intervention_Question_Answer, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                }
                                else {
                                    //ViewSubchildQuestionAndAnswers(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                    ViewSubQuestionsAndAnswers(answers[i].childQuestion, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                }


                            }
                        }

                    }
                }

            }
        }
        //End








        //var uniquevalfirst = function (arr) {
        //    var newarr = [];
        //    var unique = {};
        //    arr.forEach(function (item, index) {
        //        if (!unique[item.ID]) {
        //            newarr.push(item);
        //            unique[item.ID] = item;
        //        }
        //    });

        //    return newarr;

        //}

        //var GetAssessmentSummary = function () {
        //    ResidentsService.getAssessmentSummaryOnScores(vm.ResidentId).then(
        //    function (response) {
        //        vm.SectionIDs = uniquevalfirst(response.data.SectionInterventionSection);
        //        var GroupSection = [];
        //        for (var m = 0; m < vm.SectionIDs.length; m++) {
        //            var arrsection = { sectionID: "",sectionName:"", sectionIntervention: [] };
        //            for (var z = 0; z < response.data.SectionInterventionSection.length; z++) {
        //                if(vm.SectionIDs[m].ID==response.data.SectionInterventionSection[z].ID)
        //                {
        //                    arrsection.sectionID = vm.SectionIDs[m].ID;
        //                    arrsection.sectionName=response.data.SectionInterventionSection[z].sectionName;
        //                    arrsection.sectionIntervention.push(response.data.SectionInterventionSection[z].section_InterventionID);
        //                }
        //            }
        //            GroupSection.push(arrsection);
        //        }

        //        //code Start



        //        //code End

        //        vm.CarePlan = [];
        //        for (var i = 0; i < response.data.SectionInterventionResponse.length; i++) {


        //            var objCarePlan = {};
        //            objCarePlan.Id=response.data.SectionInterventionResponse[i].ID;
        //            objCarePlan.TaskTitle = response.data.SectionInterventionResponse[i].InterventionTitle;
        //            // objCarePlan.Resident_Question_AnswerID = response.data[i].ID;
        //            objCarePlan.IsRecurrencePatternShown = false;
        //            SetRecurrencePattern(objCarePlan);
        //            SetRecurrenceRange(objCarePlan);
        //            vm.CarePlan.push(objCarePlan);



        //        }

        //        vm.SectionCareplan = [];
        //        if(vm.CarePlan.length>0)
        //        {

        //            for (var i = 0; i < GroupSection.length; i++) {
        //                var arrsection = { sectionName: "", careplan: [] };
        //                arrsection.sectionName = GroupSection[i].sectionName;
        //                for (var m = 0; m < GroupSection[i].sectionIntervention.length; m++) {

        //                    for (var j = 0; j < vm.CarePlan.length; j++) {
        //                        if (GroupSection[i].sectionIntervention[m] == vm.CarePlan[j].Id) {
        //                            arrsection.careplan.push(vm.CarePlan[j]);
        //                        }

        //                    }

        //                }


        //               // vm.SectionCareplan.push(arrsection);
        //            }

        //        }
        //        console.log(vm.SectionCareplan);
        //    },
        //    function (err) {
        //        toastr.error('An error occurred while retrieving task titles.');
        //    }
        //);
        //}

        //  GetAssessmentSummary();



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
            else {
                var parentQuestionId = [];

                for (var k = 0; k < vm.AllQuestionParentQuestion.length; k++) {
                    if (vm.AllQuestionParentQuestion[k].QuestionID == obj.ID) {
                        parentQuestionId.push(vm.AllQuestionParentQuestion[k].QuestionID);
                    }
                }
                if (obj.AnswerText == undefined) {
                    return false;
                }
                else {
                    if (obj.AnswerText != '-')
                        return true;
                    else
                        return false;
                }

            }
            if (SumofScoresofAllQuestion > 0) {
                return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
            }
            else {
                return false;
            }

            //End
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
                for (var j = 0; j < lstResidentAnsweredQuestions.length; j++) {
                    //if(arrySection_Questions_Answers_Tasks[i].Section_QuestionID == lstResidentAnsweredQuestions[j].Section_QuestionID){

                    if (arrySection_Questions_Answers_Tasks[i].Section_Question_AnswerID == null) {

                        lstSectionQuestionAnswerHasNoParentAnswerID.push(arrySection_Questions_Answers_Tasks[i]);
                        //console.log(lstSectionQuestionAnswerHasNoParentAnswerID.length);
                    }

                    else {
                        lstSectionQuestionAnswerHasParentAnswerID.push(arrySection_Questions_Answers_Tasks[i]);
                    }
                    //}
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


                            //console.log('step4 complete');
                            //console.log(vm.AllSetQuestion);

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
                // console.log(vm.SectionCareplan);
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