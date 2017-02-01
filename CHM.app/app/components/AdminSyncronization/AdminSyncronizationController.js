(function () {
    //"use strict";

    angular.module('CHM').controller('AdminSyncronizationController', ['$rootScope', '$state', '$q', 'onlineStatus', '$scope', 'toastr', 'UsersService', 'ResidentsService', 'CommonService', '$cordovaFile', '$cordovaDevice', '$cordovaFileTransfer', '$cordovaFileOpener2', function ($rootScope, $state, $q, onlineStatus, $scope, toastr, UsersService, ResidentsService, CommonService, $cordovaFile, $cordovaDevice, $cordovaFileTransfer, $cordovaFileOpener2) {

        var vm = this;
        UsersService.GetActiveOrganizations().then(function (response) {
            vm.organizations = response.data;
        }, function (err) {
            toastr.error('an error occured while getting organizations');
        });
        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;
            if ($scope.online == true) {

                vm.SyncOrganization = function (objOrganizationID) {
                    if (objOrganizationID) {

                        app.dropTable();
                        app.createTable();
                        vm.OrganizationID = objOrganizationID;
                        insertMasterdata();

                        $rootScope.IsAdminSynchronizing = false;

                    }

                }
            }
        });

        var insertMasterdata = function () {
            $rootScope.$broadcast("loader_show");
            var lstAdminLastSyncData = [];
            var differedMasterData = [];
            differedMasterData.push(OrganizationGroups());
            differedMasterData.push(OrganizationGroup_Organization());
            differedMasterData.push(Organizations());
            differedMasterData.push(BindRoles());
            differedMasterData.push(UsersOrganizations());
            differedMasterData.push(UserRoles());
            differedMasterData.push(UserTypes());
            differedMasterData.push(BindUsers());
            differedMasterData.push(GetMasterDataOrganization());
            differedMasterData.push(GetMasterDataResidents());
            differedMasterData.push(GetResidentsDocuments());
            differedMasterData.push(GetInterventionResidentsDocuments());
            differedMasterData.push(GetAdhocInterventionResidentsDocuments());
            differedMasterData.push(Configurations());
            lstAdminLastSyncData = [];

            $q.all(differedMasterData).then(function () {

                $rootScope.$broadcast("loader_hide");
                toastr.success("Data Synchronization completed sucessfully");

            }, function error(err) {
                $rootScope.$broadcast("loader_hide");

            })
        }



        //Users_Organizations
        function UsersOrganizations() {
            var q = $q.defer();

            UsersService.GetUsersOrganizations().then(function (response) {
                var lstUsersOrganizationsData = response.data;
                var lstInsertUsersOrganizations = [];
                for (var i = 0; i < lstUsersOrganizationsData.length; i++) {
                    if (lstUsersOrganizationsData[i].OrganizationID == vm.OrganizationID) {
                        lstInsertUsersOrganizations.push(lstUsersOrganizationsData[i]);
                    }
                }
                if (lstInsertUsersOrganizations.length > 90) {
                    var i, j, temparray, chunk = 90;
                    for (i = 0, j = lstInsertUsersOrganizations.length; i < j; i += chunk) {
                        temparray = lstInsertUsersOrganizations.slice(i, i + chunk);


                        CommonService.insertUsers_Organizations(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertUsers_Organizations(app.db, lstInsertUsersOrganizations).then(function () {
                        q.resolve();
                    },
                            function (err) {
                                q.reject();
                            });
                }
            },
                    function (err) {
                        q.reject();
                        toastr.error('An error occurred while retrieving Users_Organizations.');
                    })
            return q.promise;
        }

        //Users_Roles
        function UserRoles() {
            var q = $q.defer();

            UsersService.GetActiveUsersRoles().then(function (response) {
                var lstUserRolesData = response.data;
                var lstInsertUserRoles = [];
                for (var i = 0; i < lstUserRolesData.length; i++) {
                    lstInsertUserRoles.push(lstUserRolesData[i]);
                }
                if (lstInsertUserRoles.length > 90) {
                    var i, j, temparray, chunk = 90;
                    for (i = 0, j = lstInsertUserRoles.length; i < j; i += chunk) {
                        temparray = lstInsertUserRoles.slice(i, i + chunk);


                        CommonService.insertUser_Roles(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertUser_Roles(app.db, lstInsertUserRoles).then(function () {
                        q.resolve();
                    },
                     function (err) {
                         q.reject();
                     });
                }
            },
            function (err) {
                q.reject();
                toastr.error('An error occurred while retrieving User_Roles.');
            })
            return q.promise;
        }

        //UserTypes
        function UserTypes() {
            var q = $q.defer();
            UsersService.GetUserTypes().then(function (response) {
                var lstUserTypesData = response.data;
                var lstInsertUserTypes = [];
                for (var i = 0; i < lstUserTypesData.length; i++) {
                    lstInsertUserTypes.push(lstUserTypesData[i]);
                }
                if (lstInsertUserTypes.length > 90) {
                    var i, j, temparray, chunk = 90;
                    for (i = 0, j = lstInsertUserTypes.length; i < j; i += chunk) {
                        temparray = lstInsertUserTypes.slice(i, i + chunk);


                        CommonService.insertUser_Types(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertUser_Types(app.db, lstInsertUserTypes).then(function () {
                        q.resolve();
                    },
                     function (err) {
                         q.reject();
                     });
                }
            },
                    function (err) {
                        q.reject();
                        toastr.error('An error occurred while retrieving UserTypes.');
                    })
            return q.promise;
        }

        //Roles
        function BindRoles() {
            var q = $q.defer();
            UsersService.GetRoles().then(function (response) {
                var lstRolesData = response.data;
                var lstInsertRoles = [];
                for (var i = 0; i < lstRolesData.length; i++) {
                    lstInsertRoles.push(lstRolesData[i]);
                }
                if (lstInsertRoles.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertRoles.length; i < j; i += chunk) {
                        temparray = lstInsertRoles.slice(i, i + chunk);

                        CommonService.insertRolesService(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertRolesService(app.db, lstInsertRoles).then(function () {
                        q.resolve();
                    },
                    function (err) {
                        q.reject();
                    });
                }


            },


             function (err) {
                 q.reject();
                 toastr.error('An error occurred while retrieving Roles.');
             })
            return q.promise;
        }

        //Organizations
        function Organizations() {

            var q = $q.defer();
            UsersService.GetActiveOrganizations().then(function (response) {

                var lstOrganizationsData = response.data;
                var lstInsertOrganizations = [];
                for (var i = 0; i < lstOrganizationsData.length; i++) {

                    if (lstOrganizationsData[i].ID == vm.OrganizationID) {

                        lstInsertOrganizations.push(lstOrganizationsData[i]);
                    }
                }
                if (lstInsertOrganizations.length > 0) {

                    // if (lstInsertOrganizations.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertOrganizations.length; i < j; i += chunk) {
                        temparray = lstInsertOrganizations.slice(i, i + chunk);

                        CommonService.insertOrganizations(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }


                else {
                    CommonService.insertOrganizations(app.db, lstInsertOrganizations).then(function () {
                        q.resolve();
                    },
                          function (err) {
                              q.reject();
                          });
                }
            },
             function (err) {
                 toastr.error('An error occurred while retrieving Organizations.');
                 q.reject();
             })
            return q.promise;
        }

        //OrganizationGroups
        function OrganizationGroups() {
            var q = $q.defer();
            UsersService.GetOrganizationGroups().then(function (response) {
                var lstOrganizationGroupsData = response.data;
                var lstInsertOrganizationGroups = [];
                for (var i = 0; i < lstOrganizationGroupsData.length; i++) {
                    lstInsertOrganizationGroups.push(lstOrganizationGroupsData[i]);
                }

                if (lstInsertOrganizationGroups.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertOrganizationGroups.length; i < j; i += chunk) {
                        temparray = lstInsertOrganizationGroups.slice(i, i + chunk);

                        CommonService.insertOrganizationGroups(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertOrganizationGroups(app.db, lstInsertOrganizationGroups).then(function () {
                        q.resolve();
                    },
                       function (err) {
                           q.reject();
                       });
                }
            },
             function (err) {
                 toastr.error('An error occurred while retrieving OrganizationGroups.');
                 q.reject();
             })
            return q.promise;
        }

        //OrganizationGroups_Organizations
        function OrganizationGroup_Organization() {
            var q = $q.defer();
            UsersService.GetOrganizationGroups_Organizations().then(
             function (response) {
                 var lstOrganizationGroup_OrganizationData = response.data;
                 var lstInsertlstOrganizationGroup_Organization = [];
                 for (var i = 0; i < lstOrganizationGroup_OrganizationData.length; i++) {
                     if (lstOrganizationGroup_OrganizationData[i].OrganizationID == vm.OrganizationID) {
                         lstInsertlstOrganizationGroup_Organization.push(lstOrganizationGroup_OrganizationData[i]);
                     }
                 }
                 if (lstInsertlstOrganizationGroup_Organization.length > 50) {
                     var i, j, temparray, chunk = 50;
                     for (i = 0, j = lstInsertlstOrganizationGroup_Organization.length; i < j; i += chunk) {
                         temparray = lstInsertlstOrganizationGroup_Organization.slice(i, i + chunk);
                         CommonService.insertOrganizationGroups_Organizations(app.db, temparray).then(function () {
                             q.resolve();
                         },
                         function (err) {
                             q.reject();
                         });
                     }
                 }
                 else {
                     CommonService.insertOrganizationGroups_Organizations(app.db, lstInsertlstOrganizationGroup_Organization).then(function () {
                         q.resolve();
                     },
                        function (err) {
                            q.reject();
                        });
                 }
             },
             function (err) {
                 q.reject();
                 toastr.error('An error occurred while retrieving OrganizationGroups_Organizations.');
             })

            return q.promise;
        }

        //Users
        function BindUsers() {
            var q = $q.defer();
            UsersService.GetActiveUsers().then(function (response) {

                var lstBindUsersData = [];
                lstBindUsersData = response.data;
                var lstInsertlstBindUsers = [];
                for (var i = 0; i < lstBindUsersData.length; i++) {
                    lstInsertlstBindUsers.push(lstBindUsersData[i]);
                }
                if (lstInsertlstBindUsers.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertlstBindUsers.length; i < j; i += chunk) {
                        temparray = lstInsertlstBindUsers.slice(i, i + chunk);

                        CommonService.insertUsers(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertUsers(app.db, lstInsertlstBindUsers).then(function () {
                        q.resolve();
                    },
                            function (err) {
                                //q.reject();
                                //toastr.error('BindUsersData');
                            });
                }
            },
                    function (err) {
                        //q.reject();
                        //toastr.error('An error occurred while retrieving Users.');
                    })
            return q.promise;
        }

        //Configurations
        function Configurations() {
            var q = $q.defer();
            UsersService.GetConfigurationValues().then(function (response) {

                var lstConfigurations = [];
                lstConfigurations = response.data;
                var lstInsertConfigurations = [];
                for (var i = 0; i < lstConfigurations.length; i++) {
                    if (lstConfigurations[i].ConfigurationKey == 'AdminLastSync' && lstConfigurations[i].OrganizationID == null) {
                        lstConfigurations[i].ConfigurationValue = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    }
                    lstInsertConfigurations.push(lstConfigurations[i]);
                }
                if (lstInsertConfigurations.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertConfigurations.length; i < j; i += chunk) {
                        temparray = lstInsertConfigurations.slice(i, i + chunk);

                        CommonService.insertConfigurations(app.db, temparray).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertConfigurations(app.db, lstInsertConfigurations).then(function () {
                        q.resolve();
                    },
                            function (err) {
                                //q.reject();
                                //toastr.error('BindUsersData');
                            });
                }
            },
                    function (err) {
                        //q.reject();
                        //toastr.error('An error occurred while retrieving Users.');
                    })
            return q.promise;
        }

        //Inserting MasterData Based on Organizations
        var GetMasterDataOrganization = function () {

            var q = $q.defer();
            UsersService.GetMasterDataBasedonOrganization(vm.OrganizationID).then(function (response) {

                var lstGuid = [];
                for (var k = 0; k < response.data.length; k++) {
                    for (var j = 0; j < response.data[0].SectionsQuestions.length; j++) {
                        var arrIds = { Id: response.data[0].SectionsQuestions[j].ID };
                        lstGuid.push(arrIds)
                    }
                }

                var lstSectionsQuestionsData = [];
                lstSectionsQuestionsData = response.data[0].SectionsQuestions;
                var lstInsertSectionsQuestionsData = [];
                for (var i = 0; i < lstSectionsQuestionsData.length; i++) {
                    lstInsertSectionsQuestionsData.push(lstSectionsQuestionsData[i]);
                }
                if (lstInsertSectionsQuestionsData.length > 0) {
                    if (lstInsertSectionsQuestionsData.length > 50) {
                        var i, j, temparray, chunk = 50;
                        for (i = 0, j = lstInsertSectionsQuestionsData.length; i < j; i += chunk) {
                            temparray = lstInsertSectionsQuestionsData.slice(i, i + chunk);
                            CommonService.insertSectionsQuestions(app.db, temparray).then(function () {

                            },
                            function (err) {
                                q.reject();
                            });
                        }
                    }
                    else {
                        CommonService.insertSectionsQuestions(app.db, lstInsertSectionsQuestionsData).then(function () {
                            q.resolve();
                        },
                                function (err) {
                                    q.reject();
                                });
                    }
                }
                //Section Question Answers

                var lstSections_Questions_AnswersData = [];
                lstSections_Questions_AnswersData = response.data[0].SectionsQuestionsAnswers;
                var lstInsertSections_Questions_Answers = [];
                for (var i = 0; i < lstSections_Questions_AnswersData.length; i++) {
                    lstInsertSections_Questions_Answers.push(lstSections_Questions_AnswersData[i]);
                }
                if (lstInsertSections_Questions_Answers.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertSections_Questions_Answers.length; i < j; i += chunk) {
                        temparray = lstInsertSections_Questions_Answers.slice(i, i + chunk);
                        CommonService.insertSections_Questions_Answers(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertSections_Questions_Answers(app.db, lstInsertSections_Questions_Answers).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                // Sections  Question Answer Summary

                var lstSectionsQuestionsAnswersSummaryData = [];
                lstSectionsQuestionsAnswersSummaryData = response.data[0].SectionsQuestionsAnswersSummary;
                var lstInsertlstSectionsQuestionsAnswersSummary = [];
                for (var i = 0; i < lstSectionsQuestionsAnswersSummaryData.length; i++) {
                    lstInsertlstSectionsQuestionsAnswersSummary.push(lstSectionsQuestionsAnswersSummaryData[i]);
                }
                if (lstInsertlstSectionsQuestionsAnswersSummary.length > 70) {
                    var i, j, temparray, chunk = 70;
                    for (i = 0, j = lstInsertlstSectionsQuestionsAnswersSummary.length; i < j; i += chunk) {
                        temparray = lstInsertlstSectionsQuestionsAnswersSummary.slice(i, i + chunk);
                        CommonService.insertSections_Questions_Answers_Summary(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();

                        });
                    }
                }
                else {

                    CommonService.insertSections_Questions_Answers_Summary(app.db, lstInsertlstSectionsQuestionsAnswersSummary).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                // Sections Questions Answers Tasks

                var lstSectionsQuestionsAnswersTasksData = [];
                lstSectionsQuestionsAnswersTasksData = response.data[0].SectionsQuestions_AnswersTasks;
                var lstInsertSectionsQuestionsAnswersTasksData = [];
                for (var i = 0; i < lstSectionsQuestionsAnswersTasksData.length; i++) {
                    lstInsertSectionsQuestionsAnswersTasksData.push(lstSectionsQuestionsAnswersTasksData[i]);
                }
                if (lstInsertSectionsQuestionsAnswersTasksData.length > 70) {
                    var i, j, temparray, chunk = 70;
                    for (i = 0, j = lstInsertSectionsQuestionsAnswersTasksData.length; i < j; i += chunk) {
                        temparray = lstInsertSectionsQuestionsAnswersTasksData.slice(i, i + chunk);
                        CommonService.insertSections_Questions_Answers_Tasks(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertSections_Questions_Answers_Tasks(app.db, lstInsertSectionsQuestionsAnswersTasksData).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                //Sections

                var lstBindSectionsData = [];
                lstBindSectionsData = response.data[0].objSections;
                var lstInsertBindSectionsData = [];
                for (var i = 0; i < lstBindSectionsData.length; i++) {
                    lstInsertBindSectionsData.push(lstBindSectionsData[i]);
                }
                if (lstInsertBindSectionsData.length > 80) {
                    var i, j, temparray, chunk = 80;
                    for (i = 0, j = lstInsertBindSectionsData.length; i < j; i += chunk) {
                        temparray = lstInsertBindSectionsData.slice(i, i + chunk);


                        CommonService.insertSections(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertSections(app.db, lstInsertBindSectionsData).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }




                //Sections_Organizations

                var lstSectionsOrganizationsData = [];
                lstSectionsOrganizationsData = response.data[0].objsectionOrganization;
                var lstInsertSectionsOrganizationsData = [];
                for (var i = 0; i < lstSectionsOrganizationsData.length; i++) {
                    lstInsertSectionsOrganizationsData.push(lstSectionsOrganizationsData[i]);
                }
                if (lstInsertSectionsOrganizationsData.length > 0) {
                    if (lstInsertSectionsOrganizationsData.length > 80) {
                        var i, j, temparray, chunk = 80;
                        for (i = 0, j = lstInsertSectionsOrganizationsData.length; i < j; i += chunk) {
                            temparray = lstInsertSectionsOrganizationsData.slice(i, i + chunk);
                            CommonService.insertSections_Organizations(app.db, temparray).then(function () {
                                q.resolve();
                            },
                            function (err) {
                                q.reject();
                            });
                        }
                    }
                    else {
                        CommonService.insertSections_Organizations(app.db, lstInsertSectionsOrganizationsData).then(function () {
                            q.resolve();
                        },
                                function error(err) {
                                    q.reject();
                                    //toastr.error('Sections_Organizations');
                                });
                    }
                } else {
                    q.resolve();
                }

                var q1 = $q.defer();
                Getotherdata(lstGuid).then(function () {
                    q1.resolve();
                }, function error(err) {
                    q1.reject();
                });
                return q1.promise;

            }, function (err) {

            });
            return q.promise;
        }
        var Getotherdata = function (lstGuid) {
            var q = $q.defer();
            UsersService.GetMasterDatabasedonQuestionIds(lstGuid).then(function (response) {
                //InterventionQuestion

                var lstIntervention_QuestionData = [];
                lstIntervention_QuestionData = response.data[0].InterventionQuestion;
                var lstInsertIntervention_Question = [];
                for (var i = 0; i < lstIntervention_QuestionData.length; i++) {
                    lstInsertIntervention_Question.push(lstIntervention_QuestionData[i]);
                }
                if (lstInsertIntervention_Question.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertIntervention_Question.length; i < j; i += chunk) {
                        temparray = lstInsertIntervention_Question.slice(i, i + chunk);

                        CommonService.insertIntervention_Question(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertIntervention_Question(app.db, lstInsertIntervention_Question).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                //Intervention Question Answer

                var lstIntervention_Question_AnswerData = [];
                lstIntervention_Question_AnswerData = response.data[0].InterventionQuestionAnswer;
                var lstInsertIntervention_Question_Answer = [];
                for (var i = 0; i < lstIntervention_Question_AnswerData.length; i++) {
                    lstInsertIntervention_Question_Answer.push(lstIntervention_Question_AnswerData[i]);
                }
                if (lstInsertIntervention_Question_Answer.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstInsertIntervention_Question_Answer.length; i < j; i += chunk) {
                        temparray = lstInsertIntervention_Question_Answer.slice(i, i + chunk);

                        CommonService.insertIntervention_Question_Answer(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertIntervention_Question_Answer(app.db, lstInsertIntervention_Question_Answer).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                //Intervention Question Answer Task 

                var lstInterventionQuestionAnswerTaskData = [];
                lstInterventionQuestionAnswerTaskData = response.data[0].InterventionQuestionAnswerTask;
                var lstInsertInterventionQuestionAnswerTask = [];
                for (var i = 0; i < lstInterventionQuestionAnswerTaskData.length; i++) {
                    lstInsertInterventionQuestionAnswerTask.push(lstInterventionQuestionAnswerTaskData[i]);
                }
                if (lstInsertInterventionQuestionAnswerTask.length > 80) {
                    var i, j, temparray, chunk = 80;
                    for (i = 0, j = lstInsertInterventionQuestionAnswerTask.length; i < j; i += chunk) {
                        temparray = lstInsertInterventionQuestionAnswerTask.slice(i, i + chunk);

                        CommonService.insertIntervention_Question_Answer_Task(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertIntervention_Question_Answer_Task(app.db, lstInsertInterventionQuestionAnswerTask).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                //Intervention Question Parent Question

                var lstInterventionQuestionParentQuestionData = [];
                lstInterventionQuestionParentQuestionData = response.data[0].InterventionQuestionParentQuestion;
                var lstInsertInterventionQuestionParentQuestion = [];
                for (var i = 0; i < lstInterventionQuestionParentQuestionData.length; i++) {
                    lstInsertInterventionQuestionParentQuestion.push(lstInterventionQuestionParentQuestionData[i]);
                }
                if (lstInsertInterventionQuestionParentQuestion.length > 80) {
                    var i, j, temparray, chunk = 80;
                    for (i = 0, j = lstInsertInterventionQuestionParentQuestion.length; i < j; i += chunk) {
                        temparray = lstInsertInterventionQuestionParentQuestion.slice(i, i + chunk);

                        CommonService.insertIntervention_Question_ParentQuestion(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {

                    CommonService.insertIntervention_Question_ParentQuestion(app.db, lstInsertInterventionQuestionParentQuestion).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                //Interventions_Question_Answer_Summary

                var lstInterventionsQuestionAnswerSummaryData = [];
                lstInterventionsQuestionAnswerSummaryData = response.data[0].InterventionsQuestionAnswerSummary;
                var lstInsertInterventionsQuestionAnswerSummary = [];
                for (var i = 0; i < lstInterventionsQuestionAnswerSummaryData.length; i++) {
                    lstInsertInterventionsQuestionAnswerSummary.push(lstInterventionsQuestionAnswerSummaryData[i]);
                }
                if (lstInsertInterventionsQuestionAnswerSummary.length > 80) {
                    var i, j, temparray, chunk = 80;
                    for (i = 0, j = lstInsertInterventionsQuestionAnswerSummary.length; i < j; i += chunk) {
                        temparray = lstInsertInterventionsQuestionAnswerSummary.slice(i, i + chunk);

                        CommonService.insertInterventions_Question_Answer_Summary(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertInterventions_Question_Answer_Summary(app.db, lstInsertInterventionsQuestionAnswerSummary).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }
                //Question_ParentQuestion


                var lstQuestionParentQuestionData = [];
                lstQuestionParentQuestionData = response.data[0].QuestionParentQuestion;
                var lstInsertlstQuestionParentQuestion = [];
                for (var i = 0; i < lstQuestionParentQuestionData.length; i++) {
                    lstInsertlstQuestionParentQuestion.push(lstQuestionParentQuestionData[i]);
                }

                if (lstInsertlstQuestionParentQuestion.length > 80) {
                    var i, j, temparray, chunk = 80;
                    for (i = 0, j = lstInsertlstQuestionParentQuestion.length; i < j; i += chunk) {
                        temparray = lstInsertlstQuestionParentQuestion.slice(i, i + chunk);

                        CommonService.insertQuestionParentQuestion(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertQuestionParentQuestion(app.db, lstInsertlstQuestionParentQuestion).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }

                //Section_Intervention
                var lstSectionInterventionData = [];
                lstSectionInterventionData = response.data[0].SectionIntervention;
                var lstInsertSectionIntervention = [];
                for (var i = 0; i < lstSectionInterventionData.length; i++) {
                    lstInsertSectionIntervention.push(lstSectionInterventionData[i]);
                }
                if (lstInsertSectionIntervention.length > 70) {
                    var i, j, temparray, chunk = 70;
                    for (i = 0, j = lstInsertSectionIntervention.length; i < j; i += chunk) {
                        temparray = lstInsertSectionIntervention.slice(i, i + chunk);

                        CommonService.insertSection_Intervention(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertSection_Intervention(app.db, lstInsertSectionIntervention).then(function () {

                    },
                            function (err) {
                                q.reject();
                            });
                }
                //Section_Intervention_Statements
                var lstSectionInterventionStatementsData = [];
                lstSectionInterventionStatementsData = response.data[0].SectionInterventionStatements;
                var lstInsertSectionInterventionStatements = [];
                for (var i = 0; i < lstSectionInterventionStatementsData.length; i++) {
                    lstInsertSectionInterventionStatements.push(lstSectionInterventionStatementsData[i]);
                }
                if (lstInsertSectionInterventionStatements.length > 80) {
                    var i, j, temparray, chunk = 80;
                    for (i = 0, j = lstInsertSectionInterventionStatements.length; i < j; i += chunk) {
                        temparray = lstInsertSectionInterventionStatements.slice(i, i + chunk);

                        CommonService.insertSection_Intervention_Statements(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertSection_Intervention_Statements(app.db, lstInsertSectionInterventionStatements).then(function () {

                    },
                    function (err) {
                        q.reject();
                    });
                }
                //Section_Summary
                var lstSectionSummaryData = response.data[0].SectionSummary;
                var lstInsertSectionSummary = [];
                for (var i = 0; i < lstSectionSummaryData.length; i++) {
                    lstInsertSectionSummary.push(lstSectionSummaryData[i]);
                }
                if (lstInsertSectionSummary.length > 70) {
                    var i, j, temparray, chunk = 70;
                    for (i = 0, j = lstInsertSectionSummary.length; i < j; i += chunk) {
                        temparray = lstInsertSectionSummary.slice(i, i + chunk);
                        CommonService.insertSection_Summary(app.db, temparray).then(function () {

                        },
                        function (err) {
                            q.reject();
                        });
                    }
                }
                else {
                    CommonService.insertSection_Summary(app.db, lstInsertSectionSummary).then(function () {

                    },
                    function (err) {
                        q.reject();
                    });
                }
                //Sections_Questions_Answers_Widget
                var lstSectionsQuestionsAnswersWidgetData = [];
                lstSectionsQuestionsAnswersWidgetData = response.data[0].SectionsQuestionsAnswersWidget;
                var lstInsertSectionsQuestionsAnswersWidget = [];
                for (var i = 0; i < lstSectionsQuestionsAnswersWidgetData.length; i++) {
                    lstInsertSectionsQuestionsAnswersWidget.push(lstSectionsQuestionsAnswersWidgetData[i]);
                }
                if (lstInsertSectionsQuestionsAnswersWidget.length > 0) {
                    if (lstInsertSectionsQuestionsAnswersWidget.length > 70) {
                        var i, j, temparray, chunk = 70;
                        for (i = 0, j = lstInsertSectionsQuestionsAnswersWidget.length; i < j; i += chunk) {
                            temparray = lstInsertSectionsQuestionsAnswersWidget.slice(i, i + chunk);
                            CommonService.insertSections_Questions_Answers_Widget(app.db, temparray).then(function () {
                                q.resolve();
                            },
                            function (err) {
                                q.reject();
                            });
                        }
                    }
                    else {
                        CommonService.insertSections_Questions_Answers_Widget(app.db, lstInsertSectionsQuestionsAnswersWidget).then(function () {
                            q.resolve();
                        },
                        function (err) {
                            q.reject();
                        });
                    }
                } else {
                    q.resolve();
                }
            }, function (err) {
                q.reject();
            })
            return q.promise;
        }

        //Inserting MasterData of Residents Based on OrganizationID
        var GetMasterDataResidents = function () {
            var q = $q.defer();
            var PreviousInterventionLimit;
            var NextInterventionLimit;
            UsersService.GetConfigurationValues().then(
                      function (response) {
                          var Configurations = response.data;
                          for (var z = 0; z < Configurations.length; z++) {
                              if (Configurations[z].ConfigurationKey == 'InterventionPreviousDaysCount') {
                                  PreviousInterventionLimit = Configurations[z].ConfigurationValue;

                                  break;
                              }
                          }
                          for (var s = 0; s < Configurations.length; s++) {
                              if (Configurations[s].ConfigurationKey == 'InterventionNextDaysCount') {
                                  NextInterventionLimit = Configurations[s].ConfigurationValue;
                                  break;
                              }
                          }



                          var StartDate = new Date();
                          StartDate = moment(new Date(StartDate.setDate(StartDate.getDate() - PreviousInterventionLimit))).format('YYYY-MM-DD');
                         
                          var EndDate = new Date();
                          EndDate = moment(new Date(EndDate.setDate(EndDate.getDate() + NextInterventionLimit))).format('YYYY-MM-DD');
                 
                          UsersService.GetMasterDataResidents(vm.OrganizationID, StartDate, EndDate).then(function (response) {

                              //Residents       
                              var lstResidentsData = response.data[0].Resident;

                              var differdArr = []; var lstResidentPhotos = [];
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

                                      //$rootScope.$broadcast("loader_show");
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
                                  if (lstResidentPhotos.length > 90) {
                                      var i, j, temparray, chunk = 90;
                                      for (i = 0, j = lstResidentPhotos.length; i < j; i += chunk) {
                                          temparray = lstResidentPhotos.slice(i, i + chunk);

                                          CommonService.insertResidentPhotos(app.db, temparray).then(function () {

                                          },
                                          function (err) {
                                              //toastr.error('ResidentPhotos');
                                          });
                                      }
                                  }
                                  else {
                                      if (lstResidentPhotos.length > 0) {
                                          CommonService.insertResidentPhotos(app.db, lstResidentPhotos).then(function () {

                                          },
                                          function (err) {
                                              //toastr.error('ResidentPhotos');
                                          });
                                      }
                                  }
                              },
                             function (err) {
                                 //toastr.error(err);
                                 q.reject();
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

                                          CommonService.insertResidents(app.db, temparray).then(function () {

                                          },
                                          function (err) {
                                              q.reject();
                                          });
                                      }
                                  }
                                  else {
                                      CommonService.insertResidents(app.db, lstInsertResidentsData).then(function () {

                                      },
                                         function (err) {
                                             q.reject();
                                         });
                                  }
                              }

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

                                      CommonService.insertActions(app.db, temparray).then(function () {

                                      },
                                      function (err) {
                                          q.reject();
                                      });
                                  }
                              }
                              else {

                                  CommonService.insertActions(app.db, lstInsertActions).then(function () {

                                  },
                                          function (err) {
                                              q.reject();
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

                                      CommonService.insertActions_Days(app.db, temparray).then(function () {

                                      },
                                      function (err) {
                                          q.reject();
                                      });
                                  }
                              }
                              else {

                                  CommonService.insertActions_Days(app.db, lstInsertActions_Days).then(function () {

                                  },
                                          function (err) {
                                              q.reject();
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

                                      CommonService.insertInterventions(app.db, temparray).then(function () {

                                      },
                                      function (err) {
                                          q.reject();
                                      });
                                  }
                              }
                              else {

                                  CommonService.insertInterventions(app.db, lstInsertInterventions).then(function () {

                                  },
                                          function (err) {
                                              q.reject();
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

                                      CommonService.insertInterventions_Resident_Answers(app.db, temparray).then(function () {

                                      },
                                      function (err) {
                                          q.reject();
                                      });
                                  }
                              }
                              else {

                                  CommonService.insertInterventions_Resident_Answers(app.db, lstInsertInterventionsResidentAnswers).then(function () {

                                  },
                                          function (err) {
                                              q.reject();
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

                              if (lstInsertlstResidents_RelativesData.length > 0) {
                                  if (lstInsertlstResidents_RelativesData.length > 70) {
                                      var i, j, temparray, chunk = 70;
                                      for (i = 0, j = lstInsertlstResidents_RelativesData.length; i < j; i += chunk) {
                                          temparray = lstInsertlstResidents_RelativesData.slice(i, i + chunk);

                                          CommonService.insertResidents_Relatives(app.db, temparray).then(function () {
                                              q.resolve();
                                          },
                                          function (err) {
                                              toastr.error(err);
                                          });
                                      }
                                  }
                                  else {
                                      CommonService.insertResidents_Relatives(app.db, lstInsertlstResidents_RelativesData).then(function () {
                                          q.resolve();
                                      },
                                      function (err) {

                                      });
                                  }
                              } else {
                                  q.resolve();
                              }
                              //PainMonitoring

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
                                              q.resolve();
                                          },
                                          function (err) {
                                              toastr.error(err);
                                          });
                                      }
                                  }
                                  else {
                                      CommonService.insertPainMonitoring(app.db, lstInsertlstPainMonitoringData).then(function () {
                                          q.resolve();
                                      },
                                      function (err) {

                                      });
                                  }
                              } else {
                                  q.resolve();
                              }
                          });
                      });
            return q.promise;
        }

        var GetResidentsDocuments = function () {
            var q = $q.defer();
            UsersService.GetResidentsDocuments(vm.OrganizationID).then(function (response) {
                //Residents_Questions_Answers

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
                    if (lstResidentQAsDocuments.length > 60) {
                        var i, j, temparray, chunk = 60;
                        for (i = 0, j = lstResidentQAsDocuments.length; i < j; i += chunk) {
                            temparray = lstResidentQAsDocuments.slice(i, i + chunk);

                            CommonService.insertResidentAnswerDocuments(app.db, temparray).then(function () {

                            },
                            function (err) {
                                toastr.error(err);
                                q.reject();
                            });
                        }
                    }
                    else {
                        if (lstResidentQAsDocuments.length > 0) {
                            CommonService.insertResidentAnswerDocuments(app.db, lstResidentQAsDocuments).then(function () {

                            },
                            function (err) {
                                toastr.error('ResidentAnswerDocuments');
                                q.reject();
                            });
                        }
                    }
                },
               function (err) {
                   toastr.error(err);
                   q.reject();
               });

                var lstInsertlstResidents_Questions_AnswersData = [];
                for (var i = 0; i < lstResidents_Questions_AnswersData.length; i++) {
                    lstResidents_Questions_AnswersData[i].objResidents_Questions_Answers.IsSyncnised = true;
                    lstResidents_Questions_AnswersData[i].objResidents_Questions_Answers.IsCreated = false;
                    lstInsertlstResidents_Questions_AnswersData.push(lstResidents_Questions_AnswersData[i].objResidents_Questions_Answers);
                }

                if (lstInsertlstResidents_Questions_AnswersData.length > 0) {
                    if (lstInsertlstResidents_Questions_AnswersData.length > 70) {
                        var i, j, temparray, chunk = 70;
                        for (i = 0, j = lstInsertlstResidents_Questions_AnswersData.length; i < j; i += chunk) {
                            temparray = lstInsertlstResidents_Questions_AnswersData.slice(i, i + chunk);

                            CommonService.insertResidents_Questions_Answers(app.db, temparray).then(function () {
                                q.resolve();
                            },
                            function (err) {
                                toastr.error(err);
                                q.reject();
                            });
                        }
                    }
                    else {
                        CommonService.insertResidents_Questions_Answers(app.db, lstInsertlstResidents_Questions_AnswersData).then(function () {
                            q.resolve();
                        },
                           function (err) {
                               toastr.error('Residents_Questions_Answers');
                               q.reject();
                           });
                    }
                } else {
                    q.resolve();
                }

            });
            return q.promise;
        }

        var GetInterventionResidentsDocuments = function () {
            var q = $q.defer();
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

                            CommonService.insertInterventionResidentAnswerDocuments(app.db, temparray).then(function () {

                            },
                            function (err) {
                                toastr.error(err);
                                q.reject();
                            });
                        }
                    }
                    else {
                        if (lstInterventionResidentQAsDocuments.length > 0) {
                            CommonService.insertInterventionResidentAnswerDocuments(app.db, lstInterventionResidentQAsDocuments).then(function () {

                            },
                            function (err) {
                                toastr.error('InterventionResidentAnswerDocuments');
                                q.reject();
                            });
                        }
                    }
                },
                function (err) {
                    toastr.error(err);
                    q.reject();
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

                            CommonService.insertResident_Interventions_Questions_Answers(app.db, temparray).then(function () {
                                q.resolve();
                            },
                            function (err) {
                                toastr.error('');
                                q.reject();
                            });
                        }
                    }
                    else {
                        CommonService.insertResident_Interventions_Questions_Answers(app.db, lstInsertResident_Interventions_Questions_Answers).then(function () {
                            q.resolve();
                        },
                        function (err) {

                            toastr.error('Resident_Interventions_Questions_Answers');
                            q.reject();
                        });
                    }
                } else {
                    q.resolve();
                }

            });
            return q.promise;
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


    }//contoller ends
    ]);
}());