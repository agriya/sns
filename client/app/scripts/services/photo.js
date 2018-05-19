'use strict';
/**
 * @ngdoc service
 * @name Sns.PhotoViewFactory
 * @description
 * # PhotoViewFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('PhotoFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos/:photoId', {}, {
            get: {
                method: 'GET',
                params: {
                    photoId: '@photoId'
                }
            }
        });
    }]);