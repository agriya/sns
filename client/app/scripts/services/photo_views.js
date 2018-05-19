'use strict';
/**
 * @ngdoc service
 * @name Sns.PhotoViewFactory
 * @description
 * # PhotoViewFactory
 * Factory in the Sns.
 */
angular.module('SnsApp')
    .factory('PhotoViewFactory', ['$resource', function($resource) {
        return $resource('/api/v1/photos/:id', {}, {
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
    }]);