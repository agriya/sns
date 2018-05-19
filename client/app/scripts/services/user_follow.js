'use strict';
/**
 * @ngdoc service
 * @name Sns.UserFollowFactory
 * @description
 * # UserFollowFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('UserUnfollowFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_follows/:id', {}, {
            update: {
                method: 'delete',
                params: {
                    id: '@id'
                }
            }
        });
}])
    .factory('UserFollowFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_follows', {}, {
            create: {
                method: 'POST',
            }
        });
    }]);