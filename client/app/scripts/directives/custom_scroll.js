'use strict';
/**
 * @ngdoc directive
 * @name SnsApp.directive:googleAnalytics
 * @description
 * # googleAnalytics
 */
angular.module('SnsApp')
    .directive('customScroll', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, iElement) {
                iElement.mCustomScrollbar({
                    autoHideScrollbar: false,
                    theme: "rounded-dark",
                    mouseWheel: {
                        scrollAmount: 188
                    },
                    autoExpandScrollbar: true,
                    snapAmount: 188,
                    snapOffset: 65,
                    advanced: {
                        updateOnImageLoad: true
                    },
                    keyboard: {
                        scrollType: "stepped"
                    },
                    scrollButtons: {
                        enable: true,
                        scrollType: "stepped"
                    }
                });
            }
        };
    });