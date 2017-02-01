(function () {
    "use strict";

    angular.module('CHM', [
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngTable',
    'oi.select',
    'ng-context-menu',
    'oitozero.ngSweetAlert',
    'toastr',
    'toggle-switch',
    'angular.filter',
    'ngCordova',
    'ngIdle'
    ]);


    window.onerror = function (error) {
        alert(JSON.stringify(error));
    };



}());