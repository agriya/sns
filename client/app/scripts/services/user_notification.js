'use strict';
/**
 * @ngdoc service
 * @name SnsApp.userProfile
 * @description
 * # userProfile
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('userNotificationFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_notification_settings/:id', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
    }]);