'use strict';
angular.module('SnsApp')
    .controller('designerPhotoModalController', ['$scope', 'photoid', 'photoindex', 'photoKey', 'photos', 'follow', 'redirect', '$rootScope', '$stateParams', '$filter', 'PhotoViewFactory', 'photoCommentFactory', 'PhotoCommentSaveFactory', 'UserFollowFactory', 'UserUnfollowFactory', 'md5', '$location', '$uibModalStack', 'FlagCategoryFactory', 'FlagSaveFactory', '$uibModal', 'PhotoLikeFactory', 'PhotoUnLikeFactory', '$state', 'photoStatsFactory', '$timeout', function($scope, photoid, photoindex, photoKey, photos, follow, redirect, $rootScope, $stateParams, $filter, PhotoViewFactory, photoCommentFactory, PhotoCommentSaveFactory, UserFollowFactory, UserUnfollowFactory, md5, $location, $uibModalStack, FlagCategoryFactory, FlagSaveFactory, $uibModal, PhotoLikeFactory, PhotoUnLikeFactory, $state, photoStatsFactory, $timeout) {
        var params = {};
        $scope.data = {
            prev_key: -1,
            prev_index: -1,
            prev_id: -1,
            current_key: -1,
            current_index: -1,
            current_id: -1,
            next_key: -1,
            next_index: -1,
            next_id: -1
        };
        $scope.viewphotos = [];
        $scope.flag = {};
        $scope.taglabel = [];
        $scope.init = function() {
            params.id = photoid;
            $scope.photo_id = photoid;
            $scope.index = photoindex;
            $scope.photoKey = photoKey;
            $scope.redirect = redirect;
            $scope.photos = photos;
            $scope.follow = follow;
            $scope.loadPhoto();
            $scope.indexOfRowContainingId();
            FlagCategoryFactory.get(function(response) {
                $scope.flagcategories = response.data;
            });
            $state.go('photo_view', {
                id: params.id
            }, {
                notify: false,
            });
        };
        $scope.loadPhoto = function() {
            if ($scope.photos[$scope.photoKey].photos[$scope.index].id === parseInt(params.id)) {
                $scope.viewphotos = $scope.photos[$scope.photoKey].photos[$scope.index];
                $scope.viewphotos.username = $scope.photos[$scope.photoKey].username;
                $scope.photoView($scope.viewphotos.id);
                $scope.getComment($scope.viewphotos.id);
                if (angular.isDefined($scope.photos[$scope.photoKey].attachment) && $scope.photos[$scope.photoKey].attachment !== null) {
                    $scope.viewphotos.user_avatar_url = 'images/small_thumb/UserAvatar/' + $scope.photos[$scope.photoKey].id + '.' + md5.createHash('UserAvatar' + $scope.photos[$scope.photoKey].id + 'png' + 'small_thumb') + '.png';
                } else {
                    $scope.viewphotos.user_avatar_url = 'images/profile_default_avatar.png';
                }
                $scope.viewphotos.photo_url = 'images/large_thumb/Photo/' + $scope.viewphotos.id + '.' + md5.createHash('Photo' + $scope.viewphotos.id + 'png' + 'large_thumb') + '.png';
                $scope.taglabel.push('tag tag-1', 'tag tag-2', 'tag tag-3', 'tag tag-4', 'tag tag-5', 'tag tag-6', 'tag tag-7', 'tag tag-8', 'tag tag-9');
                //addding the label for each tags
                if (angular.isDefined($scope.viewphotos.photos_photo_tag) && $scope.viewphotos.photos_photo_tag !== null) {
                    var j = 0;
                    var count = 1;
                    angular.forEach($scope.viewphotos.photos_photo_tag, function(tag) {
                        tag.label = $scope.taglabel[j];
                        j++;
                        count++;
                        if (count > 6) {
                            j = 0;
                            count = 1;
                        }
                    });
                }
            } else {
                PhotoViewFactory.get(params, function(response) {
                    $scope.photos[$scope.photoKey].photos[$scope.index] = response.data;
                    $scope.viewphotos = response.data;
                    $scope.photoView($scope.viewphotos.id);
                    $scope.getComment($scope.viewphotos.id);
                });
            }
        };
        //photo view update
        $scope.photoView = function(photo_id) {
                photoStatsFactory.create({
                    'photo_id': photo_id
                }, function(response) {});
            }
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
            $scope.usercomment.photo_id = $scope.photos[$scope.photoKey].photos[$scope.index].id;
            PhotoCommentSaveFactory.create($scope.usercomment, function(response) {
                if (response.error.code === 0) {
                    $scope.usercomment.comment = null;
                    $scope.getComment(response.photo_id);
                }
                $scope.$emit('profileParent', {});
                $scope.Count();
            });
        };
        $scope.scrollPhoto = function(id, index) {
            $uibModalStack.dismissAll();
            $location.path('/discover/' + id + '/' + index);
        };
        //user follow function
        $scope.user_follow = function() {
            var user_id = $scope.photos[$scope.photoKey].photos[$scope.index].user_id;
            var params = {};
            params.other_user_id = user_id;
            UserFollowFactory.create(params, function(response) {
                if (response.error.code === 0) {
                    $scope.follow[user_id] = {
                        follow_id: response.data.id,
                        isfollow: true
                    };
                    $scope.$emit('profileParent', {});
                }
            });
        };
        //user unfollow function
        $scope.user_unfollow = function(follow) {
            var user_id = $scope.photos[$scope.photoKey].photos[$scope.index].user_id;
            var params = {};
            params.id = follow[user_id].follow_id;
            UserUnfollowFactory.update(params, function(response) {
                if (response.error.code === 0) {
                    $scope.follow[user_id] = {
                        follow_id: 0,
                        isfollow: false
                    };
                }
            });
        };
        $scope.indexOfRowContainingId = function() {
            $scope.data = {
                prev_key: -1,
                prev_index: -1,
                prev_id: -1,
                current_key: -1,
                current_index: -1,
                current_id: -1,
                next_key: -1,
                next_index: -1,
                next_id: -1
            };
            for (var i = 0, len = $scope.photos[$scope.photoKey].photos.length; i < len; i++) {
                if ($scope.photos[$scope.photoKey].photos[i].id === $scope.photo_id) {
                    $scope.data.current_key = $scope.photoKey;
                    $scope.data.current_index = i;
                    $scope.data.current_id = $scope.photos[$scope.photoKey].photos[i].id;
                } else {
                    if ($scope.data.current_key === -1) {
                        $scope.data.prev_key = $scope.photoKey;
                        $scope.data.prev_index = i;
                        $scope.data.prev_id = $scope.photos[$scope.photoKey].photos[i].id;
                    } else {
                        $scope.data.next_key = $scope.photoKey;
                        $scope.data.next_index = i;
                        $scope.data.next_id = $scope.photos[$scope.photoKey].photos[i].id;
                        return;
                    }
                }
            }
            return;
        };
        //Next and Previous Function 
        $scope.slide_change = function(option) {
            if (option === 'next') {
                $scope.photo_id = $scope.data.next_id;
            }
            if (option === 'prev') {
                $scope.photo_id = $scope.data.prev_id;
            }
            $scope.indexOfRowContainingId();
            if ($scope.data.current_id !== -1) {
                $scope.index = parseInt($scope.data.current_index);
                $scope.photoKey = parseInt($scope.data.current_key);
                $scope.photo_id = parseInt($scope.data.current_id);
                if (angular.isDefined($scope.photos[$scope.photoKey].photos[$scope.index])) {
                    $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")($scope.photos[$scope.photoKey].photos[$scope.index].description);
                    params.id = $scope.photos[$scope.photoKey].photos[$scope.index].id;
                    $state.go('photo_view', {
                        id: params.id
                    }, {
                        notify: false,
                        location: 'replace'
                    });
                    var myEl = angular.element(document.querySelector('img'));
                    myEl.attr('src', '//:0');
                    $timeout(function() {
                        $scope.loadPhoto();
                    }, 100);
                }
            }
        };
        //opening flag model 
        $scope.openFlagModal = function(viewphotos) {
            $scope.flagview = (viewphotos.is_flag) ? 'js-flagged-view' : 'js-flag-view';
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/flagmodal.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'DesginerFlagController',
                windowClass: $scope.flagview,
                resolve: {
                    flagcategories: function() {
                        return $scope.flagcategories;
                    },
                    viewphotos: function() {
                        return viewphotos;
                    },
                    photoindex: function() {
                        return $scope.index;
                    },
                    photoKey: function() {
                        return $scope.photoKey;
                    },
                    photos: function() {
                        return $scope.photos;
                    }
                }
            });
        };
        //Post PhotoLike        
        $scope.photoLike = function() {
            if (angular.isDefined($scope.photos[$scope.photoKey].photos[$scope.index])) {
                var params = {};
                params.photo_id = $scope.photos[$scope.photoKey].photos[$scope.index].id;
                PhotoLikeFactory.create(params, function(response) {
                    if (response.error.code === 0) {
                        $scope.photos[$scope.photoKey].photos[$scope.index].is_like = true;
                        $scope.photos[$scope.photoKey].photos[$scope.index].like_id = response.data.id;
                        $scope.$emit('profileParent', {});
                        $scope.Count();
                    }
                });
            }
        };
        //Delete PhotoLike
        $scope.photoUnLike = function() {
            if (angular.isDefined($scope.photos[$scope.photoKey].photos[$scope.index])) {
                var params = {};
                params.id = $scope.photos[$scope.photoKey].photos[$scope.index].like_id;
                PhotoUnLikeFactory.update(params, function(response) {
                    if (response.error.code === 0) {
                        $scope.photos[$scope.photoKey].photos[$scope.index].is_like = false;
                        $scope.Count();
                    }
                });
            }
        };
        //modal closing fucntion
        $scope.ModelCancel = function() {
            if ($scope.redirect === 'designer' || $scope.redirect === 'designer_following' || $scope.redirect === 'designer_recent') {
                if ($scope.redirect === 'designer') {
                    $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Designer");
                }
                if ($scope.redirect === 'designer_following') {
                    $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Designer Following");
                }
                if ($scope.redirect === 'designer_recent') {
                    $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Designer Recent");
                }
                $state.go($scope.redirect, {
                    param: ''
                }, {
                    notify: false
                });
            }
            $uibModalStack.dismissAll();
        };
        //login function
        $scope.Login_func = function() {
            $uibModalStack.dismissAll();
            $location.path('/users/login');
        };
        //Like and Comment Count
        $scope.Count = function() {
            var params = {};
            params.id = $scope.photos[$scope.photoKey].photos[$scope.index].id;
            PhotoViewFactory.get(params, function(response) {
                var comment = response.data;
                $scope.viewphotos.photo_like_count = comment.photo_like_count;
                $scope.viewphotos.photo_comment_count = comment.photo_comment_count;
            });
        };
        //init triggered
        $scope.init();
    }]);