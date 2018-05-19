'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:profileController
 * @description
 * # profileController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('profileController', ['$scope', '$rootScope', '$location', '$window', '$filter', '$stateParams', 'md5', 'ProfileFactory', 'PhotoFactory', 'PhotoUnLikeFactory', 'PhotoLikeFactory', 'Upload', '$state', 'UserFollowFactory', 'UserUnfollowFactory', '$uibModal', '$uibModalStack', function($scope, $rootScope, $location, $window, $filter, $stateParams, md5, ProfileFactory, PhotoFactory, PhotoUnLikeFactory, PhotoLikeFactory, Upload, $state, UserFollowFactory, UserUnfollowFactory, $uibModal, $uibModalStack) {
        //variable declaration 
        $scope.enabled = true;
        $scope.user_id = $stateParams.id;
        $scope.user_name = $stateParams.slug;
        $scope.photos = [];
        $scope.follow = [];
        $scope.scroll_flag = true;
        $scope.lastpage = 2;
        $scope.currentpage = 1;
        //init function
        $scope.init = function() {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")($scope.user_name);
            $uibModalStack.dismissAll();
            $scope.getUserDetail();
            $scope.getPhotos();
        };
        $scope.getRandomizer = function(bottom, top) {
            return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
        };
        // FIle upload 
        $scope.upload = function(file, type) {
            $scope.attachment = {};
            Upload.upload({
                    url: '/api/v1/attachments',
                    data: {
                        class: type,
                        file: file
                    }
                })
                .then(function(response) {
                    if (type === 'UserCoverPhoto') {
                        $scope.attachment.cover_photo = response.data.attachment;
                    } else if (type === 'UserAvatar') {
                        $scope.attachment.image = response.data.attachment;
                    }
                    $scope.UserAvatarUpload(type);
                });
        };
        //Put UserAvatarUpload
        $scope.UserAvatarUpload = function(type) {
            $scope.attachment.id = $rootScope.user.id;
            ProfileFactory.update($scope.attachment, function(response) {
                if (response.error.code === 0) {
                    if (type === 'UserCoverPhoto') {
                        $scope.user.user_coverphoto_url = 'images/big_large_thumb/UserCoverPhoto/' + $scope.user.id + '.' + md5.createHash('UserCoverPhoto' + $scope.user.id + 'png' + 'big_large_thumb') + '.png' + '?dyn=' + $scope.getRandomizer(100, 9999);
                        $rootScope.user.cover_photo = response.data.cover_photo;
                    } else if (type === 'UserAvatar') {
                        $scope.user.user_avatar_url = 'images/big_normal_thumb/UserAvatar/' + $scope.user.id + '.' + md5.createHash('UserAvatar' + $scope.user.id + 'png' + 'big_normal_thumb') + '.png' + '?dyn=' + $scope.getRandomizer(100, 9999);
                        $rootScope.user.attachment = response.data.attachment;
                    }
                    $scope.$emit('updateParent', {
                        isAuth: true,
                        auth: response.data
                    });
                    $state.reload();
                }
            });
        };
        //Get UserAvatar & CoverPhoto
        $scope.getUserDetail = function() {
            var params = {};
            params.id = $scope.user_id;
            ProfileFactory.get(params, function(response) {
                $scope.user = response.data;
                if (angular.isDefined($scope.user.user_follow) && $scope.user.user_follow !== null) {
                    angular.forEach($scope.user.user_follow, function(follow) {
                        $scope.user.follow_id = follow.id;
                        $scope.user.isfollow = true;
                    });
                } else {
                    $scope.user.isfollow = false;
                }
                if (angular.isDefined($scope.user.attachment) && $scope.user.attachment !== null) {
                    $scope.user.user_avatar_url = 'images/big_normal_thumb/UserAvatar/' + $scope.user.id + '.' + md5.createHash('UserAvatar' + $scope.user.id + 'png' + 'big_normal_thumb') + '.png' + '?dyn=' + $scope.getRandomizer(100, 9999);
                } else {
                    $scope.user.user_avatar_url = 'images/profile_default_avatar.png';
                }
                if (angular.isDefined($scope.user.cover_photo) && $scope.user.cover_photo !== null) {
                    $scope.user.user_coverphoto_url = 'images/big_large_thumb/UserCoverPhoto/' + $scope.user.id + '.' + md5.createHash('UserCoverPhoto' + $scope.user.id + 'png' + 'big_large_thumb') + '.png' + '?dyn=' + $scope.getRandomizer(100, 9999);
                } else {
                    $scope.user.user_coverphoto_url = 'images/profile-banner.png';
                }
            });
        };
        //Get UserPhotos
        $scope.getPhotos = function() {
            var params = {};
            params.user_id = $scope.user_id;
            params.page = $scope.currentpage;
            PhotoFactory.get(params, function(response) {
                if (angular.isDefined(response._metadata)) {
                    $scope.scroll_flag = true;
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
                        if (angular.isDefined(photo.photo_flag) && photo.photo_flag.length > 0) {
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
        //user follow function
        $scope.user_follow = function(user) {
            $scope.follow = {};
            $scope.follow.other_user_id = user.id;
            UserFollowFactory.create($scope.follow, function(response) {
                if (response.error.code === 0) {
                    $scope.user.isfollow = true;
                    $scope.user.follow_id = response.data.id;
                }
            });
        };
        //user unfollow function
        $scope.user_unfollow = function(user) {
            var params = {};
            params.id = user.follow_id;
            UserUnfollowFactory.update(params, function(response) {
                if (response.error.code === 0) {
                    $scope.user.isfollow = false;
                }
            });
        };
        //following Function
        $scope.following = function() {
            angular.element('#following')
                .html('UnFollow');
        };
        //unfollow Function
        $scope.unfollow = function() {
            angular.element('#following')
                .html('Following');
        };
        //pagination function
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
        //init triggered
        $scope.init();
        //photo model
        $scope.openPhotoModal = function(id, description, index, size, key) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")(description);
            var param = $state.params;
            var redirectto = {
                id: param.id,
                slug: param.slug,
                name: $state.current.name
            };
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/modal_photo_view.html',
                windowTemplateUrl: 'views/window_modal.html',
                backdrop: 'static',
                animation: false,
                controller: 'PhotoModalController',
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
       
       $scope.user_follower = function(user) {                
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/user_follower.html',
                controller: 'userFollowerController',
                resolve: {
                    user: function() {
                        return user;
                    }
                }
            });
        };
        $scope.user_following = function(user) {                  
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/user_following.html',
                controller: 'userFollowingController',
                resolve: {
                    user: function() {
                        return user;
                    }
                }
            });
        };

    }]);