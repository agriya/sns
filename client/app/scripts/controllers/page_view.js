'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:PageViewCtrl
 * @description
 * # PageViewCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('PageViewCtrl', ['$scope', '$rootScope', '$stateParams', 'page', 'flash', '$filter', function($scope, $rootScope, $stateParams, page, flash, $filter) {
            window.scroll(0, 0);
            var params = {};
            params.id = $stateParams.id;
            page.get(params, function(response) {
                if (angular.isDefined(response.data)) {
                    $scope.page = response.data;
                    $rootScope.header = $rootScope.settings.SITE_NAME + ' | Page - ' + $scope.page.title;
                    var _descriptions = ($scope.page.meta_description !== null && $scope.page.meta_description !== '') ? $scope.page.meta_description : $scope.page.title;
                    var _keywords = ($scope.page.meta_keywords !== null && $scope.page.meta_keywords !== '') ? $scope.page.meta_keywords : $scope.page.title;
                    angular.element('html head meta[name=description]')
                        .attr("content", _descriptions);
                    angular.element('html head meta[name=keywords]')
                        .attr("content", _keywords);
                    angular.element('html head meta[property="og:description"], html head meta[name="twitter:description"]')
                        .attr("content", _descriptions);
                    angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]')
                        .attr("content", $rootScope.header);
                    angular.element('html head meta[property="og:image"], html head meta[name="twitter:image"]')
                        .attr("content", 'img/logo.png');
                    angular.element('meta[property="og:url"], html head meta[name="twitter:url"]')
                        .attr('content', "/pages/" + $stateParams.id);
                } else {
                    var flashMessage = $filter("translate")("Invalid request.");
                    flash.set(flashMessage, 'error', false);
                }
            });
    }
]);