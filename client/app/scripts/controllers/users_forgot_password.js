'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UsersForgotPasswordCtrl
 * @description
 * # UsersForgotPasswordCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UsersForgotPasswordCtrl', ['$rootScope', '$scope', '$location', 'flash', 'usersForgotPassword', '$filter', '$uibModalStack', function($rootScope, $scope, $location, flash, usersForgotPassword, $filter, $uibModalStack) {
        $uibModalStack.dismissAll();
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Forgot Password");
        $scope.save_btn = false;
        if (parseInt($rootScope.settings.USER_IS_CAPTCHA_ENABLED_FORGOT_PASSWORD)) {
            $scope.show_recaptcha = true;
        }
        $scope.save = function() {
            if ($scope.userForgotPassword.$valid && !$scope.save_btn) {
                var flashMessage;
                $scope.save_btn = true;
                usersForgotPassword.forgetPassword($scope.user, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flashMessage = $filter("translate")("We have sent an email to " + $scope.user.email + " with further instructions.");
                        flash.set(flashMessage, 'success', false);
                        $location.path('/users/login');
                    } else {
                        $scope.user = {};
                        $scope.save_btn = false;
                        flashMessage = $filter("translate")("There is no user registered with the email " + $scope.user.email + " or admin deactivated your account. If you spelled the address incorrectly or entered the wrong address, please try again.");
                        flash.set(flashMessage, 'error', false);
                    }
                });
            }
        };
    }]);