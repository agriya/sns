'use strict';
/**
 * @ngdoc service
 * @name SnsApp.usersLogin
 * @description
 * # usersLogin
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('usersLogin', ['$resource', function($resource) {
        return $resource('/api/v1/users/login', {}, {
            login: {
                method: 'POST'
            }
        });
    }]);