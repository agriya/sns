'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UsersLoginCtrl
 * @description
 * # UsersLoginCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UsersLoginCtrl', ['$rootScope', '$scope', 'usersLogin', 'providers', '$auth', 'flash', '$window', '$location', '$filter', '$cookies', '$uibModalStack', '$timeout', function($rootScope, $scope, usersLogin, providers, $auth, flash, $window, $location, $filter, $cookies, $uibModalStack, $timeout) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Login");
        $scope.init = function() {
            $timeout(function() {
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Login");
            }, 100);
        }
        if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            $rootScope.$emit('updateParent', {
                isAuth: true,
                auth: JSON.parse($cookies.get("auth"))
            });
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | Home';
            $location.path('/');
        }
        $scope.save_btn = false;
        $scope.save = function() {
            if ($scope.userLogin.$valid) {
                $scope.save_btn = true;
                usersLogin.login($scope.user, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        $cookies.put('token', $scope.response.access_token, {
                            path: '/'
                        });
                        $rootScope.$emit('updateParent', {
                            isAuth: true,
                            auth: $scope.response
                        });
                        $uibModalStack.dismissAll();
                        if ($cookies.get("redirect_url") !== null && $cookies.get("redirect_url") !== undefined) {
                            $location.path($cookies.get("redirect_url"));
                            $cookies.remove('redirect_url', {
                                path: '/'
                            });
                        } else {
                            $location.path('/');
                        }
                    } else {
                        flash.set(response.error.message, 'error', false);
                        $scope.save_btn = false;
                    }
                });
            }
        };
        $scope.authenticate = function(provider) {
            $auth.authenticate(provider);
        };
        var params = {};
        params.fields = 'name,icon_class,slug,button_class';
        params.is_active = true;
        providers.get(params, function(response) {
            $scope.providers = response.data;
        });
        $scope.init();
    }]);