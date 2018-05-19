'use strict';
/**
 * @ngdoc service
 * @name Sns
 * @description
 * # recentFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('designerRecentFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users?filter=popular', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);