'use strict';
/**
 * @ngdoc service
 * @name SnsApp.usersProfile
 * @description
 * # usersProfile
 * Factory in the SnsApp.
 */
angular.module('SnsApp')
    .factory('usersProfile', function() {
        // Service logic
        // ...
        var meaningOfLife = 42;
        // Public API here
        return {
            someMethod: function() {
                return meaningOfLife;
            }
        };
    });