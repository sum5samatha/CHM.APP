(function () {
    // "use strict";

    angular.module('CHM').controller('ViewResidentController', ViewResidentController);

    ViewResidentController.$inject = ['$rootScope', '$q', '$uibModal', '$window', '$filter', '$timeout', '$state', '$stateParams', '$location', '$sce', 'toastr', 'SweetAlert', 'ResidentsService', 'CommonService', '$scope', 'onlineStatus', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout'];

    function ViewResidentController($rootScope, $q, $uibModal, $window, $filter, $timeout, $state, $stateParams, $location, $sce, toastr, SweetAlert, ResidentsService, CommonService, $scope, onlineStatus, $cordovaFileTransfer, $cordovaFileOpener2, $timeout) {
        var vm = this;


        vm.IsSecondaryReadonly = $rootScope.IsSecondaryRead;
        vm.PersonalInformation = { open: true };
        vm.ResidentId = $stateParams.ResidentId;
        vm.SelectedParts = [];

        var offlineResidents = [];
        var offlineResidentPhotos = [];
        var offlineGetOnlyActiveSections = [];
        var offlineQuestionParentQuestion = [];
        var offlinesectionQuestion = [];
        var offlineSectionQuestionAnswer = [];
        var offlineResdientQuestionAnser = [];
        var offlineResidentAnswerDocuments = [];
        var offlineSecQuesAns = [];

        //Retrieving Active sections
        var loadActiveSection = function () {
            ResidentsService.GetOnlyActiveSection().then(
             function (response) {
                 vm.OnlySection = response.data;
             },
             function (err) {

             });
        }

         //Sections for retrieving Active sections  
        var loadonlineActiveSections = function () {
            loadActiveSection();
            getAllActiveQuestionParentQuestion();

        }


        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.IsSecondaryReadonly = $rootScope.IsSecondaryRead;
            vm.PersonalInformation = { open: true };
            vm.ResidentId = $stateParams.ResidentId;
            vm.OpenOnlyOneSection = false;
            vm.Resident = {};

            if ($scope.online) {

                if ($rootScope.IsSynchronizing) {
                    $scope.$on('SyncOfData', function (event, args) {
                        if (args.Compleated) {
                            GetPersonalInformation();
                            loadonlineActiveSections();
                        }
                    });
                }
                else {
                    GetPersonalInformation();
                    loadonlineActiveSections();
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

                $q.all(defferedResident).then(function (response) {
                    GetofflineResidentPersonalData();
                    $rootScope.$broadcast("loader_hide");
                },
                 function (err) {
                     console.log('err');
                 }
                );
            }
        });

        $timeout(function () {
            for (var i = 0; i < $(".selectedpart").length; i++) {
                var ids = $(".selectedpart")[i].id;
                if (ids != "border" && ids != "") {

                    $("#" + ids + "").css('fill', 'white');
                }
            }

            //Retriving Pain Monitoring Parts
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

            //Binging color in PageLoad
            var BindColor = function (obj) {
                for (var i = 0; i < obj.length; i++) {
                    var image = obj[i].PartsID.replace(/ /g, "_");
               $("#" + image + "").css('fill', 'red');
                }
            }
        });


        //Framing Section Question Answer

           var framsesectionQuestionAnswer = function () {
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

        //Retrieving  offlineResidentPersonalData 
           var GetofflineResidentPersonalData = function () {
            if (offlineResidents.length > 0) {
                for (var i = 0; i < offlineResidents.length; i++) {
                    offlineResidents[i].DOB = offlineResidents[i].DOB ? new Date(offlineResidents[i].DOB) : null;
                    offlineResidents[i].DOJ = offlineResidents[i].DOJ ? new Date(offlineResidents[i].DOJ) : null;
                    offlineResidents[i].AdmittedFrom = offlineResidents[i].AdmittedFrom ? new Date(offlineResidents[i].AdmittedFrom) : null;
                    vm.Resident = angular.copy(offlineResidents[i]);
                    if (offlineResidents[i].Gender == 'M') {
                        vm.showmaleimage = true;
                        vm.showfemaleimage = false;
                    }
                    else {
                        vm.showmaleimage = false;
                        vm.showfemaleimage = true;
                    }
                    for (var j = 0; j < offlineResidentPhotos.length; j++) {
                        if (offlineResidentPhotos[j].ID == offlineResidents[i].ID) {
                            vm.PhotoUrl = offlineResidentPhotos[j].PhotoURL;
                        }
                    }
                }
            }
            framsesectionQuestionAnswer();
            vm.OnlySection = offlineGetOnlyActiveSections;
        }

        vm.OpenOnlyOneSection = false;
        vm.Resident = {};

        //Binding the data of the Section Based on AccordianClick
        vm.ClickAccordianHeader = function (objSection) {
            vm.sectionID = objSection.ID;
            if ($scope.online == true) {
                if (objSection.Sections_Questions.length == 0)
                    GetAllActiveSection(objSection);
            }
            else {
                GetAllOfflineActiveSection(objSection);
            }
        }

        function GetDataFromOnline() {
            getAllActiveQuestionParentQuestion();
        }

        //Binding QuestionParentQuestion

        function getAllActiveQuestionParentQuestion() {
            ResidentsService.getAllActiveQuestionParentQuestion().then(
                function (response) {
                    vm.QuestionParentQuestion = response.data;
                    vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
                    vm.AllQuestionParentQuestion = response.data;
                },
                function (err) {
                    toastr.error('An error occurred while retrieving QuestionParentQuestion.');
                }
              );
        }


        //To Remove Question that has noAnswers

        var RemoveNotAnsweredQuestion = function (objChildQuestion) {
            for (var r = 0; r < objChildQuestion.length; r++) {
                if (objChildQuestion[r].AnswerText === undefined) {
                    objChildQuestion[r] = [];
                }
                else {
                    RemoveNotAnsweredQuestion(objChildQuestion[r].childQuestion);
                }

            }
        }

        //SubquestionsAsParent

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


        //subQuestionforAnswer

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


        //code to get Unique Questions And Unique Ids From Question_ParentQuestion

        var uniqueQuestion = function (arr) {
            var newarr = [];
            var unique = {};
            var onlydupiclateid = [];
            arr.forEach(function (item, index) {
                if (!unique[item.QuestionID]) {
                    newarr.push(item);
                    unique[item.QuestionID] = item;

                }
                else {
                    onlydupiclateid.push(item);
                }
            });

            return onlydupiclateid;
        }
        var uniqueval = function (arr) {
            var newarr = [];
            var unique = {};
            arr.forEach(function (item, index) {
                if (!unique[item.QuestionID]) {
                    newarr.push(item);
                    unique[item.QuestionID] = item;
                }
            });

            return newarr;

        }

        //Start 6/28/2016 
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



        var GetAllActiveSection = function (objSection) {
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
                    }

                }

                //To AddQuestion To Section Start
                        for (var t = 0; t < vm.AllSection.length; t++) {
                    vm.AllSection[t].Sections_Questions = [];
                    for (var s = 0; s < vm.MainQuestion.length; s++) {

                        if (vm.MainQuestion[s].SectionID == vm.AllSection[t].ID) {
                            vm.AllSection[t].Sections_Questions.push(vm.MainQuestion[s]);
                        }


                    }

                }
                //Step1:

                // vm.CopyQuestionParentQuestion
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
                        //Step2:
                        vm.AllParentQuestions = [];
                        //var unique = {};
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


                vm.NewSections = vm.Sections;

                objSection.Sections_Questions = [];
                objSection.Sections_Questions = vm.NewSections[0].Sections_Questions;
                GetAssessmentAnswers();
            },
            function (err) {
                toastr.error('An error occurred while retrieving sections.');
            }
             );
        }

        var GetAllOfflineActiveSection = function (objSection) {


            vm.QuestionParentQuestion = offlineQuestionParentQuestion;
            vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
            vm.AllQuestionParentQuestion = offlineQuestionParentQuestion;


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

                        // console.log('step4 complete');
                        // console.log(vm.AllSetQuestion);

                    }
                }
            }

            if (vm.AllSetQuestion != undefined) {
                if (vm.AllSetQuestion.length > 0) {

                    for (var q = 0; q < vm.AllSection.length; q++) {
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
                            // console.log('step6');
                            // console.log(vm.AllSection[q]);
                        }

                    }
                }
            }
            vm.Sections = vm.AllSection;
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

            vm.NewSections = vm.Sections;
            objSection.Sections_Questions = [];
            objSection.Sections_Questions = vm.NewSections[0].Sections_Questions;
            GetofflineAssessmentAnswers();

        }

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
                    vm.Sections[i].Sections_Questions[j].AnswerText = '-';
                    if (!vm.Sections[i].Sections_Questions[j].MulChosenAnswerID)
                        vm.Sections[i].Sections_Questions[j].MulChosenAnswerID = [];


                    if (!vm.Sections[i].Sections_Questions[j].SumofScores)
                        vm.Sections[i].Sections_Questions[j].SumofScores = 0;
                    //End


                    if (vm.Sections[i].Sections_Questions[j].AnswerType == 'CheckBoxList') {
                        vm.Sections[i].Sections_Questions[j].ChosenAnswerID = null;
                        for (var m = 0; m < lstAssessmentData.length; m++) {

                            if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[m].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {

                                var checkboxAnsTxt = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                if (checkboxAnsTxt.toUpperCase() == 'OTHER') {
                                    checkboxAnsTxt = lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                }
                                else {
                                    if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null)
                                        checkboxAnsTxt += ',' + lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                }


                                vm.Sections[i].Sections_Questions[j].AnswerText += checkboxAnsTxt + ",";
                                vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.push(lstAssessmentData[m].ResidentQuestionAnswer.Section_Question_AnswerID);
                                vm.Sections[i].Sections_Questions[j].SumofScores += $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                if (vm.Sections[i].Sections_Questions[j].Question == "Falls") {
                                    if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null) {
                                        vm.Sections[i].Sections_Questions[j].SumofScores += parseInt(lstAssessmentData[m].ResidentQuestionAnswer.AnswerText) * 5;

                                    }
                                }

                            }
                        }
                        if (vm.Sections[i].Sections_Questions[j].MinScore == null)
                            ViewSubQuestionsAndAnswers(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                        else
                            ViewSubQuestionsAndQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                    }
                    else {
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                vm.Sections[i].Sections_Questions[j].AnswerText = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                    vm.Sections[i].Sections_Questions[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                }

                                if (vm.Sections[i].Sections_Questions[j].AnswerType == 'RadioButtonList') {
                                    vm.Sections[i].Sections_Questions[j].SumofScores = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                }


                                if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Signature') {
                                    vm.Sections[i].Sections_Questions[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                    vm.Sections[i].Sections_Questions[j].AnswerText = 'Signature';
                                }

                                if (lstAssessmentData[k].ResidentFile != null) {
                                    if (vm.online) {
                                        if (lstAssessmentData[k].ResidentFile) {
                                            vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                            var filename = lstAssessmentData[k].ResidentFile.split('/');
                                            vm.Sections[i].Sections_Questions[j].AnswerText = filename[5];
                                        }
                                    }
                                    else {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                        vm.Sections[i].Sections_Questions[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                    }
                                }
                                if (vm.Sections[i].Sections_Questions[j].MinScore == null)
                                    ViewSubQuestionsAndAnswers(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                                else
                                    ViewSubQuestionsAndQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                                  }
                        }

                    }
                }
            }
        };

        var BindChosenAnswerID = function (objQuestions) {
            for (var i = 0; i < objQuestions.length; i++) {
                for (var j = 0; j < objQuestions[i].Sections_Questions_Answers.length; j++) {
                    if (objQuestions[i].Sections_Questions_Answers[j].IsDefault) {
                        if (objQuestions[i].Sections_Questions_Answers[j].IsDefault != "false") {
                            objQuestions[i].ChosenAnswerID = objQuestions[i].Sections_Questions_Answers[j].ID;
                        }
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
                    vm.PhotoUrl = response.data.PhotoUrl;
                                  },
                function (err) {
                    toastr.error('An error occurred while retrieving online personal information.');
                }
            );
        };


        var GetAssessmentAnswers = function () {
            ResidentsService.GetAssessmentData(vm.ResidentId).then(
                function (response) {
                    var lstAssessmentData = response.data;

                    for (var i = 0; i < vm.Sections.length; i++) {
                        for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                            vm.Sections[i].Sections_Questions[j].AnswerText = '-';

                            //Start 5/9/2016
                            if (!vm.Sections[i].Sections_Questions[j].MulChosenAnswerID)
                                vm.Sections[i].Sections_Questions[j].MulChosenAnswerID = [];


                            if (!vm.Sections[i].Sections_Questions[j].SumofScores)
                                vm.Sections[i].Sections_Questions[j].SumofScores = 0;
                            //End


                            if (vm.Sections[i].Sections_Questions[j].AnswerType == 'CheckBoxList') {
                                vm.Sections[i].Sections_Questions[j].ChosenAnswerID = null;
                                for (var m = 0; m < lstAssessmentData.length; m++) {

                                    if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[m].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {

                                        var checkboxAnsTxt = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                        if (checkboxAnsTxt.toUpperCase() == 'OTHER') {
                                            checkboxAnsTxt = lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                        }
                                        else {
                                            if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null)
                                                checkboxAnsTxt += ',' + lstAssessmentData[m].ResidentQuestionAnswer.AnswerText;
                                        }


                                        vm.Sections[i].Sections_Questions[j].AnswerText += checkboxAnsTxt + ",";
                                        vm.Sections[i].Sections_Questions[j].MulChosenAnswerID.push(lstAssessmentData[m].ResidentQuestionAnswer.Section_Question_AnswerID);
                                        vm.Sections[i].Sections_Questions[j].SumofScores += $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[m].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                        if (vm.Sections[i].Sections_Questions[j].Question == "Falls") {
                                            if (lstAssessmentData[m].ResidentQuestionAnswer.AnswerText != null) {
                                                vm.Sections[i].Sections_Questions[j].SumofScores += parseInt(lstAssessmentData[m].ResidentQuestionAnswer.AnswerText) * 5;

                                            }
                                        }

                                    }
                                }
                                if (vm.Sections[i].Sections_Questions[j].MinScore == null)
                                    ViewSubQuestionsAndAnswers(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                                else
                                    ViewSubQuestionsAndQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                            }
                            else {
                                for (var k = 0; k < lstAssessmentData.length; k++) {
                                    if (vm.Sections[i].Sections_Questions[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                        vm.Sections[i].Sections_Questions[j].AnswerText = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                        if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                            vm.Sections[i].Sections_Questions[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                        }

                                        if (vm.Sections[i].Sections_Questions[j].AnswerType == 'RadioButtonList') {
                                            vm.Sections[i].Sections_Questions[j].SumofScores = $filter('filter')(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                        }


                                        if (vm.Sections[i].Sections_Questions[j].AnswerType == 'Signature') {
                                            vm.Sections[i].Sections_Questions[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                            vm.Sections[i].Sections_Questions[j].AnswerText = 'Signature';
                                        }

                                        if (lstAssessmentData[k].ResidentFile != null) {
                                            if (vm.online) {
                                                if (lstAssessmentData[k].ResidentFile) {
                                                    vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                                    var filename = lstAssessmentData[k].ResidentFile.split('/');
                                                    vm.Sections[i].Sections_Questions[j].AnswerText = filename[5];
                                                }
                                            }
                                            else {
                                                vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                                vm.Sections[i].Sections_Questions[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                            }

                                        }
                                        if (vm.Sections[i].Sections_Questions[j].MinScore == null)
                                            ViewSubQuestionsAndAnswers(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers, lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                                        else
                                            ViewSubQuestionsAndQuestion(vm.Sections[i].Sections_Questions[j], lstAssessmentData, vm.Sections[i].Sections_Questions[j].AnswerText);
                                          }
                                                                    }

                            }
                        }
                    }
                },
                function (err) {
                    toastr.error('An error occurred while retrieving assessment answers.');
                }
            );





        };



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


                    if (answers[i].childQuestion[j].AnswerType == 'CheckBoxList') {
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            answers[i].childQuestion[j].ChosenAnswerID = null;
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {

                                if (answers[i].childQuestion[j].AnswerText == '-') {
                                    answers[i].childQuestion[j].AnswerText = " ";
                                }
                                var checkboxAnsTxt = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                if (checkboxAnsTxt.toUpperCase() == 'OTHER') {
                                    checkboxAnsTxt = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                }

                                answers[i].childQuestion[j].AnswerText += checkboxAnsTxt + ",";
                                answers[i].childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);
                                answers[i].childQuestion[j].SumofScores += $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                            }
                        }
                        if (answers[i].childQuestion[j].MinScore == null) {
                            //Change on 6/30/2016
                            var hasScore = false;
                            for (var ff = 0; ff < answers[i].childQuestion[j].Sections_Questions_Answers.length; ff++) {
                                if (answers[i].childQuestion[j].Sections_Questions_Answers[ff].childQuestion.length > 0) {
                                    hasScore = true;
                                }
                            }
                            if (hasScore == true)
                                ViewSubQuestionsAndAnswers(answers[i].childQuestion[j].Sections_Questions_Answers, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                            else {

                                ViewSubQuestionsAndQuestion(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                            }
                        }
                        else {
                            ViewSubQuestionsAndQuestion(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                               }
                    }
                    else {
                        for (var k = 0; k < lstAssessmentData.length; k++) {
                            if (answers[i].childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                                answers[i].childQuestion[j].AnswerText = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                                answers[i].childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                                if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                    answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                                }


                                if (answers[i].childQuestion[j].AnswerType == 'RadioButtonList') {
                                    answers[i].childQuestion[j].SumofScores = $filter('filter')(answers[i].childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                                }
                                if (answers[i].childQuestion[j].AnswerType == 'Signature') {
                                    answers[i].childQuestion[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                    answers[i].childQuestion[j].AnswerText = 'Signature';
                                }
                                if (lstAssessmentData[k].ResidentFile != null) {
                                    if (vm.online) {
                                        if (lstAssessmentData[k].ResidentFile) {
                                            answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                            var filename = lstAssessmentData[k].ResidentFile.split('/');
                                            answers[i].childQuestion[j].AnswerText = filename[5];
                                        }
                                    }
                                    else {
                                        answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                        answers[i].childQuestion[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                    }
                                }

                                if (answers[i].childQuestion[j].MinScore == null) {
                                    //Code Change on 6/30/2016
                                    ViewSubQuestionsAndAnswers(answers[i].childQuestion[j].Sections_Questions_Answers, lstAssessmentData, answers[i].childQuestion[j].AnswerText);


                                }
                                else {
                                    ViewSubQuestionsAndQuestion(answers[i].childQuestion[j], lstAssessmentData, answers[i].childQuestion[j].AnswerText);
                                   }
                                 }
                        }


                    }
                }
            }
        }

        var ViewSubQuestionsAndQuestion = function (answers, lstAssessmentData, AnswerText) {
            for (var j = 0; j < answers.childQuestion.length; j++) {
                if (!answers.childQuestion[j].MulChosenAnswerID)
                    answers.childQuestion[j].MulChosenAnswerID = [];
                if (!answers.childQuestion[j].SumofScores)
                    answers.childQuestion[j].SumofScores = 0;

                for (var k = 0; k < lstAssessmentData.length; k++) {

                    if (answers.childQuestion[j].AnswerType == 'CheckBoxList') {

                        answers.childQuestion[j].ChosenAnswerID = null;
                        if (answers.childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {

                            if (answers.childQuestion[j].AnswerText == '-') {
                                answers.childQuestion[j].AnswerText = " ";
                            }
                            var checkboxAnsTxt = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                            if (checkboxAnsTxt.toUpperCase() == 'OTHER') {
                                checkboxAnsTxt = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            }

                            if (checkboxAnsTxt && answers.childQuestion[j].AnswerText == undefined)
                                answers.childQuestion[j].AnswerText = "";

                            answers.childQuestion[j].AnswerText += checkboxAnsTxt + ",";
                            answers.childQuestion[j].MulChosenAnswerID.push(lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID);

                            answers.childQuestion[j].SumofScores += $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                        }

                        if (answers.childQuestion[j].MinScore == null) {

                            ViewSubQuestionsAndAnswers(answers.childQuestion[j].Sections_Questions_Answers, lstAssessmentData, answers.childQuestion[j].AnswerText);
                        }
                        else {

                            ViewSubQuestionsAndQuestion(answers.childQuestion[j], lstAssessmentData, answers.childQuestion[j].AnswerText);
                        }
                    }
                    else {
                        if (answers.childQuestion[j].ID == lstAssessmentData[k].ResidentQuestionAnswer.Sections_Questions_Answers.Section_QuestionID) {
                            answers.childQuestion[j].AnswerText = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].LabelText;
                            answers.childQuestion[j].ChosenAnswerID = lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID;
                            if (lstAssessmentData[k].ResidentQuestionAnswer.AnswerText != null) {
                                answers.childQuestion[j].AnswerText = lstAssessmentData[k].ResidentQuestionAnswer.AnswerText;
                            }


                            if (answers.childQuestion[j].AnswerType == 'RadioButtonList') {
                                answers.childQuestion[j].SumofScores = $filter('filter')(answers.childQuestion[j].Sections_Questions_Answers, { ID: lstAssessmentData[k].ResidentQuestionAnswer.Section_Question_AnswerID })[0].Score;
                            }
                            if (answers.childQuestion[j].AnswerType == 'Signature') {
                                answers.childQuestion[j].SignatureIcon = $sce.trustAsHtml(lstAssessmentData[k].ResidentQuestionAnswer.AnswerText);
                                answers.childQuestion[j].AnswerText = 'Signature';
                            }
                            if (lstAssessmentData[k].ResidentFile != null) {
                                if (vm.online) {
                                    if (lstAssessmentData[k].ResidentFile) {
                                        answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        answers.childQuestion[j].AnswerText = filename[5];
                                    }
                                } else {
                                    answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].FilePath;
                                    answers.childQuestion[j].AnswerText = lstAssessmentData[k].ResidentFile;
                                }
                            }

                            if (answers.childQuestion[j].MinScore == null) {

                                ViewSubQuestionsAndAnswers(answers.childQuestion[j].Sections_Questions_Answers, lstAssessmentData, answers.childQuestion[j].AnswerText);

                            }
                            else {

                                ViewSubQuestionsAndQuestion(answers.childQuestion[j], lstAssessmentData, answers.childQuestion[j].AnswerText);
                            }


                        }
                    }


                }
            }
        }

        vm.ShowChildQuestionQuestion1 = function (obj, val, objParent) {
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
        }


        vm.ShowChildQuestionQuestion = function (obj, val, objParent) {

            if (obj.AnswerText != undefined) {
                return true;
            }
            else {
                return false;
            }

        }


        vm.checkparent = function (obj) {

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

            if (objSectionQuestionAnswer != undefined) {
                var ResidentFullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
                var res = objSectionQuestionAnswer.replace("ResidentName", ResidentFullName);
                return res;
            }
        }
        vm.chk = function (obj) {

            if (obj.MinScore == null) {
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

        //Delete Prospect

        vm.DeleteProspect = function (ResidentId) {

            var objResident = { ID: '', ModifiedBy: '' }

            objResident.ID = vm.ResidentId;
            objResident.ModifiedBy = $rootScope.UserInfo.UserID;

            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to  delete this prospect ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!"
            }

            SweetAlert.swal(sweetAlertOptions,
                   function (isConfirm) {
                       if (isConfirm) {
                           if ($scope.online == true) {
                               ResidentsService.DeleteResident(objResident).then(function (response) {
                                   CommonService.DeleteOfflineResidentData(app.db, objResident).then(function (response) {
                                       toastr.success('Deleted Offline Resident sucessfully');

                                   }, function error(err) {

                                       toastr.error('An error occured while deleting Offline Resident.');
                                   })

                                   toastr.success("Deleted Sucessfully");
                                   $state.go('Residents');
                               }, function (err) {

                                   toastr.err();
                               });
                           }
                           else {
                               CommonService.DeleteOfflineResidentData(app.db, objResident).then(function (response) {
                                   toastr.success('Deleted Resident sucessfully');
                                   $state.go('Residents');
                               }, function error(err) {
                                   toastr.error('An error occured while deleting Offline Resident.');
                               })



                           }

                       }
                   }
            );

        }
    }
}());