'use strict';
/**
 * @ngdoc service
 * @name Sns.profileFactory
 * @description
 * # profileFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('ProfileFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
    }])
    .factory('PhotoFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:userId/photos', {}, {
            get: {
                method: 'GET',
                params: {
                    userId: '@userId'
                }
            }
        });
    }]);