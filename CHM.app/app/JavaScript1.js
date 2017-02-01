(function () {
    //"use strict";

    angular.module('CHM').controller('LoginController', ['$rootScope', '$state', '$q', 'toastr', 'UsersService', 'ResidentsService', 'CommonService', 'onlineStatus', '$cordovaFile', '$cordovaDevice', '$cordovaFileTransfer', '$cordovaFileOpener2', function ($rootScope, $state, $q, toastr, UsersService, ResidentsService, CommonService, onlineStatus, $cordovaFile, $cordovaDevice, $cordovaFileTransfer, $cordovaFileOpener2) {

        var vm = this;

        vm.LogIn = function () {
         
            var regexemail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            var validemail = regexemail.test(vm.UserName);
            var objUser = {};
            objUser.UserName = vm.UserName;
            objUser.Password = vm.Password;
            if (validemail) {
                if (vm.online) {
                    CheckValidEmail(objUser);
                }
            }
            else {
                if (vm.online) {
                    CheckValidUser(objUser);
                } else {

                }
            }

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
            $cordovaFile.checkDir($rootScope.Path, "InterventionResidentsQADocuments").then(function (success) {

            }, function error(err) {
                $cordovaFile.createDir($rootScope.Path, "InterventionResidentsQADocuments", true).then(function (success) {

                });
            });
        };

        function onlineLogin() {
            if (vm.online) {


                CommonService.SelectAllLoginRecords(app.db).then(function (rs) {
                    if (rs.rows.length == 1) {
                        if (rs.rows.item(0).UserName == vm.UserName.trim() && rs.rows.item(0).Password == vm.Password.trim()) {
                            var renderRoles = function (tx, rs) {

                                if (rs.rows.length == 0) {
                                    insertMasterdata();
                                    CheckUserInfo();
                                }
                                else {
                                    CheckUserInfo();
                                }
                            };
                            app.selectQueryForMasterData(renderRoles);
                        }
                        else {
                            var objLogin = {};
                            objLogin.UserID = response.UserID;
                            objLogin.UserName = vm.UserName.trim();
                            objLogin.Password = vm.Password.trim();
                            objLogin.RoleName = response.RoleName.trim();
                            CommonService.DeleteAllLoginRecords(app.db).then(function () {
                                CommonService.InsertLogin(app.db, objLogin).then(function () {
                                    var renderRoles = function (tx, rs) {

                                        if (rs.rows.length == 0) {
                                            insertMasterdata();
                                            CheckUserInfo();
                                        }
                                        else {
                                            CheckUserInfo();
                                        }
                                    };
                                    app.selectQueryForMasterData(renderRoles);
                                },
                                function (tx, error) {
                                    toastr.error(err);
                                });
                            });
                        }
                    }
                    else if (rs.rows.length == 0) {
                        var objLogin = {};
                        objLogin.UserID = response.UserID;
                        objLogin.UserName = vm.UserName.trim();
                        objLogin.Password = vm.Password.trim();
                        objLogin.RoleName = response.RoleName.trim();
                        CommonService.InsertLogin(app.db, objLogin).then(function () {

                        },
                        function (tx, error) {
                            console.log(error);
                            toastr.error(err);
                        });
                    }
                    else {
                        toastr.error('multiple Records Exists');
                        CommonService.DeleteAllLoginRecords(app.db).then(function () {
                        })
                    }
                },
                 function (tx, error) {

                 });

            }
            else {
                CommonService.SelectAllLoginRecords(app.db).then(function (rs) {

                    if (rs.rows.length == 1) {
                        if (rs.rows.item(0).UserName == vm.UserName.trim() && rs.rows.item(0).Password == vm.Password.trim()) {
                            var objUserInfo = {};
                            objUserInfo.UserID = rs.rows.item(0).UserID;
                            objUserInfo.UserName = rs.rows.item(0).UserName;
                            objUserInfo.RoleName = rs.rows.item(0).RoleName;
                            $rootScope.UserInfo = objUserInfo;
                            CheckUserInfo();
                        }
                        else {
                            toastr.error('your prev username mismatching.');
                            $state.go("Login");
                        }

                    }
                    else {
                        $state.go('Login');
                    }
                },
                 function (tx, error) {
                     toastr.error(err);
                 });
            }
        }

        function CheckUserInfo() {
            if ($rootScope.UserInfo.RoleName == 'Administrator') {
                $rootScope.IsAdmin = true;
                $rootScope.IsSecondaryRead = false;
                $state.go('AdminSyncronization');
            }
            else if ($rootScope.UserInfo.RoleName == 'SecondaryUser' || $rootScope.UserInfo.RoleName == 'ViewOnly') {
                $rootScope.IsSecondaryRead = true;
                $rootScope.IsAdmin = false;
                $state.go('Residents');
            }
            else {
                $rootScope.IsAdmin = false;
                $rootScope.IsSecondaryRead = false;
                $state.go('Residents');
            }

        }

        function CheckValidEmail(objUser) {
            UsersService.CheckValidEmail(objUser).then(function (responce) {
                if (responce.data) {
                    UsersService.Login(vm.UserName, vm.Password).then(function (response) {
                        $rootScope.UserInfo = response;
                        CheckUserInfo();
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
            })
        }

        function CheckValidUser(objUser) {
            UsersService.CheckValidUser(objUser).then(function (responce) {
                if (responce.data != null) {
                    UsersService.Login(responce.data, vm.Password).then(function (response) {
                        $rootScope.UserInfo = response;
                        CommonService.SelectAllLoginRecords(app.db).then(function (rs) {
                            if (rs.rows.length == 1) {
                                if (rs.rows.item(0).UserName == vm.UserName.trim() && rs.rows.item(0).Password == vm.Password.trim()) {
                                    CheckUserInfo();
                                }
                                else {
                                    InsertUser(response);
                                }
                            }
                            else if (rs.rows.length == 0) {
                                InsertUser(response);
                            }
                        },
                         function (tx, error) {
                             toastr.error(err);
                         });
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
            })
        }

        function InsertUser(response) {
            var objLogin = {};
            objLogin.UserID = response.UserID;
            objLogin.UserName = vm.UserName.trim();
            objLogin.Password = vm.Password.trim();
            objLogin.RoleName = response.RoleName.trim();
            CommonService.InsertLogin(app.db, objLogin).then(function () {
                CheckUserInfo();
            },
            function (tx, error) {
                console.log(error);
                toastr.error(err);
            });
        }

        var insertMasterdata = function () {
            $rootScope.$broadcast("loader_show");
            vm.Actions();
            vm.Actions_Days();
            vm.InterventionQuestion();
            vm.InterventionQuestionAnswer();
            vm.InterventionQuestionAnswerTask();
            vm.InterventionQuestionParentQuestion();
            vm.Interventions();
            vm.InterventionsQuestionAnswerSummary();
            vm.InterventionsResidentAnswers();
            vm.OrganizationGroups();
            vm.OrganizationGroup_Organization();
            vm.Organizations();
            vm.QuestionParentQuestion();
            vm.Resident_Interventions_Questions_Answers();
            vm.Residents();
            vm.Residents_Questions_Answers();
            vm.Residents_Relatives();
            vm.BindRoles();
            vm.SectionIntervention();
            vm.SectionInterventionStatements();
            vm.SectionSummary();
            vm.BindSections();
            vm.SectionsOrganizations();
            vm.SectionsQuestions();
            vm.SectionsQuestionsAnswers();
            vm.GetSectionsQuestionsAnswersSummary();
            vm.SectionsQuestionsAnswersTasks();
            vm.SectionsQuestionsAnswersWidget();
            vm.BindUsers();
            vm.UsersOrganizations();
            vm.UserRoles();
            //ResidentsPhotos();
            $rootScope.$broadcast("loader_hide");
        }


        //1. Actions
        vm.Actions = function () {
            UsersService.GetActions().then(

             function (response) {
                 var lstActionsData = [];
                 lstActionsData = response.data;
              
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
                             console.log(err);
                             toastr.error(err);
                         });
                     }
                 }
                 else {

                     CommonService.insertActions(app.db, lstInsertActions).then(function () {

                     },
                             function (err) {
                                 console.log(err);
                                 toastr.error(err);
                             });
                 }
             },
             function (err) {
                 toastr.error('An error occurred while retrieving Actions.');
             })
        }

        //2. Actions_Days
        vm.Actions_Days = function () {
            UsersService.GetActions_Days().then(

             function (response) {
                 var lstActions_DaysData = [];
                 lstActions_DaysData = response.data;

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
                             console.log(err);
                             toastr.error(err);
                         });
                     }
                 }
                 else {

                     CommonService.insertActions_Days(app.db, lstInsertActions_Days).then(function () {

                     },
                             function (err) {
                                 console.log(err);
                                 toastr.error(err);
                             });
                 }


             },
             function (err) {
                 toastr.error('An error occurred while retrieving  Actions_Days.');
             })
        }

        //3. Intervention_Question
        vm.InterventionQuestion = function () {
            UsersService.GetIntervention_Question().then(

              function (response) {
                  var lstIntervention_QuestionData = [];
                  lstIntervention_QuestionData = response.data;
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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertIntervention_Question(app.db, lstInsertIntervention_Question).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving Intervention_Question.');
              })
        }

        //4.Intervention_Question_Answer
        vm.InterventionQuestionAnswer = function () {
            UsersService.GetIntervention_Question_Answer().then(

              function (response) {
                  var lstIntervention_Question_AnswerData = [];
                  lstIntervention_Question_AnswerData = response.data;
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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertIntervention_Question_Answer(app.db, lstInsertIntervention_Question_Answer).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving Intervention_Question_Answer.');
              })
        }

        //5.Intervention_Question_Answer_Task
        vm.InterventionQuestionAnswerTask = function () {
            UsersService.GetIntervention_Question_Answer_Task().then(

              function (response) {
                  var lstInterventionQuestionAnswerTaskData = [];
                  lstInterventionQuestionAnswerTaskData = response.data;
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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertIntervention_Question_Answer_Task(app.db, lstInsertInterventionQuestionAnswerTask).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving Intervention_Question_Answer_Task.');
              })
        }


        //6.Intervention_Question_ParentQuestion

        vm.InterventionQuestionParentQuestion = function () {
            UsersService.GetIntervention_Question_ParentQuestion().then(

              function (response) {
                  var lstInterventionQuestionParentQuestionData = [];
                  lstInterventionQuestionParentQuestionData = response.data;
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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertIntervention_Question_ParentQuestion(app.db, lstInsertInterventionQuestionParentQuestion).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving InterventionQuestionParentQuestion.');
              })
        }

        //7. Interventions

        vm.Interventions = function () {
            UsersService.GetInterventionsData().then(
              function (response) {
                  var lstInterventionsData = [];
                  lstInterventionsData = response.data;

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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertInterventions(app.db, lstInsertInterventions).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving Interventions.');
              })
        }

        //8.Interventions_Question_Answer_Summary
        vm.InterventionsQuestionAnswerSummary = function () {
            UsersService.GetInterventions_Question_Answer_Summary().then(
              function (response) {
                  var lstInterventionsQuestionAnswerSummaryData = [];
                  lstInterventionsQuestionAnswerSummaryData = response.data;
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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertInterventions_Question_Answer_Summary(app.db, lstInsertInterventionsQuestionAnswerSummary).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving Interventions_Question_Answer_Summary.');
              })
        }


        //9.Interventions_Resident_Answers
        vm.InterventionsResidentAnswers = function () {
            UsersService.GetInterventions_Resident_Answers().then(
              function (response) {
                  var lstInterventionsResidentAnswersData = [];
                  lstInterventionsResidentAnswersData = response.data;

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
                              console.log(err);
                              toastr.error(err);
                          });
                      }
                  }
                  else {

                      CommonService.insertInterventions_Resident_Answers(app.db, lstInsertInterventionsResidentAnswers).then(function () {

                      },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                  }


              },
              function (err) {
                  toastr.error('An error occurred while retrieving Interventions_Resident_Answers.');
              })
        }

        //10.OrganizationGroups

        vm.OrganizationGroups = function () {
            UsersService.GetOrganizationGroups().then(
             function (response) {
                 var lstOrganizationGroupsData = [];
                 lstOrganizationGroupsData = response.data;
                 var lstInsertOrganizationGroups = [];
                 for (var i = 0; i < lstOrganizationGroupsData.length; i++) {
                     lstInsertOrganizationGroups.push(lstOrganizationGroupsData[i]);
                 }

                 if (lstInsertOrganizationGroups.length > 50) {
                     var i, j, temparray, chunk = 50;
                     for (i = 0, j = lstInsertOrganizationGroups.length; i < j; i += chunk) {
                         temparray = lstInsertOrganizationGroups.slice(i, i + chunk);

                         CommonService.insertOrganizationGroups(app.db, temparray).then(function () {

                         },
                         function (err) {
                             console.log(err);
                             toastr.error(err);
                         });
                     }
                 }
                 else {

                     CommonService.insertOrganizationGroups(app.db, lstInsertOrganizationGroups).then(function () {

                     },
                             function (err) {
                                 console.log(err);
                                 toastr.error(err);
                             });
                 }



             },
             function (err) {
                 toastr.error('An error occurred while retrieving OrganizationGroups.');
             })
        }


        //11.OrganizationGroups_Organizations

        vm.OrganizationGroup_Organization = function () {
            UsersService.GetOrganizationGroups_Organizations().then(
             function (response) {
                 var lstOrganizationGroup_OrganizationData = [];
                 lstOrganizationGroup_OrganizationData = response.data;
                 var lstInsertlstOrganizationGroup_Organization = [];
                 for (var i = 0; i < lstOrganizationGroup_OrganizationData.length; i++) {
                     lstInsertlstOrganizationGroup_Organization.push(lstOrganizationGroup_OrganizationData[i]);
                 }

                 if (lstInsertlstOrganizationGroup_Organization.length > 50) {
                     var i, j, temparray, chunk = 50;
                     for (i = 0, j = lstInsertlstOrganizationGroup_Organization.length; i < j; i += chunk) {
                         temparray = lstInsertlstOrganizationGroup_Organization.slice(i, i + chunk);

                         CommonService.insertOrganizationGroups_Organizations(app.db, temparray).then(function () {

                         },
                         function (err) {
                             console.log(err);
                             toastr.error(err);
                         });
                     }
                 }
                 else {

                     CommonService.insertOrganizationGroups_Organizations(app.db, lstInsertlstOrganizationGroup_Organization).then(function () {

                     },
                             function (err) {
                                 console.log(err);
                                 toastr.error(err);
                             });
                 }



             },
             function (err) {
                 toastr.error('An error occurred while retrieving OrganizationGroups_Organizations.');
             })
        }

        //12.Organizations

        vm.Organizations = function () {
            UsersService.GetActiveOrganizations().then(
             function (response) {
                 var lstOrganizationsData = [];
                 lstOrganizationsData = response.data;
                 var lstInsertOrganizations = [];
                 for (var i = 0; i < lstOrganizationsData.length; i++) {
                     lstInsertOrganizations.push(lstOrganizationsData[i]);
                 }

                 if (lstInsertOrganizations.length > 50) {
                     var i, j, temparray, chunk = 50;
                     for (i = 0, j = lstInsertOrganizations.length; i < j; i += chunk) {
                         temparray = lstInsertOrganizations.slice(i, i + chunk);

                         CommonService.insertOrganizations(app.db, temparray).then(function () {

                         },
                         function (err) {
                             console.log(err);
                             toastr.error(err);
                         });
                     }
                 }
                 else {
                     CommonService.insertOrganizations(app.db, lstInsertOrganizations).then(function () {

                     },
                             function (err) {
                                 console.log(err);
                                 toastr.error(err);
                             });
                 }

             },
             function (err) {
                 toastr.error('An error occurred while retrieving Organizations.');
             })
        }


        //13. Question_ParentQuestion

        vm.QuestionParentQuestion = function () {
            ResidentsService.getAllActiveQuestionParentQuestion().then(
                 function (response) {
                     var lstQuestionParentQuestionData = [];
                     lstQuestionParentQuestionData = response.data;
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
                                 console.log(err);
                                 toastr.error(err);
                             });
                         }
                     }
                     else {
                         CommonService.insertQuestionParentQuestion(app.db, lstInsertlstQuestionParentQuestion).then(function () {

                         },
                                 function (err) {
                                     console.log(err);
                                     toastr.error(err);
                                 });
                     }

                 },
             function (err) {
                 toastr.error('An error occurred while retrieving Question_ParentQuestion.');
             })
        }


        //14.Resident_Interventions_Questions_Answers

        vm.Resident_Interventions_Questions_Answers = function () {
            UsersService.GetResident_Interventions_Questions_Answers().then(function (response) {
                var lstResident_Interventions_Questions_AnswersData = response.data;
                var differdArr = [];
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
                            CommonService.insertInterventionResidentQAsDocuments(app.db, InterventionResidentQAsDocuments);
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
                                CommonService.insertInterventionResidentQAsDocuments(app.db, InterventionResidentQAsDocuments);
                                differdArrdifferdArr.resolve();
                            }
                            else {
                                differdArrdifferdArr.reject(error);
                            }
                        });
                    }
                });

                var lstInsertResident_Interventions_Questions_Answers = [];
                for (var i = 0; i < lstResident_Interventions_Questions_AnswersData.length; i++) {
                    lstResident_Interventions_Questions_AnswersData[i].objResident_Interventions_Questions_Answers.IsSyncnised = true;
                    lstResident_Interventions_Questions_AnswersData[i].objResident_Interventions_Questions_Answers.IsCreated = false;
                    lstInsertResident_Interventions_Questions_Answers.push(lstResident_Interventions_Questions_AnswersData[i].objResident_Interventions_Questions_Answers);
                }

                if (lstInsertResident_Interventions_Questions_Answers.length > 60) {
                    var i, j, temparray, chunk = 60;
                    for (i = 0, j = lstInsertResident_Interventions_Questions_Answers.length; i < j; i += chunk) {
                        temparray = lstInsertResident_Interventions_Questions_Answers.slice(i, i + chunk);

                        CommonService.insertResident_Interventions_Questions_Answers(app.db, temparray).then(function () {

                        },
                        function (err) {
                            console.log(err);
                            toastr.error(err);
                        });
                    }
                }
                else {
                    CommonService.insertResident_Interventions_Questions_Answers(app.db, lstInsertResident_Interventions_Questions_Answers).then(function () {

                    },
                    function (err) {
                        console.log(err);
                        toastr.error(err);
                    });
                }

            },
             function (err) {
                 toastr.error('An error occurred while retrieving Resident_Interventions_Questions_Answers.');
             })
        }

        //15.Residents

        vm.Residents = function () {
            UsersService.GetResidents().then(
                           function (response) {
                               var lstResidentsData = [];
                               lstResidentsData = response.data;

                               var lstInsertResidentsData = [];
                               for (var i = 0; i < lstResidentsData.length; i++) {
                                   lstResidentsData[i].IsSyncnised = true;
                                   lstResidentsData[i].IsCreated = false;
                                   lstInsertResidentsData.push(lstResidentsData[i]);
                               }

                               if (lstInsertResidentsData.length > 20) {
                                   var i, j, temparray, chunk = 20;
                                   for (i = 0, j = lstInsertResidentsData.length; i < j; i += chunk) {
                                       temparray = lstInsertResidentsData.slice(i, i + chunk);

                                       CommonService.insertResidents(app.db, temparray).then(function () {

                                       },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                                   }
                               }
                               else {
                                   CommonService.insertResidents(app.db, lstInsertResidentsData).then(function () {

                                   },
                                           function (err) {
                                               console.log(err);
                                               toastr.error(err);
                                           });
                               }

                           },
                     function (err) {
                         toastr.error('An error occurred while retrieving Residents.');
                     })
        }

        //16.Residents_Questions_Answers

        vm.Residents_Questions_Answers = function () {
            UsersService.GetResidents_Questions_Answers().then(
                function (response) {
                    var lstResidents_Questions_AnswersData = response.data;

                    //for (var i = 0; i < lstResidents_Questions_AnswersData.length; i++) {
                    lstResidents_Questions_AnswersData.forEach(function (ResidentsQAnswersItem, i) {
                        if (ResidentsQAnswersItem.Filedata) {
                            var PhotoPath = $rootScope.RootUrl + ResidentsQAnswersItem.Filedata;
                            var urlPaths = ResidentsQAnswersItem.Filedata.split('/');
                            var fileName = urlPaths.length > 0 ? urlPaths[urlPaths.length - 1] : 'downloadedFile.txt';
                            var ResidentsQAsID = urlPaths[urlPaths.length - 2]
                            var fileNameParts = fileName.split('.');
                            var extension = fileNameParts.length > 1 ? '.' + fileNameParts[fileNameParts.length - 1] : '.txt';
                            //var mimeType = CommonService.getMimeTypeForExtension(extension);
                            var targetPath = $rootScope.Path + 'residentsQADocuments/' + ResidentsQAsID + extension;
                            var options = { withCredentials: true };

                            $rootScope.$broadcast("loader_show");
                            $cordovaFileTransfer.download(PhotoPath, targetPath, options, true).then(function (result) {
                                var ResidentsQAsDocuments = { ID: '', ResidentID: '', FileName: '', ResidentFile: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                                ResidentsQAsDocuments.ID = ResidentsQAsID;
                                ResidentsQAsDocuments.FileName = fileName;
                                ResidentsQAsDocuments.ResidentFile = targetPath;
                                ResidentsQAsDocuments.IsActive = true;
                                ResidentsQAsDocuments.IsSyncnised = true;
                                ResidentsQAsDocuments.IsCreated = false;
                                ResidentsQAsDocuments.CreatedBy = $rootScope.UserInfo.UserID;
                                CommonService.insertResidentsQAsDocuments(app.db, ResidentsQAsDocuments);
                            }, function (error) {
                                $rootScope.$broadcast("loader_hide");
                            }, function (progress) {
                                $timeout(function () {
                                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                });
                            });
                        }
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

                            CommonService.insertResidents_Questions_Answers(app.db, temparray).then(function () {

                            },
                            function (err) {
                                console.log(err);
                                toastr.error(err);
                            });
                        }
                    }
                    else {
                        CommonService.insertResidents_Questions_Answers(app.db, lstInsertlstResidents_Questions_AnswersData).then(function () {

                        },
                                function (err) {
                                    console.log(err);
                                    toastr.error(err);
                                });
                    }

                },
                             function (err) {
                                 toastr.error('An error occurred while retrieving Residents_Questions_Answers.');
                             })
        }

        //17.Residents_Relatives

        vm.Residents_Relatives = function () {
            UsersService.GetResidents_Relatives().then(
                  function (response) {
                      var lstResidents_RelativesData = [];
                      lstResidents_RelativesData = response.data;

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

                              CommonService.insertResidents_Relatives(app.db, temparray).then(function () {

                              },
                              function (err) {
                                  console.log(err);
                                  toastr.error(err);
                              });
                          }
                      }
                      else {
                          CommonService.insertResidents_Relatives(app.db, lstInsertlstResidents_RelativesData).then(function () {

                          },
                                  function (err) {
                                      console.log(err);
                                      toastr.error(err);
                                  });
                      }

                  },
                             function (err) {
                                 toastr.error('An error occurred while retrieving Residents_Relatives.');
                             })
        }

        //18. Roles
        vm.BindRoles = function () {
            UsersService.GetRoles().then(
             function (response) {
                 var lstRolesData = [];
                 lstRolesData = response.data;
                 var lstInsertRoles = [];
                 for (var i = 0; i < lstRolesData.length; i++) {
                     lstInsertRoles.push(lstRolesData[i]);
                 }
                 if (lstInsertRoles.length > 50) {
                     var i, j, temparray, chunk = 50;
                     for (i = 0, j = lstInsertRoles.length; i < j; i += chunk) {
                         temparray = lstInsertRoles.slice(i, i + chunk);

                         CommonService.insertRolesService(app.db, temparray).then(function () {

                         },
                         function (err) {
                             console.log(err);
                             toastr.error(err);
                         });
                     }
                 }
                 else {

                     CommonService.insertRolesService(app.db, lstInsertRoles).then(function () {

                     },
                             function (err) {
                                 console.log(err);
                                 toastr.error(err);
                             });
                 }


             },


             function (err) {
                 toastr.error('An error occurred while retrieving Roles.');
             })
        }

        //19.Section_Intervention

        vm.SectionIntervention = function () {
            UsersService.GetSectionIntervention().then(
                function (response) {
                    var lstSectionInterventionData = [];
                    lstSectionInterventionData = response.data;
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
                                console.log(err);
                                toastr.error(err);
                            });
                        }
                    }
                    else {
                        CommonService.insertSection_Intervention(app.db, lstInsertSectionIntervention).then(function () {

                        },
                                function (err) {
                                    console.log(err);
                                    toastr.error(err);
                                });
                    }


                },


                     function (err) {
                         toastr.error('An error occurred while retrieving Section_Intervention.');
                     })
        }


        //20.Section_Intervention_Statements

        vm.SectionInterventionStatements = function () {
            UsersService.GetSectionInterventionStatements().then(
                            function (response) {
                                var lstSectionInterventionStatementsData = [];
                                lstSectionInterventionStatementsData = response.data;
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
                                            console.log(err);
                                            toastr.error(err);
                                        });
                                    }
                                }
                                else {
                                    CommonService.insertSection_Intervention_Statements(app.db, lstInsertSectionInterventionStatements).then(function () {

                                    },
                                            function (err) {
                                                console.log(err);
                                                toastr.error(err);
                                            });
                                }


                            },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Section_Intervention_Statements.');
                             })
        }

        //21.Section_Summary

        vm.SectionSummary = function () {
            UsersService.GetSection_Summary().then(
                            function (response) {
                                var lstSectionSummaryData = [];
                                lstSectionSummaryData = response.data;
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
                                            console.log(err);
                                            toastr.error(err);
                                        });
                                    }
                                }
                                else {

                                    CommonService.insertSection_Summary(app.db, lstInsertSectionSummary).then(function () {

                                    },
                                            function (err) {
                                                console.log(err);
                                                toastr.error(err);
                                            });
                                }


                            },


                             function (err) {
                                 toastr.error('An error occurred while retrieving SectionSummary.');
                             })
        }


        //22.Sections
        vm.BindSections = function () {
            ResidentsService.GetActiveSections().then(
                       function (response) {
                           var lstBindSectionsData = [];
                           lstBindSectionsData = response.data;
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
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSections(app.db, lstInsertBindSectionsData).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections.');
                             })
        }


        //23.Sections_Organizations
        vm.SectionsOrganizations = function () {
            UsersService.GetSections_Organizations().then(
                       function (response) {
                           var lstSectionsOrganizationsData = [];
                           lstSectionsOrganizationsData = response.data;
                           var lstInsertSectionsOrganizationsData = [];
                           for (var i = 0; i < lstSectionsOrganizationsData.length; i++) {
                               lstInsertSectionsOrganizationsData.push(lstSectionsOrganizationsData[i]);
                           }
                           if (lstInsertSectionsOrganizationsData.length > 80) {
                               var i, j, temparray, chunk = 80;
                               for (i = 0, j = lstInsertSectionsOrganizationsData.length; i < j; i += chunk) {
                                   temparray = lstInsertSectionsOrganizationsData.slice(i, i + chunk);


                                   CommonService.insertSections_Organizations(app.db, temparray).then(function () {

                                   },
                                   function (err) {
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSections_Organizations(app.db, lstInsertSectionsOrganizationsData).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections_Organizations.');
                             })
        }

        //24.Sections_Questions

        vm.SectionsQuestions = function () {
            UsersService.GetSections_Questions().then(
                       function (response) {
                           var lstSectionsQuestionsData = [];
                           lstSectionsQuestionsData = response.data;
                           var lstInsertSectionsQuestionsData = [];
                           for (var i = 0; i < lstSectionsQuestionsData.length; i++) {
                               lstInsertSectionsQuestionsData.push(lstSectionsQuestionsData[i]);
                           }
                           if (lstInsertSectionsQuestionsData.length > 50) {
                               var i, j, temparray, chunk = 50;
                               for (i = 0, j = lstInsertSectionsQuestionsData.length; i < j; i += chunk) {
                                   temparray = lstInsertSectionsQuestionsData.slice(i, i + chunk);


                                   CommonService.insertSectionsQuestions(app.db, temparray).then(function () {

                                   },
                                   function (err) {
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSectionsQuestions(app.db, lstInsertSectionsQuestionsData).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections_Questions.');
                             })
        }

        //25.Sections_Questions_Answers

        vm.SectionsQuestionsAnswers = function () {
            UsersService.GetSections_Questions_Answers().then(
                       function (response) {
                           var lstSections_Questions_AnswersData = [];
                           lstSections_Questions_AnswersData = response.data;
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
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSections_Questions_Answers(app.db, lstInsertSections_Questions_Answers).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections_Questions_Answers.');
                             })
        }

        //26.Sections_Questions_Answers_Summary

        vm.GetSectionsQuestionsAnswersSummary = function () {
            UsersService.GetSections_Questions_Answers_Summary().then(
                       function (response) {
                           var lstSectionsQuestionsAnswersSummaryData = [];
                           lstSectionsQuestionsAnswersSummaryData = response.data;
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
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSections_Questions_Answers_Summary(app.db, lstInsertlstSectionsQuestionsAnswersSummary).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections_Questions_Answers_Summary.');
                             })
        }

        //27.Sections_Questions_Answers_Tasks

        vm.SectionsQuestionsAnswersTasks = function () {
            UsersService.GetSections_Questions_Answers_Tasks().then(
                       function (response) {
                           var lstSectionsQuestionsAnswersTasksData = [];
                           lstSectionsQuestionsAnswersTasksData = response.data;
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
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSections_Questions_Answers_Tasks(app.db, lstInsertSectionsQuestionsAnswersTasksData).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections_Questions_Answers_Tasks.');
                             })
        }


        //28.Sections_Questions_Answers_Widget

        vm.SectionsQuestionsAnswersWidget = function () {
            UsersService.GetSections_Questions_Answers_Widget().then(
                       function (response) {
                           var lstSectionsQuestionsAnswersWidgetData = [];
                           lstSectionsQuestionsAnswersWidgetData = response.data;
                           var lstInsertSectionsQuestionsAnswersWidget = [];
                           for (var i = 0; i < lstSectionsQuestionsAnswersWidgetData.length; i++) {
                               lstInsertSectionsQuestionsAnswersWidget.push(lstSectionsQuestionsAnswersWidgetData[i]);
                           }
                           if (lstInsertSectionsQuestionsAnswersWidget.length > 70) {
                               var i, j, temparray, chunk = 70;
                               for (i = 0, j = lstInsertSectionsQuestionsAnswersWidget.length; i < j; i += chunk) {
                                   temparray = lstInsertSectionsQuestionsAnswersWidget.slice(i, i + chunk);


                                   CommonService.insertSections_Questions_Answers_Widget(app.db, temparray).then(function () {

                                   },
                                   function (err) {
                                       console.log(err);
                                       toastr.error(err);
                                   });
                               }
                           }
                           else {

                               CommonService.insertSections_Questions_Answers_Widget(app.db, lstInsertSectionsQuestionsAnswersWidget).then(function () {

                               },
                                       function (err) {
                                           console.log(err);
                                           toastr.error(err);
                                       });
                           }


                       },


                             function (err) {
                                 toastr.error('An error occurred while retrieving Sections_Questions_Answers_Widget.');
                             })
        }


        //29.Users

        vm.BindUsers = function () {
            UsersService.GetActiveUsers().then(
                   function (response) {
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

                               },
                               function (err) {
                                   console.log(err);
                                   toastr.error(err);
                               });
                           }
                       }
                       else {

                           CommonService.insertUsers(app.db, lstInsertlstBindUsers).then(function () {

                           },
                                   function (err) {
                                       console.log(err);
                                       toastr.error(err);
                                   });
                       }


                   },


                         function (err) {
                             toastr.error('An error occurred while retrieving Users.');
                         })
        }


        //30.Users_Organizations

        vm.UsersOrganizations = function () {
            UsersService.GetUsersOrganizations().then(
                   function (response) {
                       var lstUsersOrganizationsData = [];
                       lstUsersOrganizationsData = response.data;
                       var lstInsertUsersOrganizations = [];
                       for (var i = 0; i < lstUsersOrganizationsData.length; i++) {
                           lstInsertUsersOrganizations.push(lstUsersOrganizationsData[i]);
                       }
                       if (lstInsertUsersOrganizations.length > 90) {
                           var i, j, temparray, chunk = 90;
                           for (i = 0, j = lstInsertUsersOrganizations.length; i < j; i += chunk) {
                               temparray = lstInsertUsersOrganizations.slice(i, i + chunk);


                               CommonService.insertUsers_Organizations(app.db, temparray).then(function () {

                               },
                               function (err) {
                                   console.log(err);
                                   toastr.error(err);
                               });
                           }
                       }
                       else {

                           CommonService.insertUsers_Organizations(app.db, lstInsertUsersOrganizations).then(function () {

                           },
                                   function (err) {
                                       console.log(err);
                                       toastr.error(err);
                                   });
                       }


                   },


                         function (err) {
                             toastr.error('An error occurred while retrieving Users_Organizations.');
                         })
        }


        //31.Users_Roles

        vm.UserRoles = function () {
            UsersService.GetActiveUsersRoles().then(
                   function (response) {
                       var lstUserRolesData = [];
                       lstUserRolesData = response.data;
                       var lstInsertUserRoles = [];
                       for (var i = 0; i < lstUserRolesData.length; i++) {
                           lstInsertUserRoles.push(lstUserRolesData[i]);
                       }
                       if (lstInsertUserRoles.length > 90) {
                           var i, j, temparray, chunk = 90;
                           for (i = 0, j = lstInsertUserRoles.length; i < j; i += chunk) {
                               temparray = lstInsertUserRoles.slice(i, i + chunk);


                               CommonService.insertUser_Roles(app.db, temparray).then(function () {

                               },
                               function (err) {
                                   console.log(err);
                                   toastr.error(err);
                               });
                           }
                       }
                       else {

                           CommonService.insertUser_Roles(app.db, lstInsertUserRoles).then(function () {

                           },
                                   function (err) {
                                       console.log(err);
                                       toastr.error(err);
                                   });
                       }


                   },


                         function (err) {
                             toastr.error('An error occurred while retrieving User_Roles.');
                         })
        }

        var ResidentsPhotos = function () {
            UsersService.GetResidents().then(

             function (response) {
                 vm.AllResidents = response.data;

                 allresidentData(vm.AllResidents);



                 //console.log(vm.Roles);
             },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })
        }

        var allresidentData = function (obj) {
            vm.arr = [];
            for (var i = 0; i < obj.length; i++) {

                if (obj[i].ID) {
                    var promises = [];
                    ResidentsService.GetPhotoRelativeUrl(obj[i].ID).then(
                        function (response) {
                            if (response.data != null) {
                                var ResidentData = { residentId: '', photurl: '' }
                                ResidentData.photurl = response.data;
                                var i = ResidentData.photurl.split("/");
                                ResidentData.residentId = i[4];
                                saveresident(ResidentData);
                            }

                        },
                        function (err) {

                        }
                        )



                }
            }


        }

        var saveresident = function (obj) {
            var PhotoPath = obj.photurl;
            if (PhotoPath != null) {
                vm.imgsrc = $rootScope.RootUrl + PhotoPath;
                var PhotoPath = vm.imgsrc;
                var targetPath = $rootScope.Path + 'uploads/' + obj.residentId + '.jpeg';

                var options = { withCredentials: true };

                //options.headers = headers;
                $rootScope.$broadcast("loader_show");
                $cordovaFileTransfer.download(PhotoPath, targetPath, options, true).then(function (result) {
                    var Residentphots = { ID: '', ResidentID: '', PhotoURL: '', IsActive: '', Created: new Date(), CreatedBy: '', IsSyncnised: '', IsCreated: '' }
                    Residentphots.ID = obj.residentId;
                    Residentphots.ResidentID = obj.residentId;
                    Residentphots.PhotoURL = targetPath;
                    Residentphots.IsActive = true;
                    Residentphots.IsSyncnised = true;
                    Residentphots.IsCreated = false;
                    Residentphots.CreatedBy = obj.residentId;
                    CommonService.insertOfflineResidentPhotos(app.db, Residentphots);
                }, function (error) {
                    $rootScope.$broadcast("loader_hide");
                }, function (progress) {
                    $timeout(function () {
                        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                    });
                });
            }
        }




        vm.UserName = 'samathareddy216@gmail.com';
        vm.Password = 'Password123';



    }]);

}());