'use strict';
/**
 * @ngdoc directive
 * @name sheermeApp.directive:pages
 * @description
 * # pages
 */
angular.module('SnsApp')
    .directive('changepicture', function() {
        return {
            templateUrl: 'views/changephoto.html',
            restrict: 'A',
            replace: true,
            scope: {
                position: '@position'
            },
            controller: function($scope, $rootScope) {}
        };
    });