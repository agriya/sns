'use strict';
/**
 * @ngdoc service
 * @name SnsApp.usersLogout
 * @description
 * # usersLogout
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('usersLogout', ['$resource', function($resource) {
        return $resource('/api/v1/users/logout', {}, {
            logout: {
                method: 'GET'
            }
        });
    }]);