'use strict';
/**
 * @ngdoc service
 * @name Sns.photocommentFactory
 * @description
 * # photoCommentFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('photoCommentFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos/:id/photo_comments', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
    }])
    .factory('PhotoCommentSaveFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_comments', {}, {
            create: {
                method: 'POST',
            }
        });
    }]);