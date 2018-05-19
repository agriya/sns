'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('ContactCtrl', ['$rootScope', '$scope', 'contact', 'flash', '$filter', function($rootScope, $scope, contact, flash, $filter) {
        $scope.save_btn = false;
        $scope.save = function() {
            if ($scope.contactForm.$valid) {
                var flashMessage;
                $scope.save_btn = true;
                contact.create($scope.contact, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flashMessage = $filter("translate")("We will contact you shortly.");
                        flash.set(flashMessage, 'success', false);
                        $scope.contact = {};
                        $scope.save_btn = false;
                    } else {
                        flash.set(response.error.message, 'error', false);
                        $scope.save_btn = false;
                    }
                });
            }
        };
    }]);