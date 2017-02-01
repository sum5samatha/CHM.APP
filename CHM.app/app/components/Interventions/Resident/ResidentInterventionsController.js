(function () {
    // "use strict";

    angular.module('CHM').controller('ResidentInterventionsController', ResidentInterventionsController);

    ResidentInterventionsController.$inject = ['$q', '$sce', '$uibModal', '$window', '$filter', '$stateParams', '$state', '$location', 'toastr', 'ResidentsService', 'InterventionsService', 'SweetAlert', '$scope', '$rootScope', 'onlineStatus', 'CommonService'];

    function ResidentInterventionsController($q, $sce, $uibModal, $window, $filter, $stateParams, $state, $location, toastr, ResidentsService, InterventionsService, SweetAlert, $scope, $rootScope, onlineStatus, CommonService) {
        var vm = this;

        $scope.onlineStatus = onlineStatus;

        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;

            vm.Interventions = [];
            vm.PhotoUrl = '';
            FunctionForBothConditions();
            FunctionMain();
        });




        $('[data-toggle="tooltip"]').tooltip();

        vm.ResidentId = $stateParams.ResidentId;

        vm.Review = function () {
            var sweetAlertOptions = {
                title: "",
                text: "Are you sure you want to review this Intervention?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!"
            };

            SweetAlert.swal(sweetAlertOptions,
                function (isConfirm) {
                    if (isConfirm)
                        $location.path('/AdhocIntervention');
                }
            );
        }


        vm.PrintElem = function (elem) {
            Popup($(elem).html());
        }

        function Popup(data) {
            var mywindow = window.open('', '', 'height=400,width=600');
            mywindow.document.write('<html><head><title> FORM </title>');
            /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
            mywindow.document.write('</head><body >');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10

            mywindow.print();
            mywindow.close();

            return true;
        }

        // View Resident Code Start



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

        function BindResidentQuestionAnswers(lstThreeSectionsDetails) {
            vm.Sections = lstThreeSectionsDetails;
            vm.CopyallSectionsQuestion = angular.copy(lstThreeSectionsDetails);

            vm.MainQuestion = [];
            vm.SubQuestion = [];
            vm.AllSection = [];

            for (var x = 0; x < lstThreeSectionsDetails.length; x++) {
                vm.AllSection.push(lstThreeSectionsDetails[x]);
            }

            for (var p = 0; p < lstThreeSectionsDetails.length; p++) {

                for (var q = 0; q < lstThreeSectionsDetails[p].Sections_Questions.length; q++) {
                    var z = 0;
                    for (var r = 0; r < vm.QuestionParentQuestion.length ; r++) {
                        if (vm.QuestionParentQuestion[r].QuestionID == lstThreeSectionsDetails[p].Sections_Questions[q].ID) {
                            z++;
                        }
                    }

                    if (z == 0) {
                        vm.MainQuestion.push(lstThreeSectionsDetails[p].Sections_Questions[q]);
                    }
                    else {
                        vm.SubQuestion.push(lstThreeSectionsDetails[p].Sections_Questions[q]);
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


            for (var t = 0; t < vm.AllSection.length; t++) {
                vm.AllSection[t].Sections_Questions = [];
                for (var s = 0; s < vm.MainQuestion.length; s++) {

                    if (vm.MainQuestion[s].SectionID == vm.AllSection[t].ID) {
                        vm.AllSection[t].Sections_Questions.push(vm.MainQuestion[s]);
                    }
                }
            }

            //start step1 to step6:

            //Step1:


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
                        // if (vm.AllSection[q].DisplayOrder == 5 || vm.AllSection[q].DisplayOrder == 9 || vm.AllSection[q].DisplayOrder == 4 || vm.AllSection[q].DisplayOrder == 2 || vm.AllSection[q].DisplayOrder == 7 || vm.AllSection[q].DisplayOrder == 3) {
                        if (vm.AllSection[q].DisplayOrder == 7 || vm.AllSection[q].DisplayOrder == 11 || vm.AllSection[q].DisplayOrder == 6 || vm.AllSection[q].DisplayOrder == 4 || vm.AllSection[q].DisplayOrder == 9 || vm.AllSection[q].DisplayOrder == 5 || vm.AllSection[q].DisplayOrder == 8 || vm.AllSection[q].DisplayOrder == 3) {
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

            //End step1 to step6:


            vm.Sections = vm.AllSection;

            //End


            //Start 5/9/2016



            for (var i = 0; i < vm.Sections.length; i++) {
                for (var j = 0; j < vm.Sections[i].Sections_Questions.length; j++) {
                    for (var k = 0; k < vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers.length; k++) {
                        if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].IsDefault) {
                            vm.Sections[i].Sections_Questions[j].ChosenAnswerID = vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].ID;
                        }
                        if (vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion && vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion.length > 0) {

                            BindChosenAnswerID(vm.Sections[i].Sections_Questions[j].Sections_Questions_Answers[k].childQuestion);
                        }
                    }
                }
            }

            //End
            
        }


        var GetAllActiveSection = function () {
            ResidentsService.GetOnlyThreeSections().then(function (response) {
                BindResidentQuestionAnswers(response.data);
                GetAssessmentAnswers();
                vm.NewSections = vm.Sections;
            },
                function (err) {
                    toastr.error('An error occurred while retrieving sections.');
                }
            );
        };

        function BindAssesmentAnswers(lstAssessmentData) {
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
                                        vm.Sections[i].Sections_Questions[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        vm.Sections[i].Sections_Questions[j].AnswerText = filename[5];
                                    } else {
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
        }

        var BindChosenAnswerID = function (objQuestions) {
            for (var i = 0; i < objQuestions.length; i++) {
                for (var j = 0; j < objQuestions[i].Sections_Questions_Answers.length; j++) {
                    if (objQuestions[i].Sections_Questions_Answers[j].IsDefault) {
                        objQuestions[i].ChosenAnswerID = objQuestions[i].Sections_Questions_Answers[j].ID;
                    }
                    if (objQuestions[i].Sections_Questions_Answers[j].childQuestion && objQuestions[i].Sections_Questions_Answers[j].childQuestion.length > 0) {
                        BindChosenAnswerID(objQuestions[i].Sections_Questions_Answers[j].childQuestion);
                    }
                }
            }
        };

        var GetAssessmentAnswers = function () {
            ResidentsService.GetAssessmentData(vm.ResidentId).then(function (response) {
                //var lstAssessmentData = response.data;
                BindAssesmentAnswers(response.data);
                },function (err) {
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
                                //Change on 6/30/2016
                                // answers[i].childQuestion[j].SumofScores += answers[i].childQuestion[j].Sections_Questions_Answers.Score;
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
                            // ViewSubQuestionsAndAnswers(answers[i].childQuestion, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
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
                                        answers[i].childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                        var filename = lstAssessmentData[k].ResidentFile.split('/');
                                        answers[i].childQuestion[j].AnswerText = filename[5];
                                    } else {
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
                                    //ViewSubQuestionsAndAnswers(answers[i].childQuestion, lstAssessmentData, answers[i].childQuestion[j].AnswerText);
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
                                answers.childQuestion[j].ChosenAnswer = lstAssessmentData[k].ResidentFile;
                                var filename = lstAssessmentData[k].ResidentFile.split('/');
                                answers.childQuestion[j].AnswerText = filename[5];
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



        //end

        vm.ReadHide = true;
        vm.Currentdate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        vm.Resident = {};
        vm.ResidentSummary = [];
        vm.FilterSummary = [];
        vm.Interventions = [];
        if (!vm.ResidentId) {

        }

        vm.OpenOnlyOneSection = false;

        vm.ReadMoreClick = function () {
            vm.ReadHide = false;
        }
        vm.ReadLessClick = function () {
            vm.ReadHide = true;
        }


        var defferedResident = [];
        var offlineResidents = [];
        var offlineResidentPhotos = [];
        var defferofflineResident = $q.defer();
        var defferofflineResidentPhotos = $q.defer();
        defferedResident.push(defferofflineResident.promise);
        defferedResident.push(defferofflineResidentPhotos.promise);

        var renderOfflineResident = function (tx, rs) {
            offlineResidents = [];

            for (var i = 0; i < rs.rows.length; i++) {
                if (rs.rows.item(i).ID == vm.ResidentId)
                    offlineResidents.push(rs.rows.item(i));
            }

            defferofflineResident.resolve();
        };

        var renderOfflineResidentPhoto = function (tx, rs) {
            offlineResidentPhotos = [];
            for (var i = 0; i < rs.rows.length; i++) {
                if (rs.rows.item(i).ID == vm.ResidentId)
                    offlineResidentPhotos.push(rs.rows.item(i));
            }

            defferofflineResidentPhotos.resolve();
        }



        $q.all(defferedResident).then(
         function (response) {
             GetofflineResidentPersonalData();
         },
         function (err) {

         }
     );

        var LoadOfflinePersonalInformation = function () {
            app.GetOfflineResidents(renderOfflineResident);
            app.GetOfflineResidentPhotos(renderOfflineResidentPhoto);
        }




        var DataInOnline = function () {
            //ResidentsService.GetOnlyActiveSection().then(
            //    function (response) {
            //        vm.OnlySection = response.data;
            //    }
            //    , function (err) {

            //    });

            ResidentsService.getAllActiveQuestionParentQuestion().then(
             function (response) {
                 vm.QuestionParentQuestion = response.data;
                 vm.CopyQuestionParentQuestion = vm.QuestionParentQuestion;
                 vm.AllQuestionParentQuestion = response.data;
                 GetAllActiveSection();
             },
             function (err) {
                 toastr.error('An error occurred while retrieving QuestionParentQuestion.');
             }
           );

            ResidentsService.GetPersonalInformation(vm.ResidentId).then(
              function (response) {

                  vm.Resident = response.data.Resident;
                  vm.PhotoUrl = response.data.PhotoUrl;

                  //  vm.Residentid = response.data.Resident.ID;
              },
             function (err) {
                 toastr.error('An error occurred while retrieving resident information.');
             }
              );
        }
        vm.SummaryQuestion = [];

        var GetSummaryForOnline = function () {
            ResidentsService.GetResidentSummaryByID(vm.ResidentId).then(
              function (response) {

                  vm.Summarydata = response.data;
                  GetDataOnAnswersForSummary().then(
                      function (response) {

                          vm.Summary = vm.Summarydata;
                      });


              },
              function (err) {
                  toastr.error('An error occurred while retrieving resident summary.');
              }
              );
        }



        var GetofflineResidentPersonalData = function () {
            if (offlineResidents.length > 0) {
                for (var i = 0; i < offlineResidents.length; i++) {
                    for (var j = 0; j < offlineResidentPhotos.length; j++) {
                        if (offlineResidentPhotos[j].ID == offlineResidents[i].ID) {
                            console.log(offlineResidentPhotos[j].PhotoURL);
                            vm.Resident = offlineResidents[i];
                            vm.offlinePhotoUrl = offlineResidentPhotos[j].PhotoURL;
                        }
                    }
                }
            }
        }


        var todayDate = moment(new Date()).format('YYYY-MM-DD');

        var LoadPersonalInforamtion = function () {

            InterventionsService.GetInterventionsForResident(vm.ResidentId, todayDate, todayDate).then(
                function (response) {
                    vm.Interventions = response.data;
                    for (var i = 0; i < vm.Interventions.length; i++) {
                        vm.Interventions[i].PlannedStartDate = new Date(vm.Interventions[i].PlannedStartDate);
                        vm.Interventions[i].PlannedEndDate = new Date(vm.Interventions[i].PlannedEndDate);
                        vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionIcon = $sce.trustAsHtml(vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionIcon);
                    }
                },
                function (err) {
                    toastr.error('An error occurred while retrieving interventions.');
                }
            );
        }
        var arrResidents = [];
        var arrActions = [];
        var arrAction_Days = [];
        var arrInterventions = [];
        var arrSectionInterventions = [];

        var deferredArr = [];
        var deferredActions = $q.defer();
        var deferredAction_Days = $q.defer();
        var deferredInterventions = $q.defer();
        var deferredSection_Interventions = $q.defer();

        deferredArr.push(deferredActions.promise);
        deferredArr.push(deferredAction_Days.promise);
        deferredArr.push(deferredInterventions.promise);
        deferredArr.push(deferredSection_Interventions.promise);


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


        var LoadPersonalOfflineInformation = function () {
            app.GetOfflineActions(renderActions);
            app.GetOfflineAction_Days(renderAction_Days);
            app.GetOfflineInterventions(renderInterventions);
            app.GetOfflineSection_Interventions(renderSection_Interventions);
        }

        var GetofflineResidentIntervention = function () {
            //  vm.Interventions = [];
            vm.FilteredActionsDataArray = [];

            for (var i = 0; i < arrActions.length; i++) {
                if (arrActions[i].ResidentID == vm.ResidentId && arrActions[i].IsActive == "true") {

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
            var DailyDairyDate = moment(new Date()).format('YYYY-MM-DD');

            for (var i = 0; i < vm.FilteredAction_DayssDataArray.length; i++) {
                for (var j = 0; j < arrInterventions.length; j++) {
                    //var PlannedStartDate = arrInterventions[j].PlannedStartDate.split('T');
                    //var PlannedEndDate = arrInterventions[j].PlannedEndDate.split('T');

                    arrInterventions[j].PlannedStartDate = new Date(arrInterventions[j].PlannedStartDate);
                    arrInterventions[j].PlannedEndDate = new Date(arrInterventions[j].PlannedEndDate);
                    if (vm.FilteredAction_DayssDataArray[i].ID == arrInterventions[j].Action_DayID && moment(arrInterventions[j].PlannedStartDate).format('YYYY-MM-DD') <= DailyDairyDate && moment(arrInterventions[j].PlannedEndDate).format('YYYY-MM-DD') >= DailyDairyDate && arrInterventions[j].IsActive == "true") {
                        vm.FilteredInterventions.push(arrInterventions[j]);
                    }
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

            for (var i = 0; i < vm.FilteredActionsDataArray.length; i++) {
                vm.FilteredActionsDataArray[i].Section_Intervention = {};
                for (var j = 0; j < vm.FilteredSection_Interventions.length; j++) {
                    if (vm.FilteredSection_Interventions[j].ID == vm.FilteredActionsDataArray[i].Section_InterventionID) {
                        vm.FilteredActionsDataArray[i].Section_Intervention = vm.FilteredSection_Interventions[j];
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
                vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionIcon = $sce.trustAsHtml(vm.Interventions[i].Actions_Days.Action.Section_Intervention.InterventionIcon);
            }
        }

        $q.all(deferredArr).then(
           function (response) {
               GetofflineResidentIntervention();
           },
           function (err) {
               console.log('err');
           }
       );


        var FunctionForBothConditions = function () {
            if ($scope.online == true) {

                $rootScope.$broadcast("loader_show");
                //if (!($rootScope.IsAdminSynchronizing)) {
                if ($rootScope.IsSynchronizing) {
                    $scope.$on('SyncOfData', function (event, args) {
                        if (args.Compleated) {
                            // vm.Interventions = [];
                            LoadPersonalInforamtion();
                            DataInOnline();
                            $rootScope.$broadcast("loader_hide");
                        }

                    });
                }
                    //}
                else {
                    LoadPersonalInforamtion();
                    DataInOnline();
                }
            }
            else {

                //  vm.Interventions = [];
                deferredArr = [];
                deferredActions = $q.defer();
                deferredAction_Days = $q.defer();
                deferredInterventions = $q.defer();
                deferredSection_Interventions = $q.defer();

                deferredArr.push(deferredActions.promise);
                deferredArr.push(deferredAction_Days.promise);
                deferredArr.push(deferredInterventions.promise);
                deferredArr.push(deferredSection_Interventions.promise);

                defferedResident = [];

                defferofflineResident = $q.defer();
                defferofflineResidentPhotos = $q.defer();
                defferedResident.push(defferofflineResident.promise);
                defferedResident.push(defferofflineResidentPhotos.promise);
                LoadPersonalOfflineInformation();
                LoadOfflinePersonalInformation();

                $q.all(deferredArr).then(
              function (response) {
                  GetofflineResidentIntervention();
              },
              function (err) {
                  console.log('err');
              });
                $q.all(defferedResident).then(
                function (response) {
                    GetofflineResidentPersonalData();
                },
                function (err) {
                    console.log('err');
                });


            }

        }
        vm.EditIntervention = function (InterVentionID, TaskTitle, Section_InterventionID) {

            if (TaskTitle != 'Assessment Review') {

                var modalInstance = $uibModal.open({
                    templateUrl: 'app/components/Interventions/_partials/EditInterventions.html',
                    controller: 'EditInterventionsController',
                    controllerAs: 'vm',
                    resolve: {
                        InterVentionID: function () {
                            return InterVentionID;
                        },
                        TaskTitle: function () {
                            return TaskTitle;
                        },
                        SectionInterventionID: function () {
                            return Section_InterventionID;
                        }
                    },
                    backdrop: 'static'
                });
                modalInstance.result.then(
                        function (response) {
                            $q.all(response).then(
                                 function () {
                                     if ($scope.online == true) {
                                         vm.Interventions = [];
                                         LoadPersonalInforamtion();
                                     }
                                     else {
                                         FunctionForBothConditions();
                                         //LoadOfflinePersonalInformation();
                                     }
                                 }
                             );
                        }, function () {

                        }
                   );
            }
            else {
                $state.go('ViewResident', { ResidentId: vm.ResidentId });
            }
        }

        //vm.BindSummaary = function (objSectionQuestion) {


        //    if (objSectionQuestion.Summary.indexOf('ResidentName') >= 0 || objSectionQuestion.Summary.indexOf('XYZ') >= 0 || objSectionQuestion.Summary.indexOf('XXXX') >= 0) {
        //        var fullname = vm.Resident.FirstName + ' ' + vm.Resident.LastName;

        //        var res = objSectionQuestion.Summary.replace(/ResidentName/gi, fullname);
        //        for (var k = 0; k < vm.SummaryQuestion.length; k++) {

        //            if (vm.SummaryQuestion[k].Id == objSectionQuestion.ID) {

        //                if (vm.SummaryQuestion[k].Ans1 != "" && vm.SummaryQuestion[k].Ans2 != "") {
        //                    var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
        //                    var ans2 = ans1.replace("XXXX", vm.SummaryQuestion[k].Ans2);
        //                    return ans2;
        //                }
        //                else {
        //                    if (vm.SummaryQuestion[k].Ans1 != "") {
        //                        var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
        //                        return ans1;
        //                    }
        //                    if (vm.SummaryQuestion[k].Ans2 != "") {
        //                        var ans1 = res.replace("XXXX", vm.SummaryQuestion[k].Ans2);
        //                        return ans1;
        //                    }
        //                }
        //                break;
        //            }
        //        }
        //        return res;
        //    }
        //    else {
        //        return objSectionQuestion.Summary;
        //    }



        //}


        vm.BindSummaary = function (objSectionQuestion) {
            if (objSectionQuestion.Summary.indexOf('ResidentName') >= 0 || objSectionQuestion.Summary.indexOf('XYZ') >= 0 || objSectionQuestion.Summary.indexOf('XXXX') >= 0) {

                var FullName = vm.Resident.FirstName + " " + vm.Resident.LastName;
                var res = objSectionQuestion.Summary.replace(/ResidentName/g, FullName);

                for (var k = 0; k < vm.SummaryQuestion.length; k++) {

                    if (vm.SummaryQuestion[k].Id == objSectionQuestion.ID) {

                        if (vm.SummaryQuestion[k].Ans1 != "" && vm.SummaryQuestion[k].Ans2 != "") {
                            var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                            var ans2 = ans1.replace(/XXXX/g, vm.SummaryQuestion[k].Ans2);
                            return ans2;
                        }
                        else {
                            if (vm.SummaryQuestion[k].Ans1 != "") {
                                var ans1 = res.replace("XYZ", vm.SummaryQuestion[k].Ans1);
                                return ans1;
                            }
                            if (vm.SummaryQuestion[k].Ans2 != "") {
                                var ans1 = res.replace("XXXX", vm.SummaryQuestion[k].Ans2);
                                return ans1;
                            }
                        }
                        break;
                    }
                }
                return res;
            }
            else {

                return objSectionQuestion.Summary;
            }



        }



        var GetDataOnAnswersForSummary = function () {

            var diferred = $q.defer();
            for (var i = 0; i < vm.Summarydata.length; i++) {

                if (vm.Summarydata[i].Summary.indexOf('XYZ') >= 0 || vm.Summarydata[i].Summary.indexOf('XXXX') >= 0) {

                    var summarydata = { Id: "", Ans1: "", Ans2: "" }
                    summarydata.Id = vm.Summarydata[i].ID;

                    ResidentsService.GetResidentSummaryDataofAnswers(vm.Summarydata[i].Sections_Questions_Answers_Summary[0].Section_QuestionID, vm.ResidentId).then(
                  function (response) {

                      var score = "";
                      var AnsText = "";
                      for (var m = 0; m < response.data.length; m++) {

                          if (response.data[m].AnswerText)
                              score = response.data[m].AnswerText;

                          if (response.data[m].AnswerText == null) {
                              AnsText += response.data[m].Sections_Questions_Answers.LabelText + ','
                          }
                      }


                      summarydata.Ans1 = score;
                      summarydata.Ans2 = AnsText.replace(/,\s*$/, "");
                      vm.SummaryQuestion.push(summarydata);


                  },
                  function (err) {

                      toastr.error('An error occurred while retrieving resident summary.');
                      diferred.reject();
                  });

                }

                //if(i==(vm.Summarydata.length-1))
                diferred.resolve(vm.SummaryQuestion);
            }

            return diferred.promise;
        }

        vm.CompareDate = function (objStartDate, objStatus) {

            if (objStatus != null) {
                return false;
            }
            else {


                var currentDateTime = new Date();
                var InterventionDate = new Date(objStartDate)


                //var timeZoneAgnosticInterventionDate = new Date(InterventionDate.getTime() + (InterventionDate.getTimezoneOffset() * 60 * 1000));
                var timeZoneAgnosticInterventionDate = new Date(InterventionDate.getTime());

                if (timeZoneAgnosticInterventionDate < currentDateTime)
                    return true;
                else
                    return false;

            }
        }

        vm.ViewSummary = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/Interventions/ResidentSummary/ResidentSummary.html',
                controller: 'ResidentSummaryController',
                controllerAs: 'vm',
                resolve: {
                    ResidentID: function () {
                        return vm.ResidentId;
                    }

                },
                backdrop: 'static'
            });
            modalInstance.result.then(
                    function (response) {
                        $q.all(response).then(
                             function () {

                             }
                         );
                    }, function () {

                    }
               );
        }




        ////////For Summary////////////////////////////////////////////

        var arrSections_Questions_Answers = [];
        var arrSections_Questions_Answers_Summary = []
        var arrSection_Summary = [];
        var arrResidents_Questions_Answers = [];


        var deferredArray = [];
        var deferredSections_Questions_Answers = $q.defer();
        var deferredSections_Questions_Answers_Summary = $q.defer();
        var deferredSection_Summary = $q.defer();
        var deferredResidents_Questions_Answers = $q.defer();
        // var deferredJoinedData = $q.defer();

        deferredArray.push(deferredSections_Questions_Answers.promise);
        deferredArray.push(deferredSections_Questions_Answers_Summary.promise);
        deferredArray.push(deferredSection_Summary.promise);
        deferredArray.push(deferredResidents_Questions_Answers.promise);



        var renderSections_Questions_Answers = function (tx, rs) {
            arrSections_Questions_Answers = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrSections_Questions_Answers.push(rs.rows.item(i));
            }
            deferredSections_Questions_Answers.resolve();



        };
        var renderSections_Questions_Answers_Summary = function (tx, rs) {
            arrSections_Questions_Answers_Summary = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrSections_Questions_Answers_Summary.push(rs.rows.item(i));
            }
            deferredSections_Questions_Answers_Summary.resolve();



        };
        var renderSection_Summary = function (tx, rs) {
            arrSection_Summary = [];

            for (var i = 0; i < rs.rows.length; i++) {
                arrSection_Summary.push(rs.rows.item(i));
            }
            deferredSection_Summary.resolve();



        };
        var renderResidents_Questions_Answers = function (tx, rs) {
            arrResidents_Questions_Answers = [];

            for (var i = 0; i < rs.rows.length; i++) {
                if (rs.rows.item(i).ResidentID == vm.ResidentId)
                    arrResidents_Questions_Answers.push(rs.rows.item(i));
            }

            deferredResidents_Questions_Answers.resolve();


        };
        function FunctionToGetSummary() {
            app.GetOfflineSections_Questions_Answers(renderSections_Questions_Answers);
            app.GetOfflineSections_Questions_Answers_Summary(renderSections_Questions_Answers_Summary);
            app.GetOfflineSection_Summary(renderSection_Summary);
            app.GetOfflineResidents_Questions_Answers(renderResidents_Questions_Answers, vm.ResidentId);
        }

        var FunctionMain = function () {
            if ($scope.online == true) {
                GetSummaryForOnline();
            }
            else {
                var renderResidents = function (tx, rs) {
                    arrResidents = [];
                    for (var i = 0; i < rs.rows.length; i++) {
                        if (rs.rows.item(i).ID == vm.ResidentId) {
                            arrResidents.push(rs.rows.item(i));
                        }
                    }
                    vm.Resident = arrResidents[0];
                };
                app.GetOfflineResidents(renderResidents);

                deferredArray = [];
                deferredSections_Questions_Answers = $q.defer();
                deferredSections_Questions_Answers_Summary = $q.defer();
                deferredSection_Summary = $q.defer();
                deferredResidents_Questions_Answers = $q.defer();
                // var deferredJoinedData = $q.defer();

                deferredArray.push(deferredSections_Questions_Answers.promise);
                deferredArray.push(deferredSections_Questions_Answers_Summary.promise);
                deferredArray.push(deferredSection_Summary.promise);
                deferredArray.push(deferredResidents_Questions_Answers.promise);

                FunctionToGetSummary();

                $q.all(deferredArray).then(function (response) {
                    FunctionForLoops();
                    // LoadOffline();
                    DataInOffline();
                }, function (err) {
                    console.log('err');
                });
            }
        }


        var FunctionForLoops = function () {

            //Loop for Sections_Questions_Answers_Summary and Resident_Question_Answers

            var lstFormedArray = [];
            //1st loop for all  Section_Summary
            for (var i = 0; i < arrSection_Summary.length; i++) {
                var arrToBePushed = { SummaryID: '', Summary: '', MaxScore: '', MinScore: '', Section_QuestionID: [], Section_Question_AnswerID: [] }
                arrToBePushed.SummaryID = arrSection_Summary[i].ID;
                arrToBePushed.Summary = arrSection_Summary[i].Summary;
                arrToBePushed.MaxScore = arrSection_Summary[i].MaxScore;
                arrToBePushed.MinScore = arrSection_Summary[i].MinScore;

                //Second loop for Sections_Questions_Answers_Summary

                for (var j = 0; j < arrSections_Questions_Answers_Summary.length; j++) {
                    if (arrSections_Questions_Answers_Summary[j].SectionSummaryID == arrSection_Summary[i].ID) {
                        if (arrSections_Questions_Answers_Summary[j].Section_QuestionID != null) {
                            arrToBePushed.Section_QuestionID.push(arrSections_Questions_Answers_Summary[j].Section_QuestionID);
                        }
                        if (arrSections_Questions_Answers_Summary[j].Section_Question_AnswerID != null) {
                            arrToBePushed.Section_Question_AnswerID.push(arrSections_Questions_Answers_Summary[j].Section_Question_AnswerID);
                        }
                    }
                }
                lstFormedArray.push(arrToBePushed);
            }


            var arrWithAnswerID = []
            var arrWithoutAnswerID = [];
            var arrWithoutAll = [];
            for (var i = 0; i < lstFormedArray.length; i++) {

                if (lstFormedArray[i].Section_Question_AnswerID.length > 0 && lstFormedArray[i].Section_QuestionID.length > 0) {
                    arrWithAnswerID.push(lstFormedArray[i]);
                }
                if (lstFormedArray[i].Section_Question_AnswerID.length == 0 && lstFormedArray[i].Section_QuestionID.length > 0) {
                    arrWithoutAnswerID.push(lstFormedArray[i]);
                }
                if (lstFormedArray[i].Section_Question_AnswerID.length == 0 && lstFormedArray[i].Section_QuestionID.length == 0) {
                    arrWithoutAll.push(lstFormedArray[i]);
                }
            }

            var lstResidentsQAarray = [];
            for (var i = 0; i < arrResidents_Questions_Answers.length; i++) {
                var arrForResidentsQA = { ResidentID: '', Section_Question_AnswerID: '', AnswerText: '', Score: '' }
                arrForResidentsQA.ResidentID = arrResidents_Questions_Answers[i].ResidentID;
                arrForResidentsQA.Section_Question_AnswerID = arrResidents_Questions_Answers[i].Section_Question_AnswerID;
                arrForResidentsQA.AnswerText = arrResidents_Questions_Answers[i].AnswerText;
                for (var j = 0; j < arrSections_Questions_Answers.length; j++) {
                    if (arrSections_Questions_Answers[j].ID == arrResidents_Questions_Answers[i].Section_Question_AnswerID) {
                        arrForResidentsQA.Score = arrSections_Questions_Answers[j].Score;
                    }
                }
                lstResidentsQAarray.push(arrForResidentsQA);
            }



            var objSummary = [];
            for (var i = 0; i < arrWithAnswerID.length; i++) {
                for (var j = 0; j < arrWithAnswerID[i].Section_Question_AnswerID.length; j++) {
                    for (var k = 0; k < arrResidents_Questions_Answers.length; k++) {
                        if (arrWithAnswerID[i].Section_Question_AnswerID[j] == arrResidents_Questions_Answers[k].Section_Question_AnswerID) {
                            if (arrWithAnswerID[i].Summary == "") {
                                arrWithAnswerID[i].Summary = arrResidents_Questions_Answers[k].AnswerText;
                            }
                            objSummary.push(arrWithAnswerID[i]);
                        }
                    }
                }
            }

            var FormedArray = [];
            for (var i = 0; i < arrWithoutAnswerID.length; i++) {
                var a = { Summary: '', MaxScore: '', MinScore: '', Answers: [] }
                a.Summary = arrWithoutAnswerID[i].Summary;
                a.MaxScore = arrWithoutAnswerID[i].MaxScore;
                a.MinScore = arrWithoutAnswerID[i].MinScore;
                for (var j = 0; j < arrWithoutAnswerID[i].Section_QuestionID.length; j++) {
                    for (var k = 0; k < arrSections_Questions_Answers.length; k++) {
                        if (arrSections_Questions_Answers[k].Section_QuestionID == arrWithoutAnswerID[i].Section_QuestionID[j]) {
                            for (var l = 0; l < arrResidents_Questions_Answers.length; l++) {
                                if (arrResidents_Questions_Answers[l].Section_Question_AnswerID == arrSections_Questions_Answers[k].ID) {
                                    var b = { Section_Question_AnswerID: '', Score: '', LabelText: '' }
                                    b.Section_Question_AnswerID = arrSections_Questions_Answers[k].ID;
                                    b.Score = arrSections_Questions_Answers[k].Score;
                                    b.LabelText = arrSections_Questions_Answers[k].LabelText;
                                    a.Answers.push(b);
                                }
                            }
                        }
                    }
                }
                FormedArray.push(a);
            }

            var arrSummaryArray = [];
            for (var i = 0; i < FormedArray.length; i++) {
                var Score = 0;
                var hasSummary = false;
                for (var j = 0; j < FormedArray[i].Answers.length; j++) {

                    for (var k = 0; k < arrResidents_Questions_Answers.length; k++) {
                        if (arrResidents_Questions_Answers[k].Section_Question_AnswerID == FormedArray[i].Answers[j].Section_Question_AnswerID) {
                            if (FormedArray[i].Answers[j].Score != null) {
                                hasSummary = true;
                                Score += parseInt(FormedArray[i].Answers[j].Score);
                            }
                            else {
                                //do nothing
                            }
                        }
                    }
                }
                if (hasSummary) {
                    if (FormedArray[i].MinScore <= Score && (FormedArray[i].MaxScore >= Score || FormedArray[i].MaxScore == null)) {

                        arrSummaryArray.push(FormedArray[i]);
                    }
                }
            }


            for (var k = 0; k < objSummary.length; k++) {
                if (objSummary[k].Summary == null) {
                    var residentAns = _.where(arrResidents_Questions_Answers, { Section_Question_AnswerID: objSummary[k].Section_Question_AnswerID[0] });
                    if (residentAns.length > 0) {
                        objSummary[k].Summary = residentAns[0].AnswerText;
                    }
                }

            }

            //////New code
            var WithScoresAndAnswers = [];
            for (var i = 0; i < objSummary.length; i++) {
                var a = { Summary: '', MaxScore: '', MinScore: '', Answers: [], Section_QuestionID: [], Section_Question_AnswerID: [], SummaryID: '' }

                a.Summary = objSummary[i].Summary;
                a.MaxScore = objSummary[i].MaxScore;
                a.MinScore = objSummary[i].MinScore;
                a.Section_QuestionID = objSummary[i].Section_QuestionID;
                a.Section_Question_AnswerID = objSummary[i].Section_Question_AnswerID;
                a.SummaryID = objSummary[i].SummaryID;

                for (var j = 0; j < arrWithAnswerID[i].Section_QuestionID.length; j++) {
                    for (var k = 0; k < arrSections_Questions_Answers.length; k++) {

                        if (arrSections_Questions_Answers[k].Section_QuestionID == arrWithAnswerID[i].Section_QuestionID[j]) {
                            var b = { Score: '', LabelText: '' }
                            b.Score = arrSections_Questions_Answers[k].Score;
                            b.LabelText = arrSections_Questions_Answers[k].LabelText;
                            a.Answers.push(b);
                        }


                    }



                }
                WithScoresAndAnswers.push(a);
            }
            ////



            var SpliceFunction = function (i) {
                WithScoresAndAnswers.splice(i, 1);
            }


            for (var i = 0; i < WithScoresAndAnswers.length; i++) {
                if (i != 0) {
                    if (WithScoresAndAnswers[i].SummaryID == WithScoresAndAnswers[i - 1].SummaryID) {
                        SpliceFunction(i);
                    }
                }
            }


            var SplicearrSummaryArrayFunction = function (i) {
                arrSummaryArray.splice(i, 1);
            }


            for (var i = 0; i < arrSummaryArray.length; i++) {
                if (i != 0) {
                    if (arrSummaryArray[i].Summary == arrSummaryArray[i - 1].Summary) {
                        SpliceFunction(i);
                    }
                }
            }

            var arrFinalArray = WithScoresAndAnswers.concat(arrSummaryArray);

            for (var i = 0; i < arrFinalArray.length; i++) {

                var FreeTextSummaryContains = arrFinalArray[i].Summary.indexOf('FREETEXT');
                var XYZContains = arrFinalArray[i].Summary.indexOf('XYZ');
                var XXXXContains = arrFinalArray[i].Summary.indexOf('XXXX');

                if (arrFinalArray[i].Answers != undefined) {
                    var lblAid = '';
                    for (var l = 0; l < arrFinalArray[i].Answers.length; l++) {
                        lblAid += arrFinalArray[i].Answers[l].LabelText + ',';
                    }
                }
                var Aidname = lblAid;
                var carrercount = "2";

                if (XYZContains != -1 && XXXXContains == -1) {
                    var output1 = arrFinalArray[i].Summary.replace("XYZ", Aidname);
                    arrFinalArray[i].Summary = output1;
                }
                else if (XXXXContains != -1 && XYZContains == -1) {
                    var output2 = arrFinalArray[i].Summary.replace("XXXX", carrercount);
                    arrFinalArray[i].Summary = output2;
                }
                else if (XYZContains != -1 && XXXXContains != -1) {
                    var output1 = arrFinalArray[i].Summary.replace("XYZ", Aidname);
                    var output2 = output1.replace("XXXX", carrercount);
                    arrFinalArray[i].Summary = output2;
                }
                else {
                    var output1 = arrFinalArray[i].Summary.replace("XXXX", "1");
                    var output2 = output1.replace("XYZ", "None");
                    arrFinalArray[i].Summary = output2;
                }

                if (FreeTextSummaryContains >= 0) {
                    var lbltxt = '';
                    for (var j = 0; j < arrFinalArray[i].Answers.length; j++) {
                        lbltxt += arrFinalArray[i].Answers[j].LabelText + ',';
                    }
                    var freetextlbl = lbltxt;
                    var a = arrFinalArray[i].Summary.replace("FREETEXT", freetextlbl);
                    arrFinalArray[i].Summary = a;
                }

            }




            vm.Summary = arrFinalArray;
        }//function end;

        function DataInOffline() {
            CommonService.SelectAllQuestionParentQuestions(app.db).then(function (response) {
                var QuestionParentQuestion = [];
                for (var i = 0; i < response.rows.length; i++) {
                    QuestionParentQuestion.push(response.rows.item(i));
                }
                vm.QuestionParentQuestion = QuestionParentQuestion;
                vm.CopyQuestionParentQuestion = QuestionParentQuestion;
                vm.AllQuestionParentQuestion = QuestionParentQuestion;
                GetAllActiveSection_Offline();
            }, function (error) {
                toastr.error('An error occurred while retrieving QuestionParentQuestion.');
            });
        }

        function GetAllActiveSection_Offline() {
            var deferredActiveSectionsArray = [];
            vm.arrAllOfflineActiveSections = [];
            vm.arrAllOfflineSectionQuestions = [];
            vm.arrAllOfflineSectionsQuestionsAnswers = [];
            vm.arrAllOfflineResidentsQuestionsAnswers = [];
            vm.arrOfflineResidentAnswerDocuments = [];


            deferredActiveSectionsArray.push(SelectAllOfflineActiveSections());
            deferredActiveSectionsArray.push(SelectAllOfflineSectionQuestions());
            deferredActiveSectionsArray.push(SelectAllOfflineSectionsQuestionsAnswers());
            deferredActiveSectionsArray.push(SelectAllOfflineResidentsQuestionsAnswers());
            deferredActiveSectionsArray.push(SelectAllOfflineResidentAnswerDocuments());

            $q.all(deferredActiveSectionsArray).then(function (response) {
                var sections = [];

                for (var i = 0; i < vm.arrAllOfflineActiveSections.length; i++) {
                    for (var j = 0; j < vm.arrAllOfflineSectionQuestions.length; j++) {
                        if (vm.arrAllOfflineActiveSections[i].ID == vm.arrAllOfflineSectionQuestions[j].SectionID) {
                            vm.arrAllOfflineSectionQuestions[j].Sections_Questions_Answers = [];
                        }
                    }
                }
                for (var i = 0; i < vm.arrAllOfflineActiveSections.length; i++) {
                    var obj = {};
                    obj = vm.arrAllOfflineActiveSections[i];
                    obj.Sections_Questions = [];
                    obj.Sections_Questions_Answers = [];
                    for (var j = 0; j < vm.arrAllOfflineSectionQuestions.length; j++) {
                        if (vm.arrAllOfflineActiveSections[i].ID == vm.arrAllOfflineSectionQuestions[j].SectionID) {
                            obj.Sections_Questions.push(vm.arrAllOfflineSectionQuestions[j]);
                            for (var k = 0; k < vm.arrAllOfflineSectionsQuestionsAnswers.length; k++) {
                                if (vm.arrAllOfflineSectionsQuestionsAnswers[k].Section_QuestionID == vm.arrAllOfflineSectionQuestions[j].ID) {
                                    obj.Sections_Questions_Answers.push(vm.arrAllOfflineSectionsQuestionsAnswers[k]);
                                    vm.arrAllOfflineSectionQuestions[j].Sections_Questions_Answers.push(vm.arrAllOfflineSectionsQuestionsAnswers[k]);
                                    //break;
                                }
                            }
                        }
                    }
                    sections.push(obj);
                }
                BindResidentQuestionAnswers(sections);
                var lstResidentsQuestionsAnswers = [];
                for (var i = 0; i < vm.arrAllOfflineResidentsQuestionsAnswers.length; i++) {
                    var obj = {};
                    obj = vm.arrAllOfflineResidentsQuestionsAnswers[i];
                    for (var j = 0; j < vm.arrAllOfflineSectionsQuestionsAnswers.length; j++) {
                        if (vm.arrAllOfflineResidentsQuestionsAnswers[i].Section_Question_AnswerID == vm.arrAllOfflineSectionsQuestionsAnswers[j].ID) {
                            obj.Sections_Questions_Answers = vm.arrAllOfflineSectionsQuestionsAnswers[j];
                            for (var k = 0; k < vm.arrAllOfflineSectionQuestions.length; k++) {
                                if (vm.arrAllOfflineSectionQuestions[k].ID == vm.arrAllOfflineSectionsQuestionsAnswers[j].Section_QuestionID) {
                                    obj.Sections_Questions_Answers.Sections_Questions = vm.arrAllOfflineSectionQuestions[k];
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    lstResidentsQuestionsAnswers.push(obj);
                }
                var arrlstdata = [];
                for (var aa = 0; aa < lstResidentsQuestionsAnswers.length; aa++) {
                    var lstresidentdata = { ResidentFile: null, ResidentQuestionAnswer: [], FilePath: '' };
                    lstresidentdata.ResidentQuestionAnswer = lstResidentsQuestionsAnswers[aa];
                    for (var i = 0; i < vm.arrOfflineResidentAnswerDocuments.length; i++) {
                        if (vm.arrOfflineResidentAnswerDocuments[i].ID == lstResidentsQuestionsAnswers[aa].ID) {
                            lstresidentdata.ResidentFile = vm.arrOfflineResidentAnswerDocuments[i].FileName;
                            lstresidentdata.FilePath = vm.arrOfflineResidentAnswerDocuments[i].ResidentFile;
                            break;
                        }
                    }
                    arrlstdata.push(lstresidentdata);
                }
                BindAssesmentAnswers(arrlstdata);
                vm.NewSections = vm.Sections;
                //var lstAssessmentData = arrlstdata;
            }, function (err) {
                console.log('err');
            });
        }

        function SelectAllOfflineActiveSections() {
            var deferred = $q.defer();
            CommonService.SelectAllActiveSections(app.db).then(function (response) {
                for (var i = 0; i < response.rows.length; i++) {
                    vm.arrAllOfflineActiveSections.push(response.rows.item(i));
                }
                deferred.resolve();
            }, function (error) {
                toastr.error('An error occurred while retrieving Sections.');
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function SelectAllOfflineSectionQuestions() {
            var deferred = $q.defer();
            CommonService.SelectAllSectionQuestions(app.db).then(function (response) {
                for (var i = 0; i < response.rows.length; i++) {
                    vm.arrAllOfflineSectionQuestions.push(response.rows.item(i));
                }
                deferred.resolve();
            }, function (error) {
                toastr.error('An error occurred while retrieving Sections.');
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function SelectAllOfflineSectionsQuestionsAnswers() {
            var deferred = $q.defer();
            CommonService.SelectAllSectionsQuestionsAnswers(app.db).then(function (response) {
                for (var i = 0; i < response.rows.length; i++) {
                    vm.arrAllOfflineSectionsQuestionsAnswers.push(response.rows.item(i));
                }
                deferred.resolve();
            }, function (error) {
                toastr.error('An error occurred while retrieving Sections.');
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function SelectAllOfflineResidentsQuestionsAnswers() {
            var deferred = $q.defer();
            CommonService.SelectAllResidentsQuestionsAnswers(app.db, vm.ResidentId).then(function (response) {
                for (var i = 0; i < response.rows.length; i++) {
                    vm.arrAllOfflineResidentsQuestionsAnswers.push(response.rows.item(i));
                }
                deferred.resolve();
            }, function (error) {
                toastr.error('An error occurred while retrieving Sections.');
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function SelectAllOfflineResidentAnswerDocuments() {
            var deferred = $q.defer();
            CommonService.SelectAllResidentAnswerDocuments(app.db).then(function (response) {
                for (var i = 0; i < response.rows.length; i++) {
                    vm.arrOfflineResidentAnswerDocuments.push(response.rows.item(i));
                }
                deferred.resolve();
            }, function (error) {
                toastr.error('An error occurred while retrieving Sections.');
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }

}());