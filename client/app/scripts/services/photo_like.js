'use strict';
/**
 * @ngdoc service
 * @name Sns.photoLikeFactory
 * @description
 * # photoLikeFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('PhotoLikeFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_likes', {}, {
            create: {
                method: 'POST',
            }
        });
    }])
    .factory('PhotoUnLikeFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_likes/:id', {}, {
            update: {
                method: 'delete',
                params: {
                    id: '@id'
                }
            }
        });
}]);