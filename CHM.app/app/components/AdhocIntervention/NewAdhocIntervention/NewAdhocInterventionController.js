(function () {
    //"use strict";

    angular.module('CHM').controller('NewAdhocInterventionController', NewAdhocInterventionController);

    NewAdhocInterventionController.$inject = ['$scope', '$rootScope', '$q', '$window', '$uibModalInstance', '$filter', '$location', '$cordovaFile', 'toastr', 'residentId', 'ResidentsService', 'InterventionsService', 'onlineStatus', 'CommonService', '$state'];

    function NewAdhocInterventionController($scope, $rootScope, $q, $window, $uibModalInstance, $filter, $location, $cordovaFile, toastr, residentId, ResidentsService, InterventionsService, onlineStatus, CommonService, $state) {
        var vm = this;
        vm.Title = residentId;
        var lstActions = [];

        //////////////////////////////
        var arrResidents = [];
        var arrSection_Interventions = [];

        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var renderResidents = function (tx, rs) {
            arrResidents = [];
            vm.Residents = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrResidents.push(rs.rows.item(i));
                vm.Residents.push(rs.rows.item(i));
            }
        };

        var GetResidentsOnOnlineCondition = function () {

            if ($scope.online == true) {
                //Binding Residents DropDown
                ResidentsService.getActiveResidentsByOrganizationID($rootScope.OrganizationId).then(
                    function (response) {
                        vm.AllResidents = response.data;
                        vm.Residents = [];
                        for (var i = 0; i < vm.AllResidents.length; i++) {
                            if (vm.AllResidents[i].Resident.IsAccepted) {
                                vm.Residents.push(vm.AllResidents[i].Resident);
                            }
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



        var renderSection_Interventions = function (tx, rs) {
            arrSection_Interventions = [];
            vm.sectionIntervention = [];
            for (var i = 0; i < rs.rows.length; i++) {
                arrSection_Interventions.push(rs.rows.item(i));
                vm.sectionIntervention.push(rs.rows.item(i));
            }
        };




        var GetSection_InterventionsOnOnlineCondition = function () {

            if ($scope.online == true) {
                //Get Section Intervention
                ResidentsService.GetActiveSectionIntervention().then(
                    function (response) {
                        vm.sectionIntervention = response.data;

                    }, function (err) {

                    })

            }
            else {
                app.GetOfflineSection_Interventions(renderSection_Interventions);

            }
        };

        GetSection_InterventionsOnOnlineCondition();

        $scope.onlineStatus = onlineStatus;
        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            $state.go('AdhocIntervention', { reload: true });
            vm.online = $scope.online;
            GetResidentsOnOnlineCondition();
            GetSection_InterventionsOnOnlineCondition();

        });

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

        var objCarePlan = {};

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
        ResetRecurrencePattern(objCarePlan);
        ResetRecurrenceRange(objCarePlan);
        vm.Recurrence = objCarePlan.Recurrence;

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

        vm.ToggleWeekDaySelection = function (objRecurrence, weekDay) {
            var idx = objRecurrence.SelectedWeekDays.indexOf(weekDay);

            // is currently selected
            if (idx > -1) {
                objRecurrence.SelectedWeekDays.splice(idx, 1);
                objRecurrence.SelectedWeekDayTimings.splice(idx, 1);
            }
            else {
                objRecurrence.SelectedWeekDays.push(weekDay);
                objRecurrence.SelectedWeekDayTimings.push([{ StartTime: new Date(), EndTime: new Date() }]);
            }

        };

        vm.CloseRecurrencePattern = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.SaveRecurrencePattern = function () {
            vm.OkButton = true;
            vm.Recurrence.Section_InterventionID = vm.sectionInterventionID;
            vm.Recurrence.ResidentID = vm.ResidentIDs;
            if (vm.InterventionFile != undefined) {
                vm.Recurrence.FileData = vm.InterventionFile.file;
            }
            saveAdhocIntervention(vm.Recurrence);
            //$uibModalInstance.close(vm.Recurrence);
            //$location.path('/AdhocIntervention');

        };

        vm.AddTiming = function (objRecurrence) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objRecurrence.Timings.push(objTiming);
        };

        vm.RemoveTiming = function (objRecurrence, $index) {
            objRecurrence.Timings.splice($index, 1);
        }

        vm.AddWeekDayTiming = function (objWeekDayTimings) {
            var objTiming = { StartTime: new Date(), EndTime: new Date() };
            objWeekDayTimings.push(objTiming);
        };

        vm.RemoveWeekDayTiming = function (objWeekDayTimings, $index) {
            objWeekDayTimings.splice($index, 1);
        }

        vm.OpenRecurrenceStartDate = function (objRecurrence, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objRecurrence.RecurrenceStartDateOpened = true;
        }

        vm.OpenRecurrenceEndDate = function (objRecurrence, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            objRecurrence.RecurrenceEndDateOpened = true;
        }

        //End - Recurrence Pattern


        function saveOfflineAdhocIntervention() {
            vm.OkButton = true;
            //first loop
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
                    var targetEndDate = new Date(0);
                    var DummyDate = new Date();
                    var maxOccurrences = 0;

                    if (lstActions[i].EndDate == null && lstActions[i].Occurrences == null) {

                        targetEndDate = DummyDate.addDays(30);
                    }
                    else if (lstActions[i].EndDate != null) {
                        targetEndDate = lstActions[i].EndDate;
                    }
                    else {
                        maxOccurrences = lstActions[i].Occurrences;
                    }

                    arrInterventions = [];
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


                            if (lstActions[i].EndDate != null) {
                                //if (objIntervention.PlannedStartDate >= targetEndDate)
                                if (new Date(dt) >= targetEndDate)
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
                            //if (DayNumberofSelectedWeek == 0) {
                            //    DayNumberofSelectedWeek = 7;
                            //}
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



                            if (lstActions[i].EndDate != null) {
                                //if (objIntervention.PlannedStartDate >= targetEndDate)
                                if (new Date(dt) >= targetEndDate)
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



                            if (lstActions[i].EndDate != null) {
                                //if (objIntervention.PlannedStartDate >= targetEndDate)
                                if (new Date(dt) >= targetEndDate)
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
                            var n = weekday[lstActions[i].Actions_Days[j].Day];
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


                            if (lstActions[i].EndDate != null) {
                                //if (objIntervention.PlannedStartDate >= targetEndDate)
                                if (new Date(dt) >= targetEndDate)
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
                            if (lstActions[i].Actions_Days[j].Date < lstActions[i].StartDate.getDay()) {
                                dt = moment(new Date((lstActions[i].StartDate.getFullYear() + 1), (lstActions[i].StartDate.getMonth() + 1), lstActions[i].Actions_Days[j].Date)).add(k, 'years');
                            }
                            else {
                                dt = moment(new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].StartDate.getMonth() + 1), lstActions[i].Actions_Days[j].Date)).add(k, 'years');
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



                            if (lstActions[i].EndDate != null) {
                                //if (objIntervention.PlannedStartDate >= targetEndDate)
                                if (new Date(dt) >= targetEndDate)
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
                            var n = weekday[lstActions[i].Actions_Days[j].Day];
                            var currentYearDate = GetDateForWeekDay(n, lstActions[i].Instance, (lstActions[i].Month + 1), lstActions[i].StartDate.getFullYear());

                            if ((new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].Month + 1), currentYearDate)).getDay() < lstActions[i].StartDate.getDay()) {
                                dtTemp = moment(new Date(lstActions[i].StartDate.getFullYear() + 1, objAction.getMonth() + 1, 1)).add(k, 'years');
                            }
                            else {
                                dtTemp = moment(new Date(lstActions[i].StartDate.getFullYear(), (lstActions[i].Month + 1), 1)).add(k, 'years');
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

                            if (lstActions[i].EndDate != null) {
                                //if (objIntervention.PlannedStartDate >= targetEndDate)
                                if (new Date(dt) >= targetEndDate)
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

            var objnew = {};
            for (var i = 0; i < lstActions.length; i++) {

                objnew.ID = lstActions[i].ID;
                objnew.ResidentID = lstActions[i].ResidentID;
                objnew.Section_InterventionID = lstActions[i].Section_InterventionID;
                objnew.StartDate = moment(lstActions[i].StartDate).format('YYYY-MM-DDTHH:mm:ss');
                objnew.Occurrences = lstActions[i].Occurrences;
                objnew.Type = lstActions[i].Type;
                objnew.Interval = lstActions[i].Interval;
                objnew.Created = lstActions[i].Created;
                objnew.CreatedBy = lstActions[i].CreatedBy;
                objnew.Modified = lstActions[i].Modified;
                objnew.ModifiedBy = lstActions[i].ModifiedBy;

                for (var j = 0; j < lstActions[i].Actions_Days.length; j++) {
                    objnew.Action_DaysID = lstActions[i].Actions_Days[j].ID;
                    objnew.Action_DaysAction_ID = objnew.ID
                    objnew.Action_DaysStartTime = lstActions[i].Actions_Days[j].StartTime;
                    objnew.Action_DaysEndTime = lstActions[i].Actions_Days[j].EndTime;
                    objnew.Action_DaysCreated = lstActions[i].Actions_Days[j].Created;
                    objnew.Action_DaysCreatedBy = lstActions[i].Actions_Days[j].CreatedBy;
                    objnew.Action_DaysModified = lstActions[i].Actions_Days[j].Modified;
                    objnew.Action_DaysModifiedBy = lstActions[i].Actions_Days[j].ModifiedBy;
                }
                app.InsertNewadhocIntervention(objnew);
                var newobj = {};
                for (var k = 0; k < arrInterventions.length; k++) {
                    newobj = {};
                    newobj.InterventionsID = arrInterventions[k].ID;
                    newobj.InterventionsAction_DayID = arrInterventions[k].Action_DayID;
                    newobj.InterventionsPlannedStartDate = arrInterventions[k].PlannedStartDate;
                    newobj.InterventionsPlannedEndDate = arrInterventions[k].PlannedEndDate;
                    newobj.InterventionsIsActive = true;
                    newobj.InterventionsCreated = arrInterventions[k].Created;
                    newobj.InterventionsCreatedBy = arrInterventions[k].CreatedBy;
                    newobj.InterventionsModified = arrInterventions[k].Modified;
                    newobj.InterventionsModifiedBy = arrInterventions[k].ModifiedBy;

                    app.InsertNewReccurencePattern(newobj);
                }

                //Code For Upload Documents in Offline               
                var differdArr = [];
                var lstAdhocInterventionDocuments = [];


                lstActions.forEach(function (objDocument, ij) {
                    var differdArrdifferdArr = $q.defer();
                    differdArr.push(differdArrdifferdArr.promise);

                    var folderpath = $rootScope.Path + 'residentsAdhocInterventionDocuments';                  
                    $cordovaFile.writeFile(folderpath, objDocument.FileData.name, objDocument.FileData, true).then(function (success) {                     
                        var objFile = {};
                        objFile.ID = objDocument.ID;
                        objFile.FileName = objDocument.FileData.name;
                        objFile.ResidentFile = folderpath + '/', objDocument.FileData.name;
                        objFile.IsActive = true;
                        objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                        objFile.CreatedBy = $rootScope.UserInfo.UserID;
                        objFile.Modified = null;
                        objFile.ModifiedBy = null;
                        objFile.IsSyncnised = false;
                        objFile.IsCreated = true;
                        lstAdhocInterventionDocuments.push(objFile);
                        differdArrdifferdArr.resolve();
                    }, function (error) {
                        if (error.code == 6) {                       
                            var objFile = {};                                                    
                            objFile.ID = objDocument.ID;
                            objFile.FileName = objDocument.FileData.name;                       
                            objFile.ResidentFile = folderpath + '/', objDocument.FileData.name;                           
                            objFile.IsActive = true;
                            objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                            objFile.CreatedBy = $rootScope.UserInfo.UserID;
                            objFile.Modified = null;
                            objFile.ModifiedBy = null;
                            objFile.IsSyncnised = false;
                            objFile.IsCreated = true;                           
                            lstAdhocInterventionDocuments.push(objFile);
                            differdArrdifferdArr.resolve();                    
                        }
                        else {
                            differdArrdifferdArr.reject(error);
                        
                        }
                    });
                    $q.all(differdArr).then(function (response) {                      
                        CommonService.insertResidentAdhocInterventionDocuments(app.db, lstAdhocInterventionDocuments).then(function (response) {
                        
                            toastr.success('Interventions generated successfully.');
                            vm.OkButton = false;
                            $uibModalInstance.close(vm.Recurrence);
                            $state.go('AdhocIntervention');
                        },
                        function (err) {
                            console.log(err);
                            toastr.error(err);
                        });
                    },
                    function (err) {
                        toastr.error(err);
                      
                    });
                });
            }
        }

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
            var dtSat = new Date(Year, (Month - 1), 1);
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
            var dt = new Date(year, (month - 1), date);
            return (dt.getMonth() + 1) === month && dt.getDate() === date;
        }


        var saveAdhocIntervention = function (objCareplan) {

            vm.DisableGenerateTask = true;

            var objAction = {};
            objAction.ResidentID = vm.ResidentIDs;
            // objAction.Resident_Question_AnswerID = vm.CarePlan[i].Resident_Question_AnswerID;
            objAction.Section_InterventionID = objCareplan.Section_InterventionID;
            objAction.StartDate = new Date(objCareplan.RecurrenceStartDate);
            objAction.FileData = objCareplan.FileData;
            objAction.EndDate = null;
            objAction.Occurrences = null;
            objAction.Actions_Days = [];

            switch (objCareplan.RecurrenceRange) {
                case 'NoOfOccurrences':
                    objAction.Occurrences = objCareplan.NoOfOccurrences;
                    break;
                case 'RecurrenceEndDate':
                    objAction.EndDate = new Date(objCareplan.RecurrenceEndDate);
                    break;
            }

            if (objCareplan.RecurrenceType == 'Daily') {
                objAction.Type = 'Daily';
                objAction.Interval = objCareplan.RecurrenceInterval;

                for (var j = 0; j < objCareplan.Timings.length; j++) {
                    var objAction_Day = {};
                    objAction_Day.Day = null;
                    objAction_Day.Date = null;
                    objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');
                    objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                    objAction_Day.Specifications = null;

                    objAction.Actions_Days.push(objAction_Day);
                }

            }
            else if (objCareplan.RecurrenceType == 'Weekly') {
                objAction.Type = 'Weekly';
                objAction.Interval = objCareplan.RecurrenceInterval;
                objAction.RecurrenceDay = objCareplan.SelectedWeekDays.toString();

                for (var j = 0; j < objCareplan.SelectedWeekDays.length; j++) {
                    for (var k = 0; k < objCareplan.SelectedWeekDayTimings[j].length; k++) {
                        var objAction_Day = {};
                        objAction_Day.Day = objCareplan.SelectedWeekDays[j];
                        objAction_Day.Date = null;
                        objAction_Day.StartTime = moment(objCareplan.SelectedWeekDayTimings[j][k].StartTime).format('HH:mm:ss');
                        objAction_Day.EndTime = moment(objCareplan.SelectedWeekDayTimings[j][k].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }
                }

            }
            else if (objCareplan.RecurrenceType == 'Monthly') {
                if (objCareplan.MonthlyPattern == 'Date') {
                    objAction.Type = 'Monthly';
                    objAction.Interval = objCareplan.RecurrenceInterval;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = null;
                        objAction_Day.Date = objCareplan.RecurrenceDate;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }

                }
                else {
                    objAction.Type = 'MonthlyNth';
                    objAction.Interval = objCareplan.RecurrenceInterval;
                    objAction.Instance = objCareplan.Instance;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = objCareplan.RecurrenceDay;
                        objAction_Day.Date = null;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }
                }
            }
            else {
                if (objCareplan.YearlyPattern == 'Date') {
                    objAction.Type = 'Yearly';
                    objAction.Month = objCareplan.RecurrenceMonth;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = null;
                        objAction_Day.Date = objCareplan.RecurrenceDate;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }

                }
                else {
                    objAction.Type = 'YearlyNth';
                    objAction.Month = objCareplan.RecurrenceMonth;
                    objAction.Instance = objCareplan.Instance;

                    for (var j = 0; j < objCareplan.Timings.length; j++) {
                        var objAction_Day = {};
                        objAction_Day.Day = objCareplan.RecurrenceDay;
                        objAction_Day.Date = null;
                        objAction_Day.StartTime = moment(objCareplan.Timings[j].StartTime).format('HH:mm:ss');;
                        objAction_Day.EndTime = moment(objCareplan.Timings[j].EndTime).format('HH:mm:ss');
                        objAction_Day.Specifications = null;

                        objAction.Actions_Days.push(objAction_Day);
                    }
                }

            }

            lstActions.push(objAction);

            if (lstActions.length > 0) {
                if ($scope.online == true) {
                    InterventionsService.GenerateAdhocInterventions(objAction.ResidentID, lstActions).then(function (response) {
                   
                        toastr.success('Interventions generated successfully.');

                        if (response.data[0].Files.length > 0) {
                            for (var k = 0; k < response.data[0].Files.length; k++) {
                                var newobj = {};
                                var differdArr = [];
                                var differdArrdifferdArr = $q.defer();
                                differdArr.push(differdArrdifferdArr.promise);
                                var lstAdhocInterventionDocuments = [];
                                var folderpath = $rootScope.Path + 'residentsAdhocInterventionDocuments';

                                $cordovaFile.writeFile(folderpath, response.data[0].Files[k].fileName, vm.Recurrence.FileData, true).then(function (success) {

                                    var objFile = {};
                                    objFile.ID = response.data[0].Files[0].ID;
                                    objFile.FileName = response.data[0].Files[0].fileName;
                                    objFile.ResidentFile = folderpath + '/', response.data[0].Files[0].fileName;
                                    objFile.IsActive = true;
                                    objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                    objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                    objFile.Modified = null;
                                    objFile.ModifiedBy = null;
                                    objFile.IsSyncnised = true;
                                    objFile.IsCreated = false;
                                    lstAdhocInterventionDocuments.push(objFile);
                                    differdArrdifferdArr.resolve();
                                },
                                function (error) {
                                    if (error.code == 6) {

                                        var objFile = {};
                                        objFile.ID = response.data[0].Files[0].ID;
                                        objFile.FileName = response.data[0].Files[0].fileName;
                                        objFile.ResidentFile = folderpath + '/', response.data[0].Files[0].fileName;
                                        objFile.IsActive = true;
                                        objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                        objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                        objFile.Modified = null;
                                        objFile.ModifiedBy = null;
                                        objFile.IsSyncnised = true;
                                        objFile.IsCreated = false;

                                        lstAdhocInterventionDocuments.push(objFile);
                                        differdArrdifferdArr.resolve();
                                    }
                                    else {
                                        //differdArrdifferdArr.reject(error);

                                    }
                                });
                                $q.all(differdArr).then(function (response) {
                                    CommonService.insertResidentAdhocInterventionDocuments(app.db, lstAdhocInterventionDocuments).then(function () {

                                    },
                                    function (err) {
                                        console.log(err);
                                        toastr.error(err);
                                    });
                                },
                              function (err) {
                                  //toastr.error(err);
                                  //alert(err);
                              });
                            }
                        }


                        $uibModalInstance.close(vm.Recurrence);
                        CommonService.DeleteAllActionRecords(app.db).then(function (response) {
                            //toastr.success('Deleted Actions in offline.');
                            CommonService.DeleteAllAction_DaysRecords(app.db).then(function (response) {
                                //toastr.success('Deleted ActionsDays .');
                                CommonService.DeleteAllInterventionsRecords(app.db).then(function (response) {
                                    //toastr.success('Deleted Interventions.');
                                }, function (err) {
                                    //toastr.error('An error occurred while deleting Interventions.');
                                })
                            }, function (err) {
                                //toastr.error('An error occurred while deleting ActionsDays.');
                            })
                        }, function (err) {
                            //toastr.error('An error occurred while deleting Actions in offline.');
                        });

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
                                CommonService.insertActions(app.db, temparray).then(function () {
                                },
                                function (err) {

                                });
                            }
                        } else {
                            CommonService.insertActions(app.db, lstInsertActions).then(function () {
                            },
                                function (err) {

                                });
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
                                CommonService.insertActions_Days(app.db, temparray).then(function () {

                                },
                                function (err) {

                                });
                            }
                        } else {
                            CommonService.insertActions_Days(app.db, lstInsertActions_Days).then(function () {

                            },
                                function (err) {
                                });
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
                                CommonService.insertInterventions(app.db, temparray).then(function () {
                                    $uibModalInstance.close(vm.Recurrence);
                                },
                                function (err) {

                                });
                            }
                        } else {
                            CommonService.insertInterventions(app.db, lstInsertInterventions).then(function () {
                                $uibModalInstance.close(vm.Recurrence);
                                $state.go('AdhocIntervention');
                            },
                                function (err) {

                                });
                        }

                    },
                        function (err) {
                            toastr.error('An error occurred while generating interventions.');
                        }

                         );
                }
                else {

                    saveOfflineAdhocIntervention();
                }
                vm.OkButton = false;
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


                         function GetData() {
                             app.GetOfflineActions(renderActions);
                             app.GetOfflineAction_Days(renderAction_Days);
                             app.GetOfflineInterventions(renderInterventions);
                             app.GetOfflineSection_Interventions(renderSection_Interventions);
                             app.GetOfflineResidentsIsAccepted(renderResidents);
                         }
                         GetData();

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

                                 ////For IOS
                                 var InterventionTitle = vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionTitle;
                                 var StartDateTime = vm.Interventions[i].PlannedStartDate;
                                 var ResidentName = vm.Interventions[i].Actions_Days.Action.Resident.FirstName + vm.Interventions[i].Actions_Days.Action.Resident.LastName;
                                 var splittedStartDateTime = StartDateTime.split('T');
                                 var startDate = new Date(splittedStartDateTime[0]);
                                 var splittedStartTime = splittedStartDateTime[1].split(':');
                                 startDate.setHours(splittedStartTime[0], parseInt(splittedStartTime[1]) - 10);
                                 var ScheduledTime = moment(StartDateTime).format('LT');

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
            }

        };
    }

}());