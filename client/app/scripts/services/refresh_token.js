'use strict';
/**
 * @ngdoc service
 * @name SnsApp.refreshToken
 * @description
 * # refreshToken
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('refreshToken', ['$resource', function($resource) {
        return $resource('/api/v1/oauth/refresh_token', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);