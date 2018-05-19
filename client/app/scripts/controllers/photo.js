'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:photoController
 * @description
 * #photoController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('photoController', ['$scope', '$rootScope', '$location', '$window', '$filter', '$state', '$stateParams', 'md5', 'flash', '$uibModal', 'PhotoFactory', 'UserUnfollowFactory', 'UserFollowFactory', 'PhotoViewFactory', 'PhotoLikeFactory', 'PhotoUnLikeFactory', 'photoCommentFactory', 'PhotoCommentSaveFactory', 'FlagSaveFactory', 'FlagCategoryFactory', '$uibModalStack', function($scope, $rootScope, $location, $window, $filter, $state, $stateParams, md5, flash, $uibModal, PhotoFactory, UserUnfollowFactory, UserFollowFactory, PhotoViewFactory, PhotoLikeFactory, PhotoUnLikeFactory, photoCommentFactory, PhotoCommentSaveFactory, FlagSaveFactory, FlagCategoryFactory, $uibModalStack) {
        $scope.init = function() {
            $scope.getphoto();
            $scope.follow = [];
            $scope.Comment();
            FlagCategoryFactory.get(function(response) {
                $scope.flagcategories = response.data;
            });
        };
        $scope.getphoto = function() {
            var params = {};
            params.photoId = $stateParams.id;
            PhotoFactory.get(params, function(response) {
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")(response.data.description);
                $scope.photo = response.data;
                if (angular.isDefined($scope.photo.user.attachment) && $scope.photo.user.attachment !== null) {
                    $scope.photo.user_avatar_url = 'images/small_thumb/UserAvatar/' + $scope.photo.user.attachment.foreign_id + '.' + md5.createHash('UserAvatar' + $scope.photo.user.attachment.foreign_id + 'png' + 'small_thumb') + '.png';
                } else {
                    $scope.photo.user_avatar_url = 'images/profile_default_avatar.png';
                }
                $scope.photo.photos_url = 'images/extra_large_thumb/Photo/' + $scope.photo.attachment.foreign_id + '.' + md5.createHash('Photo' + $scope.photo.attachment.foreign_id + 'png' + 'extra_large_thumb') + '.png';
                if (angular.isDefined($scope.photo.photo_like) && $scope.photo.photo_like.length > 0) {
                    $scope.photo.is_like = true;
                    angular.forEach($scope.photo.photo_like, function(photo_like) {
                        $scope.photo.like_id = photo_like.id;
                    });
                } else {
                    $scope.photo.is_like = false;
                }
                if (angular.isDefined($scope.photo.user.user_follow) && $scope.photo.user.user_follow.length > 0) {
                    angular.forEach($scope.photo.user.user_follow, function(follow) {
                        {
                            $scope.follow = {
                                follow_id: follow.id,
                                isfollow: true
                            };
                        }
                    });
                } else {
                    $scope.follow[$scope.photo.user.id] = {
                        follow_id: 0,
                        isfollow: false
                    };
                }
                if (angular.isDefined($scope.photo.flag) && $scope.photo.flag.length > 0) {
                    $scope.photo.is_flag = true;
                } else {
                    $scope.photo.is_flag = false;
                }
                $scope.taglabel.push('tag tag-1', 'tag tag-2', 'tag tag-3', 'tag tag-4', 'tag tag-5', 'tag tag-6', 'tag tag-7', 'tag tag-8', 'tag tag-9');
                //addding the label for each tags
                if (angular.isDefined($scope.photo.photos_photo_tag) && $scope.photo.photos_photo_tag !== null) {
                    var j = 0;
                    var count = 1;
                    angular.forEach($scope.photo.photos_photo_tag, function(tag) {
                        tag.label = $scope.taglabel[j];
                        j++;
                        count++;
                        if (count > 6) {
                            j = 0;
                            count = 1;
                        }
                    });
                } else {
                    PhotoViewFactory.get(params, function(response) {
                        $scope.photo = response.data;
                        $scope.getComment($scope.photo.id);
                    });
                }
            });
        };
        //Post PhotoLike        
        $scope.photoLike = function() {
            var params = {};
            params.photo_id = $scope.photo.id;
            PhotoLikeFactory.create(params, function(response) {
                if (response.error.code === 0) {
                    $scope.photo.is_like = true;
                    $scope.photo.like_id = response.data.id;
                    $scope.$emit('profileParent', {});
                    $scope.Count();
                }
            });
        };
        //Delete PhotoLike
        $scope.photoUnLike = function() {
            var params = {};
            params.id = $scope.photo.like_id;
            PhotoUnLikeFactory.update(params, function(response) {
                if (response.error.code === 0) {
                    $scope.photo.is_like = false;
                    $scope.Count();
                }
            });
        };
        //user follow function
        $scope.user_follow = function() {
            var user_id = $scope.photo.user.id;
            var params = {};
            params.other_user_id = user_id;
            UserFollowFactory.create(params, function(response) {
                if (response.error.code === 0) {
                    $scope.follow = {
                        follow_id: response.data.id,
                        isfollow: true
                    };
                    $scope.$emit('profileParent', {});
                }
            });
        };
        //user unfollow function
        $scope.user_unfollow = function(follow) {
            var user_id = $scope.photo.user_id;
            var params = {};
            params.id = follow.follow_id;
            UserUnfollowFactory.update(params, function(response) {
                if (response.error.code === 0) {
                    $scope.follow = {
                        follow_id: 0,
                        isfollow: false
                    };
                }
            });
        };
        //getting the comment
        $scope.Comment = function(photo_id) {
            photoCommentFactory.get({
                'id': $stateParams.id
            }, function(response) {
                $scope.comments = response.data;
            });
        };
        //getting the comment
        $scope.getComment = function(photo_id) {
            photoCommentFactory.get({
                'id': photo_id
            }, function(response) {
                $scope.comments = response.data;
            });
        };
        //user save comment function
        $scope.saveComment = function() {
            $scope.usercomment.photo_id = $scope.photo.id;
            PhotoCommentSaveFactory.create($scope.usercomment, function(response) {
                if (response.error.code === 0) {
                    $scope.usercomment.comment = null;
                    $scope.getComment(response.photo_id);
                    $scope.$emit('profileParent', {});
                    $scope.Count();
                }
            });
        };
        //opening flag model 
        $scope.openFlagModal = function(photo) {
            $scope.flagview = (photo.is_flag) ? 'js-flagged-view' : 'js-flag-view';
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/photoflagmodel.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'PhotoFlagModelController',
                windowClass: $scope.flagview,
                resolve: {
                    flagcategories: function() {
                        return $scope.flagcategories;
                    },
                    photo: function() {
                        return photo;
                    },
                    photoindex: function() {
                        return $scope.index;
                    },
                    photoKey: function() {
                        return $scope.photoKey;
                    },
                    photos: function() {
                        return $scope.photo;
                    }
                }
            });
        };
        //modal closing fucntion
        $scope.ModelCancel = function() {
            $uibModalStack.dismissAll();
            $location.path($scope.redirect);
        };
        //login function
        $scope.Login_func = function() {
            $uibModalStack.dismissAll();
            $location.path('/users/login');
        };
        //Like and Comment Count
        $scope.Count = function() {
            var params = {};
            params.id = $scope.photo.id;
            PhotoViewFactory.get(params, function(response) {
                var comment = response.data;
                $scope.photo.photo_like_count = comment.photo_like_count;
                $scope.photo.photo_comment_count = comment.photo_comment_count;
            });
        };
        $scope.init();
        //user follow function
    }]);