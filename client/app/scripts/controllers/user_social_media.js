'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:UsersSettingsCtrl
 * @description
 * # UsersSettingsCtrl
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('UsersSocialMediaController', ['$rootScope', '$scope', 'userSettings', 'flash', '$filter', function($rootScope, $scope, userSettings, flash, $filter) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Social Media");
        $scope.save = function() {
            if ($scope.userSocialMedia.$valid) {
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
        $scope.index = function() {
            $scope.social_tab = 'active';
            var params = {};
            params.id = $rootScope.user.id;
            userSettings.get(params, function(response) {
                //$scope.user = response.data;
                $scope.user = {};
                $scope.user.facebook_username = response.data.facebook_username;
                $scope.user.twitter_username = response.data.twitter_username;
                $scope.user.Sns_username = response.data.Sns_username;
                $scope.user.linkedin_username = response.data.linkedin_username;
                $scope.user.youtube_username = response.data.youtube_username;
                $scope.user.medium_username = response.data.medium_username;
                $scope.user.etsy_username = response.data.etsy_username;
            });
        };
        $scope.index();
    }]);