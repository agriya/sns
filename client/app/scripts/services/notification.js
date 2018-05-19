'use strict';
/**
 * @ngdoc service
 * @name Sns
 * @description
 * # notificationFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('notificationFactory', ['$resource', function($resource) {
        return $resource('/api/v1/activities', {}, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
        });
  }]);