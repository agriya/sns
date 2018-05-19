'use strict';
/**
 * @ngdoc service
 * @name Sns.UserfollowingFactory
 * @description
 * # UserfollowingFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')    
.factory('UserfollowingFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:userId/user_follows', {}, {
            get: {
                method: 'GET',
                params: {
                    userId: '@userId'
                }
            }
        });
    }]);     