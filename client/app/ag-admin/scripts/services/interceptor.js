'use strict';
/**
 * @ngdoc service
 * @name SnsApp.sessionService
 * @description
 * # sessionService
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('interceptor', ['$q', '$location', '$injector', '$window', '$cookies', function($q, $location, $injector, $window, $cookies) {
        return {
            // On response success
            response: function(response) {
                if (angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data.error_message) && parseInt(response.data.error) === 1 && response.data.error_message === 'Authentication failed') {
                        $cookies.remove('auth', {
                            path: '/'
                        });
                        $cookies.remove('token', {
                            path: '/'
                        });
                        window.location = "/users/login";
                    }
                }
                // Return the response or promise.
                return response || $q.when(response);
            },
            // On response failture
            responseError: function(response) {
                if (response.status === 401) {
                    $cookies.remove('auth', {
                        path: '/'
                    });
                    $cookies.remove('token', {
                        path: '/'
                    });
                    window.location = "/users/login";
                }
                // Return the promise rejection.
                return $q.reject(response);
            },
            request: function(config) {
                if (/\/user_cash_withdrawals$/.test(config.url) && !config.params && config.method !== 'POST') {
                    config.url += '/2';
                }
                return config;
            },
        };
    }]);