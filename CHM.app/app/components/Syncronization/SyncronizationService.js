(function () {
    "use strict";

    angular.module('CHM').factory('SyncronizationService', SyncronizationService);

    SyncronizationService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function SyncronizationService($rootScope, $q, $http, $window) {

        var objSyncronizationService = {};

        objSyncronizationService.CreateofflinePainMonitoring = CreateofflinePainMonitoring;
        objSyncronizationService.UpdateofflinePainMonitoring = UpdateofflinePainMonitoring;

        objSyncronizationService.CreateOfflineResident = createOfflineResident;
        objSyncronizationService.UpdateOfflineResident = updateOfflineResident;

        objSyncronizationService.UpdateofflineUserLastLogin = UpdateofflineUserLastLogin;

        objSyncronizationService.CreateOfflineActions = createOfflineActions;
        objSyncronizationService.UpdateOfflineActions = updateOfflineActions;

        objSyncronizationService.CreateOfflineAction_Days = createOfflineAction_Days;
        objSyncronizationService.UpdateOfflineAction_Days = updateOfflineAction_Days;

        objSyncronizationService.CreateOfflineInterventions = createOfflineInterventions;
        objSyncronizationService.UpdateOfflineInterventions = updateOfflineInterventions;

        objSyncronizationService.CreateOfflineInterventions_Resident_Answers = createOfflineInterventions_Resident_Answers;
        objSyncronizationService.UpdateOfflineInterventions_Resident_Answers = updateOfflineInterventions_Resident_Answers;

        objSyncronizationService.CreateOfflineResident_Interventions_Questions_Answers = createOfflineResident_Interventions_Questions_Answers;
        objSyncronizationService.UpdateOfflineResident_Interventions_Questions_Answers = updateOfflineResident_Interventions_Questions_Answers;

        objSyncronizationService.CreateOfflineResidents_Questions_Answers = createOfflineResidents_Questions_Answers;
        objSyncronizationService.UpdateOfflineResidents_Questions_Answers = updateOfflineResidents_Questions_Answers;

        objSyncronizationService.GetsyncNewOfflineResidentPhotos = GetsyncNewOfflineResidentPhotos;

        objSyncronizationService.SaveNewOfflineResidentAnswerDocuments = SaveNewOfflineResidentAnswerDocuments;   
        objSyncronizationService.SaveResidentAdhocInterventionDocuments = SaveResidentAdhocInterventionDocuments;

        return objSyncronizationService;


        function CreateofflinePainMonitoring(painmonitoring) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflinePainMonitoring', painmonitoring);
        }
        function UpdateofflinePainMonitoring(painmonitoring) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflinePainMonitoring', painmonitoring);
        }

        function createOfflineResident(resident) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineResident', resident);
        }
        function updateOfflineResident(resident) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineResident', resident);
        }
        function UpdateofflineUserLastLogin(user) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineUserLastLogin', user);
        }        

        function createOfflineActions(action) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineActions', action);
        }
        function updateOfflineActions(action) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineActions', action);
        }


        function createOfflineAction_Days(ActionDays) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineAction_Days', ActionDays);
        }
        function updateOfflineAction_Days(ActionDays) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineActions_Days', ActionDays);
        }


        function createOfflineInterventions(Intervention) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineInterventions', Intervention);
        }
        function updateOfflineInterventions(Intervention) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineInterventions', Intervention);
        }


        function createOfflineInterventions_Resident_Answers(InterventionsResidentAnswers) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineInterventionsResidentAnswers', InterventionsResidentAnswers);
        }
        function updateOfflineInterventions_Resident_Answers(InterventionsResidentAnswers) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineInterventionsResidentAnswers', InterventionsResidentAnswers);
        }



        function createOfflineResident_Interventions_Questions_Answers(ResidentInterventionsQuestions_Answers) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineResidentInterventionsQuestions_Answers', ResidentInterventionsQuestions_Answers);
        }
        function updateOfflineResident_Interventions_Questions_Answers(ResidentInterventionsQuestions_Answers) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineResidentInterventionsQuestions_Answers', ResidentInterventionsQuestions_Answers);
        }




        function createOfflineResidents_Questions_Answers(ResidentsQuestionsAnswers) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineResidentsQuestionsAnswers', ResidentsQuestionsAnswers);
        }
        function updateOfflineResidents_Questions_Answers(ResidentsQuestionsAnswers) {
            return $http.post($rootScope.ApiPath + 'Syncronization/UpdateofflineResidentsQuestionsAnswers', ResidentsQuestionsAnswers);
        }
        function GetsyncNewOfflineResidentPhotos(lstResidentPhotos) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveofflineResidentPhotos', lstResidentPhotos);
        }

        //function SaveNewOfflineResidentAnswerDocuments(lstResidentQADocuments) {
        //    var fd = new FormData();
        //    for (var i = 0; i < lstResidentQADocuments.length; i++) {
        //        if (lstAssessmentData[i].FileData) {
        //            fd.append(lstAssessmentData[i].Section_Question_AnswerId, lstAssessmentData[i].FileData);
        //            delete lstAssessmentData[i].FileData;
        //        }
        //    }

        //    fd.append('Answers', JSON.stringify(lstAssessmentData));
        //    return $http.post($rootScope.ApiPath + 'Residents/CopyUpdateAssessmentDataWithFiles?residentId=' + residentId, fd, {
        //        transformRequest: angular.identity,
        //        headers: { 'Content-Type': undefined }
        //    });


        //    //var fd = new FormData();
        //    //fd.append('OfflineResidentDocuments', JSON.stringify(lstResidentPResidentAnswerDocuments));


        //    //return $http.post($rootScope.ApiPath + 'Syncronization/SaveResidentAnswerDocuments', fd, {
        //    //    transformRequest: angular.identity,
        //    //    headers: { 'Content-Type': undefined }
        //    //});f
        //    return $http.post($rootScope.ApiPath + 'Syncronization/SaveResidentAnswerDocuments', lstResidentPResidentAnswerDocuments);
        //}

        function SaveNewOfflineResidentAnswerDocuments(lstResidentQADocuments) {
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveResidentAnswerDocuments', lstResidentQADocuments);
        }


        function SaveResidentAdhocInterventionDocuments(lstResidentAdhocInterventionDocuments) {       
            return $http.post($rootScope.ApiPath + 'Syncronization/SaveResidentAdhocInterventionDocuments', lstResidentAdhocInterventionDocuments);
        }
        //function SaveNewOfflineInterventionResidentAnswerDocuments(lstInterventionResidentAnswerDocument) {
        //    return $http.post($rootScope.ApiPath + 'Syncronization/SaveInterventionResidentAnswerDocument', lstInterventionResidentAnswerDocument);
        //}

    }

}());