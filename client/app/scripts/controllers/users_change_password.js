'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UsersChangePasswordCtrl
 * @description
 * # UsersChangePasswordCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UsersChangePasswordCtrl', ['$rootScope', '$scope', 'flash', 'usersChangePassword', '$filter', '$window', '$state', '$cookies', function($rootScope, $scope, flash, usersChangePassword, $filter, $window, $state, $cookies) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Change Password");
        $scope.inputType = 'password';
        $scope.password_tab = 'active';
        $scope.save = function() {
            if ($scope.userChangePassword.$valid) {
                var flashMessage;
                $scope.changePassword.id = $rootScope.user.id;
                $scope.changePassword.repeat_password = $scope.changePassword.new_password;
                usersChangePassword.changePassword($scope.changePassword, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        if (parseInt($rootScope.settings.USER_IS_LOGOUT_AFTER_CHANGE_PASSWORD)) {
                            $cookies.remove('auth', {
                                path: '/'
                            });
                            $cookies.remove('token', {
                                path: '/'
                            });
                            $scope.$emit('updateParent', {
                                isAuth: false
                            });
                            flashMessage = $filter("translate")("Your password has been changed successfully. Please login now");
                            flash.set(flashMessage, 'success', false);
                            $state.go('users_login');
                        } else {
                            flashMessage = $filter("translate")("Password has been changed successfully.");
                            flash.set(flashMessage, 'success', false);
                            $state.reload('users_change_password');
                        }
                    } else {
                        flashMessage = $filter("translate")("Password could not be changed.");
                        flash.set(flashMessage, 'error', false);
                    }
                });
            }
        };
        $scope.hideShowPassword = function() {
            if ($scope.inputType == 'password') $scope.inputType = 'text';
            else $scope.inputType = 'password';
        };
    }]);