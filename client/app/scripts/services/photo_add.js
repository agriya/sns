'use strict';
/**
 * @ngdoc service
 * @name Sns.PhotoUploadFactory
 * @description
 * # PhotoUploadFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('PhotoUploadFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos', {}, {
            create: {
                method: 'POST'
            }
        });
}])
    .factory('PhototagFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_tags', {}, {
            get: {
                method: 'GET'
            }
        });
}])
    .factory('photoGetFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos/:id', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
    }]);