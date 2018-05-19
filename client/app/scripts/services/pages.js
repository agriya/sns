'use strict';
/**
 * @ngdoc service
 * @name SnsApp.page
 * @description
 * # page
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('pages', ['$resource', function($resource) {
        return $resource('/api/v1/pages', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);