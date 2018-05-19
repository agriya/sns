'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:UsersSettingsCtrl
 * @description
 * # UsersSettingsCtrl
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('UsersNotificationController', ['$rootScope', '$scope', 'userNotificationFactory', 'flash', '$filter', function($rootScope, $scope, userNotificationFactory, flash, $filter) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Notifications");
        $scope.save = function() {
            if ($scope.userNotification.$valid) {
                var flashMessage;
                $scope.user.id = $rootScope.user.user_notification_setting_id;
                $scope.user.is_enable_email_when_someone_follow_me = ($scope.user.is_enable_email_when_someone_follow_me) ? true : false;
                $scope.user.is_enable_email_when_someone_mentioned_me = ($scope.user.is_enable_email_when_someone_mentioned_me) ? true : false;
                $scope.user.is_enable_subscribe_me_for_newsletter = ($scope.user.is_enable_subscribe_me_for_newsletter) ? true : false;
                $scope.user.is_enable_subscribe_me_for_weeky_replay = ($scope.user.is_enable_subscribe_me_for_weeky_replay) ? true : false;
                $scope.user.is_enable_email_when_follow_post = ($scope.user.is_enable_email_when_follow_post) ? true : false;
                userNotificationFactory.update($scope.user, function(response) {
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
            $scope.notification_tab = 'active';
            var params = {};
            params.id = $rootScope.user.user_notification_setting_id;
            userNotificationFactory.get(params, function(response) {
                $scope.user = {};
                $scope.user.is_enable_email_when_someone_follow_me = response.data.is_enable_email_when_someone_follow_me;
                $scope.user.is_enable_email_when_someone_mentioned_me = response.data.is_enable_email_when_someone_mentioned_me;
                $scope.user.is_enable_subscribe_me_for_newsletter = response.data.is_enable_subscribe_me_for_newsletter;
                $scope.user.is_enable_subscribe_me_for_weeky_replay = response.data.is_enable_subscribe_me_for_weeky_replay;
                $scope.user.is_enable_email_when_follow_post = response.data.is_enable_email_when_follow_post;
            });
        };
        $scope.index();
    }]);