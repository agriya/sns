'use strict';
/**
 * @ngdoc service
 * @name Sns.headerSearchFactory
 * @description
 * # headerSearchFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('headerSearchFactory', ['$resource', function($resource) {
        return $resource('/api/v1/search', {}, {
            get: {
                method: 'GET',
            }
        });
    }]);