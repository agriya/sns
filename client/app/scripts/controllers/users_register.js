'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UsersRegisterCtrl
 * @description
 * # UsersRegisterCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UsersRegisterCtrl', ['$rootScope', '$scope', 'usersRegister', 'flash', '$location', '$timeout', '$filter', '$window', '$cookies', '$uibModalStack', function($rootScope, $scope, usersRegister, flash, $location, $timeout, $filter, $window, $cookies, $uibModalStack) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Register");
        $scope.save_btn = false;
        $scope.save = function() {
            if ($scope.userSignup.$valid && !$scope.save_btn) {
                var flashMessage;
                $scope.save_btn = true;
                usersRegister.create($scope.user, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        if (parseInt($rootScope.settings.USER_IS_AUTO_LOGIN_AFTER_REGISTER)) {
                            $cookies.put('token', $scope.response.access_token, {
                                path: '/'
                            });
                            $scope.$emit('updateParent', {
                                isAuth: true,
                                auth: $scope.response
                            });
                            flashMessage = $filter("translate")("You have successfully registered with our site.");
                            flash.set(flashMessage, 'success', false);
                            $location.path('/');
                        } else if (parseInt($rootScope.settings.USER_IS_EMAIL_VERIFICATION_FOR_REGISTER) && parseInt($rootScope.settings.USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER)) {
                            flashMessage = $filter("translate")("You have successfully registered with our site you can login after email verification and administrator approval. Your activation mail has been sent to your mail inbox.");
                            flash.set(flashMessage, 'success', false);
                        } else if (parseInt($rootScope.settings.USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER)) {
                            flashMessage = $filter("translate")("You have successfully registered with our site. After administrator approval you can login to site.");
                            flash.set(flashMessage, 'success', false);
                        } else if (parseInt($rootScope.settings.USER_IS_EMAIL_VERIFICATION_FOR_REGISTER)) {
                            flashMessage = $filter("translate")("You have successfully registered with our site and your activation mail has been sent to your mail inbox.");
                            flash.set(flashMessage, 'success', false);
                        }
                        $timeout(function() {
                            $location.path('/users/login');
                        }, 1000);
                    } else {
                        if (angular.isDefined($scope.response.error.fields) && angular.isDefined($scope.response.error.fields.unique)) {
                            flashMessage = $filter("translate")("Please choose different " + $scope.response.error.fields.unique.join());
                        } else {
                            flashMessage = $filter("translate")("User could not be added. Please, try again");
                        }
                        flash.set(flashMessage, 'error', false);
                        $scope.save_btn = false;
                    }
                });
            }
        };
    }]);