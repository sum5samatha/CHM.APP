(function () {
    //"use strict";

    angular.module('CHM').controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$q', '$sce', '$uibModal', '$rootScope', '$window', '$location', '$filter', '$stateParams', 'toastr', 'UsersService'];

    function ForgotPasswordController($q, $sce, $uibModal, $rootScope, $window, $location, $filter, $stateParams, toastr, UsersService) {


        var vm = this;

        vm.Submit = function () {
            UsersService.ForgotUserPassword(vm.Users.UserName).then(
                          function (response) {

                              toastr.success('Mail sent Sucessfully');

                          }
                          , function (err) {

                              toastr.error('UserName was Incorrect.');
                          }
                          )

        }







        vm.Cancel = function () {
            $window.location.href = 'http://localhost:53812/#/Residents';
        }
    }
}());