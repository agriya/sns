'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UsersLogutCtrl
 * @description
 * # UsersLogutCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UsersLogoutCtrl', ['$scope', 'usersLogout', '$location', '$window', 'flash', '$filter', '$cookies', function($scope, usersLogout, $location, $window, flash, $filter, $cookies) {
        usersLogout.logout('', function(response) {
            $scope.response = response;
            if ($scope.response.error.code === 0) {
                $cookies.remove('auth', {
                    path: '/'
                });
                $cookies.remove('token', {
                    path: '/'
                });
                var flashMessage = $filter("translate")("You are now logged out of the site.");
                flash.set(flashMessage, 'success', false);
                $scope.$emit('updateParent', {
                    isAuth: false
                });
                $location.path('/');
            }
        });
    }]);