'use strict';
/**
 * @ngdoc directive
 * @name SnsApp.directive:languages
 * @description
 * # languages
 */
angular.module('SnsApp')
    .directive('languages', function(languages) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'views/languages.html',
            controller: function($rootScope, $scope) {
                if (parseInt($rootScope.settings.USER_IS_ALLOW_SWITCH_LANGUAGE)) {
                    $scope.show_language = true;
                    languages.get('', function(response) {
                        if (angular.isDefined(response.data)) {
                            $scope.languages = response.data;
                        }
                    });
                }
            },
        };
    });