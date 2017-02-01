(function () {
    // "use strict";

    angular.module('CHM').controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$q', '$sce', '$uibModal', '$rootScope', '$window', '$location', '$filter', '$stateParams', 'toastr', 'UsersService'];

    function ChangePasswordController($q, $sce, $uibModal, $rootScope, $window, $location, $filter, $stateParams, toastr, UsersService) {


        var vm = this;
        //  vm.userData = $rootScope.UserInfo;

        vm.LoginUserID = '4E6F9D08-111F-43F6-8EE8-0A626D5A5B53';
        vm.IsPasswordAvailable = true;
        vm.UserResponse = [];
        vm.CheckPassword = function () {

            if (vm.OldPassword != undefined && vm.OldPassword != "") {

                UsersService.getUserInformation(vm.LoginUserID).then(

                 function (response) {
                     if (response.data.Password == vm.OldPassword) {
                         vm.UserResponse = response.data;
                         vm.IsPasswordAvailable = false;
                     }
                     else {
                         vm.IsPasswordAvailable = true;
                         vm.OldPassword = "";
                         toastr.error('Entered OldPassword Wrong.');
                     }

                 });
            }
            else {
                vm.IsPasswordAvailable = true;
            }

        };

        vm.ChangePassword = function () {

            var reges = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){5}$/;
            var valid = reges.test(vm.NewPassword);


            if (valid) {
                if (vm.NewPassword == vm.ConfirmPassword) {

                    vm.UserResponse.Password = vm.NewPassword

                    UsersService.UpdateUserDetails(vm.UserResponse).then(
                        function (response) {
                            toastr.success('Updated Successfully.');
                        }
                        , function (err) {
                            toastr.error('An error occurred.');
                        }
                        )

                }
                else {
                    toastr.error('New Password and Confirm Password do not match.');
                    vm.OldPassword = "";
                    vm.NewPassword = "";
                    vm.ConfirmPassword = "";
                    vm.IsPasswordAvailable = true;
                }
            } else {
                toastr.error('Password should in alphanueneric form');
                vm.OldPassword = "";
                vm.NewPassword = "";
                vm.ConfirmPassword = "";
                vm.IsPasswordAvailable = true;
            }

        }

        vm.Cancel = function () {
            $window.location.href = 'http://localhost:53812/#/Residents';
        }
    }
}());