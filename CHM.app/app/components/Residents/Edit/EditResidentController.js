(function () {
    //  "use strict";

    angular.module('CHM').controller('EditResidentController', EditResidentController);

    EditResidentController.$inject = ['$rootScope', '$scope', '$q', '$uibModal', '$window', '$filter', '$sce', '$stateParams', '$location', '$state', '$timeout', 'toastr', 'ResidentsService', 'SweetAlert', 'onlineStatus', 'CommonService', '$cordovaFile', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout'];

    function EditResidentController($rootScope, $scope, $q, $uibModal, $window, $filter, $sce, $stateParams, $location, $state, timeout, toastr, ResidentsService, SweetAlert, onlineStatus, CommonService, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $timeout) {
        var vm = this;

        vm.ResidentId = $stateParams.ResidentId;
        vm.PersonalInformation = { open: true };
        vm.RemoveAlreadyAddedPart = [];
        vm.SelectedParts = [];
        vm.SelectedPartsOffline = [];
        vm.OrganizationID = $rootScope.OrganizationId;

        var offlineResidents = [];
        var offlineResidentPhotos = [];
        var offlineGetOnlyActiveSections = [];
        var offlineQuestionParentQuestion = [];
        var offlinesectionQuestion = [];
        var offlineSectionQuestionAnswer = [];
        var offlineResdientQuestionAnser = [];
        var offlineResidentAnswerDocuments = [];
        var offlineSecQuesAns = [];


        $timeout(function () {
            for (var i = 0; i < $(".selectedpart").length; i++) {
                var ids = $(".selectedpart")[i].id;
                if (ids != "border" && ids != "") {

                    $("#" + ids + "").css('fill', 'white');
                }
            }


            $('.selectedpart').on('click', function () {

                var Part = ($(this)[0].id);

                var Parts = Part.replace(/_/g, " ");

                if (vm.SelectedParts.length > 0) {
                    //var newpart = false;
                    var Count = 0;
                    if (Part != "border" && Part != "") {

                        vm.SelectedParts.forEach(function (item, i) {
                            if (item.PartsID == Parts) {
                                Count++;
                                if (item.Description != "") {

                                    if (item.ID) {
                                        vm.RemoveAlreadyAddedPart = [];//By Aleem
                                        vm.RemoveAlreadyAddedPart.push(item.ID);
                                    }

                                    vm.AlertPainMonitoringPart().then(function (response) {
                                        if (response) {

                                            vm.SelectedParts.splice(i, 1);
                                            $("#" + Part + "").css('fill', 'white');
                                            vm.DeletePainMonitoring();

                                        }
                                    }, function err(err) {
                                        console.log(err);
                                    });
                                }
                                else {
                                    vm.SelectedParts.splice(i, 1);
                                    $scope.$digest();
                                    $("#" + Part + "").css('fill', 'white');
                                }
                            }
                        })


                        if (Count == 0) {


                            $("#" + Part + "").css('fill', 'red');
                            vm.SelectedParts.push({ PartsID: Parts, Description: "", ResidentID: vm.ResidentId, OrganizationID: vm.OrganizationID });
                            $scope.$digest();
                        }
                    }
                }
                else {

                    $("#" + Part + "").css('fill', 'red');
                    vm.SelectedParts.push({ PartsID: Parts, Description: "", ResidentID: vm.ResidentId, OrganizationID: vm.OrganizationID });
                    $scope.$digest();
                }

            });

            var GetPainMonitoring = function () {
                var ResidentID = vm.ResidentId;
                if ($scope.online == true) {
                    ResidentsService.GetPainMonitoring(ResidentID).then(
                  function (response) {
                      vm.SelectedParts = response.data;

                      BindColor(vm.SelectedParts);
                  }


                  ),
                  function (err) {
                      toastr.error('An error occurred while retrieving Pain Monitoring.');
                  }
                }
                else {
                    var defferedPainMonitoring = [];
                    offlinePainMonitoring = [];
                    var defferofflinePainMonitoring = $q.defer();

                    defferedPainMonitoring.push(defferofflinePainMonitoring.promise);

                    var renderOfflinePainMonitoring = function (tx, rs) {

                        for (var i = 0; i < rs.rows.length; i++) {

                            if (rs.rows.item(i).ResidentID == vm.ResidentId) {
                                offlinePainMonitoring.push(rs.rows.item(i));
                                vm.SelectedParts = offlinePainMonitoring;
                                BindColor(vm.SelectedParts);
                            }
                        }
                        defferofflinePainMonitoring.resolve();
                    };
                    app.GetOfflinePainMonitoring(renderOfflinePainMonitoring);
                }
            }
            GetPainMonitoring();

            //Binding the color in Pageload
            vm.SavePainMonitoring = function () {
                 if (vm.online) {
                    ResidentsService.SavePainMonitoring(vm.SelectedParts).success(function (response) {
                       if (vm.RemoveAlreadyAddedPart.length == 0) {
                            GetPainMonitoring();
                        }
                        else {
                            vm.DeletePainMonitoring();
                            GetPainMonitoring();
                        }
                        toastr.success("Pain Monitoring Updated Sucessfully");

                        for (var i = 0; i < vm.SelectedParts.length; i++) {
                            //if (vm.SelectedParts[i].ID == "undefined") {
                                if (typeof vm.SelectedParts[i].ID == 'undefined' || vm.SelectedParts[i].ID == null || vm.SelectedParts[i].ID == "") {
                                for (var k = 0; k < response.length; k++) {
                                    if (response[k].PartsID == vm.SelectedParts[i].PartsID) {
                                        vm.SelectedParts[i].ID = response[k].ID;
                                        vm.SelectedParts[i].NewlyAdded = true;
                                        break;
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < vm.SelectedParts.length; i++) {
                            if (vm.SelectedParts[i].ID && !vm.SelectedParts[i].NewlyAdded) {
                                vm.SelectedParts[i].IsSyncnised = true;
                                vm.SelectedParts[i].IsCreated = false;
                                CommonService.UpdatePainMonitoring(app.db, vm.SelectedParts[i]).then(function () {

                                }, function (err) {
                                    toastr.error('An error occured while updating Pain Monitoring.');
                                });
                            }
                            else { 
                                //for (var k = 0; k < response.length; k++) {
                                //    if (response[k].PartsID == objPainMonitoring[i].PartsID) {
                                //        objPainMonitoring[i].ID = response[k].ID;
                                //        break;
                                //    }
                                //}
                                //vm.SelectedParts[i].ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                                vm.SelectedParts[i].IsActive = true;
                                vm.SelectedParts[i].OrganizationID = $rootScope.OrganizationId;
                                vm.SelectedParts[i].Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                vm.SelectedParts[i].CreatedBy = $rootScope.UserInfo.UserID;
                                vm.SelectedParts[i].Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                vm.SelectedParts[i].ModifiedBy = $rootScope.UserInfo.UserID;
                                vm.SelectedParts[i].IsSyncnised = true;
                                vm.SelectedParts[i].IsCreated = false;

                                CommonService.insertOfflinePainMonitoring(app.db, vm.SelectedParts[i]).then(function () {

                                }, function (err) {
                                    toastr.error('An error occured while saving Pain Monitoring.');
                                });
                               }

                        }
                    }, function (err) {
                        toastr.error('An error occured while saving Pain Monitoring.');
                    });
                }
                 else {//offline SavePainMonitoring

                    var objPainMonitoring = vm.SelectedParts;
                   
                 
                    for (var i = 0; i < objPainMonitoring.length; i++) {
                        if (objPainMonitoring[i].ID) {

                            objPainMonitoring[i].IsSyncnised = false;
                            objPainMonitoring[i].IsCreated = false;
                            CommonService.UpdatePainMonitoring(app.db, objPainMonitoring[i]).then(function () {
                            });

                            toastr.success(' PainMonitoring Parts Updated successfully.');
                        }
                              
                        else {

                            objPainMonitoring[i].ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                            objPainMonitoring[i].IsActive = true;
                            objPainMonitoring[i].OrganizationID = $rootScope.OrganizationId;
                            objPainMonitoring[i].Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                            objPainMonitoring[i].CreatedBy = $rootScope.UserInfo.UserID;
                            objPainMonitoring[i].Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                            objPainMonitoring[i].ModifiedBy = $rootScope.UserInfo.UserID;
                            objPainMonitoring[i].IsSyncnised = false;
                            objPainMonitoring[i].IsCreated = true;

                            CommonService.insertOfflinePainMonitoring(app.db, objPainMonitoring[i]).then(function () {




                            });
                          

                        }
                   

                    }
                    toastr.success(' PainMonitoring Parts Saved successfully.');

                }
            }

            //Delete Pain Monitoring
            vm.DeletePainMonitoring = function () {

                if ($scope.online == true) {
                    ResidentsService.DeletePainMonitoringPart(vm.RemoveAlreadyAddedPart).then(function (response) {

                        var objDeletePainMonitoring = {};

                        objDeletePainMonitoring = vm.RemoveAlreadyAddedPart;
                        for (var i = 0; i < objDeletePainMonitoring.length; i++) {

                            CommonService.UpdateDeletedPainMonitoring(app.db, objDeletePainMonitoring[i]).then(function () {
                            });
                        }
                        toastr.success("Deleted PainMonitered Parts Sucessfully");

                        //   GetPainMonitoring();
                    }, function (err) {

                        toastr.error('An error occured while deleting Pain Monitoring.');
                    })
                }

                else {// Offline  Pain Monitoring
                    var objDeletePainMonitoring = vm.RemoveAlreadyAddedPart;
                    for (var i = 0; i < objDeletePainMonitoring.length; i++) {

                        CommonService.UpdateDeletedPainMonitoring(app.db, objDeletePainMonitoring[i]).then(function () {

                        });
                    }
                    toastr.success("Deleted PainMonitered Parts Sucessfully");


                }

            }
            var BindColor = function (obj) {

                for (var i = 0; i < obj.length; i++) {
                    var image = obj[i].PartsID.replace(/ /g, "_");

                    $("#" + image + "").css('fill', 'red');
                }

            }

        });


        $scope.onlineStatus = onlineStatus;


        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.ResidentId = $stateParams.ResidentId;
            vm.PersonalInformation = { open: true };

            if ($scope.online) {
                if ($rootScope.IsSynchronizing) {
                    $scope.$on('SyncOfData', function (event, args) {
                        if (args.Compleated) {
                            GetPersonalInformation();
                            GetDataFromOnline();
                        }

                    });
                }
                else {
                    GetPersonalInformation();
                    GetDataFromOnline();
                }
            }
            else {
                $rootScope.$broadcast("loader_show");
                var defferedResident = [];
                offlineResidents = [];
                offlineResidentPhotos = [];
                //-------------------
                offlineGetOnlyActiveSections = [];
                offlineQuestionParentQuestion = [];
                offlinesectionQuestion = [];
                offlineSectionQuestionAnswer = [];
                offlineResdientQuestionAnser = [];
                offlineResidentAnswerDocuments = [];
                offlineSecQuesAns = [];

                var defferofflineResident = $q.defer();
                var defferofflineResidentPhotos = $q.defer();
                //------------------
                var deffergetonlyactivesection = $q.defer();
                var deffergetonlyQuestionParentQuestion = $q.defer();
                var deffergetsectionQuestion = $q.defer();
                var deffergetsectionQuestionAnswer = $q.defer();
                var deffergetresidentQuestionAnswer = $q.defer();
                var defferResidentAnswerDocuments = $q.defer();

                //---------------
                defferedResident.push(defferofflineResident.promise);
                defferedResident.push(defferofflineResidentPhotos.promise);
                //-----------
                defferedResident.push(deffergetonlyactivesection.promise);
                defferedResident.push(deffergetonlyQuestionParentQuestion.promise);
                defferedResident.push(deffergetsectionQuestion.promise);
                defferedResident.push(deffergetsectionQuestionAnswer.promise);
                defferedResident.push(deffergetresidentQuestionAnswer.promise);
                defferedResident.push(defferResidentAnswerDocuments.promise);

                var renderOfflineResident = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        if (rs.rows.item(i).ID == vm.ResidentId)
                            offlineResidents.push(rs.rows.item(i));
                    }
                    defferofflineResident.resolve();
                };

                var renderOfflineResidentPhoto = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        if (rs.rows.item(i).ID == vm.ResidentId)
                            offlineResidentPhotos.push(rs.rows.item(i));
                    }
                    defferofflineResidentPhotos.resolve();
                }

                //--------------------------
                var renderofflineactivesection = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineGetOnlyActiveSections.push(rs.rows.item(i));
                    }
                    deffergetonlyactivesection.resolve();
                };
                var renderofflineQuestionParentQuestion = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineQuestionParentQuestion.push(rs.rows.item(i));
                    }

                    deffergetonlyQuestionParentQuestion.resolve();
                };
                var renderofflineSectionQuestion = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlinesectionQuestion.push(rs.rows.item(i));
                    }
                    deffergetsectionQuestion.resolve();
                };
                var renderofflinesectionQuestionAnswer = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineSectionQuestionAnswer.push(rs.rows.item(i));
                    }
                    deffergetsectionQuestionAnswer.resolve();
                };
                var renderResidentQuestionAnswer = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineResdientQuestionAnser.push(rs.rows.item(i));
                    }
                    deffergetresidentQuestionAnswer.resolve();
                };
                var renderResidentAnswerDocuments = function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        offlineResidentAnswerDocuments.push(rs.rows.item(i));
                    }
                    defferResidentAnswerDocuments.resolve();
                };


                $q.all(defferedResident).then(function (response) {
                    GetofflineResidentPersonalData();
                    $rootScope.$broadcast("loader_hide");
                },
                 function (err) {
                     //console.log('err');
                 }
                );

                var GetPersonalInformation_Offline = function () {
                    app.GetOfflineResidents(renderOfflineResident);
                    app.GetOfflineResidentPhotos(renderOfflineResidentPhoto);
                    //----------------
                    app.GetOfflineSections(renderofflineactivesection);
                    app.GetOfflineQuestionParentQuestion(renderofflineQuestionParentQuestion);
                    app.GetOfflineSections_Questions(renderofflineSectionQuestion);
                    app.GetOfflineSections_Questions_Answers(renderofflinesectionQuestionAnswer)
                    app.GetOfflineResidents_Questions_Answers(renderResidentQuestionAnswer, vm.ResidentId);
                    app.GetResidentDocuments(renderResidentAnswerDocuments);
                }
                GetPersonalInformation_Offline();
            }
        });

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        var GetofflineResidentPersonalData = function () {

            if (offlineResidents.length > 0) {
                for (var i = 0; i < offlineResidents.length; i++) {
                    vm.Resident = offlineResidents[i];

                    if (vm.Resident.Gender == 'M') {
                        vm.showmaleimage = true;
                        vm.showfemaleimage = false;
                    }
                    else {
                        vm.showmaleimage = false;
                        vm.showfemaleimage = true;
                    }

                    for (var j = 0; j < offlineResidentPhotos.length; j++) {
                        if (offlineResidentPhotos[j].ID == offlineResidents[i].ID) {

                            var dob = new Date(offlineResidents[i].DOB);
                            offlineResidents[i].DOB = dob;

                            var doj = new Date(offlineResidents[i].DOJ);
                            offlineResidents[i].DOJ = doj;

                            var AdmittedFrom = new Date(offlineResidents[i].AdmittedFrom);
                            offlineResidents[i].AdmittedFrom = AdmittedFrom;

                            vm.PhotoUrl = offlineResidentPhotos[j].PhotoURL;
                        }
                    }
                }
            }
            framsesectionQuestionAnswer();
            vm.OnlySection = offlineGetOnlyActiveSections;
        }

        function framsesectionQuestionAnswer() {
            if (offlineGetOnlyActiveSections.length > 0 && offlinesectionQuestion.length > 0 && offlineSectionQuestionAnswer.length > 0) {
                offlineSecQuesAns = angular.copy(offlineGetOnlyActiveSections);
                for (var s = 0; s < offlineSecQuesAns.length; s++) {
                    offlineSecQuesAns[s].Sections_Questions = [];
                    if (offlineSecQuesAns[s].IsActive == 'true') {
                        for (var k = 0; k < offlinesectionQuestion.length; k++) {
                            if (offlineSecQuesAns[s].ID == offlinesectionQuestion[k].SectionID) {
                                if (offlinesectionQuestion[k].IsActive == 'true') {
                                    offlineSecQuesAns[s].Sections_Questions.push(offlinesectionQuestion[k]);
                                    if (offlineSecQuesAns[s].Sections_Questions.length > 0) {
                                        for (var z = 0; z < offlineSecQuesAns[s].Sections_Questions.length; z++) {
                                            offlineSecQuesAns[s].Sections_Questions[z].Sections_Questions_Answers = [];
                                            for (var l = 0; l < offlineSectionQuestionAnswer.length; l++) {
                                                if (offlineSecQuesAns[s].Sections_Questions[z].ID == offlineSectionQuestionAnswer[l].Section_QuestionID) {
                                                    offlineSecQuesAns[s].Sections_Questions[z].Sections_Questions_Answers.push(offlineSectionQuestionAnswer[l]);
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

        vm.CurrentChange = function (objSection_Question, event1) {
            objSection_Question.ChosenAnswer = $(event1.target).parents('.clsSig').first().signature('toSVG');
        }

        vm.OpenOnlyOneSection = false;
        vm.Resident = {};
        vm.DOBOpened = false;
        vm.DOAOpened = false;
        vm.AdmittedOpened = false;
        vm.LeavingDateOpened = false;
            
        vm.getNumber = function (num) {
            return new Array(num);
        }

        function GetOnlyActiveSection() {
            ResidentsService.GetOnlyActiveSection().then(
                 function (response) {
                     vm.OnlySection = response.data;
                 },
                 function (err) {

                     // toastr.error(err);
                 });
        }

        function GetDataFromOnline() {
            GetOnlyActiveSection();
            getAllActiveQuestionParentQuestion();
        }


        //DOB Datepicker Settings
        vm.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBOpened = true;
        };


        vm.openDOA = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.DOAOpened = true;
            
           
        };

        vm.openAdmittedFrom = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.AdmittedOpened = true;
          
        };
        vm.openLeavingDate = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();
            vm.LeavingDateOpened = true;
        };


        vm.dateDOBOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        vm.dateDOAOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        vm.dateAdmittedOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        vm.dateLeavingDateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };

        var uniqueQuestion = function (arr) {
            var newarr = [];
            var unique = {};
            var onlydupiclateid = [];
            arr.forEach(function (item, index) {
                if (!unique[item.QuestionID]) {
                    newarr.push(item);
                    unique[item.QuestionID] = item;
                    //added this line to fix error in contienence start 5/30/2016
                    onlydupiclateid.push(item);
                    //end
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
                if (!unique[item.QuestionID]) {
                    newarr.push(item);
                    // console.log('chk');
                    // console.log(item.QuestionID);
                    unique[item.QuestionID] = item;
                }
            });

            return newarr;

        }

        function getAllActiveQuestionParentQuestion() {
            ResidentsService.getAllActiveQuestionParentQuestion().then(
            function (response) {
                vm.QuestionParentQuestion = response.data;
                //newly added 4/14/2016
                vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
            },
            function (err) {
                toastr.error('An error occurred while retrieving QuestionParentQuestion.');
            });
        }


        var SubQuestionsAsParent = function (objSubquestion, lstSubQuestions) {
            for (var z = 0; z < objSubquestion.length; z++) {
                objSubquestion[z].childQuestion = [];

                for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                    if (objSubquestion[z].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
                        for (var p = 0; p < lstSubQuestions.length; p++) {

                            if (lstSubQuestions[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

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

                for (var j = 0; j < objSubquestion[i].Sections_Questions_Answers.length; j++) {
                    objSubquestion[i].Sections_Questions_Answers[j].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (objSubquestion[i].Sections_Questions_Answers[j].ID == vm.QuestionParentQuestion[n].ParentAnswerID) {
                            for (var l = 0; l < lstSubQuestion.length; l++) {


                                if (lstSubQuestion[l].ID == vm.QuestionParentQuestion[n].QuestionID && objSubquestion[i].Sections_Questions_Answers[j].ID == vm.QuestionParentQuestion[n].ParentAnswerID) {  //newly added
                                    lstSubQuestion[l].ParentAnswerID = objSubquestion[i].Sections_Questions_Answers[j].ID;
                                    //end
                                    objSubquestion[i].Sections_Questions_Answers[j].childQuestion.push(lstSubQuestion[l]);
                                    subQuestionforAnswer(objSubquestion[i].Sections_Questions_Answers[j].childQuestion, lstSubQuestion);
                                }
                            }
                        }


                    }

                }
            }
        }
        var groupchildQuestion = function (objQuestion) {
            for (var i = 0; i < objQuestion.length; i++) {


                for (var L = 0; L < vm.AllSetQuestion.length; L++) {



                    if (vm.AllSetQuestion[L].filterdSectionQuestionID == objQuestion[i].ID) {
                        objQuestion[i].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                        if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                            objQuestion[i].childQuestion = [];
                            objQuestion[i].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                        }
                        else {
                            objQuestion[i].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                            if (objQuestion[i].childQuestion.length > 0) {
                                for (var c = 0; c < objQuestion[i].childQuestion.length; c++) {

                                    objQuestion[i].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                }
                            }

                        }

                    }

                }
                var childno = 0;
                for (var k = 0; k < objQuestion[i].Sections_Questions_Answers.length; k++) {
                    if (objQuestion[i].Sections_Questions_Answers[k].childQuestion != undefined) {
                        if (objQuestion[i].Sections_Questions_Answers[k].childQuestion.length > 0) {
                            childno = 1
                            groupchildQuestion(objQuestion[i].Sections_Questions_Answers[k].childQuestion);
                        }
                    }
                }
                if (childno == 0) {
                    if (objQuestion[i].childQuestion != undefined)
                        groupchildQuestion(objQuestion[i].childQuestion);
                }

            }
        }
        var GetAllActiveSection = function (objsection) {

            ResidentsService.GetActiveSectionByID(vm.sectionID).then(
            function (response) {
                vm.Sections = response.data;
                //newly added 4/14/2016
                vm.CopyallSectionsQuestion = angular.copy(response.data);
                //Data modification start
                vm.MainQuestion = [];
                vm.SubQuestion = [];
                vm.AllSection = [];
                //To get All Section
                for (var x = 0; x < response.data.length; x++) {
                    vm.AllSection.push(response.data[x]);
                }
                //To separate mainQuestion and subquestion start

                for (var p = 0; p < response.data.length; p++) {

                    for (var q = 0; q < response.data[p].Sections_Questions.length; q++) {
                        var z = 0;
                        for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {
                            if (vm.QuestionParentQuestion[r].QuestionID == response.data[p].Sections_Questions[q].ID) {
                                z++;
                            }
                        }

                        if (z == 0) {
                            vm.MainQuestion.push(response.data[p].Sections_Questions[q]);
                        }
                        else {
                            vm.SubQuestion.push(response.data[p].Sections_Questions[q]);
                        }
                    }
                }

                //End


                //To add subQuestion To MainQuestion start

                for (var m = 0; m < vm.MainQuestion.length; m++) {
                    vm.MainQuestion[m].childQuestion = [];
                    for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                        if (vm.MainQuestion[m].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
                            for (var p = 0; p < vm.SubQuestion.length; p++) {

                                if (vm.SubQuestion[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

                                    vm.MainQuestion[m].childQuestion.push(vm.SubQuestion[p]);
                                    SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
                                }

                            }
                        }
                    }


                }


                //End


                //To add SubQuestion To Answers Start

                for (var k = 0; k < vm.MainQuestion.length; k++) {
                    for (var y = 0; y < vm.MainQuestion[k].Sections_Questions_Answers.length; y++) {
                        vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion = [];
                        for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                            if (vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                for (var n = 0; n < vm.SubQuestion.length; n++) {

                                    if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                        vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].Sections_Questions_Answers[y].ID;
                                        vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
                                        subQuestionforAnswer(vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
                                    }
                                }
                            }


                        }
                    }

                }

                //End




                //To add Child Question to sectionquestion

                for (var k = 0; k < vm.MainQuestion.length; k++) {
                    for (var i = 0; i < vm.MainQuestion[k].childQuestion.length; i++) {

                        //Start
                        for (var y = 0; y < vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers.length; y++) {
                            vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion = [];
                            for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                                if (vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                    for (var n = 0; n < vm.SubQuestion.length; n++) {

                                        if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                            vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID;
                                            vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
                                            subQuestionforAnswer(vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
                                        }
                                    }
                                }


                            }
                        }


                        //End
                    }


                }



                //End


                //To AddQuestion To Section Start

                //console.log(vm.AllSection);
                for (var t = 0; t < vm.AllSection.length; t++) {
                    vm.AllSection[t].Sections_Questions = [];
                    for (var s = 0; s < vm.MainQuestion.length; s++) {

                        if (vm.MainQuestion[s].SectionID == vm.AllSection[t].ID) {
                            vm.AllSection[t].Sections_Questions.push(vm.MainQuestion[s]);
                        }


                    }

                }

                // vm.CopyQuestionParentQuestion
                vm.onlyduplicates = uniqueQuestion(vm.CopyQuestionParentQuestion);
                vm.uniqueQuestionIDs = uniqueval(vm.onlyduplicates);

                // console.log('Stp1');
                //console.log(vm.uniqueQuestionIDs);


                if (vm.uniqueQuestionIDs.length > 0) {
                    vm.uniqueQuestionIDswithNoParAnsIds = [];

                    for (var k = 0; k < vm.uniqueQuestionIDs.length; k++) {
                        if (vm.uniqueQuestionIDs[k].ParentAnswerID == null) {
                            vm.uniqueQuestionIDswithNoParAnsIds.push(vm.uniqueQuestionIDs[k]);
                        }
                    }



                    if (vm.uniqueQuestionIDswithNoParAnsIds.length > 0) {
                        //Step2:
                        vm.AllParentQuestions = [];
                        //var unique = {};
                        for (var j = 0; j < vm.uniqueQuestionIDswithNoParAnsIds.length; j++) {


                            var newarray = { QuestionID: '', SectionQuestion: [] }
                            newarray.QuestionID = vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID;

                            for (var m = 0; m < vm.CopyQuestionParentQuestion.length; m++) {
                                if (vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID == vm.CopyQuestionParentQuestion[m].QuestionID) {

                                    //newarray.SectionQuestion = GetQuestionsStructure(vm.CopyQuestionParentQuestion[m].ParentQuestionID);

                                    for (var u = 0; u < vm.CopyallSectionsQuestion.length; u++) {



                                        for (var r = 0; r < vm.CopyallSectionsQuestion[u].Sections_Questions.length; r++) {

                                            //console.log('end1');
                                            // console.log(vm.CopyallSectionsQuestion[u].Sections_Questions[r].ID);

                                            if ((vm.CopyallSectionsQuestion[u].Sections_Questions[r].ID == vm.CopyQuestionParentQuestion[m].ParentQuestionID)) {

                                                newarray.SectionQuestion.push(vm.CopyallSectionsQuestion[u].Sections_Questions[r]);
                                                // unique[vm.CopyQuestionParentQuestion[m].ParentQuestionID] = vm.CopyQuestionParentQuestion[m];
                                            }
                                        }

                                    }


                                }


                            }

                            if (newarray.SectionQuestion.length > 0)
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
                        }
                    }
                }




                //Step:6
                if (vm.AllSetQuestion != undefined) {
                    if (vm.AllSetQuestion.length > 0) {

                        for (var q = 0; q < vm.AllSection.length; q++) {
                              if(vm.AllSection[q].HasScore==true){
                          //  if (vm.AllSection[q].DisplayOrder == 2 || vm.AllSection[q].DisplayOrder == 7 || vm.AllSection[q].DisplayOrder == 11 || vm.AllSection[q].DisplayOrder == 6 || vm.AllSection[q].DisplayOrder == 4 || vm.AllSection[q].DisplayOrder == 9 || vm.AllSection[q].DisplayOrder == 5 || vm.AllSection[q].DisplayOrder == 8 || vm.AllSection[q].DisplayOrder == 3 || vm.AllSection[q].DisplayOrder == 15) {


                                for (var z = 0; z < vm.AllSection[q].Sections_Questions.length; z++) {

                                    for (var L = 0; L < vm.AllSetQuestion.length; L++) {


                                        if (vm.AllSetQuestion[L].filterdSectionQuestionID == vm.AllSection[q].Sections_Questions[z].ID) {
                                            vm.AllSection[q].Sections_Questions[z].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                                            if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                                                vm.AllSection[q].Sections_Questions[z].childQuestion = [];
                                                vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                            }
                                            else {
                                                vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                                if (vm.AllSection[q].Sections_Questions[z].childQuestion.length > 0) {
                                                    for (var c = 0; c < vm.AllSection[q].Sections_Questions[z].childQuestion.length; c++) {

                                                        vm.AllSection[q].Sections_Questions[z].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                    }
                                                }

                                            }

                                        }


                                    }
                                    var i = 0;
                                    for (var u = 0; u < vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers.length; u++) {
                                        if (vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers[u].childQuestion.length > 0) {
                                            i = 1;
                                            groupchildQuestion(vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers[u].childQuestion);
                                        }
                                    }
                                    if (i == 0) {
                                        groupchildQuestion(vm.AllSection[q].Sections_Questions[z].childQuestion);
                                    }
                                }
                                // console.log('step6');
                                //console.log(vm.AllSection[q]);
                            }

                        }
                    }

                }
                vm.Sections = vm.AllSection;


                objsection.Sections_Questions = [];
                objsection.Sections_Questions = vm.Sections[0].Sections_Questions;
                for (var i = 0; i < vm.Sections.length; i++) {
                    for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                        for (var k = 0; k < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; k++) {
                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault) {
                                if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault != "false") {
                                    vm.Sections[i].Sections_Questions[j].ChosenAnswerID = vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID;
                                }
                            }
                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion && vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion.length > 0) {

                                BindChosenAnswerID(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion);
                            }
                        }
                    }
                }
                GetAssessmentAnswers();
            },
            function (err) {
                toastr.error('An error occurred while retrieving sections.');
            }
        );
        }

        var GetAllofflineActiveSection = function (objsection) {

            //vm.QuestionParentQuestion = offlineQuestionParentQuestion;
            //vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
            //vm.AllQuestionParentQuestion = offlineQuestionParentQuestion;

            vm.QuestionParentQuestion = angular.copy(offlineQuestionParentQuestion);
            vm.CopyQuestionParentQuestion = angular.copy(offlineQuestionParentQuestion);
            vm.AllQuestionParentQuestion = angular.copy(offlineQuestionParentQuestion);


            var offlineresidentdata = [];
            for (var q = 0; q < offlineSecQuesAns.length; q++) {
                if (offlineSecQuesAns[q].ID == vm.sectionID) {
                    offlineresidentdata.push(offlineSecQuesAns[q]);
                }
            }




            vm.Sections = offlineresidentdata;
            vm.CopyallSectionsQuestion = angular.copy(offlineresidentdata);
            vm.MainQuestion = [];
            vm.SubQuestion = [];
            vm.AllSection = [];
            for (var x = 0; x < offlineresidentdata.length; x++) {
                vm.AllSection.push(offlineresidentdata[x]);
            }
            for (var p = 0; p < offlineresidentdata.length; p++) {
                for (var q = 0; q < offlineresidentdata[p].Sections_Questions.length; q++) {
                    var z = 0;
                    for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {
                        if (vm.QuestionParentQuestion[r].QuestionID == offlineresidentdata[p].Sections_Questions[q].ID) {
                            z++;
                        }
                    }

                    if (z == 0) {
                        vm.MainQuestion.push(offlineresidentdata[p].Sections_Questions[q]);
                    }
                    else {
                        vm.SubQuestion.push(offlineresidentdata[p].Sections_Questions[q]);
                    }
                }
            }
            for (var m = 0; m < vm.MainQuestion.length; m++) {
                vm.MainQuestion[m].childQuestion = [];
                for (var n = 0; n < vm.QuestionParentQuestion.length; n++) {

                    if (vm.MainQuestion[m].ID == vm.QuestionParentQuestion[n].ParentQuestionID) {
                        for (var p = 0; p < vm.SubQuestion.length; p++) {

                            if (vm.SubQuestion[p].ID == vm.QuestionParentQuestion[n].QuestionID) {

                                vm.MainQuestion[m].childQuestion.push(vm.SubQuestion[p]);
                                SubQuestionsAsParent(vm.MainQuestion[m].childQuestion, vm.SubQuestion);
                            }

                        }
                    }
                }
            }
            for (var k = 0; k < vm.MainQuestion.length; k++) {
                for (var y = 0; y < vm.MainQuestion[k].Sections_Questions_Answers.length; y++) {
                    vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion = [];
                    for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                        if (vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                            for (var n = 0; n < vm.SubQuestion.length; n++) {
                                if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                    vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].Sections_Questions_Answers[y].ID;
                                    vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
                                    subQuestionforAnswer(vm.MainQuestion[k].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
                                }
                            }
                        }


                    }
                }

            }
            for (var k = 0; k < vm.MainQuestion.length; k++) {
                for (var i = 0; i < vm.MainQuestion[k].childQuestion.length; i++) {

                    //Start
                    for (var y = 0; y < vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers.length; y++) {
                        vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion = [];
                        for (var m = 0; m < vm.QuestionParentQuestion.length; m++) {

                            if (vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                for (var n = 0; n < vm.SubQuestion.length; n++) {

                                    if (vm.SubQuestion[n].ID == vm.QuestionParentQuestion[m].QuestionID && vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID == vm.QuestionParentQuestion[m].ParentAnswerID) {
                                        vm.SubQuestion[n].ParentAnswerID = vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].ID;
                                        vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion.push(vm.SubQuestion[n]);
                                        subQuestionforAnswer(vm.MainQuestion[k].childQuestion[i].Sections_Questions_Answers[y].childQuestion, vm.SubQuestion)
                                    }
                                }
                            }


                        }
                    }


                    //End
                }


            }
            for (var t = 0; t < vm.AllSection.length; t++) {
                vm.AllSection[t].Sections_Questions = [];
                for (var s = 0; s < vm.MainQuestion.length; s++) {

                    if (vm.MainQuestion[s].SectionID == vm.AllSection[t].ID) {
                        vm.AllSection[t].Sections_Questions.push(vm.MainQuestion[s]);
                    }


                }

            }
            vm.onlyduplicates = uniqueQuestion(vm.CopyQuestionParentQuestion);
            vm.uniqueQuestionIDs = uniqueval(vm.onlyduplicates);
            if (vm.uniqueQuestionIDs.length > 0) {
                vm.uniqueQuestionIDswithNoParAnsIds = [];
                for (var k = 0; k < vm.uniqueQuestionIDs.length; k++) {
                    if (vm.uniqueQuestionIDs[k].ParentAnswerID == null) {
                        vm.uniqueQuestionIDswithNoParAnsIds.push(vm.uniqueQuestionIDs[k]);
                    }
                }
                if (vm.uniqueQuestionIDswithNoParAnsIds.length > 0) {
                    vm.AllParentQuestions = [];
                    for (var j = 0; j < vm.uniqueQuestionIDswithNoParAnsIds.length; j++) {
                        var newarray = { QuestionID: '', SectionQuestion: [] }
                        newarray.QuestionID = vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID;
                        for (var m = 0; m < vm.CopyQuestionParentQuestion.length; m++) {
                            if (vm.uniqueQuestionIDswithNoParAnsIds[j].QuestionID == vm.CopyQuestionParentQuestion[m].QuestionID) {
                                for (var u = 0; u < vm.CopyallSectionsQuestion.length; u++) {
                                    for (var r = 0; r < vm.CopyallSectionsQuestion[u].Sections_Questions.length; r++) {
                                        if ((vm.CopyallSectionsQuestion[u].Sections_Questions[r].ID == vm.CopyQuestionParentQuestion[m].ParentQuestionID)) {
                                            newarray.SectionQuestion.push(vm.CopyallSectionsQuestion[u].Sections_Questions[r]);
                                        }
                                    }
                                }
                            }
                        }
                        if (newarray.SectionQuestion.length > 0)
                            vm.AllParentQuestions.push(newarray);
                    }

                    if (vm.AllParentQuestions.length > 0) {
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
                    }
                }
            }

            if (vm.AllSetQuestion != undefined) {
                if (vm.AllSetQuestion.length > 0) {
                    for (var q = 0; q < vm.AllSection.length; q++) {
                        // if(vm.AllSection[q].hasScore==true){
                        if (vm.AllSection[q].DisplayOrder == 2 || vm.AllSection[q].DisplayOrder == 7 || vm.AllSection[q].DisplayOrder == 11 || vm.AllSection[q].DisplayOrder == 6 || vm.AllSection[q].DisplayOrder == 4 || vm.AllSection[q].DisplayOrder == 9 || vm.AllSection[q].DisplayOrder == 5 || vm.AllSection[q].DisplayOrder == 8 || vm.AllSection[q].DisplayOrder == 3 || vm.AllSection[q].DisplayOrder == 15) {
                            for (var z = 0; z < vm.AllSection[q].Sections_Questions.length; z++) {

                                for (var L = 0; L < vm.AllSetQuestion.length; L++) {
                                    if (vm.AllSetQuestion[L].filterdSectionQuestionID == vm.AllSection[q].Sections_Questions[z].ID) {
                                        vm.AllSection[q].Sections_Questions[z].SetGroupNo = vm.AllSetQuestion[L].GroupNo;
                                        if (vm.AllSetQuestion[L].IsLastQuesInGroup == false) {
                                            vm.AllSection[q].Sections_Questions[z].childQuestion = [];
                                            vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                        }
                                        else {
                                            vm.AllSection[q].Sections_Questions[z].LastQuestionInset = vm.AllSetQuestion[L].IsLastQuesInGroup;
                                            if (vm.AllSection[q].Sections_Questions[z].childQuestion.length > 0) {
                                                for (var c = 0; c < vm.AllSection[q].Sections_Questions[z].childQuestion.length; c++) {

                                                    vm.AllSection[q].Sections_Questions[z].childQuestion[c].childGroupNo = vm.AllSetQuestion[L].GroupNo;
                                                }
                                            }

                                        }

                                    }


                                }
                                var i = 0;
                                for (var u = 0; u < vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers.length; u++) {
                                    if (vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers[u].childQuestion.length > 0) {
                                        i = 1;
                                        groupchildQuestion(vm.AllSection[q].Sections_Questions[z].Sections_Questions_Answers[u].childQuestion);
                                    }
                                }
                                if (i == 0) {
                                    groupchildQuestion(vm.AllSection[q].Sections_Questions[z].childQuestion);
                                }
                            }
                        }

                    }
                }

            }
            vm.Sections = vm.AllSection;


            objsection.Sections_Questions = [];
            objsection.Sections_Questions = vm.Sections[0].Sections_Questions;
            for (var i = 0; i < vm.Sections.length; i++) {
                for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                    for (var k = 0; k < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; k++) {
                        if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault) {
                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault != "false") {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswerID = vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID;
                            }
                        }
                        if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion && vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion.length > 0) {

                            BindChosenAnswerID(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion);
                        }
                    }
                }
            }
            GetofflineAssessmentAnswers();

        }


        vm.ClickAccordianHeader = function (objSection) {
            vm.sectionID = objSection.ID;
            if ($scope.online == true) {
                if (objSection.Sections_Questions.length == 0) {
                    GetAllActiveSection(objSection);
                }
            }
            else {
                if (objSection.Sections_Questions) {
                    if (objSection.Sections_Questions.length == 0) {
                        GetAllofflineActiveSection(objSection);
                    }
                } else {
                    GetAllofflineActiveSection(objSection);
                }
            }
        }
        //offline end




        var BindChosenAnswerID = function (objQuestions) {
            for (var i = 0; i < objQuestions.length; i++) {
                for (var j = 0; j < objQuestions[i].Sections_Questions_Answers.length; j++) {
                    if (objQuestions[i].Sections_Questions_Answers[j].IsDefault) {
                        if (objQuestions[i].Sections_Questions_Answers[j].IsDefault != "false")
                            objQuestions[i].ChosenAnswerID = objQuestions[i].Sections_Questions_Answers[j].ID;
                    }
                    if (objQuestions[i].Sections_Questions_Answers[j].childQuestion && objQuestions[i].Sections_Questions_Answers[j].childQuestion.length > 0) {
                        BindChosenAnswerID(objQuestions[i].Sections_Questions_Answers[j].childQuestion);
                    }
                }
            }
        };
        var GetPersonalInformation = function () {
            ResidentsService.GetPersonalInformation(vm.ResidentId).then(
                function (response) {

                    if (response.data.Resident.Gender == 'M') {
                        vm.showmaleimage = true;
                        vm.showfemaleimage = false;
                    }
                    else {
                        vm.showmaleimage = false;
                        vm.showfemaleimage = true;
                    }

                    vm.Resident = response.data.Resident;
                    vm.Resident.DOB = new Date(vm.Resident.DOB);
                    vm.Resident.DOJ = new Date(vm.Resident.DOJ);
                    vm.Resident.AdmittedFrom = new Date(vm.Resident.AdmittedFrom);
                    vm.PhotoUrl = response.data.PhotoUrl;
                },
                function (err) {
                    //toastr.error('An error occurred while retrieving personal information.');
                }
            );
        };

        var GetAssessmentAnswers = function () {
            ResidentsService.GetAssessmentData(vm.ResidentId).then(
                function (response) {
                    var lstAssessmentData = response.data;

                    for (var i = 0; i < vm.Sections.length; i++) {
                        for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                            vm.Sections[i].Sections_Questions[j].ChosenAnswer = null;
                            vm.Sections[i].Sections_Questions[j].OldChosenAnswer = null;
                            vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = null;
                            vm.Sections[i].Sections_Questions[j].SignatureIcon = null;
                            if (!vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer)
                                vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer = [];

                            if (!vm.Sections[i].Sections_Questions[j].MulChosenAnswerID)
                                vm.Sections[i].Sections_Questions[j].MulChosenAnswerID = [];

                            //Changes on  4/11/2016
                            if (!vm.Sections[i].Sections_Questions[j].SumofScores)
                                vm.Sections[i].Sections_Questions[j].SumofScores = 0;


                            //newly added on 4/18/2016
                            var lstQueswthnoAnswer = 0;
                            for (var k = 0; k < lstAssessmentData.length; k++) {
                                if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                    lstQueswthnoAnswer++;
                                    vm.Sections[i].Sections_Questions[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    if (vm.Sections[i].Sections_Questions[j].AnswerType == 'RadioButtonList') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        //newly added 4/15/2016
                                        vm.Sections[i].Sections_Questions[j].SumofScores = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;

                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'DropDownList') {
                                        //newly added on 4/19/2016
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Yes/No') {
                                        var labelText = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'FreeText') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                        if (vm.Sections[i].Sections_Questions[j].Question == "Weight") {
                                            if (vm.Sections[i].Sections_Questions[j].ChosenAnswer != "")
                                                vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].ChosenAnswer;
                                            vm.Sections[i].Sections_Questions[j].oldScore = vm.Sections[i].Sections_Questions[j].ChosenAnswer;
                                        }
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Signature') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                        vm.Sections[i].Sections_Questions[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Number') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'FileUpload') {
                                        if (vm.online) {
                                            if (lstAssessmentData[k].ResidentFile) {
                                                vm.Sections[i].Sections_Questions[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                                var filename = lstAssessmentData[k].ResidentFile.split('/');
                                                vm.Sections[i].Sections_Questions[j].ChosenFileName = filename[5];
                                            }
                                        } else {
                                            if (lstAssessmentData[k].Filepath != '') {
                                                vm.Sections[i].Sections_Questions[j].ChosenFilePath = lstAssessmentData[k].Filepath;
                                                vm.Sections[i].Sections_Questions[j].ChosenFileName = lstAssessmentData[k].ResidentFile;
                                            }
                                        }

                                    }
                                    else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'CheckBoxList') {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswerID = null;
                                        for (var p = 0; p < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; p++) {
                                            if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                                vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                    vm.Sections[i].Sections_Questions[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                                }

                                                var chosenAnswerIndex = vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                if (!(chosenAnswerIndex > -1)) {
                                                    vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                }
                                                //code on 6/3/2016
                                                var oldChkIndex = vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                if (!(oldChkIndex > -1)) {
                                                    vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                }
                                                //Chnaged on 4/11/2016
                                                if (vm.Sections[i].Sections_Questions[j].Question == "Falls") {
                                                    if (vm.Sections[i].Sections_Questions[j].txtAreaAnswer != "" && vm.Sections[i].Sections_Questions[j].txtAreaAnswer != undefined) {
                                                        vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].txtAreaAnswer * 5;
                                                        vm.Sections[i].Sections_Questions[j].oldScore = vm.Sections[i].Sections_Questions[j].txtAreaAnswer * 5;
                                                    }
                                                }
                                                vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].Score;
                                            }
                                            //if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {
                                            //    vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                            //}
                                        }
                                        //vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        //vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                    }

                                    //newlyaddedd
                                    if (vm.Sections[i].Sections_Questions[j].MinScore != null) {
                                        EditSubQuestionQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData);
                                    }
                                    else {
                                        EditSubQuestion(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData);
                                    }
                                }
                            }

                            if (lstQueswthnoAnswer == 0 && vm.Sections[i].Sections_Questions[j].LastQuestionInset == true) {
                                if (vm.Sections[i].Sections_Questions[j].MinScore != null) {
                                    EditSubQuestionQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData);
                                }
                                else {
                                    EditSubQuestion(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData);
                                }
                            }
                        }
                    }
                },
                function (err) {
                    toastr.error('An error occurred while retrieving assessment answers.');
                }


            );
            //console.log("Edit");
            // console.log(vm.Sections)
        };
        //offline start


        var GetofflineAssessmentAnswers = function () {
            for (var zz = 0; zz < offlineResdientQuestionAnser.length; zz++) {
                if (offlineResdientQuestionAnser[zz].IsActive == 'true') {
                    for (var mm = 0; mm < offlineSectionQuestionAnswer.length; mm++) {
                        if (offlineSectionQuestionAnswer[mm].ID == offlineResdientQuestionAnser[zz].Section_Question_AnswerID) {
                            offlineResdientQuestionAnser[zz].Sections_Questions_Answers = offlineSectionQuestionAnswer[mm];
                        }
                    }
                }
            }
            var arrlstdata = [];
            for (var aa = 0; aa < offlineResdientQuestionAnser.length; aa++) {
                var lstresidentdata = { ResidentFile: null, ResidentQuestionAnswer: [], FilePath: '' };

                lstresidentdata.ResidentQuestionAnswer = offlineResdientQuestionAnser[aa];
                for (var i = 0; i < offlineResidentAnswerDocuments.length; i++) {
                    if (offlineResidentAnswerDocuments[i].ID == offlineResdientQuestionAnser[aa].ID) {
                        lstresidentdata.ResidentFile = offlineResidentAnswerDocuments[i].FileName;
                        lstresidentdata.FilePath = offlineResidentAnswerDocuments[i].ResidentFile;
                        break;
                    }
                }
                arrlstdata.push(lstresidentdata);
            }
            var lstAssessmentData = arrlstdata;

            for (var i = 0; i < vm.Sections.length; i++) {
                for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                    vm.Sections[i].Sections_Questions[j].ChosenAnswer = null;
                    vm.Sections[i].Sections_Questions[j].OldChosenAnswer = null;
                    vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = null;
                    vm.Sections[i].Sections_Questions[j].SignatureIcon = null;
                    if (!vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer)
                        vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer = [];

                    if (!vm.Sections[i].Sections_Questions[j].MulChosenAnswerID)
                        vm.Sections[i].Sections_Questions[j].MulChosenAnswerID = [];


                    if (!vm.Sections[i].Sections_Questions[j].SumofScores)
                        vm.Sections[i].Sections_Questions[j].SumofScores = 0;

                    var lstQueswthnoAnswer = 0;
                    for (var k = 0; k < lstAssessmentData.length; k++) {
                        if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                            lstQueswthnoAnswer++;
                            vm.Sections[i].Sections_Questions[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            if (vm.Sections[i].Sections_Questions[j].AnswerType == 'RadioButtonList') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                vm.Sections[i].Sections_Questions[j].SumofScores = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;

                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'DropDownList') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Yes/No') {
                                var labelText = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'FreeText') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                if (vm.Sections[i].Sections_Questions[j].Question == "Weight") {
                                    if (vm.Sections[i].Sections_Questions[j].ChosenAnswer != "")
                                        vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].ChosenAnswer;
                                    vm.Sections[i].Sections_Questions[j].oldScore = vm.Sections[i].Sections_Questions[j].ChosenAnswer;
                                }
                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Signature') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                                vm.Sections[i].Sections_Questions[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Number') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                vm.Sections[i].Sections_Questions[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.ID;
                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'FileUpload') {
                                if (vm.online) {
                                    if (lstAssessmentData[k].ResidentFile) {
                                        vm.Sections[i].Sections_Questions[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile ? lstAssessmentData[k].ResidentFile.split('/') : null;
                                        vm.Sections[i].Sections_Questions[j].ChosenFileName = lstAssessmentData[k].ResidentFile ? filename[5] : null;
                                    }
                                } else {
                                    if (lstAssessmentData[k].FilePath != '') {
                                        vm.Sections[i].Sections_Questions[j].ChosenFilePath = lstAssessmentData[k].FilePath;
                                        vm.Sections[i].Sections_Questions[j].ChosenFileName = lstAssessmentData[k].ResidentFile;
                                    }
                                }

                            }
                            else if (vm.Sections[i].Sections_Questions[j].AnswerType == 'CheckBoxList') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswerID = null;
                                for (var p = 0; p < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; p++) {
                                    if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                        vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                        if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                            vm.Sections[i].Sections_Questions[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        }

                                        var chosenAnswerIndex = vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                        if (!(chosenAnswerIndex > -1)) {
                                            vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                        }

                                        var oldChkIndex = vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                        if (!(oldChkIndex > -1)) {
                                            vm.Sections[i].Sections_Questions[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                        }
                                        if (vm.Sections[i].Sections_Questions[j].Question == "Falls") {
                                            if (vm.Sections[i].Sections_Questions[j].txtAreaAnswer != "" && vm.Sections[i].Sections_Questions[j].txtAreaAnswer != undefined) {
                                                vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].txtAreaAnswer * 5;
                                                vm.Sections[i].Sections_Questions[j].oldScore = vm.Sections[i].Sections_Questions[j].txtAreaAnswer * 5;
                                            }
                                        }


                                        vm.Sections[i].Sections_Questions[j].SumofScores += vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[p].Score;
                                    }

                                }

                            }

                            if (vm.Sections[i].Sections_Questions[j].MinScore != null) {
                                EditSubQuestionQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData);

                            }
                            else {
                                EditSubQuestion(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData);
                            }
                        }
                    }

                    if (lstQueswthnoAnswer == 0 && vm.Sections[i].Sections_Questions[j].LastQuestionInset == true) {
                        if (vm.Sections[i].Sections_Questions[j].MinScore != null) {
                            EditSubQuestionQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData);
                        }
                        else {
                            EditSubQuestion(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData);
                        }
                    }
                }
            }

        };


        //oofline end


        vm.UpdatePersonalInformation = function () {
            if (vm.online) {
                UpdatePersonalInformation_Online();
            }
            else {
                UpdatePersonalInformation_Offline();
            }
        };



        function UpdatePersonalInformation_Offline() {

            var objResident = angular.copy(vm.Resident);
            objResident.DOB = moment(vm.Resident.DOB).format('YYYY-MM-DDTHH:mm:ss');
            objResident.DOJ = moment(vm.Resident.DOJ).format('YYYY-MM-DDTHH:mm:ss');
            objResident.AdmittedFrom = moment(vm.Resident.AdmittedFrom).format('YYYY-MM-DDTHH:mm:ss');

            objResident.IsSyncnised = false;
            objResident.IsCreated = false;
            
            CommonService.UpdateResidents(app.db, objResident).then(function (response) {
                if (vm.ResidentImage) {
                    if (vm.ResidentImage.file) {
                        if (vm.ResidentImage.file.type == "image/jpeg" || vm.ResidentImage.file.type == "image/png" || vm.ResidentImage.file.type == "image/gif") {
                            InsertFileinLocalDbandFolder(vm.ResidentImage.file, vm.ResidentId, false).then(function () {
                                toastr.success('Personal Information updated successfully in offline.');
                            })
                        } else {
                            toastr.info('Please Choose jpeg,png,gif.');
                        }
                    } else {
                        toastr.info('Please Choose Photo.');
                    }
                  
            } 
            else {
                    toastr.success('Personal Information updated successfully.');
                }
                
            })
        }
        function UpdatePersonalInformation_Online() {
            ResidentsService.UpdatePersonalInformation(vm.Resident).success(function (response) {
                if (vm.ResidentImage) {
                    if (vm.ResidentImage.file) {
                        if (vm.ResidentImage.file.type == "image/jpeg" || vm.ResidentImage.file.type == "image/png" || vm.ResidentImage.file.type == "image/gif") {
                            UploadPhoto().then(function (response) {
                                //toastr.success('Personal Information updated successfully.');
                                InsertFileinLocalDbandFolder(vm.ResidentImage.file, vm.ResidentId, true).then(function () {
                                    //toastr.success('Personal Information updated successfully');
                                });
                            },
                            function (err) {
                                toastr.error(err);
                            });
                        } else {
                            toastr.info('Please Choose jpeg,png,gif.');
                        }
                    } else {
                        toastr.info('Please Choose Photo.');
                    }













                } else {
                    toastr.success('Personal Information updated successfully.');
                }
                var objResident = {};
                objResident = vm.Resident;
                objResident.IsSyncnised = true;
                objResident.IsCreated = false;
                //objResident.DOB = moment(vm.Resident.DOB).format('YYYY-MM-DDTHH:mm:ss');
                //objResident.DOJ = moment(vm.Resident.DOJ).format('YYYY-MM-DDTHH:mm:ss');
                //objResident.AdmittedFrom = moment(vm.Resident.AdmittedFrom).format('YYYY-MM-DDTHH:mm:ss');                                          
                CommonService.UpdateResidents(app.db, objResident).then(function (response) {
                 
                    toastr.success('Personal Information updated successfully');
                },
                function (err) {
                    toastr.error('An error occured while updating offline personal information.');
                })
            },
            function (err) {
                toastr.error('An error occured while saving personal information.');
            });
        }

        function InsertFileinLocalDbandFolder(file, ResidentID, IsSyncnised) {
            var q = $q.defer();
            var folderpath = $rootScope.Path + 'uploads';
            var fileUniqueName = ResidentID + '.jpeg';
            $cordovaFile.writeFile(folderpath, fileUniqueName, file, true).then(function (success) {
                var Residentphots = { ID: '', PhotoURL: '', IsActive: '', Created: new Date(), CreatedBy: '' }
                Residentphots.ID = ResidentID;
                Residentphots.PhotoURL = folderpath + '/' + fileUniqueName;
                Residentphots.IsActive = true;
                Residentphots.IsSyncnised = IsSyncnised;
                Residentphots.IsCreated = IsSyncnised ? false : true;
                Residentphots.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                Residentphots.ModifiedBy = $rootScope.UserInfo.UserID;
                CommonService.UpdateinsertResidentPhotos(app.db, Residentphots).then(function () {
                    toastr.success('Resident Photo saved successfully.');
                    q.resolve();
                }, function (err) {
                    alert(JSON.stringify(err));
                });
            },
            function (error) {
                if (error.code == 6) {
                    var Residentphots = { ID: '', PhotoURL: '', IsActive: '', Created: new Date(), CreatedBy: '' }
                    Residentphots.ID = ResidentID;
                    Residentphots.PhotoURL = folderpath + '/' + fileUniqueName;
                    Residentphots.IsActive = true;
                    Residentphots.IsSyncnised = IsSyncnised;
                    Residentphots.IsCreated = IsSyncnised ? false : true;
                    Residentphots.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    Residentphots.ModifiedBy = $rootScope.UserInfo.UserID;
                    CommonService.UpdateinsertResidentPhotos(app.db, Residentphots).then(function () {
                        toastr.success('Resident Photo saved successfully.');
                        q.resolve();
                    }, function (err) {
                        alert(JSON.stringify(err));
                        q.reject();
                    });
                }
            });
            return q.promise;
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

        vm.UpdateAssessmentData = function (objSection) {
            var lstResidents_Questions_Answers = [];

            for (var i = 0; i < objSection.Sections_Questions.length; i++) {
                var objResidents_Questions_Answers = {};
                //Code on 6/6/2016
                objResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].OldChosenAnswerID;
                objResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                var CheckParentIsAnswered = [];
                if ((objSection.Sections_Questions[i].ChosenAnswer != null || objSection.Sections_Questions[i].LastQuestionInset == true) && objSection.Sections_Questions[i].ChosenAnswer != objSection.Sections_Questions[i].OldChosenAnswer) {



                    if (objSection.Sections_Questions[i].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].ChosenAnswer;

                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'DropDownList') {
                        //newly added 4/19/2016
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].ChosenAnswer;

                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'Yes/No') {
                        if (objSection.Sections_Questions[i].ChosenAnswer) {
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
                        }
                        else {
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
                        }

                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'Signature') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (objSection.Sections_Questions[i].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }

                    CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                    //lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
                }
                else {
                    if ((objSection.Sections_Questions[i].ChosenAnswer != null || objSection.Sections_Questions[i].LastQuestionInset == true) && objSection.Sections_Questions[i].ChosenAnswer == objSection.Sections_Questions[i].OldChosenAnswer)
                        objResidents_Questions_Answers.Section_Question_AnswerId = objResidents_Questions_Answers.oldChosenAnswer;
                }
                //code on 6/6/2016  
                if ((objResidents_Questions_Answers.oldChosenAnswer != null || objResidents_Questions_Answers.Section_Question_AnswerId != null) && (objSection.Sections_Questions[i].AnswerType == 'Number' || objSection.Sections_Questions[i].AnswerType == 'FreeText' || objSection.Sections_Questions[i].AnswerType == 'Yes/No' || objSection.Sections_Questions[i].AnswerType == 'DropDownList' || objSection.Sections_Questions[i].AnswerType == 'RadioButtonList'))
                    lstResidents_Questions_Answers.push(objResidents_Questions_Answers);

                if (objSection.Sections_Questions[i].AnswerType == 'CheckBoxList') {
                    //Code on 6/6/2016
                    if (objSection.Sections_Questions[i].MulChosenAnswerID.length > 0) {
                        for (var k = 0; k < objSection.Sections_Questions[i].MulChosenAnswerID.length; k++) {
                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;

                            objchkResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].MulChosenAnswerID[k];
                            objchkResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                            if (objSection.Sections_Questions[i].txtAreaAnswer) {
                                for (var ans = 0; ans < objSection.Sections_Questions[i].Sections_Questions_Answers.length; ans++) {
                                    if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].ID == objchkResidents_Questions_Answers.Section_Question_AnswerId) {
                                        if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].AnswerType == "FreeText") {
                                            objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
                                        }
                                    }


                                }


                            }
                            CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                            if (objSection.Sections_Questions[i].OldChkChosenAnswer != undefined) {

                                if (!(objSection.Sections_Questions[i].OldChkChosenAnswer.indexOf(objchkResidents_Questions_Answers.Section_Question_AnswerId) >= 0))
                                    lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                                else {
                                    objchkResidents_Questions_Answers.Section_Question_AnswerId = objSection.Sections_Questions[i].MulChosenAnswerID[k];
                                    objchkResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].MulChosenAnswerID[k];
                                    lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                                }
                            }
                            else {
                                lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);

                            }
                        }

                        if (objSection.Sections_Questions[i].OldChkChosenAnswer != undefined) {
                            for (var x = 0; x < objSection.Sections_Questions[i].OldChkChosenAnswer.length; x++) {
                                if (!(objSection.Sections_Questions[i].MulChosenAnswerID.indexOf(objSection.Sections_Questions[i].OldChkChosenAnswer[x]) >= 0)) {
                                    var objchkResidents_Questions_Answers = {};
                                    objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                    objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                    //added on 6.33 pm on 6/21/2016
                                    if (objSection.Sections_Questions[i].txtAreaAnswer) {
                                        for (var ans = 0; ans < objSection.Sections_Questions[i].Sections_Questions_Answers.length; ans++) {
                                            if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].ID == objchkResidents_Questions_Answers.Section_Question_AnswerId) {
                                                if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].AnswerType == "FreeText") {
                                                    objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
                                                }
                                            }


                                        }
                                    }
                                    objchkResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                                    objchkResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].OldChkChosenAnswer[x];
                                    lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                                }
                            }
                        }

                    }
                    else {
                        for (var m = 0; m < objSection.Sections_Questions[i].OldChkChosenAnswer.length; m++) {

                            var objchkResidents_Questions_Answers = {};
                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                            objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                            //added on 6.33 pm on 6/21/2016
                            if (objSection.Sections_Questions[i].txtAreaAnswer && objSection.Sections_Questions[i].Sections_Questions_Answers[m].AnswerType == "FreeText") {
                                for (var ans = 0; ans < objSection.Sections_Questions[i].Sections_Questions_Answers.length; ans++) {
                                    if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].ID == objchkResidents_Questions_Answers.Section_Question_AnswerId) {
                                        if (objSection.Sections_Questions[i].Sections_Questions_Answers[ans].AnswerType == "FreeText") {
                                            objchkResidents_Questions_Answers.AnswerText = objSection.Sections_Questions[i].txtAreaAnswer;
                                        }
                                    }


                                }
                            }
                            objchkResidents_Questions_Answers.HasScore = objSection.Sections_Questions[i].MinScore;
                            objchkResidents_Questions_Answers.oldChosenAnswer = objSection.Sections_Questions[i].OldChkChosenAnswer[m];
                            lstResidents_Questions_Answers.push(objchkResidents_Questions_Answers);
                        }
                    }

                }


                if (objSection.Sections_Questions[i].AnswerType == 'FileUpload' && objSection.Sections_Questions[i].ChosenAnswer) {
                    objResidents_Questions_Answers.AnswerText = "FileUpload";
                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(objSection.Sections_Questions[i].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = objSection.Sections_Questions[i].ChosenAnswer.file;
                    lstResidents_Questions_Answers.push(objResidents_Questions_Answers);
                    // CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                }
                if (objSection.Sections_Questions[i].MinScore != null) {


                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionQuestion(objSection.Sections_Questions[i]));

                }
                else {


                    lstResidents_Questions_Answers = lstResidents_Questions_Answers.concat(GetSubQuestionAnswers(objSection.Sections_Questions[i].Sections_Questions_Answers, CheckParentIsAnswered));
                }
            }

            UpdateAssessment(lstResidents_Questions_Answers, objSection);

        };

        var updateofflineAssesment = function (objlstResidentQuestionAnswer, objsection) {

            var objoldchoosenNotEqlsecQuesAns = [];
            for (var i = 0; i < objlstResidentQuestionAnswer.length; i++) {
                if (objlstResidentQuestionAnswer[i].Section_Question_AnswerId != objlstResidentQuestionAnswer[i].oldChosenAnswer) {
                    objoldchoosenNotEqlsecQuesAns.push(objlstResidentQuestionAnswer[i]);

                }
            }
            var objlstResidentAnswer = [];
            var objlstfileuploadandAnswer = [];
            var objlstFreeText = [];
            for (var j = 0; j < objoldchoosenNotEqlsecQuesAns.length; j++) {
                if (objoldchoosenNotEqlsecQuesAns[j].AnswerText) {
                    if (objoldchoosenNotEqlsecQuesAns[j].AnswerText == 'FileUpload') {
                        objlstfileuploadandAnswer.push(objoldchoosenNotEqlsecQuesAns[j]);
                    }
                    else {
                        objlstFreeText.push(objoldchoosenNotEqlsecQuesAns[j]);
                    }
                }
                else {
                    objlstResidentAnswer.push(objoldchoosenNotEqlsecQuesAns[j]);
                }
            }

            var DeleteoldChoosenAnswerIds = [];

            for (var k = 0; k < objlstResidentAnswer.length; k++) {
                if (objlstResidentAnswer[k].oldChosenAnswer) {
                    if (objlstResidentAnswer[k].oldChosenAnswer != null) {
                        DeleteoldChoosenAnswerIds.push(objlstResidentAnswer[k]);
                    }
                }
            }

            var CreateNewChoosenAnswers = [];

            for (var p = 0; p < objoldchoosenNotEqlsecQuesAns.length; p++) {

                if (objoldchoosenNotEqlsecQuesAns[p].Section_Question_AnswerId) {
                    if (objoldchoosenNotEqlsecQuesAns[p].Section_Question_AnswerId != null) {
                        CreateNewChoosenAnswers.push(objoldchoosenNotEqlsecQuesAns[p]);
                    }
                }
            }

            if (CreateNewChoosenAnswers.length > 0) {
                for (var i = 0; i < CreateNewChoosenAnswers.length; i++) {
                    var objAns = {};
                    objAns.Section_Question_AnswerID = CreateNewChoosenAnswers[i].Section_Question_AnswerId;
                    objAns.ResidentID = CreateNewChoosenAnswers[i].ResidentId;
                    objAns.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    objAns.ModifiedBy = $rootScope.UserInfo.UserID;
                    CommonService.UpdateExistingResidents_Questions_Answers(app.db, objAns).then(
                      function (response) {
                          //toastr.success('Success');
                      }, function (err) {

                      })
                }

            }
            //Answer to be created in CreateNewChoosenAnswers
            //Answer to be created in DeleteoldChoosenAnswerIds

            var DeactiveResidentAns = [];


            if (DeleteoldChoosenAnswerIds.length > 0) {
                var hasScoreDeleteOldChoosenAns = [];
                var hasNoScoreDeleteOldChoosenAns = [];

                for (var i = 0; i < DeleteoldChoosenAnswerIds.length; i++) {
                    if (DeleteoldChoosenAnswerIds[i].HasScore != null) {
                        hasScoreDeleteOldChoosenAns.push(DeleteoldChoosenAnswerIds[i]);
                    }

                }
                for (var k = 0; k < DeleteoldChoosenAnswerIds.length; k++) {
                    if (DeleteoldChoosenAnswerIds[k].HasScore == null) {
                        hasNoScoreDeleteOldChoosenAns.push(DeleteoldChoosenAnswerIds[k]);
                    }

                }

                if (offlinesectionQuestion.length > 0 && offlineSectionQuestionAnswer.length > 0 && offlineResdientQuestionAnser.length > 0) {
                    //answer to be deleted that hasscore hasScoreDeleteOldChoosenAns
                    //answer to be deleted that hasnoscore hasNoScoreDeleteOldChoosenAns
                    var NoScoreDelAns = [];
                    if (hasNoScoreDeleteOldChoosenAns.length > 0) {

                        var allSectionQuestionAns = [];
                        for (var g = 0; g < hasNoScoreDeleteOldChoosenAns.length; g++) {
                            var arrlstResidentQueAns = _.where(offlineResdientQuestionAnser, { Section_Question_AnswerID: hasNoScoreDeleteOldChoosenAns[g].oldChosenAnswer, ResidentID: vm.ResidentId });
                            if (arrlstResidentQueAns.length > 0) {
                                for (var b = 0; b < arrlstResidentQueAns.length; b++) {
                                    NoScoreDelAns.push(arrlstResidentQueAns[b].ID);
                                    allSectionQuestionAns.push(arrlstResidentQueAns[b].Section_Question_AnswerID);
                                }

                            }

                        }
                        if (allSectionQuestionAns.length > 0)
                            NoScorechildQuestionAnswer(allSectionQuestionAns, NoScoreDelAns);


                        if (NoScoreDelAns.length > 0) {
                            for (var r = 0; r < NoScoreDelAns.length; r++) {
                                DeactiveResidentAns.push(NoScoreDelAns[r]);
                            }

                        }

                    }

                    if (hasScoreDeleteOldChoosenAns.length > 0) {
                        var ScoreDelAns = [];
                        var allDelAns = [];
                        for (var m = 0; m < hasScoreDeleteOldChoosenAns.length; m++) {
                            var arrscorelstResidentQueAns = _.where(offlineResdientQuestionAnser, { Section_Question_AnswerID: hasScoreDeleteOldChoosenAns[m].oldChosenAnswer, ResidentID: vm.ResidentId });
                            if (arrscorelstResidentQueAns.length > 0) {
                                for (var b = 0; b < arrscorelstResidentQueAns.length; b++) {
                                    ScoreDelAns.push(arrscorelstResidentQueAns[b].ID);
                                    allDelAns.push(arrscorelstResidentQueAns[b].Section_Question_AnswerID);
                                    ScoreRecurssivedelete(arrscorelstResidentQueAns[b].Section_Question_AnswerID, ScoreDelAns, objlstResidentQuestionAnswer);

                                }
                            }

                        }
                        if (allDelAns.length > 0) {
                            var allsecAns = [];
                            for (var yy = 0; yy < allDelAns.length; yy++) {

                                var arrscorelstResidentQueAns = _.where(offlineSectionQuestionAnswer, { ID: allDelAns[yy] });
                                if (arrscorelstResidentQueAns.length > 0) {
                                    for (var ss = 0; ss < arrscorelstResidentQueAns.length; ss++) {
                                        allsecAns.push(arrscorelstResidentQueAns[ss].ID);
                                    }
                                }
                            }
                            if (allsecAns.length > 0) {
                                ScorechildQuestionAnswer(allsecAns, ScoreDelAns);
                            }
                        }




                        if (ScoreDelAns.length > 0) {
                            for (var r = 0; r < ScoreDelAns.length; r++) {
                                DeactiveResidentAns.push(ScoreDelAns[r]);
                            }

                        }
                    }


                }

            }


            if (CreateNewChoosenAnswers.length > 0) {
                var lstResidents_Questions_Answers = [];
                var lstResidentAnswerDocuments = [];
                var differdArr = [];
                CreateNewChoosenAnswers.forEach(function (listItem, i) {
                    var createResdient = listItem;
                    createResdient.ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                    createResdient.ResidentID = listItem.ResidentId;
                    createResdient.Section_Question_AnswerID = listItem.Section_Question_AnswerId;
                    if (listItem.AnswerText != null)
                        createResdient.AnswerText = listItem.AnswerText;
                    else
                        createResdient.AnswerText = null;

                    createResdient.IsSyncnised = false;
                    createResdient.IsActive = true;
                    createResdient.IsCreated = true;
                    createResdient.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    createResdient.CreatedBy = $rootScope.UserInfo.UserID;
                    createResdient.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    createResdient.ModifiedBy = $rootScope.UserInfo.UserID;
                    lstResidents_Questions_Answers.push(createResdient);
                    //});

                    //CreateNewChoosenAnswers.forEach(function (NewChoosenAnswersItem, i) {
                    if (createResdient.FileData) {
                        var differdArrdifferdArr = $q.defer();
                        differdArr.push(differdArrdifferdArr.promise);

                        var folderpath = $rootScope.Path + 'residentsQADocuments';

                        $cordovaFile.writeFile(folderpath, createResdient.FileData.name, createResdient.FileData, true).then(function (success) {

                            var objFile = {};
                            objFile.ID = createResdient.ID;
                            objFile.FileName = createResdient.FileData.name;
                            objFile.ResidentFile = folderpath + '/', createResdient.FileData.name;
                            objFile.IsSyncnised = false;
                            objFile.IsActive = true;
                            objFile.IsCreated = true;
                            objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                            objFile.CreatedBy = $rootScope.UserInfo.UserID;
                            objFile.Modified = null;
                            objFile.ModifiedBy = null;
                            lstResidentAnswerDocuments.push(objFile);
                            differdArrdifferdArr.resolve();
                        },
                        function (error) {
                            if (error.code == 6) {
                                var objFile = {};
                                objFile.ID = createResdient.ID;
                                objFile.FileName = createResdient.FileData.name;
                                objFile.ResidentFile = folderpath + '/', createResdient.FileData.name;
                                objFile.IsSyncnised = false;
                                objFile.IsActive = true;
                                objFile.IsCreated = true;
                                objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                objFile.Modified = null;
                                objFile.ModifiedBy = null;
                                lstResidentAnswerDocuments.push(objFile);
                                differdArrdifferdArr.resolve();
                            }
                            else {
                                differdArrdifferdArr.reject(error);
                            }
                        });
                    }
                });
                if (lstResidents_Questions_Answers.length > 50) {
                    var i, j, temparray, chunk = 50;
                    for (i = 0, j = lstResidents_Questions_Answers.length; i < j; i += chunk) {
                        temparray = lstResidents_Questions_Answers.slice(i, i + chunk);
                        CommonService.insertResidents_Questions_Answers(app.db, temparray).then(function () {

                        },
                        function (err) {
                            //console.log(err);

                        });
                    }
                }
                else {
                    CommonService.insertResidents_Questions_Answers(app.db, lstResidents_Questions_Answers).then(function () {

                    },
                    function (err) {
                        //  console.log(err);

                    });
                }


                $q.all(differdArr).then(function (response) {
                    if (lstResidentAnswerDocuments.length > 50) {
                        var i, j, temparray, chunk = 50;
                        for (i = 0, j = lstResidentAnswerDocuments.length; i < j; i += chunk) {
                            temparray = lstResidentAnswerDocuments.slice(i, i + chunk);
                            CommonService.insertResidentAnswerDocuments(app.db, temparray).then(function () {
                                toastr.success('File Uploaded');
                            },
                            function (err) {
                                //  console.log(err);

                            });
                        }
                    }
                    else {
                        CommonService.insertResidentAnswerDocuments(app.db, lstResidentAnswerDocuments).then(function () {
                            toastr.success('File Uploaded');
                        },
                        function (err) {
                            //  console.log(err);

                        });
                    }
                });
            }

            if (DeactiveResidentAns.length > 0) {
                //for (var jj = 0; jj < DeactiveResidentAns.length; jj++) {
                //    var objResidentInterventionsQuestionsAnswers = {};
                //    objResidentInterventionsQuestionsAnswers.ModifiedBy = $rootScope.UserInfo.UserID;
                //    objResidentInterventionsQuestionsAnswers.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                //    objResidentInterventionsQuestionsAnswers.ID = DeactiveResidentAns[jj];
                    
                //    CommonService.UpdateResidents_Questions_Answers(app.db, objResidentInterventionsQuestionsAnswers).then(function () {
                //        CommonService.DeleteResidentAnswerDocumentsByID(app.db, objResidentInterventionsQuestionsAnswers.ID).then(function () {
                //            $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                //        });
                //    });
                //}
                var differdArrResidentInterventionsQuestionsAnswers = [];
                DeactiveResidentAns.forEach(function (objResidentInterventionsQuestionsAnswersIds, jj) {
                    var defferResidentInterventionsQuestionsAnswers = $q.defer();
                    var objResidentInterventionsQuestionsAnswers = {};
                    objResidentInterventionsQuestionsAnswers.ModifiedBy = $rootScope.UserInfo.UserID;
                    objResidentInterventionsQuestionsAnswers.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    objResidentInterventionsQuestionsAnswers.ID = objResidentInterventionsQuestionsAnswersIds;
                    CommonService.UpdateResidents_Questions_Answers(app.db, objResidentInterventionsQuestionsAnswers).then(function () {
                        CommonService.DeleteResidentAnswerDocuments(app.db, objResidentInterventionsQuestionsAnswers.ID).then(function () {
                            defferResidentInterventionsQuestionsAnswers.resolve();
                        }, function (err) {
                            console.log(err);
                            defferResidentInterventionsQuestionsAnswers.resolve(err);
                            toastr.error('An error occured while updating ResidentAnswer Documents ');
                        });
                    }, function (err) {
                        console.log(err);
                        defferResidentInterventionsQuestionsAnswers.resolve(err);
                        toastr.error(err);
                        toastr.error('An error occured while Deleting ResidentAnswer Documents ');
                    });
                });
                $q.all(differdArrResidentInterventionsQuestionsAnswers).then(function (response) {
                    $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                });
            }
            else {
                $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
            }
            $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
            toastr.success('' + objsection.Name + ' updated successfully.');
        }


        var NoScorechildQuestionAnswer = function (oldChosenAnswer, NoScoreDelAns) {
            if (oldChosenAnswer.length > 0) {
                var allSectionQuestionAns = [];
                for (var kk = 0; kk < oldChosenAnswer.length; kk++) {
                    var arrQueParQue = _.where(offlineQuestionParentQuestion, { ParentAnswerID: oldChosenAnswer[kk] });
                    //var sectionQuestion
                    for (var i = 0; i < arrQueParQue.length; i++) {

                        if (arrQueParQue[i].QuestionID) {
                            var arrSecQueAns = _.where(offlineSectionQuestionAnswer, { Section_QuestionID: arrQueParQue[i].QuestionID });
                            for (var j = 0; j < arrSecQueAns.length; j++) {
                                var arrResidentQueAns = _.where(offlineResdientQuestionAnser, { Section_Question_AnswerID: arrSecQueAns[j].ID, ResidentID: vm.ResidentId });
                                if (arrResidentQueAns.length > 0) {
                                    for (var k = 0; k < arrResidentQueAns.length; k++) {
                                        NoScoreDelAns.push(arrResidentQueAns[k].ID);
                                        allSectionQuestionAns.push(arrResidentQueAns[k].Section_Question_AnswerID);
                                    }
                                }
                            }


                        }


                    }
                }

                if (allSectionQuestionAns.length > 0) {
                    NoScorechildQuestionAnswer(allSectionQuestionAns, NoScoreDelAns);
                }
                else {
                    return NoScoreDelAns;
                }
            }

        }

        var ScorechildQuestionAnswer = function (oldChosenAnswer, ScoreDelAns) {
            if (oldChosenAnswer.length > 0) {
                var allSectionQuestionAns = [];
                for (var kk = 0; kk < oldChosenAnswer.length; kk++) {
                    var arrQueParQue = _.where(offlineQuestionParentQuestion, { ParentAnswerID: oldChosenAnswer[kk] });
                    //var sectionQuestion
                    for (var i = 0; i < arrQueParQue.length; i++) {

                        if (arrQueParQue[i].QuestionID) {
                            var arrSecQueAns = _.where(offlineSectionQuestionAnswer, { Section_QuestionID: arrQueParQue[i].QuestionID });
                            for (var j = 0; j < arrSecQueAns.length; j++) {
                                var arrResidentQueAns = _.where(offlineResdientQuestionAnser, { Section_Question_AnswerID: arrSecQueAns[j].ID, ResidentID: vm.ResidentId });
                                if (arrResidentQueAns.length > 0) {
                                    for (var k = 0; k < arrResidentQueAns.length; k++) {
                                        ScoreDelAns.push(arrResidentQueAns[k].ID);
                                        allSectionQuestionAns.push(arrResidentQueAns[k].Section_Question_AnswerID);
                                    }
                                }
                            }


                        }


                    }
                }

                if (allSectionQuestionAns.length > 0) {
                    ScorechildQuestionAnswer(allSectionQuestionAns, ScoreDelAns);
                }
                else {
                    return ScoreDelAns;
                }
            }

        }

        var ScoreRecurssivedelete = function (scoreoldChosenAnswer, ScoreDelAns, objlstResidentQuestionAnswer) {
            if (offlineQuestionParentQuestion.length > 0 && offlineSectionQuestionAnswer.length > 0) {
                //Code to separate new ans and old answer by resident
                var newResidentanswer = []
                for (var f = 0; f < objlstResidentQuestionAnswer.length; f++) {

                    if (objlstResidentQuestionAnswer[f].Section_Question_AnswerId != objlstResidentQuestionAnswer[f].oldChosenAnswer && objlstResidentQuestionAnswer[f].Section_Question_AnswerId != null) {
                        newResidentanswer.push(objlstResidentQuestionAnswer[f].Section_Question_AnswerId)
                    }
                    else if (objlstResidentQuestionAnswer[f].Section_Question_AnswerId == objlstResidentQuestionAnswer[f].oldChosenAnswer && objlstResidentQuestionAnswer[f].Section_Question_AnswerId != null) {
                        newResidentanswer.push(objlstResidentQuestionAnswer[f].Section_Question_AnswerId)
                    }
                    else if (objlstResidentQuestionAnswer[f].Section_Question_AnswerId != null && objlstResidentQuestionAnswer[f].oldChosenAnswer == null) {
                        newResidentanswer.push(objlstResidentQuestionAnswer[f].Section_Question_AnswerId)
                    }
                    else {

                    }
                }



                //Question Of Answer   ans-->Question 
                var SectionQuestion = _.where(offlineSectionQuestionAnswer, { ID: scoreoldChosenAnswer });


                //Question of above Question As ParentQuestion (question as parentQues---> multiple childQuestion) 
                var QuestionParentQuestion = _.where(offlineQuestionParentQuestion, { ParentQuestionID: SectionQuestion[0].Section_QuestionID });


                for (var h = 0; h < QuestionParentQuestion.length; h++) {
                    //QuestionParentQuestion[h].QuestionID ans should be deleted
                    //Parent Question Of Above Question (single mutliple child question--->depends on multiple  ParentQestion)
                    var ParentQuestionForQuestion = _.where(offlineQuestionParentQuestion, { QuestionID: QuestionParentQuestion[h].QuestionID });

                    var allansofParentQuestion = [];
                    for (var k = 0; k < ParentQuestionForQuestion.length; k++) {

                        //SectionAns of multiple parentQuestion
                        var SectionQuestionAnswer = _.where(offlineSectionQuestionAnswer, { Section_QuestionID: ParentQuestionForQuestion[k].ParentQuestionID });
                        if (SectionQuestionAnswer.length > 0) {
                            for (var ii = 0; ii < SectionQuestionAnswer.length; ii++) {
                                allansofParentQuestion.push(SectionQuestionAnswer[ii]);
                            }

                        }
                    }

                    //Score to delete QuestionParentQuestion[h].QuestionID
                    var totalScore = parseInt("0");
                    var hasScore = false;
                    //All Answer of parentQuestions
                    if (allansofParentQuestion.length > 0) {
                        if (newResidentanswer.length > 0) {
                            for (var ff = 0; ff < allansofParentQuestion.length; ff++) {
                                for (var gg = 0; gg < newResidentanswer.length; gg++) {
                                    if (allansofParentQuestion[ff].ID == newResidentanswer[gg]) {
                                        hasScore = true;
                                        if (allansofParentQuestion[ff].Score != null) {
                                            if (!(isNaN(allansofParentQuestion[ff].Score)))
                                                totalScore = parseInt(totalScore) + parseInt(allansofParentQuestion[ff].Score);
                                        }
                                    }
                                }

                            }


                        }
                    }
                    if (hasScore == true) {

                        var delQuestion = _.where(offlinesectionQuestion, { ID: QuestionParentQuestion[h].QuestionID });
                        if (!(delQuestion[0].MinScore <= totalScore && (delQuestion[0].MaxScore >= totalScore || delQuestion[0].MaxScore == null))) {

                            var SectionQuestionAnswer = _.where(offlineSectionQuestionAnswer, { Section_QuestionID: delQuestion[0].ID });

                            for (var hhh = 0; hhh < SectionQuestionAnswer.length; hhh++) {
                                var arrscorelstResidentQueAns = _.where(offlineResdientQuestionAnser, { Section_Question_AnswerID: SectionQuestionAnswer[hhh].ID, ResidentID: vm.ResidentId });
                                if (arrscorelstResidentQueAns.length > 0) {
                                    for (var zz = 0; zz < arrscorelstResidentQueAns.length; zz++) {
                                        ScoreDelAns.push(arrscorelstResidentQueAns[zz].ID);
                                    }
                                }
                            }
                        }
                    }
                }
                return ScoreDelAns;
            }
        }

        var UpdateAssessment = function (lstResidents_Questions_Answers, objsection) {
            if ($scope.online == true) {
                var requiredData = [];
                for (var i = 0; i < lstResidents_Questions_Answers.length; i++) {
                    if (lstResidents_Questions_Answers[i].FileData) {
                        requiredData.push({ FileData: lstResidents_Questions_Answers[i].FileData });
                    }
                }
                //CommonService.SelectResidentAnswerDocuments(app.db).then(function (rs) {
                //    for (var i = 0; i < rs.rows.length; i++) {
                //        offlineResidentAnswerDocuments.push(rs.rows[i]);
                //    }
                //});

                ResidentsService.UpdateAssessmentData(vm.ResidentId, lstResidents_Questions_Answers).then(function (response) {
                    if (response.data.Files.length > 0) {
                        var folderpath = $rootScope.Path + 'residentsQADocuments';
                        //var ExistingDocuments = [];
                        var NewDocuments = []; var lstResidentAnswerDocuments = [];
                        var differdArr = [];

                        //for (var i = 0; i < response.data.Files.length; i++) {
                        //    for (var j = 0; j < offlineResidentAnswerDocuments.length; j++) {
                        //        if (response.data.Files[i].ID == offlineResidentAnswerDocuments[j].ID) {
                        //            var objUpdateDoc = {};
                        //            objUpdateDoc.ID = response.data.Files[i].ID;
                        //            objUpdateDoc.ExitingFileName = offlineResidentAnswerDocuments[j].FileName;
                        //            objUpdateDoc.NewFileName = response.data.Files[i].fileName;
                        //            ExistingDocuments.push(objUpdateDoc);
                        //        }
                        //    }
                        //}
                        //var ExistingDocumentsIds = [];
                        //for (var i = 0; i < ExistingDocuments.length; i++) {
                        //    ExistingDocumentsIds.push(ExistingDocuments[i].ID);
                        //}
                        //for (var i = 0; i < ExistingDocuments.length; i++) {
                        //    for (var j = 0; j < requiredData.length; j++) {
                        //        if (ExistingDocuments[i].NewFileName == requiredData[j].FileData.name) {
                        //            ExistingDocuments[i].File = requiredData[j].FileData;
                        //            break;
                        //        }
                        //    }
                        //}
                        //if (ExistingDocumentsIds.length > 0) {

                        //    ExistingDocuments.forEach(function (objExistingDocuments, i) {
                        //        $cordovaFile.removeFile(folderpath, objExistingDocuments.ExitingFileName).then(function (success) {
                        //            // success
                        //            var objResidentAnswerDocuments = {};
                        //            objResidentAnswerDocuments.ID = objExistingDocuments.ID;
                        //            objResidentAnswerDocuments.FileName = objExistingDocuments.NewFileName;
                        //            objResidentAnswerDocuments.ResidentFile = folderpath + '/', objExistingDocuments.NewFileName;
                        //            CommonService.UpdateResidentAnswerDocuments(app.db, objResidentAnswerDocuments).then(function () {
                        //                $cordovaFile.writeFile(folderpath, objExistingDocuments.NewFileName, objExistingDocuments.File, true).then(function (success) {

                        //                },
                        //            function (error) {
                        //                toastr.error(error);
                        //            });
                        //            }, function (error) {
                        //                toastr.error('An error occured whelr updating ResidentAnswerDocuments');
                        //            });
                        //        }, function (error) {
                        //            toastr.error('no file available in specified path');
                        //        });
                        //    });

                        //    for (var i = 0; i < response.data.Files.length; i++) {
                        //        if (ExistingDocumentsIds.indexOf(response.data.Files[i].ID) > -1) {
                        //            for (var j = 0; j < requiredData.length; j++) {
                        //                    if (requiredData[j].FileData.name == response.data.Files[i].fileName) {
                        //                        var objNewDoc = {};
                        //                        objNewDoc.ID = response.data.Files[i].ID;
                        //                        objNewDoc.NewFileName = response.data.Files[i].fileName;
                        //                        objNewDoc.File = requiredData[j].FileData;
                        //                        NewDocuments.push(objNewDoc);
                        //                        break;
                        //                    }
                        //            }
                        //        }
                        //    }
                        //}
                        //else {
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
                        //}

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
                                lstResidentAnswerDocuments.push(objFile);
                                differdArrdifferdArr.resolve();
                            },
                             function (error) {
                                 if (error.code == 6) {
                                     var objFile = {};
                                     objFile.ID = objNewDocuments.ID;
                                     objFile.FileName = objNewDocuments.NewFileName;
                                     objFile.ResidentFile = folderpath + '/', objNewDocuments.NewFileName;
                                     objFile.IsSyncnised = false;
                                     objFile.IsActive = true;
                                     objFile.IsCreated = false;
                                     objFile.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                                     objFile.CreatedBy = $rootScope.UserInfo.UserID;
                                     objFile.Modified = null;
                                     objFile.ModifiedBy = null;
                                     lstResidentAnswerDocuments.push(objFile);
                                     differdArrdifferdArr.resolve();
                                 }
                                 else {
                                     differdArrdifferdArr.reject(error);
                                 }
                             });
                        });
                        $q.all(differdArr).then(function (response) {
                            CommonService.insertResidentAnswerDocuments(app.db, lstResidentAnswerDocuments).then(function () {

                            },
                            function (err) {
                                console.log(err);
                                toastr.error(err);
                            });
                        },
                        function (err) {
                            toastr.error(err);
                        });
                    }

                    toastr.success('' + objsection.Name + ' updated successfully.');
                    //if (objsection.Name == 'Emotional Needs and Motivation')
                    //    RiskAlert();
                    //else
                    //    $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });


                    var lstResidents_Questions_AnswersData = response.data.ResidentQuestionAnswers;

                    var lstInsertlstResidents_Questions_AnswersData = [];
                    CommonService.DeleteAllResidents_Questions_AnswersRecords(app.db).then(function (response) {

                        for (var i = 0; i < lstResidents_Questions_AnswersData.length; i++) {
                            lstResidents_Questions_AnswersData[i].IsSyncnised = true;
                            lstResidents_Questions_AnswersData[i].IsCreated = false;
                            lstInsertlstResidents_Questions_AnswersData.push(lstResidents_Questions_AnswersData[i]);
                        }

                        if (lstInsertlstResidents_Questions_AnswersData.length > 70) {
                            var i, j, temparray, chunk = 70;
                            for (i = 0, j = lstInsertlstResidents_Questions_AnswersData.length; i < j; i += chunk) {
                                temparray = lstInsertlstResidents_Questions_AnswersData.slice(i, i + chunk);
                                CommonService.insertResidents_Questions_Answers(app.db, temparray).then(function () {
                                },
                                 function (err) {
                                     toastr.error('An error occurred while updating Residents_Questions_Answers.');
                                 });
                            }
                        }
                    }),
                        function (err) {
                            toastr.error('An error occurred while deleting Residents_Questions_Answers.');
                        }
                },
                   function (err) {
                       console.log(err);
                       toastr.error('An error occurred while updating assessment data.');
                   }
               );
            }
            else {
                updateofflineAssesment(lstResidents_Questions_Answers, objsection);
            }
        };
        var RiskAlert = function () {
            if ($scope.online == true) {
                ResidentsService.GetResidentSummaryAlert(vm.ResidentId).then(
                    function (response) {
                        if (response.data.length > 0) {
                            var sweetAlertOptions = { title: "Suicide Risk!", text: "This person is at high risk of suicide and may require hospital admission.Refer to the mental health team urgently.", type: "error" };
                            SweetAlert.swal(sweetAlertOptions,
                              function (isConfirm) {
                                  if (isConfirm) {
                                      $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                                  }
                              }
                             );
                        }
                        else {
                            $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: true });
                        }
                    }, function (err) {

                    })
            }
        }
        var GetSubQuestionAnswers = function (answers, objSectionQuestionAns) {
            var lst = [];

            for (var i = 0; i < answers.length; i++) {
                if (answers[i].childQuestion && answers[i].childQuestion.length > 0) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {



                        var objResidents_Questions_Answers = {};
                        var CheckParentIsAnswered = [];
                        objResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].OldChosenAnswerID;
                        objResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                        objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                        if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer != answers[i].childQuestion[j].OldChosenAnswer) {



                            if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {//newly added 4/19/2016
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].ChosenAnswer;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                if (answers[i].childQuestion[j].ChosenAnswer)
                                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
                                else
                                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                                objResidents_Questions_Answers.oldChosenAnswer = null;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Signature') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                                objResidents_Questions_Answers.oldChosenAnswer = null;
                            }
                            else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                objResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].Sections_Questions_Answers[0].ID;
                                objResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].ChosenAnswer;
                                objResidents_Questions_Answers.oldChosenAnswer = null;
                            }

                            CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                            // lst.push(objResidents_Questions_Answers);
                        }
                        else {
                            if (answers[i].childQuestion[j].ChosenAnswer != null && answers[i].childQuestion[j].ChosenAnswer == answers[i].childQuestion[j].OldChosenAnswer) {
                                objResidents_Questions_Answers.Section_Question_AnswerId = objResidents_Questions_Answers.oldChosenAnswer;
                            }
                        }


                        if ((objResidents_Questions_Answers.oldChosenAnswer != null || objResidents_Questions_Answers.Section_Question_AnswerId != null) && (answers[i].childQuestion[j].AnswerType == 'RadioButtonList' || answers[i].childQuestion[j].AnswerType == 'DropDownList' || answers[i].childQuestion[j].AnswerType == 'Yes/No' || answers[i].childQuestion[j].AnswerType == 'FreeText' || answers[i].childQuestion[j].AnswerType == 'Number' || answers[i].childQuestion[j].AnswerType == 'Signature'))
                            lst.push(objResidents_Questions_Answers);

                        if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                            if (answers[i].childQuestion[j].MulChosenAnswerID != undefined) {
                                if (answers[i].childQuestion[j].MulChosenAnswerID.length > 0) {
                                    for (var k = 0; k < answers[i].childQuestion[j].MulChosenAnswerID.length; k++) {
                                        var objchkResidents_Questions_Answers = {};
                                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                        objchkResidents_Questions_Answers.oldChosenAnswer = null;
                                        objchkResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                                        objchkResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].MulChosenAnswerID[k];
                                        CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                                        if (answers[i].childQuestion[j].txtAreaAnswer) {
                                            objchkResidents_Questions_Answers.AnswerText = answers[i].childQuestion[j].txtAreaAnswer;
                                        }
                                        //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
                                        //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;
                                        if (answers[i].childQuestion[j].OldChkChosenAnswer != undefined) {

                                            if (!(answers[i].childQuestion[j].OldChkChosenAnswer.indexOf(objchkResidents_Questions_Answers.Section_Question_AnswerId) >= 0))
                                                lst.push(objchkResidents_Questions_Answers);
                                            else {
                                                objchkResidents_Questions_Answers.Section_Question_AnswerId = answers[i].childQuestion[j].MulChosenAnswerID[k];
                                                objchkResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].MulChosenAnswerID[k];
                                                lst.push(objchkResidents_Questions_Answers);
                                            }
                                        }
                                        else {
                                            lst.push(objchkResidents_Questions_Answers);
                                        }

                                    }

                                    if (answers[i].childQuestion[j].OldChkChosenAnswer != undefined) {
                                        for (var z = 0; z < answers[i].childQuestion[j].OldChkChosenAnswer.length; z++) {
                                            if (!(answers[i].childQuestion[j].MulChosenAnswerID.indexOf(answers[i].childQuestion[j].OldChkChosenAnswer[z]) >= 0)) {
                                                var objchkResidents_Questions_Answers = {};
                                                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                                objchkResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                                                objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                                objchkResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].OldChkChosenAnswer[z];
                                                lst.push(objchkResidents_Questions_Answers);
                                            }

                                        }
                                    }
                                }
                                else {

                                    if (answers[i].childQuestion[j].OldChkChosenAnswer != undefined) {
                                        for (var l = 0; l < answers[i].childQuestion[j].OldChkChosenAnswer.length; l++) {
                                            var objchkResidents_Questions_Answers = {};
                                            objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                            objchkResidents_Questions_Answers.HasScore = answers[i].childQuestion[j].MinScore;
                                            objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                            objchkResidents_Questions_Answers.oldChosenAnswer = answers[i].childQuestion[j].OldChkChosenAnswer[l];
                                            lst.push(objchkResidents_Questions_Answers);
                                        }
                                    }
                                }
                            }
                        }

                        if (answers[i].childQuestion[j].AnswerType == 'FileUpload' && answers[i].childQuestion[j].ChosenAnswer) {

                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
                            objResidents_Questions_Answers.FileData = answers[i].childQuestion[j].ChosenAnswer.file;
                            objResidents_Questions_Answers.AnswerText = "FileUpload";
                            lst.push(objResidents_Questions_Answers);
                            //CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                        }

                        if (answers[i].childQuestion[j].MinScore != null) {


                            lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));

                        }
                        else {
                            //Code change on 6/30/2016
                            var hasscore = false;
                            for (var mmm = 0; mmm < answers[i].childQuestion[j].Sections_Questions_Answers.length; mmm++) {

                                if (answers[i].childQuestion[j].Sections_Questions_Answers[mmm].childQuestion.length > 0) {
                                    hasscore = true;
                                }
                            }

                            if (hasscore == true)
                                lst = lst.concat(GetSubQuestionAnswers(answers[i].childQuestion[j].Sections_Questions_Answers, CheckParentIsAnswered));
                            else {
                                if (answers[i].childQuestion[j].childQuestion.length > 0)
                                    lst = lst.concat(GetSubQuestionQuestion(answers[i].childQuestion[j]));
                            }
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
                objResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].OldChosenAnswerID;
                objResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                objResidents_Questions_Answers.ResidentId = vm.ResidentId;
                var CheckParentIsAnswered = [];
                if (answers.childQuestion[j].ChosenAnswer != null && answers.childQuestion[j].ChosenAnswer != answers.childQuestion[j].OldChosenAnswer) {



                    if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                        //newly added 4/19/2016
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].ChosenAnswer;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                        if (answers.childQuestion[j].ChosenAnswer)
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
                        else
                            objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Signature') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }
                    else if (answers.childQuestion[j].AnswerType == 'Number') {
                        objResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].Sections_Questions_Answers[0].ID;
                        objResidents_Questions_Answers.AnswerText = answers.childQuestion[j].ChosenAnswer;
                        objResidents_Questions_Answers.oldChosenAnswer = null;
                    }

                    CheckParentIsAnswered.push(objResidents_Questions_Answers.Section_Question_AnswerId);
                    // lst.push(objResidents_Questions_Answers);
                }
                else {
                    if (answers.childQuestion[j].ChosenAnswer == answers.childQuestion[j].OldChosenAnswer && answers.childQuestion[j].ChosenAnswer != null) {
                        objResidents_Questions_Answers.Section_Question_AnswerId = objResidents_Questions_Answers.oldChosenAnswer;
                    }
                }

                if ((objResidents_Questions_Answers.Section_Question_AnswerId != null || objResidents_Questions_Answers.oldChosenAnswer != null) && (answers.childQuestion[j].AnswerType == 'RadioButtonList' || answers.childQuestion[j].AnswerType == 'DropDownList' || answers.childQuestion[j].AnswerType == 'Yes/No' || answers.childQuestion[j].AnswerType == 'FreeText' || answers.childQuestion[j].AnswerType == 'Number' || answers.childQuestion[j].AnswerType == 'Signature'))
                    lst.push(objResidents_Questions_Answers);

                if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                    if (answers.childQuestion[j].MulChosenAnswerID != undefined) {

                        if (answers.childQuestion[j].MulChosenAnswerID.length > 0) {
                            for (var k = 0; k < answers.childQuestion[j].MulChosenAnswerID.length; k++) {
                                var objchkResidents_Questions_Answers = {};
                                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                objchkResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                                objchkResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].MulChosenAnswerID[k];
                                CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                                if (answers.childQuestion[j].txtAreaAnswer) {
                                    objchkResidents_Questions_Answers.AnswerText = answers.childQuestion[j].txtAreaAnswer;
                                }
                                //if (answers[i].Sections_Questions1[j].txtAreaAnswer)
                                //    objchkResidents_Questions_Answers.AnswerText = answers[i].Sections_Questions1[j].txtAreaAnswer;
                                if (answers.childQuestion[j].OldChkChosenAnswer != undefined) {
                                    if (!(answers.childQuestion[j].OldChkChosenAnswer.indexOf(objchkResidents_Questions_Answers.Section_Question_AnswerId) >= 0))
                                        lst.push(objchkResidents_Questions_Answers);
                                    else {
                                        objchkResidents_Questions_Answers.Section_Question_AnswerId = answers.childQuestion[j].MulChosenAnswerID[k];
                                        objchkResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].MulChosenAnswerID[k];
                                        lst.push(objchkResidents_Questions_Answers);
                                    }



                                }
                                else {

                                    lst.push(objchkResidents_Questions_Answers);
                                }

                            }

                            if (answers.childQuestion[j].OldChkChosenAnswer != undefined) {
                                for (var m = 0; m < answers.childQuestion[j].OldChkChosenAnswer.length; m++) {

                                    if (!(answers.childQuestion[j].MulChosenAnswerID.indexOf(answers.childQuestion[j].OldChkChosenAnswer[m]) >= 0)) {
                                        var objchkResidents_Questions_Answers = {};
                                        objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                        objchkResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                                        objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                        objchkResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].OldChkChosenAnswer[m];
                                        lst.push(objchkResidents_Questions_Answers);
                                    }
                                }
                            }
                        }
                        else {
                            for (var l = 0; l < answers.childQuestion[j].OldChkChosenAnswer.length; l++) {
                                var objchkResidents_Questions_Answers = {};
                                objchkResidents_Questions_Answers.ResidentId = vm.ResidentId;
                                objchkResidents_Questions_Answers.HasScore = answers.childQuestion[j].MinScore;
                                objchkResidents_Questions_Answers.Section_Question_AnswerId = null;
                                objchkResidents_Questions_Answers.oldChosenAnswer = answers.childQuestion[j].OldChkChosenAnswer[l];
                                lst.push(objchkResidents_Questions_Answers);
                            }
                        }
                    }
                }

                if (answers.childQuestion[j].AnswerType == 'FileUpload' && answers.childQuestion[j].ChosenAnswer) {

                    objResidents_Questions_Answers.Section_Question_AnswerId = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { LabelText: 'Choose Form' })[0].ID;
                    objResidents_Questions_Answers.FileData = answers.childQuestion[j].ChosenAnswer.file;
                    objResidents_Questions_Answers.AnswerText = "FileUpload";
                    lst.push(objResidents_Questions_Answers);
                    //CheckParentIsAnswered.push(objchkResidents_Questions_Answers.Section_Question_AnswerId);
                }


                if (answers.childQuestion[j].MinScore != null) {


                    lst = lst.concat(GetSubQuestionQuestion(answers.childQuestion[j]));

                }
                else {


                    lst = lst.concat(GetSubQuestionAnswers(answers.childQuestion[j].Sections_Questions_Answers, CheckParentIsAnswered));
                }



            }



            return lst;
        };
        var EditSubQuestion = function (answers, lstAssessmentData) {
            for (var i = 0; i < answers.length; i++) {

                if (answers[i].childQuestion != undefined) {
                    for (var j = 0; j < answers[i].childQuestion.length; j++) {
                        answers[i].childQuestion[j].ChosenAnswer = null;
                        answers[i].childQuestion[j].OldChosenAnswer = null;
                        answers[i].childQuestion[j].OldChosenAnswerID = null;
                        answers[i].childQuestion[j].SignatureIcon = null;
                        if (!answers[i].childQuestion[j].MulChosenAnswerID)
                            answers[i].childQuestion[j].MulChosenAnswerID = [];
                        if (!answers[i].childQuestion[j].SumofScores)
                            answers[i].childQuestion[j].SumofScores = 0;


                        if (!answers[i].childQuestion[j].OldChkChosenAnswer) {
                            answers[i].childQuestion[j].OldChkChosenAnswer = [];
                        }
                        //newly added on 4/18/2016
                        var lstQueswthnoAnswer = 0;
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                lstQueswthnoAnswer++;
                                answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    var rbScore = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                    if (rbScore != null)
                                        answers[i].childQuestion[j].SumofScores = rbScore;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'DropDownList') {
                                    //newly added 4/19/2016
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Yes/No') {
                                    var labelText = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                    answers[i].childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                                    answers[i].childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                                    answers[i].childQuestion[j].OldChosenAnswerID = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FreeText') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Signature') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    answers[i].childQuestion[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'Number') {
                                    answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    answers[i].childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                }
                                else if (answers[i].childQuestion[j].AnswerType == 'FileUpload') {
                                    if (vm.online) {
                                        if (lstAssessmentData[k].ResidentFile) {
                                            answers[i].childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                            var filename = lstAssessmentData[k].ResidentFile ? lstAssessmentData[k].ResidentFile.split('/') : null;
                                            answers[i].childQuestion[j].ChosenFileName = lstAssessmentData[k].ResidentFile ? filename[5] : null;
                                        }
                                    } else {
                                        if (lstAssessmentData[k].FilePath != '') {
                                            answers[i].childQuestion[j].ChosenFilePath = lstAssessmentData[k].FilePath;
                                            answers[i].childQuestion[j].ChosenFileName = lstAssessmentData[k].ResidentFile;
                                        }
                                    }
                                }

                                else if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                                    answers[i].childQuestion[j].ChosenAnswerID = null;
                                    // var sumscores1=0
                                    for (var p = 0; p < answers[i].childQuestion[j].Sections_Questions_Answers.length; p++) {



                                        if (answers[i].childQuestion[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                            answers[i].childQuestion[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                            if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                                answers[i].childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                            }

                                            var chosenAnswerIndex = answers[i].childQuestion[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                            if (!(chosenAnswerIndex > -1)) {
                                                answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                                answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Sections_Questions_Answers[p].Score;
                                            }

                                            var oldchkIndex = answers[i].childQuestion[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                            if (!(oldchkIndex > -1)) {
                                                answers[i].childQuestion[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                            }

                                            //Changed on 6/30/2016
                                            //answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Sections_Questions_Answers.Score;


                                            // sumscores1 += answers[i].childQuestion[j].Sections_Questions_Answers.Score;
                                        }




                                    }
                                    //if(sumscores > 0)
                                    //vm.copySumofScore = sumscores1;

                                    //answers[i].Sections_Questions1[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                    //answers[i].Sections_Questions1[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;

                                }

                                var hasonlyScores = false;
                                for (var zzz = 0; zzz < answers[i].childQuestion[j].Sections_Questions_Answers.length; zzz++) {

                                    if (answers[i].childQuestion[j].Sections_Questions_Answers[zzz].childQuestion.length > 0) {

                                        hasonlyScores = true;
                                    }
                                }

                                if (hasonlyScores == true)
                                    EditSubQuestion(answers[i].childQuestion[j].Sections_Questions_Answers, lstAssessmentData);
                                else {
                                    if (answers[i].childQuestion[j].childQuestion.length > 0) {
                                        EditSubQuestionQuestion(answers[i].childQuestion[j], lstAssessmentData);
                                    }
                                }



                            }

                        }
                        //newly added 4/18/2016
                        if (lstQueswthnoAnswer == 0 && answers[i].childQuestion[j].LastQuestionInset == true) {

                            EditSubQuestion(answers[i].childQuestion[j].Sections_Questions_Answers, lstAssessmentData);


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
                answers.childQuestion[j].OldChosenAnswerID = null;
                answers.childQuestion[j].SignatureIcon = null;
                if (!answers.childQuestion[j].MulChosenAnswerID) {
                    answers.childQuestion[j].MulChosenAnswerID = [];

                }

                if (!answers.childQuestion[j].OldChkChosenAnswer) {
                    answers.childQuestion[j].OldChkChosenAnswer = [];
                }

                if (!answers.childQuestion[j].SumofScores)
                    answers.childQuestion[j].SumofScores = 0;

                //newly added on 4/18/2016
                var lstQueswthnoAnswer = 0;
                for (var k = 0; k < lstAssessmentData.length; k++) {
                    if (answers.childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                        lstQueswthnoAnswer++;
                        answers.childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            var rbScore = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                            if (rbScore != null)
                                answers.childQuestion[j].SumofScores = rbScore;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'DropDownList') {
                            //4/19/2016
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'Yes/No') {
                            var labelText = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                            answers.childQuestion[j].ChosenAnswer = labelText == 'Yes' ? true : false;
                            answers.childQuestion[j].OldChosenAnswer = labelText == 'Yes' ? true : false;
                            answers.childQuestion[j].OldChosenAnswerID = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].ID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'FreeText') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'Signature') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            answers.childQuestion[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);

                        }
                        else if (answers.childQuestion[j].AnswerType == 'Number') {
                            answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            answers.childQuestion[j].OldChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                        }
                        else if (answers.childQuestion[j].AnswerType == 'FileUpload') {
                            if (vm.online) {
                                if (lstAssessmentData[k].ResidentFile) {
                                    answers.childQuestion[j].ChosenFilePath = lstAssessmentData[k].ResidentFile;
                                    var filename = lstAssessmentData[k].ResidentFile ? lstAssessmentData[k].ResidentFile.split('/') : null;
                                    answers.childQuestion[j].ChosenFileName = lstAssessmentData[k].ResidentFile ? filename[5] : null;
                                }
                            }
                            else {
                                if (lstAssessmentData[k].FilePath != '') {
                                    answers.childQuestion[j].ChosenFilePath = lstAssessmentData[k].FilePath;
                                    answers.childQuestion[j].ChosenFileName = lstAssessmentData[k].ResidentFile;
                                }
                            }
                        }

                        else if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {
                            answers.childQuestion[j].ChosenAnswerID = null;
                            var sumscores = 0
                            for (var p = 0; p < answers.childQuestion[j].Sections_Questions_Answers.length; p++) {



                                if (answers.childQuestion[j].Sections_Questions_Answers[p].ID == lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID) {

                                    answers.childQuestion[j].Sections_Questions_Answers[p].ChosenAnswer = true;
                                    if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText) {
                                        answers.childQuestion[j].txtAreaAnswer = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                    }

                                    //code on 6/7/2016
                                    var chosenAnswerIndex = answers.childQuestion[j].MulChosenAnswerID.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    if (!(chosenAnswerIndex > -1)) {
                                        answers.childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    }

                                    var OldChkChosenAnswerIndex = answers.childQuestion[j].OldChkChosenAnswer.indexOf(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    if (!(OldChkChosenAnswerIndex > -1)) {
                                        answers.childQuestion[j].OldChkChosenAnswer.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                    }


                                    answers.childQuestion[j].SumofScores += answers.childQuestion[j].Sections_Questions_Answers.Score;
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
                            EditSubQuestion(answers.childQuestion[j].Sections_Questions_Answers, lstAssessmentData);
                        }





                    }

                }
                //newly added 4/18/2016
                if (lstQueswthnoAnswer == 0 && answers.childQuestion[j].LastQuestionInset == true) {
                    if (answers.childQuestion[j].MinScore != null) {


                        EditSubQuestionQuestion(answers.childQuestion[j], lstAssessmentData);



                    }
                    else {
                        EditSubQuestion(answers.childQuestion[j].Sections_Questions_Answers, lstAssessmentData);
                    }
                }

            }
            return true
        }

        vm.alertsArr = [];
      
        vm.RadioButtonChange = function (objSection_Question, objSection_Question_Answer) {

            objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;
            //newly added
            objSection_Question.SumofScores = $filter('filter')(objSection_Question.Sections_Questions_Answers, { ID: objSection_Question.ChosenAnswer })[0].Score;
            SucideAlertPopUp(objSection_Question, objSection_Question_Answer);
        }

        var lstAnsweredEmotionalNeedsAnswers = [];
        var SucideAlertPopUp = function (objSection_Question, objSection_Question_Answer) {

            var lstQuestionIds = [];
            for (var i = 0; i < $rootScope.SucideAlertQuestionIds.length; i++) {
                if ($rootScope.SucideAlertQuestionIds[i].ConfigurationKey == 'SucideAlertPopup') {
                    lstQuestionIds = $rootScope.SucideAlertQuestionIds[i].ConfigurationValue;
                }
            }

            if (lstQuestionIds.indexOf(angular.uppercase(objSection_Question.ID)) > -1) {
                var isQuestionAlreadyAnswered = false;

                for (var i = 0; i < lstAnsweredEmotionalNeedsAnswers.length; i++) {
                    if (lstAnsweredEmotionalNeedsAnswers[i].QuestionId == objSection_Question.ID) {
                        isQuestionAlreadyAnswered = true;
                        lstAnsweredEmotionalNeedsAnswers[i].AnswerId = objSection_Question_Answer.ID;
                        lstAnsweredEmotionalNeedsAnswers[i].Score = objSection_Question_Answer.Score;
                        break;
                    }
                }
                if (!isQuestionAlreadyAnswered) {
                    var objEmotionalNeedsAnswer = {};
                    objEmotionalNeedsAnswer.QuestionId = objSection_Question.ID;
                    objEmotionalNeedsAnswer.AnswerId = objSection_Question_Answer.ID;
                    objEmotionalNeedsAnswer.Score = objSection_Question_Answer.Score;
                    lstAnsweredEmotionalNeedsAnswers.push(objEmotionalNeedsAnswer);
                }

                var totalScoreOfEmotionalNeeds = 0;
                for (var i = 0; i < lstAnsweredEmotionalNeedsAnswers.length; i++) {
                    totalScoreOfEmotionalNeeds += lstAnsweredEmotionalNeedsAnswers[i].Score;
                }

                if (totalScoreOfEmotionalNeeds > 9) {
                    var sweetAlertOptions = { title: "Suicide Risk!", text: "This person is at high risk of suicide and may require hospital admission.Refer to the mental health team urgently.", type: "error" };
                    SweetAlert.swal(sweetAlertOptions,
                      function (isConfirm) {
                          if (isConfirm) {
                              $state.go($state.current, { ResidentId: vm.ResidentId }, { reload: false });
                          }
                      }
                     );
                }
            }
        }

        vm.ToggleSwitchChange = function (objSection_Question) {
            if (objSection_Question.ChosenAnswer == true)
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'Yes' })[0].ID;
            else
                objSection_Question.ChosenAnswerID = $filter('filter')(objSection_Question.Sections_Questions_Answers, { LabelText: 'No' })[0].ID;
        }

        vm.DropDownchange = function (objSection_Question) {
            objSection_Question.ChosenAnswerID = objSection_Question.ChosenAnswer;

        }

        vm.copySumofScore = 0;
        vm.CheckBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
            if (!objSection_Question.MulChosenAnswerID)
                objSection_Question.MulChosenAnswerID = [];
            //else
            //{
            //    var objuniqueIds = objSection_Question.MulChosenAnswerID;
            //    objSection_Question.MulChosenAnswerID = [];
            //    objSection_Question.MulChosenAnswerID.push(uniquecheckbox(objuniqueIds));
            //}





            if (!objSection_Question.SumofScores) {

                objSection_Question.SumofScores = 0;
            }

            if (objsectionQuestionAnswer.ChosenAnswer == true) {
                if (objsectionQuestionAnswer.LabelText != 'None') {
                    objSection_Question.MulChosenAnswerID.push(objsectionQuestionAnswer.ID);
                    if (objsectionQuestionAnswer.Score) {
                        objSection_Question.SumofScores = objSection_Question.SumofScores + objsectionQuestionAnswer.Score;

                    }
                    for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
                        if (objSection_Question.Sections_Questions_Answers[i].LabelText == 'None') {
                            objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
                            var chosenAnswerIndex = objSection_Question.MulChosenAnswerID.indexOf(objSection_Question.Sections_Questions_Answers[i].ID);
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
                    for (var i = 0; i < objSection_Question.Sections_Questions_Answers.length; i++) {
                        if (objSection_Question.Sections_Questions_Answers[i].ID != objsectionQuestionAnswer.ID) {
                            objSection_Question.Sections_Questions_Answers[i].ChosenAnswer = false;
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
            //if (objSection_Question.SumofScores!=undefined)
            //vm.copySumofScore+= objSection_Question.SumofScores
            // console.log('hiiii')
            //console.log($parent.objSection_Question);
            //console.log(objSection_Question.MulChosenAnswerID)

            if (objSection_Question.MulChosenAnswerID.length == 0) {
                objSection_Question.SumofScores = 0;
            }
        }
        vm.ShowChildQuestionQuestion = function (obj, val, objParent) {
            if (val.objSection.Name == 'Eating') {
                var sectionScore = 0;
                for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
                    if (val.objSection.Sections_Questions[i].AnswerType == 'FreeText') {
                        sectionScore += val.objSection.Sections_Questions[i].SumofScores;
                    }
                }

                if (sectionScore > 0)
                    return (obj.MinScore <= sectionScore && (obj.MaxScore >= sectionScore || obj.MaxScore == null));
                else
                    return false;
            }
            else {
                if (obj.childGroupNo != undefined) {
                    var SumofScoresofAllQuestion = 0;

                    for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
                        if (val.objSection.Sections_Questions[i].SetGroupNo == obj.childGroupNo) {

                            if (val.objSection.Sections_Questions[i].SumofScores != undefined && val.objSection.Sections_Questions[i].SumofScores > 0) {
                                SumofScoresofAllQuestion += val.objSection.Sections_Questions[i].SumofScores;

                            }
                        }


                    }

                    if (SumofScoresofAllQuestion == 0) {
                        for (var i = 0; i < val.objSection.Sections_Questions.length; i++) {
                            for (var l = 0; l < val.objSection.Sections_Questions[i].childQuestion.length; l++) {
                                if (val.objSection.Sections_Questions[i].childQuestion[l].SetGroupNo == obj.childGroupNo) {

                                    if (val.objSection.Sections_Questions[i].childQuestion[l].SumofScores != undefined && val.objSection.Sections_Questions[i].childQuestion[l].SumofScores > 0) {
                                        SumofScoresofAllQuestion += val.objSection.Sections_Questions[i].childQuestion[l].SumofScores;

                                    }
                                }
                            }



                        }
                    }


                    if (SumofScoresofAllQuestion == 0) {
                        if (objParent != undefined)
                            if (objParent.SetGroupNo != undefined) {
                                if (obj.childGroupNo == objParent.SetGroupNo) {
                                    SumofScoresofAllQuestion = objParent.SumofScores;
                                }
                            }
                    }

                }

                if (SumofScoresofAllQuestion > 0) {
                    return (obj.MinScore <= SumofScoresofAllQuestion && (obj.MaxScore >= SumofScoresofAllQuestion || obj.MaxScore == null));
                }
                    //else if (SumofScoresofAllQuestionWithNoChildGrooupNo>0)
                    //{
                    //    return (obj.MinScore <= SumofScoresofAllQuestionWithNoChildGrooupNo && (obj.MaxScore >= SumofScoresofAllQuestionWithNoChildGrooupNo || obj.MaxScore == null));
                    //}
                else {
                    return false;
                }
            }
        }
        vm.txtBoxChange = function (objSection_Question, objsectionQuestionAnswer) {
            if (objSection_Question.Question == 'Falls') {
                if (objSection_Question.SumofScores || objSection_Question.SumofScores == 0) {

                    if (isNaN(objSection_Question.txtAreaAnswer) || objSection_Question.txtAreaAnswer == "") {

                        if (!(objSection_Question.oldScore === undefined)) {
                            objSection_Question.SumofScores = objSection_Question.SumofScores - objSection_Question.oldScore;
                            objSection_Question.oldScore = 0;
                        }

                    }
                    else {
                        if (objSection_Question.SumofScores >= 0) {

                            if (objSection_Question.oldScore === undefined) {
                                objSection_Question.SumofScores = (objSection_Question.SumofScores) + parseInt(objSection_Question.txtAreaAnswer * 5);
                                objSection_Question.oldScore = objSection_Question.txtAreaAnswer * 5;
                            }
                            else {
                                objSection_Question.SumofScores = ((objSection_Question.SumofScores - objSection_Question.oldScore)) + parseInt(objSection_Question.txtAreaAnswer * 5);
                                objSection_Question.oldScore = objSection_Question.txtAreaAnswer * 5;
                            }
                        }
                        else {
                            objSection_Question.txtAreaAnswer = 0;
                            objSection_Question.SumofScores = objSection_Question.SumofScores + objSection_Question.txtAreaAnswer;
                            objSection_Question.oldScore = objSection_Question.txtAreaAnswer;
                        }

                    }
                }
            }
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
        vm.BindSectionQuestionAnswer = function (objSectionQuestionAnswer) {
            var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
            var res = objSectionQuestionAnswer.replace("ResidentName", ResidentFullName);
            return res;
        }
        vm.check = function (objSubQuestion, obj) {
            objSubQuestion.SampleScope = obj;
        }
        vm.HasChildQuestion = function (objSubQuestion) {
            return objSubQuestion.SampleScope;
        }

        vm.openFile = function (url) {
            alert(url);
            var urlPaths = url.split('/');
            var fileName = urlPaths.length > 0 ? urlPaths[urlPaths.length - 1] : 'downloadedFile.txt';
            var fileNameParts = fileName.split('.');
            var extension = fileNameParts.length > 1 ? '.' + fileNameParts[fileNameParts.length - 1] : '.txt';
            var mimeType = CommonService.getMimeTypeForExtension(extension);
            alert(fileName);
            alert(mimeType);
            if (vm.online) {

                var targetPath = $rootScope.Path + 'downloads/' + fileName;
                alert(targetPath);
                var options = { withCredentials: true };
                $rootScope.$broadcast("loader_show");
                $cordovaFileTransfer.download($rootScope.RootUrl + url, targetPath, options, true).then(function (result) {
                    alert(JSON.stringify(result));
                    $rootScope.$broadcast("loader_hide");
                    $cordovaFileOpener2.open(targetPath, mimeType).then(function () {
                        $rootScope.$broadcast("loader_hide");
                    }, function (err) {
                        $rootScope.$broadcast("loader_hide");
                    });
                }, function (error) {
                    alert(JSON.stringify(error));
                    if (error.code == 1) {
                        $cordovaFileOpener2.open(targetPath, mimeType).then(function () {
                            $rootScope.$broadcast("loader_hide");
                        }, function (err) {
                            alert(JSON.stringify(err));
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
                    alert(JSON.stringify(err));
                    $rootScope.$broadcast("loader_hide");
                });
            }
        }

        //Delete Alert functionality

        vm.AlertPainMonitoringPart = function () {
            var deferred = $q.defer();
            var AlertConfirm = false;
            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to  delete this Part ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            }

            SweetAlert.swal(sweetAlertOptions,
                   function (isConfirm) {
                       if (isConfirm) {
                           deferred.resolve(true);
                       }
                       else {
                           deferred.resolve(false);
                       }
                   });
            return deferred.promise;
        }



    }

}());