angular.module('CHM')

      .factory('$cordovaSQLite', ['$q', function ($q) {

        return {
            execute: function (db, query, binding) {
                var q = $q.defer();
                db.transaction(function (tx) {
                    tx.executeSql(query, binding, function (tx, result) {
                        q.resolve(result);
                    },
                      function (transaction, error) {
                          q.reject(error);
                      });
                });
                return q.promise;
            },
            bulkInsert: function (db, query, binding) {
                var q = $q.defer();
                var coll = binding.slice(0); // clone collection
                db.transaction(function (tx) {
                    tx.executeSql(query, coll[0], function (tx, result) {
                        q.resolve(result);
                    },
                      function (transaction, error) {
                          q.reject(error);
                      });
                });
                return q.promise;
            }
        }
    
}]);