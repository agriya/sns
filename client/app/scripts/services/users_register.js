'use strict';
/**
 * @ngdoc service
 * @name SnsApp.usersRegister
 * @description
 * # usersRegister
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('usersRegister', ['$resource', function($resource) {
        return $resource('/api/v1/users/register', {}, {
            create: {
                method: 'POST'
            }
        });
    }]);