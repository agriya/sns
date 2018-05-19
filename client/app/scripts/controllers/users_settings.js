'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:UsersSettingsCtrl
 * @description
 * # UsersSettingsCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('UsersSettingsCtrl', ['$rootScope', '$scope', 'userSettings', 'flash', '$filter', function($rootScope, $scope, userSettings, flash, $filter) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Users Settings");
        $scope.place = null;
        $scope.autocompleteOptions = {
            types: ['cities']
        };
        $scope.save = function() {
            if ($scope.userSettings.$valid) {
                var flashMessage;
                if (typeof($scope.place) !== 'string' && $scope.place !== null) {
                    $scope.user.latitude = $scope.place.geometry.location.lat();
                    $scope.user.longitude = $scope.place.geometry.location.lng();
                    $scope.user.address = $scope.place.formatted_address;
                    $scope.user.address1 = $scope.place.name;
                    angular.forEach($scope.place.address_components, function(value) {
                        if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                            $scope.user.city_name = value.long_name;
                        }
                        if (value.types[0] === 'administrative_area_level_1') {
                            $scope.user.state_name = value.long_name;
                        }
                        if (value.types[0] === 'country') {
                            $scope.user.country_iso2 = value.short_name;
                        }
                    });
                }
                $scope.user.id = $rootScope.user.id;
                userSettings.update($scope.user, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flashMessage = $filter("translate")("User Profile has been updated.");
                        flash.set(flashMessage, 'success', false);
                    } else {
                        flashMessage = $filter("translate")(response.error.message);
                        flash.set(flashMessage, 'error', false);
                    }
                });
            }
        };
        $scope.index = function() {
            $scope.profile_tab = 'active';
            var params = {};
            params.id = $rootScope.user.id;
            userSettings.get(params, function(response) {
                //$scope.user = response.data;
                $scope.user = {};
                $scope.user.first_name = response.data.first_name;
                $scope.user.middle_name = response.data.middle_name;
                $scope.user.last_name = response.data.last_name;
                $scope.user.email = response.data.email;
                $scope.user.website = response.data.website;
                $scope.user.about_me = response.data.about_me;
                $scope.user.educations = response.data.educations;
                $scope.user.recognitions = response.data.recognitions;
                $scope.user.brands = response.data.brands;
                if (angular.isDefined(response.data.city) && response.data.city !== null) {
                    $scope.user.city_name = response.data.city.name;
                } else {
                    $scope.user.city_name = "";
                }
                if (angular.isDefined(response.data.latitude) && response.data.latitude !== null) {
                    $scope.user.latitude = response.data.latitude;
                } else {
                    $scope.user.latitude = "";
                }
                if (angular.isDefined(response.data.longitude) && response.data.longitude !== null) {
                    $scope.user.longitude = response.data.longitude;
                } else {
                    $scope.user.longitude = "";
                }
                if (angular.isDefined(response.data.address) && response.data.address !== null) {
                    $scope.user.address = response.data.address;
                    $scope.place = $scope.user.address;
                } else {
                    $scope.user.address = "";
                }
                if (angular.isDefined(response.data.address1) && response.data.address1 !== null) {
                    $scope.user.address1 = response.data.address1;
                } else {
                    $scope.user.address1 = "";
                }
                if (angular.isDefined(response.data.state) && response.data.state !== null) {
                    $scope.user.state_name = response.data.state.name;
                } else {
                    $scope.user.state_name = "";
                }
                if (angular.isDefined(response.data.country) && response.data.country !== null) {
                    $scope.user.country_iso2 = response.data.country.iso_alpha2;
                } else {
                    $scope.user.country_iso2 = "";
                }
            });
        };
        $scope.index();
    }]);