'use strict';
/**
 * @ngdoc filter
 * @name SnsApp.filter:dateFormat
 * @function
 * @description
 * # dateFormat
 * Filter in the SnsApp.
 */
angular.module('SnsApp')
    .filter('medium', function myDateFormat($filter) {
        return function(text) {
            var tempdate = new Date(text.replace(/(.+) (.+)/, "$1T$2Z"));
            return $filter('date')(tempdate, "medium");
        };
    });