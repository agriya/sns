'use strict';
/**
 * @ngdoc service
 * @name SnsApp.getGateways
 * @description
 * # getGateways
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('StatFactory', ['$resource', function($resource) {
        return $resource('/api/v1/stats', {}, {
            get: {
                method: 'GET'
            }
        });
}]);