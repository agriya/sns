'use strict';
/**
 * @ngdoc service
 * @name SnsApp.providers
 * @description
 * # providers
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('providers', ['$resource', function($resource) {
        return $resource('/api/v1/providers', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);