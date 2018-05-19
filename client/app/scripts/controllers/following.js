'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:followingController
 * @description
 * # followingController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('followingController', ['$scope', '$rootScope', '$location', '$window', '$filter', '$state', 'md5', 'followingFactory', 'PhotoLikeFactory', 'flash', 'PhotoUnLikeFactory', '$uibModal', '$uibModalStack', function($scope, $rootScope, $location, $window, $filter, $state, md5, followingFactory, PhotoLikeFactory, flash, PhotoUnLikeFactory, $uibModal, $uibModalStack) {
        $scope.enabled = true;
        $scope.scroll_flag = true;
        $scope.lastpage = 2;
        $scope.photos = [];
        $scope.follow = [];
        $scope.currentpage = 1;
        //init Function
        $scope.init = function() {
            $uibModalStack.dismissAll();
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Following");
            $scope.getPhotos();
        };
        //Get UserPhotos
        $scope.getPhotos = function() {
            var params = {};
            params.sort = 'id';
            params.sortby = 'desc';
            params.filter = 'following';
            params.page = $scope.currentpage;
            followingFactory.get(params, function(response) {
                $scope.scroll_flag = true;
                if (angular.isDefined(response._metadata)) {
                    $scope.lastpage = response._metadata.last_page;
                    $scope.currentpage = response._metadata.current_page;
                }
                if (angular.isDefined(response.data)) {
                    var temp_photos = [];
                    var i = 0;
                    angular.forEach(response.data, function(photo) {
                        i++;
                        if (angular.isDefined(photo.user.attachment) && photo.user.attachment !== null) {
                            photo.user_avatar_url = 'images/small_thumb/UserAvatar/' + photo.user.id + '.' + md5.createHash('UserAvatar' + photo.user.id + 'png' + 'small_thumb') + '.png';
                        } else {
                            photo.user_avatar_url = 'images/profile_default_avatar.png';
                        }
                        photo.photos_url = 'images/medium_thumb/Photo/' + photo.id + '.' + md5.createHash('Photo' + photo.id + 'png' + 'medium_thumb') + '.png';
                        if (angular.isDefined(photo.photo_like) && photo.photo_like.length > 0) {
                            photo.is_like = true;
                            angular.forEach(photo.photo_like, function(photo_like) {
                                photo.like_id = photo_like.id;
                            });
                        } else {
                            photo.is_like = false;
                        }
                        if (angular.isDefined(photo.user.user_follow) && photo.user.user_follow !== null) {
                            angular.forEach(photo.user.user_follow, function(follow) {
                                {
                                    $scope.follow[photo.user.id] = {
                                        follow_id: follow.id,
                                        isfollow: true
                                    };
                                }
                            });
                        } else {
                            $scope.follow[photo.user.id] = {
                                follow_id: 0,
                                isfollow: false
                            };
                        }
                        if (angular.isDefined(photo.flag) && photo.flag.length > 0) {
                            photo.is_flag = true;
                        } else {
                            photo.is_flag = false;
                        }
                        temp_photos.push(photo);
                        if (temp_photos.length === 3 || i === response.data.length) {
                            $scope.photos.push(temp_photos);
                            temp_photos = [];
                        }
                    });
                }
            }, function(error) {
                $scope.scroll_flag = true;
            });
        };
        //pagination Function
        $scope.pagination = function() {
            if ($scope.enabled === true && $scope.scroll_flag === true) {
                if ($scope.currentpage <= $scope.lastpage) {
                    $scope.currentpage += 1;
                    $scope.scroll_flag = false;
                    $scope.getPhotos();
                } else {
                    $scope.enabled = false;
                }
            }
        };
        //Post PhotoLike        
        $scope.photoLike = function(photo) {
            var photo_index = $scope.photos.indexOf(photo);
            var params = {};
            params.photo_id = photo.id;
            PhotoLikeFactory.create(params, function(response) {
                if (response.error.code === 0) {
                    $scope.photos[photo_index].is_like = true;
                    $scope.photos[photo_index].like_id = response.id;
                }
            });
        };
        //Delete PhotoLike
        $scope.photoUnLike = function(photo) {
            var unlike_index = $scope.photos.indexOf(photo);
            var params = {};
            params.id = $scope.photos[unlike_index].like_id;
            PhotoUnLikeFactory.update(params, function(response) {
                if (response.error.code === 0) {
                    $scope.photos[unlike_index].is_like = false;
                }
            });
        };
        $scope.go = function(photo_user_id, photo_user_username) {
            $location.path('profile/' + photo_user_id + '/' + photo_user_username);
        };
        //init Triggered
        $scope.init();
        //photo model
        $scope.openPhotoModal = function(id, description, index, size, key) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")(description);
            var redirectto = {
                id: '',
                name: $state.current.name
            };
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/modal_photo_view.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'PhotoModalController',
                backdrop: 'static',
                size: size,
                windowClass: "js-photo-view",
                resolve: {
                    photoid: function() {
                        return id;
                    },
                    photoindex: function() {
                        return index;
                    },
                    photoKey: function() {
                        return key;
                    },
                    follow: function() {
                        return $scope.follow;
                    },
                    photos: function() {
                        return $scope.photos;
                    },
                    redirect: function() {
                        return redirectto;
                    }
                }
            });
        };
    }]);