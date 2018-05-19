'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:FlagModelController
 * @description
 * # FlagModelController
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UserFlagModelController', ['$scope', '$rootScope', 'FlagSaveFactory', 'flagcategories', 'user', 'userKey', 'users', '$uibModalInstance', '$uibModalStack', '$location', function($scope, $rootScope, FlagSaveFactory, flagcategories, user, userKey, users, $uibModalInstance, $uibModalStack, $location) {
        $scope.users = users;
        $scope.flagcategories = flagcategories;
        $scope.user = user;
        $scope.flag = {};
        $scope.SaveFlag = function(flag_id) {
            if ($rootScope.isAuth === true) {
                var params = {};
                params.flagged_user_id = user.id;
                params.flag_category_id = flag_id;
                params.type = "user";
                FlagSaveFactory.create(params, function(response) {
                    if (response.error.code === 0) {
                        $scope.users[userKey].is_userflag = true;
                        $uibModalInstance.close();
                    }
                });
            } else {
                $uibModalStack.dismissAll();
                $location.path('/users/login');
            }
        };
        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    }]);