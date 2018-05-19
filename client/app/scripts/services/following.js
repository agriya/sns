'use strict';
/**
 * @ngdoc service
 * @name Sns.photosFactory
 * @description
 * # photosFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('followingFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos', {}, {
            get: {
                method: 'GET',
            }
        });
    }]);