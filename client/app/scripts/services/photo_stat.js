'use strict';
/**
 * @ngdoc service
 * @name Sns.photoLikeFactory
 * @description
 * # photoLikeFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('photoStatsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_views', {}, {
            create: {
                method: 'POST',
            }
        });
    }]);