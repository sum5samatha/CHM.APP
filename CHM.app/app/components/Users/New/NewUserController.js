(function () {
    //   "use strict";

    angular.module('CHM').controller('NewUserController', NewUserController);

    NewUserController.$inject = ['$q', '$sce', '$uibModal', '$window', '$location', '$filter', '$stateParams', 'toastr', 'UsersService', 'ResidentsService'];

    function NewUserController($q, $sce, $uibModal, $window, $location, $filter, $stateParams, toastr, UsersService, ResidentsService) {


        var vm = this;
        //DOB Datepicker Settings
        vm.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBOpened = true;
        };

        //Binding Roles DropDown
        //UsersService.GetRoles().then(

        // function (response) {
        //  vm.Roles = response.data;
        //     console.log(vm.Roles);
        //    for (var i = 0; i < vm.Roles.length; i++) {

        //        app.insertRolesService(vm.Roles[i]);

        //      }
        //console.log(vm.Roles);
        //      },
        // function (err) {
        //     toastr.error('An error occurred while retrieving Roles.');
        //})

        //Users List

        //  UsersService.GetActiveUsers().then(

        //   function (response) {
        //     vm.AllUsers = response.data;
        //
        //     for (var i = 0; i < vm.AllUsers.length; i++) {
        //          console.log(vm.AllUsers[i]);
        ////           app.insertUsers(vm.AllUsers[i]);

        //       }
        //console.log(vm.Roles);
        //   },
        // function (err) {
        //  toastr.error('An error occurred while retrieving Users.');
        // })


        //Binding Residents DropDown
        ResidentsService.GetActiveResidents().then(
            function (response) {
                vm.AllResidents = response.data;
                vm.Residents = [];
                for (var i = 0; i < vm.AllResidents.length; i++) {
                    vm.Residents.push(vm.AllResidents[i].Resident);

                }


            },
            function (err) {
                toastr.error('An error occurred while retrieving Residents.');
            })


        //Save User Functionality
        vm.SaveUser = function () {

            if (vm.RoleIds != undefined) {
                vm.Users.Users_Roles = [];
                var objUsers_Roles = {
                    RoleID: vm.RoleIds
                };
                vm.Users.Users_Roles.push(objUsers_Roles);
            }

            if (vm.ResidentIDs != undefined) {
                vm.Users.Residents_Relatives2 = [];
                var objResident_Relatives = {
                    ResidentID: vm.ResidentIDs
                };
                vm.Users.Residents_Relatives2.push(objResident_Relatives);
            }


            UsersService.SaveUser(vm.Users).success(
                   function (response) {
                       toastr.success('Saved Sucessfully .');
                       $location.path('/UsersList');

                   },
                   function (err) {
                       toastr.error('An error occured while saving personal information.');
                   }
               );
        }

    }
}());