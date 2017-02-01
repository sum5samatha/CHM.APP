(function () {
    //"use strict";

    angular.module('CHM').controller('NewResidentController', NewResidentController);

    NewResidentController.$inject = ['$rootScope', '$scope', '$q', '$uibModal', '$window', '$filter', '$location', 'toastr', 'ResidentsService', 'onlineStatus', '$timeout', 'CommonService', '$cordovaFile', '$cordovaDevice', '$cordovaFileTransfer', '$cordovaFileOpener2'];

    function NewResidentController($rootScope, $scope, $q, $uibModal, $window, $filter, $location, toastr, ResidentsService, onlineStatus, $timeout, CommonService, $cordovaFile, $cordovaDevice, $cordovaFileTransfer, $cordovaFileOpener2) {
        var vm = this;
        vm.OpenOnlyOneSection = false;
        vm.Resident = {};
        vm.ResidentId = null;
        vm.PersonalInformation = { open: true };
        vm.isDisabled = false;    
    
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        //online or offline

        $scope.onlineStatus = onlineStatus;
        $scope.$watch('onlineStatus.isOnline()', function (online) {
            $scope.online = online ? true : false;
            vm.online = $scope.online;
            vm.OpenOnlyOneSection = false;
            vm.Resident = {};
            vm.ResidentId = null;
            vm.PersonalInformation = { open: true };
            vm.isDisabled = false;

        });

        //DOB Datepicker Settings
        vm.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.DOBOpened = true;
        };

        //DOA Datepicker Settings
        vm.openDOA = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            vm.DOAOpened = true;
        };

        //AdmittedFrom Datepicker Settings
        vm.openAdmittedFrom = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            vm.AdmittedOpened = true;
        };

    
       //DOB DatePicker
        vm.dateDOBOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        //DOA DatePicker
        vm.dateDOAOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        //Admitted DatePicker
        vm.dateAdmittedOptions = {
            formatYear: 'yy',
            startingDay: 1,
            initDate: new Date()
        };
        vm.EndDate = new Date();

        //Saving Personal Information Online
        vm.SavePersonalInformation = function () {
            vm.isDisabled = true;
            vm.Resident.DOB = moment(new Date(vm.DOB)).format('YYYY-MM-DDTHH:mm:ss');
            vm.Resident.DOJ = moment(new Date(vm.DOJ)).format('YYYY-MM-DDTHH:mm:ss');
            vm.Resident.AdmittedFrom = moment(new Date(vm.AdmittedFrom)).format('YYYY-MM-DDTHH:mm:ss');
            var file = vm.ResidentImage.file;
            if (file == undefined) {
                toastr.error('Please attach an image.');
            } else {
                if (vm.online) {
                    ResidentsService.SavePersonalInformation(vm.Resident).success(function (response) {
                        vm.ResidentId = response.ID;
                        var lstResidentData = response;
                        lstResidentData.IsSyncnised = true;
                        lstResidentData.IsCreated = false;
                       
                        CommonService.insertOfflineResidents(app.db, lstResidentData).then(function () {
                          },
                     function (err) {
                           })
                        ResidentsService.UploadPhoto(file, vm.ResidentId).success(function (response) {
                                InsertFileinLocalDbandFolder(file, vm.ResidentId,true).then(function () {
                                toastr.success('Personal Information saved successfully.');
                                $location.path('/Residents');
                            })
                        },
                        function (err) {
                            deferred.reject('An error occured while uploading the attachment.');
                        });
                    },
                        function (err) {
                            toastr.error('An error occured while saving personal information.');
                        });
                }
                else {
           
                    if (vm.Resident) {
                        var objResident = {};
                        objResident = vm.Resident;
                        objResident.ID = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
                        objResident.IsSyncnised = false;
                        objResident.IsCreated = true;
                        objResident.IsActive = true;
                        objResident.OrganizationID = $rootScope.OrganizationId;
                        objResident.IsAccepted = false;
                         objResident.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                        objResident.CreatedBy = $rootScope.UserInfo.UserID;
                        objResident.Modified = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                        objResident.ModifiedBy = $rootScope.UserInfo.UserID;
                        CommonService.insertOfflineResidents(app.db, objResident).then(function () {
                            InsertFileinLocalDbandFolder(file, objResident.ID,false).then(function () {
                                toastr.success('Personal Information saved successfully.');
                                $location.path('/Residents');
                            })
                        },
                            function (err) {

                                toastr.error(err);
                            });
                    }
                }
            }

        };

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
                Residentphots.IsCreated = IsSyncnised?false:true;
                Residentphots.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                Residentphots.CreatedBy = $rootScope.UserInfo.UserID;
                CommonService.insertOfflineResidentPhotos(app.db, Residentphots).then(function () {
                    q.resolve();
                }, function (err) {
                
                    q.reject();
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
                    Residentphots.Created = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
                    Residentphots.CreatedBy = $rootScope.UserInfo.UserID;
                    CommonService.insertOfflineResidentPhotos(app.db, Residentphots).then(function () {
                        q.resolve();
                    }, function (err) {
                        q.reject();
                    });
                }
            });
            return q.promise;
        }

        vm.Redirect = function () {
            $location.url('/Residents');
        }
    }

}());