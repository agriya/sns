'use strict';
/**
 * @ngdoc service
 * @name Sns.page
 * @description
 * # page
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('designerFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users?filter=popular', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);