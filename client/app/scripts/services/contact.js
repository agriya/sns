'use strict';
/**
 * @ngdoc service
 * @name SnsApp.contact
 * @description
 * # contact
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('contact', ['$resource', function($resource) {
        return $resource('/api/v1/contacts', {}, {
            create: {
                method: 'POST'
            }
        });
    }]);