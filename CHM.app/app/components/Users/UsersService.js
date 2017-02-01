(function () {
    "use strict";

    angular.module('CHM').factory('UsersService', UsersService);

    UsersService.$inject = ['$rootScope', '$q', '$http', '$window'];

    function UsersService($rootScope, $q, $http, $window) {

        var objUsersService = {};

        objUsersService.Login = login;

        objUsersService.GetConfigurationValues = getConfigurationValues;

        objUsersService.GetUsers = getUsers;

        objUsersService.ForgotUserPassword = ForgotUserPassword;


        objUsersService.UpdateUserDetails = UpdateUserDetails;

        objUsersService.GetActiveUsers = getActiveUsers;

        objUsersService.GetActiveUsersRoles = GetActiveUsersRoles;

        objUsersService.GetUsersOrganizations = GetUsersOrganizations;

        objUsersService.GetActiveOrganizations = GetActiveOrganizations;

        objUsersService.GetOrganizationGroups = GetOrganizationGroups;

        objUsersService.GetOrganizationGroups_Organizations = GetOrganizationGroups_Organizations;

        objUsersService.GetIntervention_Question = GetIntervention_Question;

        objUsersService.GetSections_Questions_Answers_Widget = GetSections_Questions_Answers_Widget;

        objUsersService.GetSections_Questions_Answers_Tasks = GetSections_Questions_Answers_Tasks;

        objUsersService.GetSections_Questions_Answers = GetSections_Questions_Answers;

        objUsersService.GetSections_Questions = GetSections_Questions;

        objUsersService.GetSections_Questions_Answers_Summary = GetSections_Questions_Answers_Summary;

        objUsersService.GetSections_Organizations = GetSections_Organizations;

        objUsersService.GetSection_Summary = GetSection_Summary;

        objUsersService.GetSectionIntervention = GetSectionIntervention;

        objUsersService.GetSectionInterventionStatements = GetSectionInterventionStatements;

        objUsersService.GetInterventions = GetInterventions;

        objUsersService.GetIntervention_Question_Answer = GetIntervention_Question_Answer;

        objUsersService.GetInterventions_Question_Answer_Summary = GetInterventions_Question_Answer_Summary;

        objUsersService.GetIntervention_Question_ParentQuestion = GetIntervention_Question_ParentQuestion;

        objUsersService.GetIntervention_Question_Answer_Task = GetIntervention_Question_Answer_Task;

        objUsersService.GetUserInfo = getUserInfo;

        objUsersService.GetCurrentUserDetails = getCurrentUserDetails;

        objUsersService.CreateUser = createUser;

        objUsersService.GetRoles = GetRoles;

        objUsersService.SaveUser = SaveUser;

        objUsersService.getUserInformation = getUserInformation;

        objUsersService.ViewUserInformation = ViewUserInformation;

        objUsersService.UpdateUser = UpdateUser;

        objUsersService.DeleteUser = DeleteUser;

        // objUsersService.CheckOldPassword = CheckOldPassword;



        objUsersService.GetActions = GetActions;

        objUsersService.GetActions_Days = GetActions_Days;

        objUsersService.GetInterventionsData = GetInterventionsData;

        objUsersService.GetInterventions_Resident_Answers = GetInterventions_Resident_Answers;


        objUsersService.GetResident_Interventions_Questions_Answers = GetResident_Interventions_Questions_Answers

        objUsersService.GetResidents = GetResidents;


        objUsersService.GetResidents_Questions_Answers = GetResidents_Questions_Answers;

        objUsersService.GetResidents_Relatives = GetResidents_Relatives;
        objUsersService.GetResidentsQuestionsAnswersDocuments = GetResidentsQuestionsAnswersDocuments;

        objUsersService.GetMasterDataBasedonOrganization = GetMasterDataBasedonOrganization;
        objUsersService.GetMasterDataResidents = GetMasterDataResidents; 
        objUsersService.GetResidentsDocuments = GetResidentsDocuments;
        objUsersService.GetInterventionResidentsDocuments = GetInterventionResidentsDocuments;
        objUsersService.GetAdhocInterventionResidentsDocuments = GetAdhocInterventionResidentsDocuments;

        objUsersService.GetUserTypes = GetUserTypes;

        objUsersService.GetMasterDatabasedonQuestionIds = GetMasterDatabasedonQuestionIds;

        objUsersService.CheckValidEmail = CheckValidEmail;
        objUsersService.CheckValidUser = CheckValidUser;

        objUsersService.GetOrganizationWRTUserID = GetOrganizationWRTUserID;

        return objUsersService;

        function CheckValidEmail(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/CheckValidEmail', objUser);
        }

        function CheckValidUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/CheckValidUser', objUser);
        }

        function login(userName, password) {

            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.RootUrl + '/token',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': undefined },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { grant_type: 'password', UserName: userName, Password: password }
            }).then(
                function (response) {
                    var UserInfo = {
                        Token: response.data.access_token,
                        UserName: response.data.name,
                        RoleName: response.data.Role,
                        UserID: response.data.UserID,
                        organizationsIds: response.data.organizationsIds,
                        LastLogin :response.data.LastLogin
                    };
                    deferred.resolve(UserInfo);
                },
                function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getConfigurationValues() {
            return $http.get($rootScope.ApiPath + 'Users/GetConfigurationsValues');
        }   

        function getUsers() {
            return $http.get($rootScope.ApiPath + 'Users/GetAllUsers');
        }

        function getUserInformation(UserID) {
            return $http.get($rootScope.ApiPath + 'Users/GetUser?UserID=' + UserID);
        }

        function getActiveUsers() {
            return $http.get($rootScope.ApiPath + 'Users/GetAllActiveUsers');
        }

        function ForgotUserPassword(Username) {
            return $http.post($rootScope.ApiPath + 'Users/GetUserName?Username=' + Username);
        }


        function getUserInfo() {
            if ($window.sessionStorage["FinanceUserInfo"]) {
                return JSON.parse($window.sessionStorage["FinanceUserInfo"]);
            }
            return null;
        }

        function getCurrentUserDetails() {
            return $http.get($rootScope.ApiPath + 'Users/GetCurrentUserDetails');
        }

        function createUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/Register', objUser);
        }


        function GetRoles() {
            return $http.get($rootScope.ApiPath + 'Roles/GetActiveRoles');

        }


        function SaveUser(user) {
            return $http.post($rootScope.ApiPath + 'Users/SaveUser', user);
        }

        function ViewUserInformation(UserID) {
            return $http.get($rootScope.ApiPath + 'Users/ViewUser?UserID=' + UserID);
        }
        function UpdateUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/UpdateUser', objUser);
        }

        function DeleteUser(objUser) {
            return $http.post($rootScope.ApiPath + 'Users/DeleteUser', objUser);
        }

        //function CheckOldPassword(objUserID) {

        //    return $http.get($rootScope.ApiPath + 'Users/CheckOldPassword', objUserID);
        //}
        function UpdateUserDetails(ObjUser) {
            return $http.post($rootScope.ApiPath + 'Users/UpdateUser', ObjUser);
        }
        function GetActiveUsersRoles() {
            return $http.get($rootScope.ApiPath + 'Users/GetActiveUsersRoles');
        }

        function GetActiveOrganizations() {
            return $http.get($rootScope.ApiPath + 'Users/GetActiveOrganizations');
        }

        function GetUsersOrganizations() {
            return $http.get($rootScope.ApiPath + 'Users/GetUsersOrganizations');
        }

        function GetOrganizationGroups() {
            return $http.get($rootScope.ApiPath + 'Users/GetOrganizationGroups');
        }


        function GetOrganizationGroups_Organizations() {
            return $http.get($rootScope.ApiPath + 'Users/GetOrganizationGroups_Organizations');
        }

        function GetIntervention_Question() {
            return $http.get($rootScope.ApiPath + 'Users/GetIntervention_Question');
        }



        function GetSections_Questions_Answers_Widget() {
            return $http.get($rootScope.ApiPath + 'Users/GetSections_Questions_Answers_Widget');
        }

        function GetSections_Questions_Answers_Tasks() {
            return $http.get($rootScope.ApiPath + 'Users/GetSections_Questions_Answers_Tasks');
        }


        function GetSections_Questions_Answers_Summary() {
            return $http.get($rootScope.ApiPath + 'Users/GetSections_Questions_Answers_Summary');
        }

        function GetSections_Questions_Answers() {
            return $http.get($rootScope.ApiPath + 'Users/GetSections_Questions_Answers');
        }

        function GetSections_Organizations() {
            return $http.get($rootScope.ApiPath + 'Users/GetSections_Organizations');
        }


        function GetSection_Summary() {
            return $http.get($rootScope.ApiPath + 'Users/GetSection_Summary');
        }


        function GetSectionInterventionStatements() {
            return $http.get($rootScope.ApiPath + 'Users/GetSectionInterventionStatements');
        }



        function GetSectionIntervention() {
            return $http.get($rootScope.ApiPath + 'Users/GetSectionIntervention');
        }



        function GetInterventions() {
            return $http.get($rootScope.ApiPath + 'Users/GetInterventions');
        }




        function GetInterventions_Question_Answer_Summary() {
            return $http.get($rootScope.ApiPath + 'Users/GetInterventions_Question_Answer_Summary');
        }

        function GetIntervention_Question_ParentQuestion() {
            return $http.get($rootScope.ApiPath + 'Users/GetIntervention_Question_ParentQuestion');
        }


        function GetIntervention_Question_Answer_Task() {
            return $http.get($rootScope.ApiPath + 'Users/GetIntervention_Question_Answer_Task');
        }


        function GetIntervention_Question_Answer_Task() {
            return $http.get($rootScope.ApiPath + 'Users/GetIntervention_Question_Answer_Task');
        }


        function GetIntervention_Question_Answer() {
            return $http.get($rootScope.ApiPath + 'Users/GetIntervention_Question_Answer');
        }

        function GetSections_Questions() {
            return $http.get($rootScope.ApiPath + 'Users/GetSections_Questions');
        }

        function GetActions() {
            return $http.get($rootScope.ApiPath + 'Users/GetActions');
        }

        function GetActions_Days() {
            return $http.get($rootScope.ApiPath + 'Users/GetActions_Days');
        }

        function GetInterventionsData() {
            return $http.get($rootScope.ApiPath + 'Users/GetInterventionsData');
        }
        function GetInterventions_Resident_Answers() {
            return $http.get($rootScope.ApiPath + 'Users/GetInterventions_Resident_Answers');
        }

        function GetResident_Interventions_Questions_Answers() {
            return $http.get($rootScope.ApiPath + 'Users/GetResident_Interventions_Questions_Answers');
        }


        function GetResidents() {
            return $http.get($rootScope.ApiPath + 'Users/GetResidents');
        }

        function GetResidents_Questions_Answers() {
            return $http.get($rootScope.ApiPath + 'Users/GetResidents_Questions_Answers');
        }

        function GetResidents_Relatives() {
            return $http.get($rootScope.ApiPath + 'Users/GetResidents_Relatives');
        }
        function GetResidentsQuestionsAnswersDocuments(ResidentQuestionAnswerID) {
            return $http.get($rootScope.ApiPath + 'Residents/GetResidentFile?guidResidentQuestionAnswerID=' + ResidentQuestionAnswerID);
        }

        function GetMasterDataBasedonOrganization(OrganizationID) {
            return $http.get($rootScope.ApiPath + 'Syncronization/GetMasterDataBasedonOrganization?guidOrganizationID=' + OrganizationID);
        }
        function GetMasterDataResidents(OrganizationID, startDate, endDate) {
            return $http.get($rootScope.ApiPath + 'Syncronization/GetResidentsDataBasedonOrganization?guidOrganizationID=' + OrganizationID + '&startDate=' + startDate + '&endDate=' + endDate);
        }
        function GetResidentsDocuments(OrganizationID) {
            return $http.get($rootScope.ApiPath + 'Syncronization/GetResidentsAnswerDocumentsBasedonOrganization?guidOrganizationID=' + OrganizationID);
        }
        function GetInterventionResidentsDocuments(OrganizationID) {
            return $http.get($rootScope.ApiPath + 'Syncronization/GetInterventionAnswerDocumentsBasedonOrganization?guidOrganizationID=' + OrganizationID);
        }
        function GetAdhocInterventionResidentsDocuments(OrganizationID) {           
            return $http.get($rootScope.ApiPath + 'Syncronization/GetAdhocInterventionAnswerDocumentsBasedonOrganization?guidOrganizationID=' + OrganizationID);
        }

        function GetUserTypes() {
            return $http.get($rootScope.ApiPath + 'Users/GetUserTypes');
        }

        function GetMasterDatabasedonQuestionIds(objQuestionIds) {
            return $http.post($rootScope.ApiPath + 'Syncronization/MasterDatabasedonQuestionIds', objQuestionIds);
        }

        function GetOrganizationWRTUserID(UserID) {
            return $http.get($rootScope.ApiPath + 'Users/GetOrganizationWRTUserID?UserID='+UserID);
        }



    }

}());