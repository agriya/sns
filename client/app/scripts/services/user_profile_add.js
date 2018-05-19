'use strict';
/**
 * @ngdoc service
 * @name Sns.userAvatarFactory
 * @description
 * # userAvatarFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('userAvatarFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
}]);