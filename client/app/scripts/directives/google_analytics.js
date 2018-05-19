'use strict';
/**
 * @ngdoc directive
 * @name SnsApp.directive:googleAnalytics
 * @description
 * # googleAnalytics
 */
angular.module('SnsApp')
    .directive('googleAnalytics', function() {
        var linker = function(scope, element, attrs) {
            //jshint unused:false
            // do DOM Manipulation here			
        };
        return {
            restrict: 'AE',
            link: linker,
            replace: true,
            template: '<div ng-bind-html="googleAnalyticsCode | unsafe"></div>',
            controller: function($rootScope, $scope, TokenService) {
                //jshint unused:false
                var promise = TokenService.promise;
                var promiseSettings = TokenService.promiseSettings;
                promiseSettings.then(function(data) {
                    if ($rootScope.settings) {
                        $scope.googleAnalyticsCode = $rootScope.settings.SITE_TRACKING_SCRIPT;
                    }
                });
            },
            scope: {}
        };
    });