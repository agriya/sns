'use strict';
/**
 * @ngdoc service
 * @name SnsApp.page
 * @description
 * # page
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('page', ['$resource', function($resource) {
        return $resource('/api/v1/pages/:id', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
    }]);