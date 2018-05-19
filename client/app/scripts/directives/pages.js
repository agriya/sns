'use strict';
/**
 * @ngdoc directive
 * @name SnsApp.directive:pages
 * @description
 * # pages
 */
angular.module('SnsApp')
    .directive('pages', function(pages) {
        return {
            templateUrl: 'views/pages.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                //jshint unused:false
                var params = {
                    limit: 20,
                    is_active: true
                };
                pages.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        scope.pages = response.data;
                    }
                });
            }
        };
    });
angular.module('SnsApp')
    .directive('affixer', function($window) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                var win = angular.element($window);
                var topOffset = $element[0].offsetTop;

                function affixElement() {
                    if ($window.pageYOffset > topOffset) {
                        $element.css('position', 'fixed');
                        if ($('header')
                            .hasClass('headroom--pinned')) $element.css('top', '60px');
                        else $element.css('top', '0px');
                    } else {
                        $element.css('position', '');
                        $element.css('top', '');
                    }
                }
                $scope.$on('$routeChangeStart', function() {
                    win.unbind('scroll', affixElement);
                });
                win.bind('scroll', affixElement);
            }
        };
    });