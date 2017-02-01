(function () {
    "use strict";

    angular.module('CHM').controller('ResidentDocumentsViewerController', ResidentDocumentsViewerController);

    ResidentDocumentsViewerController.$inject = ['$q', '$sce', '$stateParams', '$uibModal', '$window', '$filter', 'toastr', 'ResidentDocumentsViewerService', 'ResidentsService', '$rootScope', 'InterventionsService', 'CommonService', 'onlineStatus', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout', '$scope'];

    function ResidentDocumentsViewerController($q, $sce, $stateParams, $uibModal, $window, $filter, toastr, ResidentDocumentsViewerService, ResidentsService, $rootScope, InterventionsService, CommonService, onlineStatus, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $timeout, $scope) {
        var vm = this;
        vm.online = onlineStatus.isOnline();

        vm.ResidentId = $stateParams.ResidentId;
        vm.ResidentSectionQuestionAnswers = [];
        vm.filteredResidentSectionQuestionAnswers = [];
        vm.ResidentInterventionsQuestionAnswer = [];
        vm.filteredResidentInterventionsQuestionAnswer = [];
        vm.ResidentAdhocInterventionsQuestionAnswer = [];
        vm.filteredResidentAdhocInterventionsQuestionAnswer = [];
        var lstSectionInterventions = [];


        var offlineResdientQuestionAnser = [];
        var offlineGetResidentSectionAnswerDocuments = [];
        var offlineResidentInterventionsQuestionAnswersDocuments = [];
        var offlineResidentInterventionsQuestionAnswers = [];
        var offlineResidentAdhocInterventionsDocuments = [];
        var offlineSectionQuestionAnswers = [];
        var offlineSectionQuestions = [];
        var offlineInterventionQuestionAnswers = [];
        var offlineInterventionSection = [];
        var offlineAdhocInterventionActions = [];

        vm.offlineResidentFilteredSectionQuestionAnswersDocu = [];
        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.ResidentId = $stateParams.ResidentId;
            vm.PersonalInformation = { open: true };

            if ($scope.online) {
                getResidentSectionQuestionAnswers();
                getResidentInterventionsQuestionAnswers();
                getResidentAdhocInterventions();
            }
            else {
                $rootScope.$broadcast("loader_show");

                var defferedResidentDocuments = [];
                offlineResdientQuestionAnser = [];
                offlineGetResidentSectionAnswerDocuments = [];
                offlineResidentInterventionsQuestionAnswersDocuments = [];
                offlineResidentInterventionsQuestionAnswers = [];
                offlineResidentAdhocInterventionsDocuments = [];
                offlineSectionQuestionAnswers = [];
                offlineSectionQuestions = [];
                offlineInterventionQuestionAnswers = [];
                offlineInterventionSection = [];
                offlineAdhocInterventionActions = [];

                var defferofflineResidentQuestionAnswer = $q.defer();
                var defferofflineResidentSectionQuestionAnswerDocuments = $q.defer();
                var defferofflineResidentInterventionsQuestionAnswersDocuments = $q.defer();
                var defferofflineResidentInterventionsQuestionAnswers = $q.defer();
                var defferofflineResidentAdhocInterventions = $q.defer();
                var defferofflineSectionQuestionAnswers = $q.defer();
                var defferofflineSectionQuestions = $q.defer();
                var defferofflineInterventionQuestionAnswers = $q.defer();
                var defferofflineInterventionSection = $q.defer();
                var defferofflineAdhocInterventionActions = $q.defer();


                defferedResidentDocuments.push(defferofflineResidentQuestionAnswer.promise);
                defferedResidentDocuments.push(defferofflineResidentSectionQuestionAnswerDocuments.promise);
                defferedResidentDocuments.push(defferofflineSectionQuestionAnswers.promise);
                defferedResidentDocuments.push(defferofflineSectionQuestions.promise);
                defferedResidentDocuments.push(defferofflineResidentInterventionsQuestionAnswersDocuments.promise);
                defferedResidentDocuments.push(defferofflineResidentInterventionsQuestionAnswers.promise);
                defferedResidentDocuments.push(defferofflineResidentAdhocInterventions.promise);
                defferedResidentDocuments.push(defferofflineInterventionQuestionAnswers.promise);
                defferedResidentDocuments.push(defferofflineInterventionSection.promise);
                defferedResidentDocuments.push(defferofflineAdhocInterventionActions.promise);


                var renderResidentQuestionAnswer = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineResdientQuestionAnser.push(rs.rows.item(i));
                    }
                    defferofflineResidentQuestionAnswer.resolve();
                };

                var renderOfflineResidentSectionQADocuments = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineGetResidentSectionAnswerDocuments.push(rs.rows.item(i));
                    }
                    defferofflineResidentSectionQuestionAnswerDocuments.resolve();
                };

                var renderOfflineSectionQuestionAnswers = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineSectionQuestionAnswers.push(rs.rows.item(i));
                    }
                    defferofflineSectionQuestionAnswers.resolve();
                };

                var renderOfflineSectionQuestions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineSectionQuestions.push(rs.rows.item(i));
                    }
                    defferofflineSectionQuestions.resolve();
                };

                var renderOfflineResidentInterventionQADocuments = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineResidentInterventionsQuestionAnswersDocuments.push(rs.rows.item(i));
                    }
                    defferofflineResidentInterventionsQuestionAnswersDocuments.resolve();
                };
                var renderOfflineResidentInterventionQA = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineResidentInterventionsQuestionAnswers.push(rs.rows.item(i));
                    }
                    defferofflineResidentInterventionsQuestionAnswers.resolve();
                };

                var renderOfflineInterventionQuestionAnswers = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineInterventionQuestionAnswers.push(rs.rows.item(i));
                    }
                    defferofflineInterventionQuestionAnswers.resolve();
                };

                var renderOfflineInterventionSection = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineInterventionSection.push(rs.rows.item(i));
                    }
                    defferofflineInterventionSection.resolve();
                };

                var renderOfflineResidentAdhocInterventions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineResidentAdhocInterventionsDocuments.push(rs.rows.item(i));
                    }
                    defferofflineResidentAdhocInterventions.resolve();
                };
                var renderOfflineAdhocInterventionsActions = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineAdhocInterventionActions.push(rs.rows.item(i));
                    }
                    defferofflineAdhocInterventionActions.resolve();
                };

                $q.all(defferedResidentDocuments).then(function (response) {
                    GetofflineResidentSectionQAs();
                    GetOfflineResidentInterventionQAs();
                    GetofflineResidentAdhocInterventionQAs();
                    $rootScope.$broadcast("loader_hide");
                },
                function (err) {
                    alert(JSON.stringify(err));
                    $rootScope.$broadcast("loader_hide");
                }
                );

                var GetPersonalInformation_Offline = function () {
                    app.GetOfflineResidents_Questions_Answers(renderResidentQuestionAnswer, vm.ResidentId);
                    app.GetResidentDocuments(renderOfflineResidentSectionQADocuments);
                    app.GetInterventionResidentAnswerDocuments(renderOfflineResidentInterventionQADocuments);
                    app.GetOfflineResident_Interventions_Questions_Answers(renderOfflineResidentInterventionQA, vm.ResidentId);
                    app.GetResidentAdhocInterventionDocuments(renderOfflineResidentAdhocInterventions);
                    app.GetOfflineSections_Questions_Answers(renderOfflineSectionQuestionAnswers);
                    app.GetOfflineSections_Questions(renderOfflineSectionQuestions);
                    app.GetOfflineIntervention_Question_Answer(renderOfflineInterventionQuestionAnswers);
                    app.GetOfflineSection_Interventions(renderOfflineInterventionSection);
                    app.GetOfflineAdhocInterventionsActions(renderOfflineAdhocInterventionsActions, vm.ResidentId);
                }
                GetPersonalInformation_Offline();
            }
        });

        //Online
        var getResidentSectionQuestionAnswers = function () {
            ResidentsService.GetAssessmentData(vm.ResidentId).then(
                  function (response) {
                      vm.ResidentSectionQuestionAnswers = response.data;                     
                      vm.filteredResidentSectionQuestionAnswers = [];
                      for (var i = 0; i < vm.ResidentSectionQuestionAnswers.length; i++) {
                          if (vm.ResidentSectionQuestionAnswers[i].ResidentFile != null) {
                              vm.ResidentSectionQuestionAnswers[i].ResidentFile = $rootScope.RootUrl + "/" + vm.ResidentSectionQuestionAnswers[i].ResidentFile;
                              vm.ResidentSectionQuestionAnswers[i].ResidentFileName = (vm.ResidentSectionQuestionAnswers[i].ResidentFile).replace(/^.*[\\\/]/, '');
                              vm.filteredResidentSectionQuestionAnswers.push(vm.ResidentSectionQuestionAnswers[i]);
                          }
                      }
                  },
                  function (err) {
                      toastr.error('An error occurred while retrieving Resident Section Question Answers.');
                  }
              );
        }

        var getResidentInterventionsQuestionAnswers = function () {

            ResidentDocumentsViewerService.GetResidentInterventions(vm.ResidentId).then(
                function (response) {
                    vm.ResidentInterventionsQuestionAnswer = response.data;                 
                    vm.filteredResidentInterventionsQuestionAnswer = [];                
                    for (var i = 0; i < vm.ResidentInterventionsQuestionAnswer.length; i++) {
                        if (vm.ResidentInterventionsQuestionAnswer[i].ResidentFile != null) {
                            vm.ResidentInterventionsQuestionAnswer[i].ResidentFile = $rootScope.RootUrl + "/" + vm.ResidentInterventionsQuestionAnswer[i].ResidentFile;
                            vm.ResidentInterventionsQuestionAnswer[i].ResidentFileName = (vm.ResidentInterventionsQuestionAnswer[i].ResidentFile).replace(/^.*[\\\/]/, '');
                            vm.filteredResidentInterventionsQuestionAnswer.push(vm.ResidentInterventionsQuestionAnswer[i]);
                        }
                    }
                },
                 function (err) {
                     toastr.error('An error occurred while retrieving Resident Interventions.');
                 }
                );
        }

        var getResidentAdhocInterventions = function () {

            var StartDate = new Date();
            StartDate = moment(new Date(StartDate.setDate(StartDate.getDate() - 10))).format('YYYY-MM-DD');

            var EndDate = new Date();
            EndDate = moment(new Date(EndDate.setDate(EndDate.getDate() + 30))).format('YYYY-MM-DD');

            ResidentDocumentsViewerService.GetResidentAdhocInterventions(vm.ResidentId, StartDate, EndDate).then(
                function (response) {
                    vm.ResidentAdhocInterventionsQuestionAnswer = response.data;
                    vm.filteredResidentAdhocInterventionsQuestionAnswer = [];                 
                    for (var i = 0; i < vm.ResidentAdhocInterventionsQuestionAnswer.length; i++) {
                        if (vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile != null) {
                            vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile = $rootScope.RootUrl + "/" + vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile;
                            vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFileName = (vm.ResidentAdhocInterventionsQuestionAnswer[i].ResidentFile).replace(/^.*[\\\/]/, '');
                            vm.filteredResidentAdhocInterventionsQuestionAnswer.push(vm.ResidentAdhocInterventionsQuestionAnswer[i]);
                        }
                    }
                },
                 function (err) {
                     toastr.error('An error occurred while retrieving Resident AdhocInterventions.');
                 }
                );
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

        //Offline
        var GetofflineResidentSectionQAs = function () {
            var arrlstdata = [];
            for (var aa = 0; aa < offlineResdientQuestionAnser.length; aa++) {
                var lstresidentdata = { ResidentFile: null, ResidentQuestionAnswer: [], FilePath: '' };

                lstresidentdata.ResidentQuestionAnswer = offlineResdientQuestionAnser[aa];
                for (var i = 0; i < offlineGetResidentSectionAnswerDocuments.length; i++) {
                    if (offlineGetResidentSectionAnswerDocuments[i].ID == offlineResdientQuestionAnser[aa].ID) {
                        lstresidentdata.ResidentFile = offlineGetResidentSectionAnswerDocuments[i].FileName;
                        lstresidentdata.FilePath = offlineGetResidentSectionAnswerDocuments[i].ResidentFile;
                        break;
                    }
                }
                arrlstdata.push(lstresidentdata);
            }

            var objResid = {};
            for (var j = 0; j < arrlstdata.length; j++) {
                if (arrlstdata[j].ResidentFile != null) {
                    objResid = {};
                    //objResid.ResidentFile = $rootScope.RootUrl + "/" + arrlstdata[j].ResidentFile;
                    //objResid.ResidentFileName = (arrlstdata[j].ResidentFile).replace(/^.*[\\\/]/, '');
                    objResid.ResidentFile = arrlstdata[j].FilePath;
                    objResid.ResidentFileName = (arrlstdata[j].ResidentFile).replace(/^.*[\\\/]/, '');
                    objResid.ResidentQuestionAnswer = arrlstdata[j].ResidentQuestionAnswer;
                    vm.offlineResidentFilteredSectionQuestionAnswersDocu.push(objResid);
                }
            }


            var SectionQuestionIDs = [];
            var obj = {};
            for (var k = 0; k < offlineSectionQuestionAnswers.length; k++) {
                for (var m = 0; m < vm.offlineResidentFilteredSectionQuestionAnswersDocu.length; m++) {
                    if (offlineSectionQuestionAnswers[k].ID == vm.offlineResidentFilteredSectionQuestionAnswersDocu[m].ResidentQuestionAnswer.Section_Question_AnswerID) {
                        obj = {};
                        obj.SectionQuestionID = offlineSectionQuestionAnswers[k].Section_QuestionID;
                        obj.ResidentFile = vm.offlineResidentFilteredSectionQuestionAnswersDocu[m].ResidentFile;
                        obj.ResidentFileName = vm.offlineResidentFilteredSectionQuestionAnswersDocu[m].ResidentFileName;
                        SectionQuestionIDs.push(obj);
                    }
                }
            }

            vm.offlineResidentQuestionAnswerDoc = [];
            for (var k = 0; k < SectionQuestionIDs.length; k++) {
                for (var m = 0; m < offlineSectionQuestions.length; m++) {
                    if (SectionQuestionIDs[k].SectionQuestionID == offlineSectionQuestions[m].ID) {
                        obj = {};
                        obj.SectionQuestion = offlineSectionQuestions[m].QuestionView;
                        obj.ResidentFile = SectionQuestionIDs[k].ResidentFile;
                        obj.ResidentFileName = SectionQuestionIDs[k].ResidentFileName;
                        vm.offlineResidentQuestionAnswerDoc.push(obj);
                    }
                }
            }
        }

        var GetOfflineResidentInterventionQAs = function () {

            var arrlstdata = [];
            for (var aa = 0; aa < offlineResidentInterventionsQuestionAnswers.length; aa++) {
                var lstresidentdata = { ResidentFile: null, ResidentInterventionQuestionAnswer: [], FilePath: '' };

                lstresidentdata.ResidentInterventionQuestionAnswer = offlineResidentInterventionsQuestionAnswers[aa];
                for (var i = 0; i < offlineResidentInterventionsQuestionAnswersDocuments.length; i++) {
                    if (offlineResidentInterventionsQuestionAnswersDocuments[i].ID == offlineResidentInterventionsQuestionAnswers[aa].ID) {
                        lstresidentdata.ResidentFile = offlineResidentInterventionsQuestionAnswersDocuments[i].FileName;
                        lstresidentdata.FilePath = offlineResidentInterventionsQuestionAnswersDocuments[i].ResidentFile;
                        break;
                    }
                }
                arrlstdata.push(lstresidentdata);
            }

            vm.offlineResidentFilteredInterventionQuestionAnswersDocuments = [];
            var objResid = {};
            for (var j = 0; j < arrlstdata.length; j++) {
                if (arrlstdata[j].ResidentFile != null) {
                    objResid = {};
                    //objResid.ResidentFile = $rootScope.RootUrl + "/" + arrlstdata[j].ResidentFile;
                    //objResid.ResidentFileName = (arrlstdata[j].ResidentFile).replace(/^.*[\\\/]/, '');
                    objResid.ResidentFile = arrlstdata[j].FilePath;
                    objResid.ResidentFileName = (arrlstdata[j].ResidentFile).replace(/^.*[\\\/]/, '');
                    objResid.ResidentInterventionQuestionAnswer = arrlstdata[j].ResidentInterventionQuestionAnswer;
                    vm.offlineResidentFilteredInterventionQuestionAnswersDocuments.push(objResid);
                }
            }

            var lstSectionInterventions = [];
            for (var k = 0; k < vm.offlineResidentFilteredInterventionQuestionAnswersDocuments.length; k++) {
                for (var m = 0; m < offlineInterventionQuestionAnswers.length; m++) {
                    if (vm.offlineResidentFilteredInterventionQuestionAnswersDocuments[k].ResidentInterventionQuestionAnswer.Intervention_Question_AnswerID == offlineInterventionQuestionAnswers[m].ID) {
                        objResid = {};
                        objResid.InterventionSectionID = offlineInterventionQuestionAnswers[m].Section_InterventionID;
                        objResid.ResidentFile =  vm.offlineResidentFilteredInterventionQuestionAnswersDocuments[k].ResidentFile;
                        objResid.ResidentFileName = (vm.offlineResidentFilteredInterventionQuestionAnswersDocuments[k].ResidentFile).replace(/^.*[\\\/]/, '');
                        lstSectionInterventions.push(objResid);
                    }
                }
            }

            vm.offlineResidentInterventionQADocuments = [];
            for (var i = 0; i < lstSectionInterventions.length; i++) {
                for (var j = 0; j < offlineInterventionSection.length; j++) {
                    if (lstSectionInterventions[i].InterventionSectionID == offlineInterventionSection[j].ID) {
                        objResid = {};
                        objResid.InterventionTitle = offlineInterventionSection[j].InterventionTitle;
                        objResid.ResidentFile =  lstSectionInterventions[i].ResidentFile;
                        objResid.ResidentFileName = (lstSectionInterventions[i].ResidentFile).replace(/^.*[\\\/]/, '');
                        vm.offlineResidentInterventionQADocuments.push(objResid);
                    }
                }
            }
        }

        var GetofflineResidentAdhocInterventionQAs = function () {

            var arrlstdata = [];
            for (var i = 0; i < offlineResidentAdhocInterventionsDocuments.length; i++) {
                for (var j = 0; j < offlineAdhocInterventionActions.length; j++) {

                    var lstresidentdata = { ResidentFileName: null, Section_InterventionID: [], FilePath: '' };
                    if (offlineResidentAdhocInterventionsDocuments[i].ID == offlineAdhocInterventionActions[j].ID) {
                        lstresidentdata.ResidentFileName = offlineResidentAdhocInterventionsDocuments[i].FileName;
                        lstresidentdata.FilePath = offlineResidentAdhocInterventionsDocuments[i].ResidentFile;
                        lstresidentdata.Section_InterventionID = offlineAdhocInterventionActions[j].Section_InterventionID;                       
                    }
                    arrlstdata.push(lstresidentdata);
                }
            }
         

            vm.offlineResidentAdhocInterventionDocuments = [];
            for (var i = 0; i < offlineInterventionSection.length; i++) {
                for (var j = 0; j < arrlstdata.length; j++) {
                    if (offlineInterventionSection[i].ID == arrlstdata[j].Section_InterventionID) {
                        var objResid = {};
                        objResid.InterventionTitle = offlineInterventionSection[i].InterventionTitle;
                        objResid.FilePath = arrlstdata[j].FilePath;
                        objResid.FileName = (arrlstdata[j].ResidentFileName);
                        vm.offlineResidentAdhocInterventionDocuments.push(objResid);
                    }
                }
            }           
        }
    }
}());