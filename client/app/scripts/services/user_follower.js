'use strict';
/**
 * @ngdoc service
 * @name Sns.UserfollowerFactory
 * @description
 * # UserfollowerFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')    
.factory('UserfollowerFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:userId/user_followings', {}, {
            get: {
                method: 'GET',
                params: {
                    userId: '@userId'
                }
            }
        });
    }]);   