'use strict';
/**
 * @ngdoc service
 * @name SnsApp.usersChangePassword
 * @description
 * # usersChangePassword
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('usersChangePassword', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id/change_password', {}, {
            changePassword: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
    }]);