'use strict';
/**
 * @ngdoc service
 * @name Sns
 * @description
 * # designerfollowingFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('designerfollowingFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users?filter=popular', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);