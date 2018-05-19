'use strict';
/**
 * @ngdoc service
 * @name SnsApp.oauthTokenInjector
 * @description
 * # sessionService
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('oauthTokenInjector', ['$window', '$cookies',
    function($window, $cookies) {
            var oauthTokenInjector = {
                request: function(config) {
                    if (config.url.indexOf('.html') === -1) {
                        if ($cookies.get("token") !== null) {
                            var sep = config.url.indexOf('?') === -1 ? '?' : '&';
                            config.url = config.url + sep + 'token=' + $cookies.get("token");
                        }
                    }
                    return config;
                }
            };
            return oauthTokenInjector;
}]);