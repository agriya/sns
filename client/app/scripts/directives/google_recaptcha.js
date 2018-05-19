'use strict';
/**
 * @ngdoc directive
 * @name SnsApp.directive:googleRecaptcha
 * @description
 * # googleRecaptcha
 */
angular.module('SnsApp')
    .directive('googleRecaptcha', 'vcRecaptchaService', function(vcRecaptchaService) {
        return {
            restrict: 'C',
            scope: true,
            template: '<div vc-recaptcha theme="\'light\'" key="model.key" on-create="setWidgetId(widgetId)" on-success="setResponse(response)" on-expire="cbExpiration()"></div>',
            controller: function($rootScope, $scope) {
                $scope.model = {
                    key: $rootScope.settings.GOOGLE_RECAPTCHA_CODE
                };
                $scope.setResponse = function(response) {
                    $scope.response = response;
                };
                $scope.setWidgetId = function(widgetId) {
                    $scope.widgetId = widgetId;
                };
                $scope.cbExpiration = function() {
                    vcRecaptchaService.reload($scope.widgetId);
                    $scope.response = null;
                };
            },
        };
    });