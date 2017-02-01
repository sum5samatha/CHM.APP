(function () {
    "use strict";

    angular.module('CHM').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
          .state('Login', {
              url: '/',
              templateUrl: 'app/components/Users/Login/Login.html?v=1',
              controller: 'LoginController',
              controllerAs: 'vm'
          })
        .state('Residents', {
            url: '/Residents',
            templateUrl: 'app/components/Residents/List/ResidentsList.html?v=2',
            controller: 'ResidentsListController',
            controllerAs: 'vm'
        })
        .state('ResidentsSyncronization', {
            url: '/ResidentsSyncronization',
            templateUrl: 'app/components/ResidentsSyncronization/ResidentsSyncronization.html',
            controller: 'ResidentsSyncronizationController',
            controllerAs: 'vm'
        })
        .state('NewResident', {
            url: '/NewResident',
            templateUrl: 'app/components/Residents/New/NewResident.html?v=4',
            controller: 'NewResidentController',
            controllerAs: 'vm'
        })
        .state('EditResident', {
            url: '/EditResident',
            templateUrl: 'app/components/Residents/Edit/EditResident.html?v=12',
            controller: 'EditResidentController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
            .state('Interventions', {
                url: '/Interventions',
                templateUrl: 'app/components/Interventions/InterventionsList/Interventions.html?v=1',
                controller: 'InterventionsController',
                controllerAs: 'vm',
                params: {
                    ResidentId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
        .state('ViewResident', {
            url: '/ViewResident',
            templateUrl: 'app/components/Residents/View/ViewResident.html?v=5',
            controller: 'ViewResidentController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('RiskAssessmentSummary', {
            url: '/RiskAssessmentSummary',
            templateUrl: 'app/components/RiskAssessmentSummary/RiskAssessmentSummary.html?v=3',
            controller: 'RiskAssessmentSummaryController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                EditMode: { value: false, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('EditCarePlan', {
            url: '/EditCarePlan',
            templateUrl: 'app/components/CarePlan/Edit/EditCarePlan.html?v=5',
            controller: 'EditCarePlanController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('ViewCarePlan', {
            url: '/ViewCarePlan',
            templateUrl: 'app/components/CarePlan/View/ViewCarePlan.html?v=5',
            controller: 'ViewCarePlanController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
        .state('ResidentInterventions', {
            url: '/ResidentInterventions',
            templateUrl: 'app/components/Interventions/Resident/ResidentInterventions.html?v=5',
            controller: 'ResidentInterventionsController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
           .state('AdhocIntervention', {
               url: '/AdhocIntervention',
               templateUrl: 'app/components/AdhocIntervention/AdhocInterventionList/AdhocInterventionList.html',
               controller: 'AdhocInterventionListController',
               controllerAs: 'vm',
               params: {
                   ResidentId: { value: null, squash: false },
                   hiddenParam: 'YES'
               }
           })
        .state('DailyDiary', {
            url: '/DailyDiary',
            templateUrl: 'app/components/DailyDiary/DailyDiary.html',
            controller: 'DailyDiaryController',
            controllerAs: 'vm',
            params: {
                ResidentId: { value: null, squash: false },
                hiddenParam: 'YES'
            }
        })
          .state('UsersList', {
              url: '/UsersList',
              templateUrl: 'app/components/Users/List/UsersList.html',
              controller: 'UsersListController',
              controllerAs: 'vm',
              params: {
                  ResidentId: { value: null, squash: false },
                  hiddenParam: 'YES'
              }
          })
             .state('EditUser', {
                 url: '/EditUser',
                 templateUrl: 'app/components/Users/Edit/EditUser.html',
                 controller: 'EditUserController',
                 controllerAs: 'vm',
                 params: {
                     UserId: { value: null, squash: false },
                     hiddenParam: 'YES'
                 }
             })
              .state('NewUser', {
                  url: '/NewUser',
                  templateUrl: 'app/components/Users/New/NewUser.html',
                  controller: 'NewUserController',
                  controllerAs: 'vm',
                  params: {
                      ResidentId: { value: null, squash: false },
                      hiddenParam: 'YES'
                  }
              })
             .state('ViewUser', {
                 url: '/ViewUser',
                 templateUrl: 'app/components/Users/View/ViewUser.html',
                 controller: 'ViewUserController',
                 controllerAs: 'vm',
                 params: {
                     ResidentId: { value: null, squash: false },
                     hiddenParam: 'YES'
                 }
             })
            .state('ChangePassword', {
                url: '/ChangePassword',
                templateUrl: 'app/components/Users/ChangePassword/ChangePassword.html',
                controller: 'ChangePasswordController',
                controllerAs: 'vm',
                params: {
                    UserId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
            .state('ForgotPassword', {
                url: '/ForgotPassword',
                templateUrl: 'app/components/Users/ForgotPassword/ForgotPassword.html',
                controller: 'ForgotPasswordController',
                controllerAs: 'vm',
                params: {
                    UserId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            }).state('AdminSyncronization', {
                url: '/AdminSyncronization',
                templateUrl: 'app/components/AdminSyncronization/AdminSyncronization.html',
                controller: 'AdminSyncronizationController',
                controllerAs: 'vm',
                params: {
                    UserId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            }).state('HandOverNotes', {
                url: '/HandOverNotes',
                templateUrl: 'app/components/HandOverNotes/HandOverNotes.html?v=1',
                controller: 'HandOverNotesController',
                controllerAs: 'vm',
                params: {
                    ResidentId: { value: null, squash: false },
                    hiddenParam: 'YES'
                }
            })
            .state('ResidentDocumentViewer', {
                url: '/ResidentDocumentViewer',
                templateUrl: 'app/components/ResidentDocumentsViewer/ResidentDocumentsViewer.html?v=1',
                controller: 'ResidentDocumentsViewerController',
                controllerAs: 'vm',
                params: {
                    ResidentId: {
                        value: null, squash: false
                    },
                    hiddenParam: 'YES'
                }
            });
    }]);

    angular.module('CHM').run(['$rootScope', '$state', '$window', '$location', 'UsersService', function ($rootScope, $state, $window, $location, UsersService) {

        //google analytics
        $window.ga('create', 'UA-80836044-1', 'auto');

       

        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            //google analytics
            $window.ga('send', 'pageview', $location.path());


            if (toState.name == 'Login') {
                if ($rootScope.UserInfo)
                    e.preventDefault();

                return;
            }

            if (!$rootScope.UserInfo) {
                e.preventDefault();
                $state.go('Login');

            }
        });

        $rootScope.DateFormat = 'dd-MMMM-yyyy';
        $rootScope.DateFormatForMoment = 'YYYY-MM-DD';
        $rootScope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $rootScope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };

        $rootScope.Logout = function () {
            $rootScope.UserInfo = null;
            $state.go('Login');
        };




        $rootScope.RootUrl = 'http://54.171.141.65';
        //$rootScope.RootUrl = 'http://enthusis.azurewebsites.net';
        // $rootScope.RootUrl = 'http://db72ce6d.ngrok.io';
        //$rootScope.RootUrl = 'http://54.171.141.65';


         // $rootScope.RootUrl ='http://54.171.141.65/lm'; 
      //  $rootScope.RootUrl = 'http://SF-D001:1234';
        //$rootScope.OrganizationId = 'A3BE0758-7999-4674-89DE-3FD91F99FDD9';
        //$rootScope.RootUrl = 'http://b8e74ded.ngrok.io';
        
     
     $rootScope.ApiPath = $rootScope.RootUrl + '/api/';

    }]);


}());