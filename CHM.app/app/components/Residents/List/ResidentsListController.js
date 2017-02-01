(function () {
    // "use strict";

    angular.module('CHM').controller('ResidentsListController', ResidentsListController);

    ResidentsListController.$inject = ['$q', '$uibModal', '$window', '$rootScope', 'toastr', 'ResidentsService', '$filter', 'SweetAlert', '$scope', 'onlineStatus', 'CommonService'];

    function ResidentsListController($q, $uibModal, $window, $rootScope, toastr, ResidentsService, $filter, SweetAlert, $scope, onlineStatus, CommonService) {
        var vm = this;

        vm.Residents = [];
        vm.ResidentPhotos = [];
        vm.ResidentsShowing = true;
        vm.ActiveResidentsShowing = true;
        var ResidentPersonalData = [];
        var updateResofflineData = [];

        var arryResidents = [];
        var arryResidentPhotos = [];
        vm.IsSecondaryReadonly = $rootScope.IsSecondaryRead;

        //checking online or offline

        $scope.onlineStatus = onlineStatus;


        $scope.$watch('onlineStatus.isOnline()', function (online) {

            $scope.online = online ? true : false;
            vm.online = false;
            $scope.online = false;

            $rootScope.$broadcast("loader_show");

            //Retrieving the residents from offline database

            function GetAllOfflineData() {
         
                CommonService.SelectAllResidents(app.db).then(function (rs) {
                 
                    vm.Residents = [];
                    if (rs.rows.length > 0) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            vm.Residents.push(rs.rows.item(i));
                      
                        }
                    }
                    CommonService.SelectAllResidentPhotos(app.db).then(function (rs) {
                        vm.ResidentPhotos = [];
                        if (rs.rows.length > 0) {
                            for (var i = 0; i < rs.rows.length; i++) {
                                vm.ResidentPhotos.push(rs.rows.item(i));
                            }
                        }
                        getAllResidents();                      
                        $rootScope.$broadcast("loader_hide");
                    }, function error(err) {
                        toastr.error('An error occurred while retrieving Resident Photos.');
                    });
                }, function error(err) {
                    toastr.error('An error occurred while retrieving Residents.');
                });

            }
            GetAllOfflineData();           
        });

        //Search functionality of Resident/Prospect

        vm.search = function (item) {
            if (vm.searchText == undefined) {
                return true;
            }
            else {
                if (item.Resident.FirstName.toLowerCase().indexOf(vm.searchText.toLowerCase()) != -1 ||
                    item.Resident.LastName.toLowerCase().indexOf(vm.searchText.toLowerCase()) != -1 ||
                    item.Resident.FirstName.toLowerCase().concat(' ').concat(item.Resident.LastName.toLowerCase()).indexOf(vm.searchText.toLowerCase()) != -1) {
                    return true;
                }
            }
            return false;
        }

        // Retriving all the Residents

        var getAllResidents = function (obj) {


            var CurrentDate = moment().format();
            var TodayDate = CurrentDate.split('T');
            CurrentDate = TodayDate[0];

            if (vm.Residents.length > 0) {
               vm.arrResidentData = [];
                for (var i = 0; i < vm.Residents.length; i++) {
                    var arrResident = { PhotoUrl: '', Resident: {} }
                    arrResident.Resident = vm.Residents[i];
                    var LeavingDate = vm.Residents[i].LeavingDate;
                    if (LeavingDate != null) {
                        var ResidentLeavingDate = LeavingDate.split('T');
                        LeavingDate = ResidentLeavingDate[0];
                        if (CurrentDate >= LeavingDate) {
                            CommonService.DeleteOfflineResidentData(app.db, vm.Residents[i]).then(function (response) {
                            }, function error(err) {

                            })
                        }
                    }
                    for (var j = 0; j < vm.ResidentPhotos.length; j++) {
                        if (vm.ResidentPhotos[j].ID == vm.Residents[i].ID) {
                            arrResident.PhotoUrl = vm.ResidentPhotos[j].PhotoURL;
                        }
                    }
                    vm.arrResidentData.push(arrResident);
                }
                vm.ResidentWithPhoto = vm.arrResidentData;
              
            }
            else {
                $rootScope.$broadcast("loader_hide");
            }
        };
    }   
}());