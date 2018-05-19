'use strict';
/**
 * @ngdoc service
 * @name SnsApp.userProfile
 * @description
 * # userProfile
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('userSettings', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            delete: {
                method: 'delete',
                params: {
                    id: '@id'
                }
            }
        });
    }]);