'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:FlagModelController
 * @description
 * # FlagModelController
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('FlagModelController', ['$scope', '$rootScope', 'FlagSaveFactory', 'flagcategories', 'viewphotos', 'photoindex', 'photoKey', 'photos', '$uibModalInstance', '$uibModalStack', '$location', function($scope, $rootScope, FlagSaveFactory, flagcategories, viewphotos, photoindex, photoKey, photos, $uibModalInstance, $uibModalStack, $location) {
        $scope.photos = photos;
        $scope.flagcategories = flagcategories;
        $scope.viewphotos = viewphotos;
        $scope.flag = {};
        $scope.SaveFlag = function(flag_id) {
            if ($rootScope.isAuth === true) {
                var params = {};
                params.photo_id = $scope.viewphotos.id;
                params.flag_category_id = flag_id;
                params.type = "photo";
                FlagSaveFactory.create(params, function(response) {
                    if (response.error.code === 0) {
                        $scope.photos[photoKey][photoindex].is_flag = true;
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