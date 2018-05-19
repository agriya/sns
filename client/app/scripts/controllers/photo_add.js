'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:PhotoaddController
 * @description
 * # PhotoaddController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('PhotoaddController', ['$scope', '$rootScope', '$stateParams', 'PhotoUploadFactory', 'PhototagFactory', 'flash', 'Upload', '$filter', '$state', '$uibModalStack', '$timeout', function($scope, $rootScope, $stateParams, PhotoUploadFactory, PhototagFactory, flash, Upload, $filter, $state, $uibModalStack, $timeout) {
        $scope.newEntry = [];
        //init function
        $scope.init = function() {
            $scope.photo_show = false;
            $scope.attachment = {};
            $scope.tags = [];
        };
        //autocomplete tag input  
        $scope.loadTags = function(query) {
            return PhototagFactory.get({
                    q: query,
                    fields: 'name'
                })
                .$promise.then(function(response) {
                    if (angular.isDefined(response.data) && response.data.length > 0) {
                        $scope.newEntry = [];
                        angular.forEach(response.data, function(tag) {
                            $scope.newEntry.push({
                                'text': tag.name
                            });
                        });
                    }
                    return $scope.newEntry;
                });
        };
        //user photo upload function
        $scope.PhotoUpload = function() {
            $scope.value = [];
            angular.forEach($scope.tags, function(tag) {
                $scope.value.push(tag.text);
                $scope.attachment.tags = $scope.value.join();
            });
            PhotoUploadFactory.create($scope.attachment, function(response) {
                if (response.error.code === 0) {
                    $uibModalStack.dismissAll();
                    $state.reload();
                }
            });
        };
        //user photo attachment function
        $scope.upload = function(file) {
            Upload.upload({
                    url: '/api/v1/attachments',
                    data: {
                        class: 'photo',
                        file: file,
                    }
                })
                .then(function(response) {
                    $scope.attachment.image = response.data.attachment;
                    $scope.photo_show = true;
                    var res =  $scope.attachment.image.split(".");
                    $scope.imagepop = res.pop();
                    var image_extensions=['jpeg', 'jpg', 'tiff', 'exif', 'gif', 'bmp', 'png', 'ppm', 'pgm', 'pbm', 'pnm','tif'];
                    var image_extension=image_extensions.indexOf($scope.imagepop);
                    if(image_extension == -1){
                        $scope.video_show = true;
                    }
                    else{
                        $scope.video_show = false;
                    }
                    angular.element('.modal-dialog')
                        .removeClass('modal-md')
                        .addClass('modal-lg');
                });
        };
        //upload model closing function
        $scope.ModelCancel = function() {
            $uibModalStack.dismissAll();
        };
        $scope.init();
    }]);