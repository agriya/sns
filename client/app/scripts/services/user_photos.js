'use strict';
/**
 * @ngdoc service
 * @name Sns.page
 * @description
 * # page
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('UserPhotosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:userId/photos', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
  }]);