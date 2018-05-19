'use strict';
/**
 * @ngdoc service
 * @name SnsApp.usersForgotPassword
 * @description
 * # usersForgotPassword
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('usersForgotPassword', ['$resource', function($resource) {
        return $resource('/api/v1/users/forgot_password', {}, {
            forgetPassword: {
                method: 'POST'
            }
        });
    }]);