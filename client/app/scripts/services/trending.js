'use strict';
/**
 * @ngdoc service
 * @name Sns.trendingFactory
 * @description
 * # trendingFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('trendingFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos', {}, {
            get: {
                method: 'GET',
            }
        });
    }]);