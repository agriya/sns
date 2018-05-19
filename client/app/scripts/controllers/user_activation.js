'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UserActivationCtrl
 * @description
 * # UserActivationCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UserActivationCtrl', ['$rootScope', '$scope', '$location', 'flash', 'userActivation', '$stateParams', '$filter', '$window', '$cookies', function($rootScope, $scope, $location, flash, userActivation, $stateParams, $filter, $window, $cookies) {
        var element = {};
        var flashMessage;
        element.user_id = $stateParams.user_id;
        element.hash = $stateParams.hash;
        userActivation.activation(element, function(data) {
            $scope.data = data;
            if ($scope.data.error.code === 0) {
                if (parseInt($rootScope.settings.USER_IS_AUTO_LOGIN_AFTER_REGISTER)) {
                    $cookies.put('token', $scope.response.access_token, {
                        path: '/'
                    });
                    $scope.$emit('updateParent', {
                        isAuth: true,
                        auth: $scope.response
                    });
                    flashMessage = $filter("translate")("You have successfully activated and logged in to your account.");
                    flash.set(flashMessage, 'success', false);
                    $location.path('/');
                } else if (parseInt($rootScope.settings.USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER)) {
                    flashMessage = $filter("translate")("You have successfully activated your account. But you can login after admin activate your account.");
                    flash.set(flashMessage, 'success', false);
                    $location.path('/');
                } else {
                    flashMessage = $filter("translate")("You have successfully activated your account. Now you can login.");
                    flash.set(flashMessage, 'success', false);
                    $location.path('/users/login');
                }
            } else {
                flashMessage = $filter("translate")("Invalid activation request.");
                flash.set(flashMessage, 'error', false);
            }
        });
  }]);