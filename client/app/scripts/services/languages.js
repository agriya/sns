'use strict';
/**
 * @ngdoc service
 * @name SnsApp.languages
 * @description
 * # languages
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('languages', ['$resource', function($resource) {
        return $resource('/api/v1/languages', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);