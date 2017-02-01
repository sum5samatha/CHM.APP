(function () {
    angular.module('CHM').factory('onlineStatus', ["$window", "$rootScope", "ResidentsService", function ($window, $rootScope, ResidentsService) {
        
        var onlineStatus = {};

        onlineStatus.onLine = $window.navigator.onLine;

        onlineStatus.isOnline = function () {
            return onlineStatus.onLine;
        }

        $window.addEventListener("online", function () {
            ResidentsService.GetActiveRoles().then(function (succ) {
                onlineStatus.onLine = true;
                //$rootScope.$broadcast('ConnectionChange', { onLine: true });
                //$rootScope.$digest();
            }, function errorr(err) {
                onlineStatus.onLine = false;
                //$rootScope.$broadcast('ConnectionChange', { onLine: false });
                //$rootScope.$digest();
            })
        }, true);

        $window.addEventListener("offline", function () {
            onlineStatus.onLine = false;
            //$rootScope.$broadcast('ConnectionChange', { onLine: false });
            //$rootScope.$digest();
        }, true);

        return onlineStatus;
    }])

}());