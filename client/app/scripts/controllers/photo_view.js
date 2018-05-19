'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:photoController
 * @description
 * # photoController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('photoController', ['$scope', '$rootScope', '$location', '$window', '$stateParams', '$state', '$filter', 'PhotoViewFactory', '$uibModal', function($scope, $rootScope, $location, $window, $stateParams, $state, $filter, PhotoViewFactory, $uibModal) {
        $scope.init = function() {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Photo View");
            $scope.id = $stateParams.id;
            $scope.index = $stateParams.index;
            $scope.openPhotoModal();
        };
        $scope.openPhotoModal = function() {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/modal_photo_view.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'PhotoModalController',
                resolve: {
                    photoid: function() {
                        return $scope.id;
                    },
                    photoindex: function() {
                        return $scope.index;
                    },
                    photos: function() {
                        return $scope.photos;
                    }
                }
            });
            $scope.modalInstance.result.finally(function() {
                $state.go('home');
            });
        };
        $scope.init();
    }]);