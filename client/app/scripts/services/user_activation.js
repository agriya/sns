'use strict';
/**
 * @ngdoc service
 * @name SnsApp.userActivation
 * @description
 * # userActivation
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('userActivation', ['$resource', function($resource) {
        return $resource('/api/v1/users/:user_id/activation/:hash', {}, {
            activation: {
                method: 'PUT',
                params: {
                    user_id: '@user_id',
                    hash: '@hash'
                }
            }
        });
  }]);