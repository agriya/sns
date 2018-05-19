'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:UsersPrivacyController
 * @description
 * # UsersPrivacyController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('UsersPrivacyController', ['$rootScope', '$scope', 'userSettings', 'flash', '$state', '$filter', function($rootScope, $scope, userSettings, flash, $state, $filter) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Privacy");
        $scope.save = function() {
            if ($scope.userPrivacy.$valid) {
                var flashMessage;
                $scope.user.id = $rootScope.user.id;
                userSettings.update($scope.user, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flashMessage = $filter("translate")("User Profile has been updated.");
                        flash.set(flashMessage, 'success', false);
                    } else {
                        flashMessage = $filter("translate")(response.error.message);
                        flash.set(flashMessage, 'error', false);
                    }
                });
            }
        };
        $scope.delete = function() {
            var flashMessage;
            $scope.user.id = $rootScope.user.id;
            userSettings.delete($scope.user, function(response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    flashMessage = $filter("translate")("Your account has been deleted.");
                    flash.set(flashMessage, 'success', false);
                    $state.go('users_logout');
                } else {
                    flashMessage = $filter("translate")(response.error.message);
                    flash.set(flashMessage, 'error', false);
                }
            });
        };
        $scope.index = function() {
            var params = {};
            $scope.privacy_tab = 'active';
            params.id = $rootScope.user.id;
            userSettings.get(params, function(response) {
                $scope.user = {};
                $scope.user.is_show_profile_picture_in_search_engine = response.data.is_show_profile_picture_in_search_engine;
                $scope.user.is_show_pictures_in_search_engine = response.data.is_show_pictures_in_search_engine;
            });
        };
        $scope.index();
    }]);