(function () {
    //"use strict";
    angular.module('CHM').controller('LoginController', LoginController);
    LoginController.$inject = ['$rootScope', '$scope', '$state', '$q', 'toastr', '$stateParams', 'UsersService', 'InterventionsService', 'ResidentsService', 'CommonService', 'onlineStatus', '$cordovaFile', '$cordovaDevice', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout'];
    function LoginController($rootScope, $scope, $state, $q, toastr, $stateParams, UsersService, InterventionsService, ResidentsService, CommonService, onlineStatus, $cordovaFile, $cordovaDevice, $cordovaFileTransfer, $cordovaFileOpener2, $timeout) {
        var vm = this;
        vm.Interventions = [];
        vm.Residents = [];
        var UserPreviousLastLogin = null;

        window.onerror = function (error) {
            alert(error);
        };

        document.addEventListener('deviceready', function () {

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

                         ////For IOS
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

                         // );


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

        });


        vm.LogIn = function () {

            $rootScope.UserFirstLogin = false;
            vm.online = onlineStatus.isOnline();

            var Device = $cordovaDevice.getPlatform();

            if (Device == "iOS") {
                $rootScope.Path = cordova.file.cacheDirectory.endsWith('/') ? cordova.file.cacheDirectory : cordova.file.cacheDirectory + '/';
            }
            else if (Device == "Android") {

                $rootScope.Path = cordova.file.externalDataDirectory.endsWith('/') ? cordova.file.externalDataDirectory : cordova.file.externalDataDirectory + '/';
            }
            $cordovaFile.checkDir($rootScope.Path, "residentsQADocuments").then(function (success) {

            }, function error(err) {
                $cordovaFile.createDir($rootScope.Path, "residentsQADocuments", true).then(function (success) {

                });
            });

            $cordovaFile.checkDir($rootScope.Path, "residentsAdhocInterventionDocuments").then(function (success) {

            }, function error(err) {
                $cordovaFile.createDir($rootScope.Path, "residentsAdhocInterventionDocuments", true).then(function (success) {

                });
            });
            $cordovaFile.checkDir($rootScope.Path, "InterventionResidentsQADocuments").then(function (success) {

            }, function error(err) {
                $cordovaFile.createDir($rootScope.Path, "InterventionResidentsQADocuments", true).then(function (success) {

                });
            });

            var regexemail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            var validemail = regexemail.test(vm.UserName);
            var objUser = {};
            objUser.UserName = vm.UserName;
            objUser.Password = vm.Password;
            $rootScope.IsAdminSynchronizing = true;
            if (validemail) {
                if (vm.online) {
                    CheckValidEmail(objUser);
                }
                else {
                    //toastr.info("Go Online");
                }
            }
            else {
                if (vm.online) {
                    CheckValidUser(objUser);
                } else {
                    CommonService.SelectAllLoginRecords(app.db).then(function (rs) {
                        if (rs.rows.length == 1) {
                            if (rs.rows.item(0).UserName == vm.UserName.trim() && rs.rows.item(0).Password == vm.Password.trim()) {
                                var lstSucideAlertIds = [];

                                CommonService.SelectConfigurationValues(app.db).then(
                                      function (response) {

                                          for (var i = 0; i < response.rows.length; i++) {
                                              if (response.rows[i].ConfigurationKey == "AdminLastSync" && response.rows[i].OrganizationID == null) {
                                                  var StartDate = new Date();
                                                  StartDate = moment(new Date(StartDate.setDate(StartDate.getDate() - 10))).format('YYYY-MM-DD');
                                                  var ConfigurationValue = response.rows[i].ConfigurationValue;
                                                  var SeparatedConfigurationValue = ConfigurationValue.split("T");
                                                  ConfigurationValue = SeparatedConfigurationValue[0];
                                                  // var Difference = todayDate - ConfigurationValue;

                                                  if (StartDate > ConfigurationValue) {
                                                      $rootScope.$broadcast("loader_show");
                                                      toastr.info("Sync the data its been 10 days");
                                                      $rootScope.UserInfo = null;
                                                      $state.go('Login');
                                                      $rootScope.$broadcast("loader_hide");                                                   
                                                  }
                                                  break;
                                              }
                                          }

                                          var lstIntervetnionList = [];
                                          var lstSucideAlertPopup = [];
                                          var Configurations = response.rows;

                                          for (var i = 0; i < Configurations.length; i++) {
                                              if (Configurations[i].OrganizationID == null && Configurations[i].ConfigurationKey == 'SucideAlertPopup') {
                                                  Configurations[i].ConfigurationValue = Configurations[i].ConfigurationValue.split(',');
                                                  lstSucideAlertPopup.push(Configurations[i]);
                                              }
                                              if (Configurations[i].OrganizationID != null && Configurations[i].ConfigurationKey == 'GenerateInterventionLimit') {
                                                  lstIntervetnionList.push(Configurations[i]);
                                              }
                                          }
                                          $rootScope.SucideAlertQuestionIds = lstSucideAlertPopup;
                                          $rootScope.LimitofInterventions = lstIntervetnionList;
                                          $rootScope.Configurations = Configurations;
                                          console.log($rootScope.Configurations);

                                      });

                                var objUserInfo = {};
                                objUserInfo.UserID = rs.rows.item(0).UserID;
                                objUserInfo.UserName = rs.rows.item(0).UserName;
                                objUserInfo.RoleName = rs.rows.item(0).RoleName;
                                objUserInfo.LastLogin = new Date(rs.rows.item(0).LastLogin);
                                UserPreviousLastLogin = moment(new Date(objUserInfo.LastLogin.getUTCFullYear(), objUserInfo.LastLogin.getUTCMonth(), objUserInfo.LastLogin.getUTCDate(), objUserInfo.LastLogin.getUTCHours(), objUserInfo.LastLogin.getUTCMinutes(), objUserInfo.LastLogin.getUTCSeconds())).format('YYYY-MM-DD HH:mm:ss');
                                $rootScope.UserInfo = objUserInfo;
                                UpdateUserLogin($rootScope.UserInfo);

                                //by Aleem 13th Dec
                                CommonService.SelectAllUsersOrganizations(app.db, objUserInfo.UserID).then(function (response) {
                                    if (response.rows.length > 0) {
                                        if (response.rows.length == 1) {
                                            $rootScope.OrganizationId = response.rows.item(0).OrganizationID;
                                            //$state.go('Residents');
                                            CheckUserInfo();
                                            $rootScope.$broadcast('SyncOfData', { Compleated: true });
                                        }
                                    }
                                });
                                //CheckUserInfo();
                            }
                            else {
                                toastr.error('your prev username mismatching.');
                                $state.go("Login");
                            }
                        }
                        if (rs.rows.length == 0) {
                            toastr.error('This is the first time login.Login when Online');
                            $state.go('Login');
                        }
                        //else {
                        //    toastr.error('more than one user exists.');
                        //    $state.go('Login');
                        //}
                    },
                     function (tx, error) {
                         toastr.error(err);
                     });
                }
            }
        };

        function CheckUserInfo() {
            $scope.$on('SyncOfData', function (event, args) {
                if (args.Compleated) {
                    CommonService.SelectAllSectionQuestions(app.db).then(function (response) {
                        if ($rootScope.UserInfo.RoleName == 'SecondaryUser' || $rootScope.UserInfo.RoleName == 'ViewOnly') {
                            $rootScope.IsSecondaryRead = true;
                            $rootScope.IsAdmin = false;
                            if (response.rows.length > 0) {
                                $state.go('Residents');
                            }
                            else {
                                toastr.info('Please Sync Data to login');
                                $rootScope.UserInfo = null;
                                $state.go('Login');
                            }
                        }
                        else {
                            $rootScope.IsAdmin = false;
                            $rootScope.IsSecondaryRead = false;
                            if (response.rows.length > 0) {
                                if (UserPreviousLastLogin == null || (new Date(UserPreviousLastLogin).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
                                    $rootScope.UserFirstLogin = true;
                                    $state.go('HandOverNotes');
                                }
                                else {
                                    $state.go('Residents');
                                }
                            }
                            else {
                                toastr.info('Please Sync Data to login');
                                $rootScope.UserInfo = null;
                                $state.go('Login');
                            }
                        }
                    }, function (err) {
                        $rootScope.UserInfo = null;
                        $state.go('Login');
                    })
                } else {
                    $rootScope.$broadcast("loader_hide");
                }
            });
        }

        function CheckValidEmail(objUser) {
            UsersService.CheckValidEmail(objUser).then(function (responce) {
                if (responce.data) {
                    UsersService.Login(vm.UserName, vm.Password).then(function (UserInfoResponse) {
                        UsersService.GetConfigurationValues().then(
                       function (response) {

                           var Configurations = response.data;
                           var lstIntervetnionList = [];
                           var lstSucideAlertPopup = [];
                           for (var i = 0; i < Configurations.length; i++) {
                               if (Configurations[i].OrganizationID == null && Configurations[i].ConfigurationKey == 'SucideAlertPopup') {
                                   Configurations[i].ConfigurationValue = Configurations[i].ConfigurationValue.split(',');
                                   lstSucideAlertPopup.push(Configurations[i]);
                               }
                               if (Configurations[i].OrganizationID != null && Configurations[i].ConfigurationKey == 'GenerateInterventionLimit') {
                                   lstIntervetnionList.push(Configurations[i]);
                               }
                           }
                           $rootScope.SucideAlertQuestionIds = lstSucideAlertPopup;
                           $rootScope.LimitofInterventions = lstIntervetnionList;


                       });
                        if (UserInfoResponse.RoleName == 'Administrator') {
                            $rootScope.IsAdmin = true;
                            $rootScope.IsSecondaryRead = false;
                            $rootScope.UserInfo = UserInfoResponse;
                            $state.go('AdminSyncronization');
                        } else {
                            CommonService.SelectAllUsersOrganizations(app.db, UserInfoResponse.UserID).then(function (response) {
                                if (response.rows.length > 0) {
                                    //$rootScope.UserInfo = UserInfoResponse;
                                    if (response.rows.length > 0) {
                                        if (response.rows.length == 1) {
                                            $rootScope.OrganizationId = response.rows.item(0).OrganizationID;
                                        }
                                        CommonService.SelectAllLoginRecords(app.db).then(function (rs) {
                                            if (rs.rows.length == 1) {
                                                if (rs.rows.item(0).UserName == vm.UserName.trim() && rs.rows.item(0).Password == vm.Password.trim()) {
                                                    CheckUserInfo();
                                                    $rootScope.UserInfo = UserInfoResponse;
                                                }
                                                else {//delete db
                                                    CommonService.DeleteAllLoginRecords(app.db).then(function () {
                                                        $rootScope.UserInfo = UserInfoResponse;
                                                        InsertUser($rootScope.UserInfo);

                                                    }, function error(err) {
                                                        toastr.error('Error while deleting Login Records');
                                                    });
                                                    //$rootScope.$broadcast('GettingDatatoDisplay', { NewUser: true });
                                                }
                                            }
                                            else if (rs.rows.length == 0) {
                                                $rootScope.UserInfo = UserInfoResponse;
                                                InsertUser($rootScope.UserInfo);

                                                //$rootScope.$broadcast('GettingDatatoDisplay', { NewUser: true });
                                            }
                                        },
                                     function (tx, error) {
                                         toastr.error(err);
                                     });
                                    } else {
                                        $rootScope.UserInfo = null;
                                        $state.go('Login');
                                    }
                                } else {
                                    toastr.info('Please Sync Data to login');
                                }
                            });
                        }
                    },
                    function (err) {
                        console.log(err);
                        toastr.error('Login failed.');
                    });
                }
                else {
                    toastr.error('Invalid User');
                }
            }, function error(err) {
                toastr.error('An error occured while checking user valid or not');
            });
        }

        function CheckValidUser(objUser) {
            UsersService.CheckValidUser(objUser).then(function (responce) {
                if (responce.data != null) {
                    UsersService.Login(responce.data, vm.Password).then(function (UserInfoResponse) {
                        UsersService.GetConfigurationValues().then(
                       function (response) {

                           var Configurations = response.data;
                           var lstIntervetnionList = [];
                           var lstSucideAlertPopup = [];
                           for (var i = 0; i < Configurations.length; i++) {
                               if (Configurations[i].OrganizationID == null && Configurations[i].ConfigurationKey == 'SucideAlertPopup') {
                                   Configurations[i].ConfigurationValue = Configurations[i].ConfigurationValue.split(',');
                                   lstSucideAlertPopup.push(Configurations[i]);
                               }
                               if (Configurations[i].OrganizationID != null && Configurations[i].ConfigurationKey == 'GenerateInterventionLimit') {
                                   lstIntervetnionList.push(Configurations[i]);
                               }
                           }
                           $rootScope.SucideAlertQuestionIds = lstSucideAlertPopup;
                           $rootScope.LimitofInterventions = lstIntervetnionList;


                       });

                        if (UserInfoResponse.LastLogin != "") {
                            UserPreviousLastLogin =new Date((UserInfoResponse.LastLogin - 621355968000000000) / 10000);
                        }
                        UpdateUserLogin(UserInfoResponse);
                        if (UserInfoResponse.RoleName == 'Administrator') {
                            $rootScope.UserInfo = UserInfoResponse;
                            $rootScope.IsAdmin = true;
                            $rootScope.IsSecondaryRead = false;
                            $state.go('AdminSyncronization');
                        }
                        else {
                            CommonService.SelectAllUsersOrganizations(app.db, UserInfoResponse.UserID).then(function (response) {
                                if (response.rows.length > 0) {
                                    // $rootScope.UserInfo = UserInfoResponse;
                                    if (response.rows.length > 0) {
                                        if (response.rows.length == 1) {

                                            $rootScope.OrganizationId = response.rows.item(0).OrganizationID;
                                        }
                                        CommonService.SelectAllLoginRecords(app.db).then(function (rs) {
                                            if (rs.rows.length == 1) {
                                                if (rs.rows.item(0).UserName == vm.UserName.trim() && rs.rows.item(0).Password == vm.Password.trim()) {
                                                    CheckUserInfo();
                                                    $rootScope.UserInfo = UserInfoResponse;
                                                }
                                                else {//delete db
                                                    CommonService.DeleteAllLoginRecords(app.db).then(function () {
                                                        $rootScope.UserInfo = UserInfoResponse;
                                                        InsertUser($rootScope.UserInfo);
                                                    }, function error(err) {
                                                        toastr.error('Error while deleting Login Records');
                                                    });
                                                    //$rootScope.$broadcast('GettingDatatoDisplay', { NewUser: true });
                                                }
                                            }
                                            else if (rs.rows.length == 0) {
                                                $rootScope.UserInfo = UserInfoResponse;
                                                InsertUser($rootScope.UserInfo);
                                                //$rootScope.$broadcast('GettingDatatoDisplay', { NewUser: true });
                                            }
                                        },
                                     function (tx, error) {
                                         toastr.error(err);
                                     });
                                    } else {
                                        $rootScope.UserInfo = null;
                                        $state.go('Login');
                                    }
                                } else {
                                    toastr.info('Please Sync Data to login');
                                }
                            });
                        }
                    },
                    function (err) {
                        console.log(err);
                        toastr.error('Login failed.');
                    });

                }
                else {
                    toastr.error('Invalid User');
                }
            }, function error(err) {
                toastr.error('An error occured while checking user valid or not');
            });
        }

        function InsertUser(response) {
            var objLogin = {};
            objLogin.UserID = response.UserID;
            objLogin.UserName = vm.UserName.trim();
            objLogin.Password = vm.Password.trim();
            objLogin.RoleName = response.RoleName.trim();
            objLogin.LastLogin = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
            if (vm.online) {
                objLogin.IsSyncnised = true;
            }
            else {
                objLogin.IsSyncnised = false;
            }
            CommonService.InsertLogin(app.db, objLogin).then(function () {
                CheckUserInfo();
            },
            function (tx, error) {

            });
        }
        function UpdateUserLogin(response) {
            var objLogin = {};
            objLogin.UserID = response.UserID;
            objLogin.LastLogin = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
            if (vm.online) {
                objLogin.IsSyncnised = true;
            }
            else {
                objLogin.IsSyncnised = false;
            }
            CommonService.UpdateLogin(app.db, objLogin).then(function () {
            },
            function (tx, error) {
            });
        }

        //vm.UserName = 'senak';
        //vm.Password = 'user123';

        //vm.UserName = 'samathareddy216@gmail.com';
        //vm.Password = 'Password123';


    };

}());