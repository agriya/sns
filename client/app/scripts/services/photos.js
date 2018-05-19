'use strict';
/**
 * @ngdoc service
 * @name Sns.photosFactory
 * @description
 * # photosFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('PhotosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos', {}, {
            get: {
                method: 'GET',
            }
        });
    }])
    .factory('FlagCategoryFactory', ['$resource', function($resource) {
        return $resource('/api/v1/flag_categories', {}, {
            get: {
                method: 'GET'
            }
        });
}])
    .factory('FlagSaveFactory', ['$resource', function($resource) {
        return $resource('/api/v1/flags', {}, {
            create: {
                method: 'POST'
            }
        });
}])
    .factory('SearchPhotoFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photo_tags/:photoTagId/photos', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
}]);