(function () {
    angular.module('CHM').controller('SyncronizationController', SyncronizationController);

    SyncronizationController.$inject = ['$rootScope', '$scope', '$q', 'onlineStatus', 'SyncronizationService', 'CommonService', 'UsersService', 'toastr', '$cordovaFile', '$cordovaDevice', '$cordovaFileTransfer', '$cordovaFileOpener2', '$location', '$state', '$timeout'];

    function SyncronizationController($rootScope, $scope, $q, onlineStatus, SyncronizationService, CommonService, UsersService, toastr, $cordovaFile, $cordovaDevice, $cordovaFileTransfer, $cordovaFileOpener2, $location, $state, $timeout) {

        var vm = this;


        var getnewofflinePainMonitoring = [];
        var GetUpdatedOfflinePainMonitoring = [];

        var GetUpdatedOfflineUserLogin = [];

        var getnewofflineResidents = [];
        var GetUpdatedOfflineResidents = [];

        var GetNewOfflineActions = [];
        var GetUpdatedOfflineActions = [];

        var GetNewOfflineActions_Days = [];
        var GetUpdatedOfflineActions_Days = [];

        var GetNewOfflineInterventions = [];
        var GetUpdatedOfflineInterventions = [];

        var GetNewOfflineInterventions_Resident_Answers = [];
        var GetUpdatedOfflineInterventions_Resident_Answers = [];

        var GetNewOfflineResident_Interventions_Questions_Answers = [];
        var GetUpdatedOfflineResident_Interventions_Questions_Answers = [];

        var GetNewOfflineResidents_Questions_Answer = [];
        var GetUpdatedOfflineResidents_Questions_Answer = [];

        var GetNewOfflineResidentPhotos = [];
        // var GetUpdatedOfflineResidentPhotos = [];

        var GetNewOfflineResidentDocuments = [];
        var GetNewOfflineInterventionResidentAnswerDocuments = [];
        var GetNewOfflineResidentAdhocIntervention = [];

        $scope.onlineStatus = onlineStatus;


        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;
            if ($rootScope.UserInfo) {
                vm.OrganizationID = $rootScope.OrganizationId;
                if ($rootScope.UserInfo.RoleName != 'Administrator') {
                    if ($scope.online == true) {
                        $rootScope.IsSynchronizing = true;
                        $rootScope.IsAdminSynchronizing = false;
                        CommonService.SelectAllLoginRecords(app.db).then(function (rs) {
                            if (rs.rows.length == 1) {
                                var objUser = {};
                                objUser.UserName = rs.rows.item(0).UserName;
                                objUser.Password = rs.rows.item(0).Password;
                                UsersService.CheckValidUser(objUser).then(function (responce) {
                                    if (responce.data != null) {
                                        UsersService.Login(responce.data, objUser.Password).then(function (UserInfoResponse) {
                                            $rootScope.UserInfo = UserInfoResponse;
                                            var deffered = [];

                                            var defferGetUpdatedOfflineUserLogin = $q.defer();

                                            var deffergetnewofflineResidents = $q.defer();
                                            var defferGetUpdatedOfflineResidents = $q.defer();

                                            var defferGetNewOfflineActions = $q.defer();
                                            var defferGetUpdatedOfflineActions = $q.defer();

                                            var defferGetNewOfflineActions_Days = $q.defer();
                                            var defferGetUpdatedOfflineActions_Days = $q.defer();

                                            var defferGetNewOfflineInterventions = $q.defer();
                                            var defferGetUpdatedOfflineInterventions = $q.defer();

                                            var defferGetNewOfflineInterventions_Resident_Answers = $q.defer();
                                            var defferGetUpdatedOfflineInterventions_Resident_Answers = $q.defer();

                                            var defferGetNewOfflineResident_Interventions_Questions_Answers = $q.defer();
                                            var defferGetUpdatedOfflineResident_Interventions_Questions_Answers = $q.defer();

                                            var defferGetNewOfflineResidents_Questions_Answer = $q.defer();
                                            var defferGetUpdatedOfflineResidents_Questions_Answer = $q.defer();

                                            var defferGetNewOfflineResidentPhotos = $q.defer();

                                            var defferGetNewOfflineResidentDocuments = $q.defer();
                                            var defferGetNewOfflineInterventionResidentAnswerDocuments = $q.defer();
                                            var defferGetNewOfflineResidentAdhocIntervention = $q.defer();

                                            var deffergetnewofflinePainMonitoring = $q.defer();
                                            var defferGetUpdatedOfflinePainMonitoring = $q.defer();

                                            deffered.push(defferGetUpdatedOfflineUserLogin.promise);

                                            deffered.push(deffergetnewofflineResidents.promise);
                                            deffered.push(defferGetUpdatedOfflineResidents.promise);

                                            deffered.push(defferGetNewOfflineActions.promise);
                                            deffered.push(defferGetUpdatedOfflineActions.promise);

                                            deffered.push(defferGetNewOfflineActions_Days.promise);
                                            deffered.push(defferGetUpdatedOfflineActions_Days.promise);

                                            deffered.push(defferGetNewOfflineInterventions.promise);
                                            deffered.push(defferGetUpdatedOfflineInterventions.promise);

                                            deffered.push(defferGetNewOfflineInterventions_Resident_Answers.promise);
                                            deffered.push(defferGetUpdatedOfflineInterventions_Resident_Answers.promise);

                                            deffered.push(defferGetNewOfflineResident_Interventions_Questions_Answers.promise);
                                            deffered.push(defferGetUpdatedOfflineResident_Interventions_Questions_Answers.promise);

                                            deffered.push(defferGetNewOfflineResidents_Questions_Answer.promise);
                                            deffered.push(defferGetUpdatedOfflineResidents_Questions_Answer.promise);

                                            deffered.push(defferGetNewOfflineResidentPhotos.promise);
                                            //deffered.push(defferGetUpdatedOfflineResidentPhotos.promise);

                                            deffered.push(defferGetNewOfflineResidentDocuments.promise);
                                            deffered.push(defferGetNewOfflineInterventionResidentAnswerDocuments.promise);
                                            deffered.push(defferGetNewOfflineResidentAdhocIntervention.promise);

                                            deffered.push(deffergetnewofflinePainMonitoring.promise);
                                            deffered.push(defferGetUpdatedOfflinePainMonitoring.promise);

                                            //#engregion

                                            GetUpdatedOfflineUserLogin = [];

                                            getnewofflineResidents = [];
                                            GetUpdatedOfflineResidents = [];

                                            GetNewOfflineActions = [];
                                            GetUpdatedOfflineActions = [];

                                            GetNewOfflineActions_Days = [];
                                            GetUpdatedOfflineActions_Days = [];

                                            GetNewOfflineInterventions = [];
                                            GetUpdatedOfflineInterventions = [];

                                            GetNewOfflineInterventions_Resident_Answers = [];
                                            GetUpdatedOfflineInterventions_Resident_Answers = [];

                                            GetNewOfflineResident_Interventions_Questions_Answers = [];
                                            GetUpdatedOfflineResident_Interventions_Questions_Answers = [];

                                            GetNewOfflineResidents_Questions_Answer = [];
                                            GetUpdatedOfflineResidents_Questions_Answer = [];

                                            GetNewOfflineResidentPhotos = [];
                                            //  GetUpdatedOfflineResidentPhotos = [];

                                            GetNewOfflineResidentDocuments = [];
                                            GetNewOfflineInterventionResidentAnswerDocuments = [];
                                            GetNewOfflineResidentAdhocIntervention = [];


                                            getnewofflinePainMonitoring = [];
                                            GetUpdatedOfflinePainMonitoring = [];


                                            var renderUpdatedOfflineUserLogin = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineUserLogin.push(rs.rows.item(i));
                                                    GetUpdatedOfflineUserLogin[i].ID = GetUpdatedOfflineUserLogin[i].UserID;
                                                }
                                                defferGetUpdatedOfflineUserLogin.resolve();
                                            };

                                            var rendernewOfflineResident = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    getnewofflineResidents.push(rs.rows.item(i));
                                                }
                                                deffergetnewofflineResidents.resolve();
                                            };

                                            var renderUpdatedOfflineResidents = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineResidents.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineResidents.resolve();
                                            };


                                            var renderNewOfflineActions = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineActions.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineActions.resolve();
                                            };

                                            var renderUpdatedOfflineActions = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineActions.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineActions.resolve();
                                            };



                                            var renderNewOfflineActions_Days = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineActions_Days.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineActions_Days.resolve();
                                            };

                                            var renderUpdatedOfflineActions_Days = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineActions_Days.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineActions_Days.resolve();
                                            };



                                            var renderNewOfflineInterventions = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineInterventions.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineInterventions.resolve();
                                            };

                                            var renderUpdatedOfflineInterventions = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineInterventions.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineInterventions.resolve();
                                            };



                                            var renderNewOfflineInterventions_Resident_Answers = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineInterventions_Resident_Answers.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineInterventions_Resident_Answers.resolve();
                                            };

                                            var renderUpdatedOfflineInterventions_Resident_Answers = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineInterventions_Resident_Answers.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineInterventions_Resident_Answers.resolve();
                                            };



                                            var renderNewOfflineResident_Interventions_Questions_Answers = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineResident_Interventions_Questions_Answers.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineResident_Interventions_Questions_Answers.resolve();
                                            };

                                            var renderUpdatedOfflineResident_Interventions_Questions_Answers = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineResident_Interventions_Questions_Answers.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineResident_Interventions_Questions_Answers.resolve();
                                            };



                                            var renderNewOfflineResidents_Questions_Answers = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineResidents_Questions_Answer.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineResidents_Questions_Answer.resolve();

                                            };

                                            var renderUpdatedOfflineResidents_Questions_Answer = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflineResidents_Questions_Answer.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflineResidents_Questions_Answer.resolve();

                                            };



                                            var renderNewOfflineResidentPhotos = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineResidentPhotos.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineResidentPhotos.resolve();
                                            };

                                            var renderNewOfflineResidentDocuments = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineResidentDocuments.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineResidentDocuments.resolve();
                                            };

                                            var renderGetNewOfflineInterventionResidentAnswerDocuments = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineInterventionResidentAnswerDocuments.push(rs.rows.item(i));
                                                }
                                                defferGetNewOfflineInterventionResidentAnswerDocuments.resolve();
                                            };


                                            var renderNewOfflineResidentAdhocIntervention = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetNewOfflineResidentAdhocIntervention.push(rs.rows.item(i));
                                                    
                                                }
                                                defferGetNewOfflineResidentAdhocIntervention.resolve();
                                            };

                                            var rendernewOfflinePainMonitoring = function (tx, rs) {

                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    getnewofflinePainMonitoring.push(rs.rows.item(i));
                                                }
                                                deffergetnewofflinePainMonitoring.resolve();

                                            };


                                            var renderUpdatedOfflinePainMonitoring = function (tx, rs) {
                                                for (var i = 0; i < rs.rows.length; i++) {
                                                    GetUpdatedOfflinePainMonitoring.push(rs.rows.item(i));
                                                }
                                                defferGetUpdatedOfflinePainMonitoring.resolve();

                                            };

                                            app.GetUpdatedOfflineUserLogin(renderUpdatedOfflineUserLogin, $rootScope.UserInfo.UserID);

                                            app.GetOfflineResidentsNew(rendernewOfflineResident);
                                            app.GetUpdatedOfflineResidents(renderUpdatedOfflineResidents);

                                            app.GetNewOfflineActions(renderNewOfflineActions);
                                            app.GetUpdatedOfflineActions(renderUpdatedOfflineActions);

                                            app.GetNewOfflineActions_Days(renderNewOfflineActions_Days);
                                            app.GetUpdatedOfflineActions_Days(renderUpdatedOfflineActions_Days);

                                            app.GetNewOfflineInterventions(renderNewOfflineInterventions);
                                            app.GetUpdatedOfflineInterventions(renderUpdatedOfflineInterventions);

                                            app.GetNewOfflineInterventions_Resident_Answers(renderNewOfflineInterventions_Resident_Answers);
                                            app.GetUpdatedOfflineInterventions_Resident_Answers(renderUpdatedOfflineInterventions_Resident_Answers);

                                            app.GetNewOfflineResident_Interventions_Questions_Answers(renderNewOfflineResident_Interventions_Questions_Answers);
                                            app.GetUpdatedOfflineResident_Interventions_Questions_Answers(renderUpdatedOfflineResident_Interventions_Questions_Answers);

                                            app.GetNewOfflineResidents_Questions_Answers(renderNewOfflineResidents_Questions_Answers);
                                            app.GetUpdatedOfflineResidents_Questions_Answers(renderUpdatedOfflineResidents_Questions_Answer);

                                            app.GetNewOfflineResidentPhotos(renderNewOfflineResidentPhotos);
                                            //app.GetUpdatedOfflineResidentPhotos(renderUpdatedOfflineResidentPhotos);

                                            app.GetNewOfflineResidentDocuments(renderNewOfflineResidentDocuments);
                                            app.GetNewOfflineInterventionResidentAnswerDocuments(renderGetNewOfflineInterventionResidentAnswerDocuments);
                                            app.GetNewOfflineResidentAdhocIntervention(renderNewOfflineResidentAdhocIntervention);

                                            app.getnewofflinePainMonitoring(rendernewOfflinePainMonitoring);
                                            app.GetUpdatedOfflinePainMonitoring(renderUpdatedOfflinePainMonitoring);

                                            $q.all(deffered).then(function (response) {
                                                CreateOfflineResidentAnswerDocuments().then(function () {
                                                    CreateOfflineInterventionResidentAnswerDocuments().then(function () {
                                                        CreateOfflineResidentPhotos().then(function () {
                                                            CreateOfflineResidentAdhocInterventions().then(function () {
                                                                InsertOfflineTablesData();
                                                            }, function (error) {
                                                                toastr.error('ResidentPhotos');
                                                            });
                                                        }, function (error) {
                                                            toastr.error('InterventionResidentAnswerDocuments');
                                                        });
                                                    }, function (err) {
                                                        toastr.error('An error occurred while saving Resident Adhoc Intervention Document.');
                                                        q.reject();
                                                    })

                                                }, function (error) {
                                                    toastr.error('ResidentAnswerDocuments');
                                                });
                                            },
                                            function (err) {
                                                console.log('err');
                                            });
                                        }, function (err) {
                                            console.log(err);
                                            toastr.error('Login failed.');
                                        });
                                    } else {
                                        toastr.error('Invalid User');
                                    }
                                });
                            } else {
                                toastr.error('Login failed.');
                            }
                        },
                        function (err) {
                            console.log(err);
                        });

                    }
                }
            }
        });

        function InsertOfflineTablesData() {
            var differed = [];
            $rootScope.$broadcast("loader_show");
            differed.push(CreateofflineResident());
            differed.push(UpdateofflineResident());
            differed.push(UpdateofflineUserLastLogin());
            differed.push(CreateOfflineActions());
            differed.push(UpdateOfflineActions());
            //differed.push(CreateOfflineAction_Days());
            differed.push(UpdateOfflineAction_Days());
            //differed.push(CreateOfflineInterventions());
            differed.push(UpdateOfflineInterventions());
            differed.push(CreateOfflineInterventions_Resident_Answers());
            differed.push(UpdateOfflineInterventions_Resident_Answers());
            differed.push(CreateOfflineResident_Interventions_Questions_Answers());
            differed.push(UpdateOfflineResident_Interventions_Questions_Answers());
            differed.push(CreateOfflineResidents_Questions_Answers());
            differed.push(UpdateOfflineResidents_Questions_Answers());
            differed.push(CreateofflinePainMonitoring());
            differed.push(UpdateofflinePainMonitoring());

            $q.all(differed).then(function (response) {
                CommonService.DeleteAllResidentDependableTables(app.db).then(function () {
                    $rootScope.$broadcast("loader_hide");
                    GetMasterDataResidents();
                    GetResidentsDocuments();
                    GetInterventionResidentsDocuments();
                    GetAdhocInterventionResidentsDocuments();
                });
            }, function error(err) {
                alert(err);
                $rootScope.$broadcast("loader_hide");
            })
        }

        function UpdateofflineUserLastLogin() {

            var q = $q.defer();
            if (GetUpdatedOfflineUserLogin.length != 0) {
                if (GetUpdatedOfflineUserLogin.length > 0) {
                    SyncronizationService.UpdateofflineUserLastLogin(GetUpdatedOfflineUserLogin).then(function (response) {
                       // toastr.success('Updated offline User LastLogin saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while updating User LastLogin.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateofflineResident() {
            var q = $q.defer();
            if (getnewofflineResidents.length != 0) {
                if (getnewofflineResidents.length > 0) {
                    SyncronizationService.CreateOfflineResident(getnewofflineResidents).then(function (response) {
                        toastr.success('Resident saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while saving Residents.');
                        q.reject();
                    });
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateofflineResident() {

            var q = $q.defer();
            if (GetUpdatedOfflineResidents.length != 0) {
                if (GetUpdatedOfflineResidents.length > 0) {
                    SyncronizationService.UpdateOfflineResident(GetUpdatedOfflineResidents).then(function (response) {
                        //toastr.success('Updated offline Residents saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while updating AllResidentRecords.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineActions() {

            var q = $q.defer();
            if (GetNewOfflineActions.length != 0) {
                if (GetNewOfflineActions.length > 0) {
                    SyncronizationService.CreateOfflineActions(GetNewOfflineActions).then(function (response) {
                        toastr.success('Actions saved successfully.');
                        CreateOfflineAction_Days().then(function () {
                            q.resolve();
                        }, function (err) {
                            toastr.error('An error occurred while saving Action_Days.');
                            q.reject();
                        })
                    }, function (err) {
                        toastr.error('An error occurred while saving Actions.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateOfflineActions() {
            var q = $q.defer();
            if (GetUpdatedOfflineActions.length != 0) {
                if (GetUpdatedOfflineActions.length > 0) {
                    SyncronizationService.UpdateOfflineActions(GetUpdatedOfflineActions).then(function (response) {
                        toastr.success('Actions Updated  successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred updating Actions.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineAction_Days() {
            var q = $q.defer();
            if (GetNewOfflineActions_Days.length != 0) {
                if (GetNewOfflineActions_Days.length > 0) {
                    SyncronizationService.CreateOfflineAction_Days(GetNewOfflineActions_Days).then(function (response) {
                        toastr.success('Action Days saved successfully.');
                        CreateOfflineInterventions().then(function () {
                            q.resolve();
                        }, function (err) {
                            toastr.error('An error occurred while saving Interventions.');
                            q.reject();
                        });
                    }, function (err) {
                        toastr.error('An error occurred while saving Action Days.');
                        q.reject();
                    });
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateOfflineAction_Days() {

            var q = $q.defer();
            if (GetUpdatedOfflineActions_Days.length != 0) {
                if (GetUpdatedOfflineActions_Days.length > 0) {
                    SyncronizationService.UpdateOfflineAction_Days(GetUpdatedOfflineActions_Days).then(function (response) {
                        toastr.success('ActionDays updated successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while updating Action Days .');
                        q.reject();
                    });
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineInterventions() {

            var q = $q.defer();
            if (GetNewOfflineInterventions.length != 0) {
                if (GetNewOfflineInterventions.length > 0) {
                    SyncronizationService.CreateOfflineInterventions(GetNewOfflineInterventions).then(function (response) {
                        toastr.success('Interventions saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while saving Interventions.');
                        q.reject();
                    })
                }
                else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateOfflineInterventions() {

            var q = $q.defer();
            if (GetUpdatedOfflineInterventions.length != 0) {
                if (GetUpdatedOfflineInterventions.length > 0) {
                    SyncronizationService.UpdateOfflineInterventions(GetUpdatedOfflineInterventions).then(function (response) {
                        toastr.success('Updated successfully.');
                        q.resolve();
                    },
                    function (err) {
                        toastr.error('An error occurred updating Interventions.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineInterventions_Resident_Answers() {

            var q = $q.defer();
            if (GetNewOfflineInterventions_Resident_Answers.length > 0) {
                if (GetNewOfflineInterventions_Resident_Answers.length > 0) {
                    SyncronizationService.CreateOfflineInterventions_Resident_Answers(GetNewOfflineInterventions_Resident_Answers).then(
                        function (response) {
                            toastr.success('Interventions_Resident_Answers saved successfully.');
                            q.resolve();
                        }, function (err) {
                            toastr.error('An error occurred while saving Interventions_Resident_Answers.');
                            q.reject();
                        }
                        )
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateOfflineInterventions_Resident_Answers() {
            var q = $q.defer();
            if (GetUpdatedOfflineInterventions_Resident_Answers.length != 0) {
                if (GetUpdatedOfflineInterventions_Resident_Answers.length > 0) {
                    SyncronizationService.UpdateOfflineInterventions_Resident_Answers(GetUpdatedOfflineInterventions_Resident_Answers).then(function (response) {
                        toastr.success('Interventions_Resident_Answers updated successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred updating Interventions_Resident_Answers.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineResident_Interventions_Questions_Answers() {
            var q = $q.defer();
            if (GetNewOfflineResident_Interventions_Questions_Answers.length != 0) {
                if (GetNewOfflineResident_Interventions_Questions_Answers.length > 0) {
                    SyncronizationService.CreateOfflineResident_Interventions_Questions_Answers(GetNewOfflineResident_Interventions_Questions_Answers).then(function (response) {
                        toastr.success('Resident_Interventions_Questions_Answers saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while saving Resident_Interventions_Questions_Answers.');
                        q.reject();
                    });
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateOfflineResident_Interventions_Questions_Answers() {
            var q = $q.defer();
            if (GetUpdatedOfflineResident_Interventions_Questions_Answers.length != 0) {
                if (GetUpdatedOfflineResident_Interventions_Questions_Answers.length > 0) {
                    SyncronizationService.UpdateOfflineResident_Interventions_Questions_Answers(GetUpdatedOfflineResident_Interventions_Questions_Answers).then(function (repsonse) {
                        toastr.success('Resident_Interventions_Questions_Answers updated successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred updating Resident_Interventions_Questions_Answers.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineResidents_Questions_Answers() {
            var q = $q.defer();
            if (GetNewOfflineResidents_Questions_Answer.length != 0) {
                if (GetNewOfflineResidents_Questions_Answer.length > 0) {
                    SyncronizationService.CreateOfflineResidents_Questions_Answers(GetNewOfflineResidents_Questions_Answer).then(function (response) {
                        toastr.success('Resident_Questions_Answers saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while saving Resident_Questions_Answers.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateOfflineResidents_Questions_Answers() {
            var q = $q.defer();
            if (GetUpdatedOfflineResidents_Questions_Answer.length != 0) {
                if (GetUpdatedOfflineResidents_Questions_Answer.length > 0) {
                    SyncronizationService.UpdateOfflineResidents_Questions_Answers(GetUpdatedOfflineResidents_Questions_Answer).then(function (response) {
                        toastr.success('Resident_Questions_Answers updated successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while updating Resident_Questions_Answers.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }


        //Pain Monitoring

        function CreateofflinePainMonitoring() {
            var q = $q.defer();
            if (getnewofflinePainMonitoring.length != 0) {
                if (getnewofflinePainMonitoring.length > 0) {
                    SyncronizationService.CreateofflinePainMonitoring(getnewofflinePainMonitoring).then(function (response) {
                        toastr.success('PainMonitoring  saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while saving PainMonitoring.');
                        q.reject();
                    });
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function UpdateofflinePainMonitoring() {
            var q = $q.defer();
            if (GetUpdatedOfflinePainMonitoring.length != 0) {
                if (GetUpdatedOfflinePainMonitoring.length > 0) {
                    SyncronizationService.UpdateofflinePainMonitoring(GetUpdatedOfflinePainMonitoring).then(function (response) {
                        toastr.success('Updated offline PainMonitoring saved successfully.');
                        q.resolve();
                    }, function (err) {
                        toastr.error('An error occurred while updating PainMonitoring.');
                        q.reject();
                    })
                } else {
                    q.resolve();
                }
            } else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineResidentAnswerDocuments() {
            var q = $q.defer();
            var defferedResidentDocuments = [];
            var offlineResidentDocuments = [];

            if (GetNewOfflineResidentDocuments.length > 0) {
                GetNewOfflineResidentDocuments.forEach(function (ResidentDocumentsItem, i) {
                    var defferofflineResidentDocument = $q.defer();
                    defferedResidentDocuments.push(defferofflineResidentDocument.promise);

                    var objResidentDocument = { ResidentQuestionAnswerID: '', ResidentFile: '', FileName: '' };
                    objResidentDocument.ResidentQuestionAnswerID = ResidentDocumentsItem.ID;
                    objResidentDocument.FileName = ResidentDocumentsItem.FileName;

                    var folderpath = $rootScope.Path + 'residentsQADocuments/';
                    var filename = ResidentDocumentsItem.FileName;
                    $cordovaFile.readAsDataURL(folderpath, filename).then(function (fileAsBase64) {
                        objResidentDocument.ResidentFile = fileAsBase64;
                        offlineResidentDocuments.push(objResidentDocument);
                        defferofflineResidentDocument.resolve();
                    }, function (error) {
                        toastr.error(error);
                    });
                });
                $q.all(defferedResidentDocuments).then(function (response) {
                    if (offlineResidentDocuments.length > 0) {
                        SyncronizationService.SaveNewOfflineResidentAnswerDocuments(offlineResidentDocuments).then(function (response) {
                            toastr.success('Resident Answer Documents saved successfully.');
                            $cordovaFile.checkDir($rootScope.Path, "residentsQADocuments").then(function (success) {
                                $cordovaFile.removeRecursively($rootScope.Path, "residentsQADocuments").then(function (success) {
                                    $cordovaFile.createDir($rootScope.Path, "residentsQADocuments", true).then(function (success) {
                                        q.resolve();
                                    }, function (error) {
                                        toastr.error(error);
                                        toastr.error('error while creating residentsQADocuments Directory');
                                    });
                                }, function (error) {
                                    toastr.error(error);
                                    toastr.error('error while deleting residentsQADocuments Directory');
                                    q.reject(error);
                                });
                            }, function (error) {
                                q.resolve();
                            });
                        }, function (err) {
                            toastr.error('An error occurred while saving Resident Answer Documents.');
                            q.reject(error);
                        })
                    }
                    else {
                        q.resolve();
                    }
                },
                function (err) {
                    alert(err);
                    q.reject(error);
                });
            }
            else {
                q.resolve();
            }
            return q.promise;
        }

        function CreateOfflineInterventionResidentAnswerDocuments() {
            var q = $q.defer();
            var defferedInterventionResidentDocuments = [];
            var offlineInterventionResidentDocuments = [];

            if (GetNewOfflineInterventionResidentAnswerDocuments.length > 0) {
                GetNewOfflineInterventionResidentAnswerDocuments.forEach(function (InterventionResidentDocumentsItem, i) {
                    var defferofflineInterventionResidentDocument = $q.defer();
                    defferedInterventionResidentDocuments.push(defferofflineInterventionResidentDocument.promise);

                    var objInterventionResidentDocument = { ResidentQuestionAnswerID: '', ResidentFile: '', FileName: '' };
                    objInterventionResidentDocument.ResidentQuestionAnswerID = InterventionResidentDocumentsItem.ID;
                    objInterventionResidentDocument.FileName = InterventionResidentDocumentsItem.FileName;

                    var folderpath = $rootScope.Path + 'InterventionResidentsQADocuments/';
                    var filename = InterventionResidentDocumentsItem.FileName;
                    $cordovaFile.readAsDataURL(folderpath, filename).then(function (fileAsBase64) {
                        objInterventionResidentDocument.ResidentFile = fileAsBase64;
                        offlineInterventionResidentDocuments.push(objInterventionResidentDocument);
                        defferofflineInterventionResidentDocument.resolve();
                    }, function (error) {
                        toastr.error(error);
                    });
                });
                $q.all(defferedInterventionResidentDocuments).then(function (response) {
                    alert("to update Recs length=" + offlineInterventionResidentDocuments.length);
                    if (offlineInterventionResidentDocuments.length > 0) {
                        SyncronizationService.SaveNewOfflineResidentAnswerDocuments(offlineInterventionResidentDocuments).then(function (response) {
                            alert(response);
                            toastr.success('InterventionResident Answer Documents saved successfully.');
                            $cordovaFile.checkDir($rootScope.Path, "InterventionResidentsQADocuments").then(function (success) {
                                $cordovaFile.removeRecursively($rootScope.Path, "InterventionResidentsQADocuments").then(function (success) {
                                    $cordovaFile.createDir($rootScope.Path, "InterventionResidentsQADocuments", true).then(function (success) {
                                        q.resolve();
                                    }, function (error) {
                                        toastr.error(error);
                                        toastr.error('error while creating InterventionResidentsQADocuments Directory');
                                    });
                                }, function (error) {
                                    toastr.error(error);
                                    toastr.error('error while deleting InterventionResidentsQADocuments Directory');
                                    q.reject(error);
                                });
                            }, function (error) {
                                q.resolve();
                            });
                        }, function (err) {
                            toastr.error('An error occurred while saving Intervention Resident Answer Documents.');
                            q.reject(error);
                        })
                    }
                    else {
                        q.resolve();
                    }
                },
                    function (err) {
                        alert(err);
                        q.reject(error);
                    }
                    );
            }
            else {
                q.resolve();
            }
            return q.promise;
        }


        function CreateOfflineResidentAdhocInterventions() {
            var q = $q.defer();
            var defferedResidentAdhocInterventions = [];
            var offlineResidentAdhocInterventions = [];

            if (GetNewOfflineResidentAdhocIntervention.length > 0) {
                GetNewOfflineResidentAdhocIntervention.forEach(function (ResidentAdhocInterventionItem, i) {
                    var defferofflineResidentAdhocIntervention = $q.defer();
                    defferedResidentAdhocInterventions.push(defferofflineResidentAdhocIntervention.promise);

                    var objResidentAdhocIntervention = { ActionID: '', AdhocInterventionFile: '', FileName: '' };
                    objResidentAdhocIntervention.ActionID = ResidentAdhocInterventionItem.ID;
                    objResidentAdhocIntervention.FileName = ResidentAdhocInterventionItem.FileName;                   
                    var folderpath = $rootScope.Path + 'residentsAdhocInterventionDocuments/';
                    var filename = ResidentAdhocInterventionItem.FileName;                           

                    $cordovaFile.readAsDataURL(folderpath, filename).then(function (fileAsBase64) {                   
                        objResidentAdhocIntervention.AdhocInterventionFile = fileAsBase64;
                        offlineResidentAdhocInterventions.push(objResidentAdhocIntervention);
                        defferofflineResidentAdhocIntervention.resolve();
                    }, function (error) {
                        toastr.error(error);
                    });
                });
                $q.all(defferedResidentAdhocInterventions).then(function (response) {                                 
                    if (offlineResidentAdhocInterventions.length > 0) {                       
                        SyncronizationService.SaveResidentAdhocInterventionDocuments(offlineResidentAdhocInterventions).then(function (response) {
                            toastr.success('Resident Adhoc Intervention Document saved successfully.');
                            $cordovaFile.checkDir($rootScope.Path, "residentsAdhocInterventionDocuments").then(function (success) {
                                $cordovaFile.removeRecursively($rootScope.Path, "residentsAdhocInterventionDocuments").then(function (success) {
                                    $cordovaFile.createDir($rootScope.Path, "residentsAdhocInterventionDocuments", true).then(function (success) {
                                        q.resolve();
                                    }, function (error) {
                                        toastr.error(error);
                                        toastr.error('error while creating ResidentsAdhocInterventionQADocuments Directory');
                                    });
                                }, function (error) {
                                    toastr.error(error);
                                    toastr.error('error while deleting ResidentsAdhocInterventionQADocuments Directory');
                                    q.reject(error);
                                });
                            }, function (error) {
                                q.resolve();
                            });
                        }, function (err) {
                            toastr.error('An error occurred while saving  Resident Adhoc Intervention.');
                            q.reject(err);
                        })
                    }
                    else {
                        q.resolve();                    
                    }
                },
                    function (err) {
                        alert(err);
                        q.reject(error);
                    }
                    );
            }
            else {              
                q.resolve();
            }
            return q.promise;
        }


        function CreateOfflineResidentPhotos() {
            var q = $q.defer();
            var defferedResidentPhotos = [];
            var offlineResidentPhotos = [];

            if (GetNewOfflineResidentPhotos.length > 0) {
                GetNewOfflineResidentPhotos.forEach(function (ResidentPhotosItem, i) {
                    var defferofflineResidentDocument = $q.defer();
                    defferedResidentPhotos.push(defferofflineResidentDocument.promise);

                    var objResidentDocument = { ResidentID: '', PhotoUrl: '' };
                    objResidentDocument.ResidentID = ResidentPhotosItem.ID;
                    var folderpath = $rootScope.Path + 'uploads/';
                    var filename = ResidentPhotosItem.ID + ".jpeg";
                    $cordovaFile.readAsDataURL(folderpath, filename).then(function (fileAsBase64) {
                        objResidentDocument.PhotoUrl = fileAsBase64;
                        offlineResidentPhotos.push(objResidentDocument);
                        defferofflineResidentDocument.resolve();
                    }, function (error) {
                        toastr.error(error);
                    });
                });
                $q.all(defferedResidentPhotos).then(function (response) {
                    if (offlineResidentPhotos.length > 0) {
                        SyncronizationService.GetsyncNewOfflineResidentPhotos(offlineResidentPhotos).then(function (response) {
                            toastr.success('Resident photos saved successfully.');
                            $cordovaFile.checkDir($rootScope.Path, "uploads").then(function (success) {
                                $cordovaFile.removeRecursively($rootScope.Path, "uploads").then(function (success) {
                                    $cordovaFile.createDir($rootScope.Path, "uploads", true).then(function (success) {
                                        q.resolve();
                                    }, function (error) {
                                        toastr.error(error);
                                        toastr.error('error while creating uploads Directory');
                                    });
                                }, function (error) {
                                    toastr.error(error);
                                    toastr.error('error while deleting uploads Directory');
                                    q.reject(error);
                                });
                            }, function (error) {
                                q.resolve();
                            });
                        }, function (err) {
                            toastr.error('An error occurred while saving Resident Photos.');
                            q.reject(error);
                        })
                    }
                    else {
                        q.resolve();
                    }
                },
                function (err) {
                    alert(err);
                    q.reject(error);
                });
            }
            else {
                q.resolve();
            }
            return q.promise;
        }

        //Inserting MasterData of Residents Based on OrganizationID
        var StartDate = new Date();
        StartDate = moment(new Date(StartDate.setDate(StartDate.getDate() - 10))).format('YYYY-MM-DD');


        var EndDate = new Date();
        EndDate = moment(new Date(EndDate.setDate(EndDate.getDate() + 30))).format('YYYY-MM-DD');
        var GetMasterDataResidents = function () {
            console.log('GetMasterDataResidents is called');
            UsersService.GetMasterDataResidents(vm.OrganizationID, StartDate, EndDate).then(function (response) {

                //Residents       
                $rootScope.$broadcast("loader_show");
                var lstResidentsData = response.data[0].Resident;
                var differdArr = []; var lstResidentPhotos = []; var differedSyncOfData = [];
                var deferredResidents = $q.defer();
                var deferredResidentPhotos = $q.defer();
                differedSyncOfData.push(deferredResidents.promise);
                differedSyncOfData.push(deferredResidentPhotos.promise);
                lstResidentsData.forEach(function (ResidentsItem, i) {
                    if (ResidentsItem.Filedata) {
                        var differdArrdifferdArr = $q.defer();
                        differdArr.push(differdArrdifferdArr.promise);

                        var PhotoPath = $rootScope.RootUrl + ResidentsItem.Filedata;
                        var urlPaths = ResidentsItem.Filedata.split('/');
                        var fileName = urlPaths.length > 0 ? urlPaths[urlPaths.length - 1] : 'downloadedFile.txt';
                        var ResidentID = urlPaths[urlPaths.length - 2];
                        var fileNameParts = fileName.split('.');
                        var extension = fileNameParts.length > 1 ? '.' + fileNameParts[fileNameParts.length - 1] : '.txt';
                        var targetPath = $rootScope.Path + 'uploads/' + ResidentID + extension;
                        var options = { withCredentials: true };

                        $rootScope.$broadcast("loader_show");
                        $cordovaFileTransfer.download(PhotoPath, targetPath, options, true).then(function (result) {
                            var Residents = { ID: '', PhotoURL: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                            Residents.ID = ResidentID;
                            Residents.PhotoURL = targetPath;
                            Residents.IsActive = true;
                            Residents.IsSyncnised = true;
                            Residents.IsCreated = false;
                            Residents.CreatedBy = $rootScope.UserInfo.UserID;
                            lstResidentPhotos.push(Residents);
                            differdArrdifferdArr.resolve();
                            $rootScope.$broadcast("loader_hide");
                        }, function (error) {
                            $rootScope.$broadcast("loader_hide");
                            differdArrdifferdArr.resolve();
                        }, function (progress) {
                            $timeout(function () {
                                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                            });
                        });
                    }
                });

                $q.all(differdArr).then(function (response) {
                    if (lstResidentPhotos.length > 0) {
                        if (lstResidentPhotos.length > 90) {
                            var i, j, temparray, chunk = 90;
                            for (i = 0, j = lstResidentPhotos.length; i < j; i += chunk) {
                                temparray = lstResidentPhotos.slice(i, i + chunk);
                                $rootScope.$broadcast("loader_show");
                                CommonService.insertResidentPhotos(app.db, temparray).then(function () {
                                    deferredResidentPhotos.resolve();
                                    $rootScope.$broadcast("loader_hide");
                                },
                                function (err) {
                                    console.log(err);
                                    toastr.error('ResidentPhotos');
                                    deferredResidentPhotos.reject(err);
                                    $rootScope.$broadcast("loader_hide");
                                });
                            }
                        }
                        else {
                            $rootScope.$broadcast("loader_show");
                            CommonService.insertResidentPhotos(app.db, lstResidentPhotos).then(function () {
                                deferredResidentPhotos.resolve();
                                $rootScope.$broadcast("loader_hide");
                            },
                            function (err) {
                                console.log(err);
                                toastr.error('ResidentPhotos');
                                deferredResidentPhotos.reject(err);
                                $rootScope.$broadcast("loader_hide");
                            });
                        }
                    } else {
                        deferredResidentPhotos.resolve();
                    }
                },
               function (err) {
                   toastr.error(err);
               });

                var lstInsertResidentsData = [];
                for (var i = 0; i < lstResidentsData.length; i++) {
                    lstResidentsData[i].objResident.IsSyncnised = true;
                    lstResidentsData[i].objResident.IsCreated = false;
                    lstInsertResidentsData.push(lstResidentsData[i].objResident);
                }
                if (lstInsertResidentsData.length > 0) {
                    if (lstInsertResidentsData.length > 20) {
                        var i, j, temparray, chunk = 20;
                        for (i = 0, j = lstInsertResidentsData.length; i < j; i += chunk) {
                            temparray = lstInsertResidentsData.slice(i, i + chunk);
                            $rootScope.$broadcast("loader_show");
                            CommonService.insertResidents(app.db, temparray).then(function () {
                                deferredResidents.resolve();
                                $rootScope.$broadcast("loader_show");
                            },
                            function (err) {
                                deferredResidents.reject(err);
                                $rootScope.$broadcast("loader_hide");
                            });
                        }
                    }
                    else {
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertResidents(app.db, lstInsertResidentsData).then(function () {
                            deferredResidents.resolve();
                            $rootScope.$broadcast("loader_hide");
                        },
                           function (err) {
                               deferredResidents.reject(err);
                               $rootScope.$broadcast("loader_hide");
                           });
                    }
                } else {
                    deferredResidents.resolve();
                }
                $q.all(differedSyncOfData).then(function () {
                    console.log('came here');
                    $rootScope.IsSynchronizing = false;
                    $rootScope.$broadcast('SyncOfData', { Compleated: true });
                    $rootScope.$broadcast("loader_hide");
                },
                function (err) {
                    console.log(err);
                    $rootScope.IsSynchronizing = false;

                });

                //1. Action                                        
                var lstActionsData = [];
                lstActionsData = response.data[0].Actions;

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
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertActions(app.db, temparray).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }
                else {
                    $rootScope.$broadcast("loader_show");
                    CommonService.insertActions(app.db, lstInsertActions).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    },
                            function (err) {
                                $rootScope.$broadcast("loader_hide");
                            });
                }

                //Action_Days
                var lstActions_DaysData = [];
                lstActions_DaysData = response.data[0].ActionDays;

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
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertActions_Days(app.db, temparray).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }
                else {
                    $rootScope.$broadcast("loader_show");
                    CommonService.insertActions_Days(app.db, lstInsertActions_Days).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    },
                            function (err) {
                                $rootScope.$broadcast("loader_hide");
                            });
                }

                //Interventions
                var lstInterventionsData = [];
                lstInterventionsData = response.data[0].Intervention;

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
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertInterventions(app.db, temparray).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }
                else {
                    $rootScope.$broadcast("loader_show");
                    CommonService.insertInterventions(app.db, lstInsertInterventions).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    },
                            function (err) {
                                $rootScope.$broadcast("loader_hide");
                            });
                }


                //Interventions_Resident_Answers
                var lstInterventionsResidentAnswersData = [];
                lstInterventionsResidentAnswersData = response.data[0].InterventionResidentAnswers;

                var lstInsertInterventionsResidentAnswers = [];
                for (var i = 0; i < lstInterventionsResidentAnswersData.length; i++) {
                    lstInterventionsResidentAnswersData[i].IsSyncnised = true;
                    lstInterventionsResidentAnswersData[i].IsCreated = false;
                    lstInsertInterventionsResidentAnswers.push(lstInterventionsResidentAnswersData[i]);
                }
                if (lstInsertInterventionsResidentAnswers.length > 60) {
                    var i, j, temparray, chunk = 60;
                    for (i = 0, j = lstInsertInterventionsResidentAnswers.length; i < j; i += chunk) {
                        temparray = lstInsertInterventionsResidentAnswers.slice(i, i + chunk);
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertInterventions_Resident_Answers(app.db, temparray).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }
                else {
                    $rootScope.$broadcast("loader_show");
                    CommonService.insertInterventions_Resident_Answers(app.db, lstInsertInterventionsResidentAnswers).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    },
                            function (err) {
                                $rootScope.$broadcast("loader_hide");
                            });
                }

                //Resident_Relatives

                var lstResidents_RelativesData = [];
                lstResidents_RelativesData = response.data[0].ResidentRelatives;

                var lstInsertlstResidents_RelativesData = [];
                for (var i = 0; i < lstResidents_RelativesData.length; i++) {
                    lstResidents_RelativesData[i].IsSyncnised = true;
                    lstResidents_RelativesData[i].IsCreated = false;
                    lstInsertlstResidents_RelativesData.push(lstResidents_RelativesData[i]);
                }

                if (lstInsertlstResidents_RelativesData.length > 70) {
                    var i, j, temparray, chunk = 70;
                    for (i = 0, j = lstInsertlstResidents_RelativesData.length; i < j; i += chunk) {
                        temparray = lstInsertlstResidents_RelativesData.slice(i, i + chunk);
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertResidents_Relatives(app.db, temparray).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            console.log(err);
                            toastr.error('Residents_Relatives');
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }
                else {
                    $rootScope.$broadcast("loader_show");
                    CommonService.insertResidents_Relatives(app.db, lstInsertlstResidents_RelativesData).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    },
                            function (err) {
                                $rootScope.$broadcast("loader_hide");
                            });
                }

                //Pain Monitoring

                var lstPainMonitoringData = [];
                lstPainMonitoringData = response.data[0].PainMonitoring;
                var lstInsertlstPainMonitoringData = [];
                for (var i = 0; i < lstPainMonitoringData.length; i++) {
                    lstPainMonitoringData[i].IsSyncnised = true;
                    lstPainMonitoringData[i].IsCreated = false;
                    lstInsertlstPainMonitoringData.push(lstPainMonitoringData[i]);
                }

                if (lstInsertlstPainMonitoringData.length > 0) {
                    if (lstInsertlstPainMonitoringData.length > 70) {
                        var i, j, temparray, chunk = 70;
                        for (i = 0, j = lstInsertlstPainMonitoringData.length; i < j; i += chunk) {
                            temparray = lstInsertlstPainMonitoringData.slice(i, i + chunk);

                            CommonService.insertPainMonitoring(app.db, temparray).then(function () {

                            },
                            function (err) {
                                toastr.error(err);
                            });
                        }
                    }
                    else {
                        CommonService.insertPainMonitoring(app.db, lstInsertlstPainMonitoringData).then(function () {

                        },
                        function (err) {

                        });
                    }
                } else {

                }

            }, function (err) {
                console.log(err);
            }

   )
        }

        var GetResidentsDocuments = function () {
            UsersService.GetResidentsDocuments(vm.OrganizationID).then(function (response) {
                //Residents_Questions_Answers
                //$rootScope.$broadcast("loader_show");
                var lstResidents_Questions_AnswersData = response.data;
                var differdArr = []; var lstResidentQAsDocuments = [];
                lstResidents_Questions_AnswersData.forEach(function (ResidentsQAnswersItem, i) {
                    if (ResidentsQAnswersItem.Filedata) {
                        var differdArrdifferdArr = $q.defer();
                        differdArr.push(differdArrdifferdArr.promise);

                        var PhotoPath = $rootScope.RootUrl + ResidentsQAnswersItem.Filedata;
                        var urlPaths = ResidentsQAnswersItem.Filedata.split('/');
                        var fileName = urlPaths.length > 0 ? urlPaths[urlPaths.length - 1] : 'downloadedFile.txt';
                        var ResidentsQAsID = urlPaths[urlPaths.length - 2]
                        var fileNameParts = fileName.split('.');
                        var extension = fileNameParts.length > 1 ? '.' + fileNameParts[fileNameParts.length - 1] : '.txt';
                        var targetPath = $rootScope.Path + 'residentsQADocuments/' + ResidentsQAsID + extension;
                        var options = { withCredentials: true };

                        //$rootScope.$broadcast("loader_show");
                        $cordovaFileTransfer.download(PhotoPath, targetPath, options, true).then(function (result) {
                            var ResidentsQAsDocuments = { ID: '', ResidentID: '', FileName: '', ResidentFile: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                            ResidentsQAsDocuments.ID = ResidentsQAsID;
                            ResidentsQAsDocuments.FileName = fileName;
                            ResidentsQAsDocuments.ResidentFile = targetPath;
                            ResidentsQAsDocuments.IsActive = true;
                            ResidentsQAsDocuments.IsSyncnised = true;
                            ResidentsQAsDocuments.IsCreated = false;
                            ResidentsQAsDocuments.CreatedBy = $rootScope.UserInfo.UserID;
                            lstResidentQAsDocuments.push(ResidentsQAsDocuments);
                            differdArrdifferdArr.resolve();
                            //$rootScope.$broadcast("loader_hide");
                        }, function (error) {
                            //$rootScope.$broadcast("loader_hide");
                            differdArrdifferdArr.resolve();
                        }, function (progress) {
                            $timeout(function () {
                                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                            });
                        });
                    }
                });

                $q.all(differdArr).then(function (response) {
                    //$rootScope.$broadcast("loader_hide");
                    if (lstResidentQAsDocuments.length > 0) {
                        if (lstResidentQAsDocuments.length > 60) {
                            var i, j, temparray, chunk = 60;
                            for (i = 0, j = lstResidentQAsDocuments.length; i < j; i += chunk) {
                                temparray = lstResidentQAsDocuments.slice(i, i + chunk);
                                $rootScope.$broadcast("loader_show");
                                CommonService.insertResidentAnswerDocuments(app.db, temparray).then(function () {
                                    $rootScope.$broadcast("loader_hide");
                                },
                                function (err) {
                                    console.log(err);
                                    toastr.error('ResidentAnswerDocuments');
                                    $rootScope.$broadcast("loader_hide");
                                });
                            }
                        }
                        else {
                            if (lstResidentQAsDocuments.length > 0) {
                                $rootScope.$broadcast("loader_show");
                                CommonService.insertResidentAnswerDocuments(app.db, lstResidentQAsDocuments).then(function () {
                                    $rootScope.$broadcast("loader_hide");
                                },
                                function (err) {
                                    console.log(err);
                                    toastr.error('ResidentAnswerDocuments');
                                    $rootScope.$broadcast("loader_hide");
                                });
                            }
                        }
                    }
                },
               function (err) {
                   toastr.error(err);
               });

                var lstInsertlstResidents_Questions_AnswersData = [];
                for (var i = 0; i < lstResidents_Questions_AnswersData.length; i++) {
                    lstResidents_Questions_AnswersData[i].objResidents_Questions_Answers.IsSyncnised = true;
                    lstResidents_Questions_AnswersData[i].objResidents_Questions_Answers.IsCreated = false;
                    lstInsertlstResidents_Questions_AnswersData.push(lstResidents_Questions_AnswersData[i].objResidents_Questions_Answers);
                }

                if (lstInsertlstResidents_Questions_AnswersData.length > 70) {
                    var i, j, temparray, chunk = 70;
                    for (i = 0, j = lstInsertlstResidents_Questions_AnswersData.length; i < j; i += chunk) {
                        temparray = lstInsertlstResidents_Questions_AnswersData.slice(i, i + chunk);
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertResidents_Questions_Answers(app.db, temparray).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            console.log(err);
                            toastr.error('Residents_Questions_Answers');
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }
                else {
                    if (lstInsertlstResidents_Questions_AnswersData.length > 0) {
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertResidents_Questions_Answers(app.db, lstInsertlstResidents_Questions_AnswersData).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                           function (err) {
                               console.log(err);
                               toastr.error('Residents_Questions_Answers');
                               $rootScope.$broadcast("loader_hide");
                           });
                    }
                }

            });
        }

        var GetInterventionResidentsDocuments = function () {
            //$rootScope.$broadcast("loader_show");
            UsersService.GetInterventionResidentsDocuments(vm.OrganizationID).then(function (response) {
                //Resident_Interventions_Questions_Answers

                var lstResident_Interventions_Questions_AnswersData = response.data;
                var differdArr = []; var lstInterventionResidentQAsDocuments = [];
                lstResident_Interventions_Questions_AnswersData.forEach(function (ResidentInterventionsQAnswersItem, i) {
                    if (ResidentInterventionsQAnswersItem.Filedata) {
                        var contentType = CommonService.getMimeTypeForExtension(ResidentInterventionsQAnswersItem.Extention);

                        var sliceSize = 1024;
                        var byteCharacters = atob(ResidentInterventionsQAnswersItem.Filedata);
                        var bytesLength = byteCharacters.length;
                        var slicesCount = Math.ceil(bytesLength / sliceSize);
                        var byteArrays = new Array(slicesCount);

                        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                            var begin = sliceIndex * sliceSize;
                            var end = Math.min(begin + sliceSize, bytesLength);

                            var bytes = new Array(end - begin);
                            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                                bytes[i] = byteCharacters[offset].charCodeAt(0);
                            }
                            byteArrays[sliceIndex] = new Uint8Array(bytes);
                        }
                        var File = new Blob(byteArrays, { type: contentType });

                        var differdArrdifferdArr = $q.defer();
                        differdArr.push(differdArrdifferdArr.promise);

                        var folderpath = $rootScope.Path + 'InterventionResidentsQADocuments';
                        var fileNameInDb = ResidentInterventionsQAnswersItem.FileName;
                        var fileNameInFolder = ResidentInterventionsQAnswersItem.objResident_Interventions_Questions_Answers.ID + ResidentInterventionsQAnswersItem.Extention;

                        $cordovaFile.writeFile(folderpath, fileNameInFolder, File, true).then(function (success) {
                            var InterventionResidentQAsDocuments = { ID: '', FileName: '', ResidentFile: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                            InterventionResidentQAsDocuments.ID = ResidentInterventionsQAnswersItem.objResident_Interventions_Questions_Answers.ID;
                            InterventionResidentQAsDocuments.FileName = fileNameInDb;
                            InterventionResidentQAsDocuments.ResidentFile = folderpath + '/' + fileNameInFolder;
                            InterventionResidentQAsDocuments.IsActive = true;
                            InterventionResidentQAsDocuments.IsSyncnised = true;
                            InterventionResidentQAsDocuments.IsCreated = false;
                            InterventionResidentQAsDocuments.CreatedBy = $rootScope.UserInfo.UserID;
                            //CommonService.insertInterventionResidentQAsDocuments(app.db, InterventionResidentQAsDocuments);
                            lstInterventionResidentQAsDocuments.push(InterventionResidentQAsDocuments);
                            differdArrdifferdArr.resolve();
                        },
                        function (error) {
                            if (error.code == 6) {
                                var InterventionResidentQAsDocuments = { ID: '', FileName: '', ResidentFile: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                                InterventionResidentQAsDocuments.ID = ResidentInterventionsQAnswersItem.objResident_Interventions_Questions_Answers.ID;
                                InterventionResidentQAsDocuments.FileName = fileNameInDb;
                                InterventionResidentQAsDocuments.ResidentFile = folderpath + '/' + fileNameInFolder;
                                InterventionResidentQAsDocuments.IsActive = true;
                                InterventionResidentQAsDocuments.IsSyncnised = true;
                                InterventionResidentQAsDocuments.IsCreated = false;
                                InterventionResidentQAsDocuments.CreatedBy = $rootScope.UserInfo.UserID;
                                lstInterventionResidentQAsDocuments.push(InterventionResidentQAsDocuments);
                                differdArrdifferdArr.resolve();
                            }
                            else {
                                differdArrdifferdArr.reject(error);
                            }
                        });
                    }
                });

                $q.all(differdArr).then(function (response) {

                    if (lstInterventionResidentQAsDocuments.length > 60) {
                        var i, j, temparray, chunk = 60;
                        for (i = 0, j = lstInterventionResidentQAsDocuments.length; i < j; i += chunk) {
                            temparray = lstInterventionResidentQAsDocuments.slice(i, i + chunk);
                            $rootScope.$broadcast("loader_show");
                            CommonService.insertInterventionResidentAnswerDocuments(app.db, temparray).then(function () {
                                $rootScope.$broadcast("loader_hide");
                            },
                            function (err) {
                                console.log(err);
                                toastr.error('InterventionResidentAnswerDocuments');
                                $rootScope.$broadcast("loader_hide");
                            });
                        }
                    }
                    else {
                        if (lstInterventionResidentQAsDocuments.length > 0) {
                            $rootScope.$broadcast("loader_show");
                            CommonService.insertInterventionResidentAnswerDocuments(app.db, lstInterventionResidentQAsDocuments).then(function () {
                                $rootScope.$broadcast("loader_hide");
                            },
                            function (err) {
                                console.log(err);
                                toastr.error('InterventionResidentAnswerDocuments');
                                $rootScope.$broadcast("loader_hide");
                            });
                        }
                    }
                },
                function (err) {
                    toastr.error(err);
                });

                var lstInsertResident_Interventions_Questions_Answers = [];
                for (var i = 0; i < lstResident_Interventions_Questions_AnswersData.length; i++) {
                    lstResident_Interventions_Questions_AnswersData[i].objResident_Interventions_Questions_Answers.IsSyncnised = true;
                    lstResident_Interventions_Questions_AnswersData[i].objResident_Interventions_Questions_Answers.IsCreated = false;
                    lstInsertResident_Interventions_Questions_Answers.push(lstResident_Interventions_Questions_AnswersData[i].objResident_Interventions_Questions_Answers);
                }

                if (lstInsertResident_Interventions_Questions_Answers.length > 0) {
                    if (lstInsertResident_Interventions_Questions_Answers.length > 60) {
                        var i, j, temparray, chunk = 60;
                        for (i = 0, j = lstInsertResident_Interventions_Questions_Answers.length; i < j; i += chunk) {
                            temparray = lstInsertResident_Interventions_Questions_Answers.slice(i, i + chunk);
                            $rootScope.$broadcast("loader_show");
                            CommonService.insertResident_Interventions_Questions_Answers(app.db, temparray).then(function () {
                                $rootScope.$broadcast("loader_hide");
                            },
                            function (err) {
                                console.log(err);
                                toastr.error('Resident_Interventions_Questions_Answers');
                                $rootScope.$broadcast("loader_hide");
                            });
                        }
                    }
                    else {
                        $rootScope.$broadcast("loader_show");
                        CommonService.insertResident_Interventions_Questions_Answers(app.db, lstInsertResident_Interventions_Questions_Answers).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        },
                        function (err) {
                            console.log(err);
                            toastr.error('Resident_Interventions_Questions_Answers');
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                }

            });
        }       

        var GetAdhocInterventionResidentsDocuments = function () {

            var q = $q.defer();
            UsersService.GetAdhocInterventionResidentsDocuments(vm.OrganizationID).then(function (response) {
                //Resident_Interventions_Questions_Answers

                var lstResident_AdhocInterventions_Questions_AnswersData = response.data;
                var differdArr = [];
                var lstAdhocInterventionResidentQAsDocuments = [];
                lstResident_AdhocInterventions_Questions_AnswersData.forEach(function (ResidentAdhocInterventionsQAnswersItem, i) {
                    if (ResidentAdhocInterventionsQAnswersItem.Filedata) {
                        var contentType = CommonService.getMimeTypeForExtension(ResidentAdhocInterventionsQAnswersItem.Extention);

                        var sliceSize = 1024;
                        var byteCharacters = atob(ResidentAdhocInterventionsQAnswersItem.Filedata);
                        var bytesLength = byteCharacters.length;
                        var slicesCount = Math.ceil(bytesLength / sliceSize);
                        var byteArrays = new Array(slicesCount);

                        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                            var begin = sliceIndex * sliceSize;
                            var end = Math.min(begin + sliceSize, bytesLength);

                            var bytes = new Array(end - begin);
                            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                                bytes[i] = byteCharacters[offset].charCodeAt(0);
                            }
                            byteArrays[sliceIndex] = new Uint8Array(bytes);
                        }
                        var File = new Blob(byteArrays, { type: contentType });

                        var differdArrdifferdArr = $q.defer();
                        differdArr.push(differdArrdifferdArr.promise);

                        var folderpath = $rootScope.Path + 'residentsAdhocInterventionDocuments';
                        var fileNameInDb = ResidentAdhocInterventionsQAnswersItem.FileName;
                        var fileNameInFolder = ResidentAdhocInterventionsQAnswersItem.objResident_AdhocInterventions_FileData.ID + ResidentAdhocInterventionsQAnswersItem.Extention;

                        $cordovaFile.writeFile(folderpath, fileNameInFolder, File, true).then(function (success) {

                            var AdhocInterventionResidentQAsDocuments = { ID: '', FileName: '', ResidentFile: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                            AdhocInterventionResidentQAsDocuments.ID = ResidentAdhocInterventionsQAnswersItem.objResident_AdhocInterventions_FileData.ID;
                            AdhocInterventionResidentQAsDocuments.FileName = fileNameInDb;
                            AdhocInterventionResidentQAsDocuments.ResidentFile = folderpath + '/' + fileNameInFolder;
                            AdhocInterventionResidentQAsDocuments.IsActive = true;
                            AdhocInterventionResidentQAsDocuments.IsSyncnised = true;
                            AdhocInterventionResidentQAsDocuments.IsCreated = false;
                            AdhocInterventionResidentQAsDocuments.CreatedBy = $rootScope.UserInfo.UserID;
                            //CommonService.insertInterventionResidentQAsDocuments(app.db, InterventionResidentQAsDocuments);
                            lstAdhocInterventionResidentQAsDocuments.push(AdhocInterventionResidentQAsDocuments);
                            differdArrdifferdArr.resolve();
                        },
                        function (error) {
                            if (error.code == 6) {
                                var AdhocInterventionResidentQAsDocuments = { ID: '', FileName: '', ResidentFile: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                                AdhocInterventionResidentQAsDocuments.ID = ResidentAdhocInterventionsQAnswersItem.objResident_AdhocInterventions_FileData.ID;
                                AdhocInterventionResidentQAsDocuments.FileName = fileNameInDb;
                                AdhocInterventionResidentQAsDocuments.ResidentFile = folderpath + '/' + fileNameInFolder;
                                AdhocInterventionResidentQAsDocuments.IsActive = true;
                                AdhocInterventionResidentQAsDocuments.IsSyncnised = true;
                                AdhocInterventionResidentQAsDocuments.IsCreated = false;
                                AdhocInterventionResidentQAsDocuments.CreatedBy = $rootScope.UserInfo.UserID;
                                lstAdhocInterventionResidentQAsDocuments.push(AdhocInterventionResidentQAsDocuments);
                                differdArrdifferdArr.resolve();
                            }
                            else {
                                differdArrdifferdArr.reject(error);
                            }
                        });
                    }
                });

                $q.all(differdArr).then(function (response) {
                    if (lstAdhocInterventionResidentQAsDocuments.length > 60) {
                        var i, j, temparray, chunk = 60;
                        for (i = 0, j = lstAdhocInterventionResidentQAsDocuments.length; i < j; i += chunk) {
                            temparray = lstAdhocInterventionResidentQAsDocuments.slice(i, i + chunk);

                            CommonService.insertResidentAdhocInterventionDocuments(app.db, temparray).then(function () {

                            },
                            function (err) {

                                q.reject();
                            });
                        }
                    }
                    else {
                        if (lstAdhocInterventionResidentQAsDocuments.length > 0) {
                            CommonService.insertResidentAdhocInterventionDocuments(app.db, lstAdhocInterventionResidentQAsDocuments).then(function () {

                            },
                            function (err) {
                                toastr.error('InterventionAdhocResidentAnswerDocuments');
                                q.reject();
                            });
                        }
                    }
                },
                function (err) {

                    q.reject();
                });
            });
            return q.promise;
        }

    };
}())
