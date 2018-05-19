'use strict';
/**
 * @ngdoc function
 * @name Sns.controller:recentController
 * @description
 * # recentController
 * Controller of the Sns
 */
angular.module('SnsApp')
    .controller('recentController', ['$scope', '$rootScope', '$location', '$window', '$filter', 'md5', 'designerRecentFactory', 'UserUnfollowFactory', 'UserFollowFactory', '$uibModal', 'FlagCategoryFactory', '$uibModalStack', '$state', 'FlickityService', 'UserPhotosFactory', function($scope, $rootScope, $location, $window, $filter, md5, designerRecentFactory, UserUnfollowFactory, UserFollowFactory, $uibModal, FlagCategoryFactory, $uibModalStack, $state, FlickityService, UserPhotosFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Designer Recent");
        $scope.enabled = true;
        $scope.users = [];
        $scope.follow = [];
        $scope.user_photo = [];
        $scope.scroll_flag = true;
        $scope.lastpage = 2;
        $scope.currentpage = 1;
        //init Function
        $scope.init = function() {
            $uibModalStack.dismissAll();
            FlagCategoryFactory.get(function(response) {
                $scope.flagcategories = response.data;
            });
            $scope.getUserPhoto();
            var windowEl = angular.element($window)
                .bind("scroll", function(e) {
                    var scrollPos = windowEl.scrollTop();
                    angular.element('#banner-text')
                        .css({
                            'margin-top': (scrollPos / 3) + 'px',
                            'opacity': 1 - (scrollPos / 300)
                        });
                });
        };
        //Get UserPhoto
        $scope.getUserPhoto = function() {
            var params = {};
            params.filter = 'recent';
            params.sort = 'id';
            params.sortby = 'desc';
            params.page = $scope.currentpage;
            designerRecentFactory.get(params, function(response) {
                $scope.scroll_flag = true;
                if (angular.isDefined(response._metadata)) {
                    $scope.lastpage = response._metadata.last_page;
                    $scope.currentpage = response._metadata.current_page;
                }
                if (angular.isDefined(response.data)) {
                    angular.forEach(response.data, function(user) {
                        if (angular.isDefined(user.attachment) && user.attachment !== null) {
                            user.user_avatar_url = 'images/big_normal_thumb/UserAvatar/' + user.id + '.' + md5.createHash('UserAvatar' + user.id + 'png' + 'big_normal_thumb') + '.png';
                        } else {
                            user.user_avatar_url = 'images/profile_default_avatar.png';
                        }
                        if (angular.isDefined(user.user_follow) && user.user_follow !== null) {
                            angular.forEach(user.user_follow, function(follow) {
                                {
                                    $scope.follow[user.id] = {
                                        follow_id: follow.id,
                                        isfollow: true
                                    };
                                }
                            });
                        } else {
                            $scope.follow[user.id] = {
                                follow_id: 0,
                                isfollow: false
                            };
                        }
                        angular.forEach(user.photos, function(photo, index) {
                            user.photos[index].photos_url = 'images/medium_thumb/Photo/' + photo.id + '.' + md5.createHash('Photo' + photo.id + 'png' + 'medium_thumb') + '.png';
                            if (angular.isDefined(photo.photo_like) && photo.photo_like.length > 0) {
                                photo.is_like = true;
                                angular.forEach(photo.photo_like, function(photo_like) {
                                    photo.like_id = photo_like.id;
                                });
                            } else {
                                photo.is_like = false;
                            }
                            if (angular.isDefined(photo.flag) && photo.flag.length > 0) {
                                photo.is_flag = true;
                            } else {
                                photo.is_flag = false;
                            }
                        });
                        if (angular.isDefined(user.flag) && user.flag.length > 0) {
                            user.is_userflag = true;
                        } else {
                            user.is_userflag = false;
                        }
                        $scope.flickityOptions = {
                            cellSelector: '.user_id' + user.id,
                            contain: true,
                            lazyLoad: true,
                            groupCells: true,
                            prevNextButtons: false,
                            pageDots: false,
                            cellAlign: 'left',
                            imagesLoaded: true,
                            percentPosition: false
                        };
                        user.flickityOptions = $scope.flickityOptions;
                        $scope.users.push(user);
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
                    $scope.follow[user.id] = {
                        follow_id: response.data.id,
                        isfollow: true
                    };
                }
            });
        };
        //user unfollow function
        $scope.user_unfollow = function(user, follow) {
            var params = {};
            params.id = follow[user.id].follow_id;
            UserUnfollowFactory.update(params, function(response) {
                if (response.error.code === 0) {
                    $scope.follow[user.id] = {
                        follow_id: 0,
                        isfollow: false
                    };
                }
            });
        };
        //pagination Function
        $scope.pagination = function() {
            if ($scope.enabled === true && $scope.scroll_flag === true) {
                if ($scope.currentpage <= $scope.lastpage) {
                    $scope.currentpage += 1;
                    $scope.scroll_flag = false;
                    $scope.getUserPhoto();
                } else {
                    $scope.enabled = false;
                }
            }
        };
        //Text_following 
        $scope.following = function(index) {
            angular.element('#following-' + index)
                .html('unfollow');
        };
        //Text_ unfollow 
        $scope.unfollow = function(index) {
            angular.element('#following-' + index)
                .html('following');
        };
        //flag model
        $scope.openFlagModal = function(user, key) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Photo view");
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/userflagmodal.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'UserFlagModelController',
                windowClass: "js-flag-view",
                resolve: {
                    flagcategories: function() {
                        return $scope.flagcategories;
                    },
                    user: function() {
                        return user;
                    },
                    userKey: function() {
                        return key;
                    },
                    users: function() {
                        return $scope.users;
                    }
                }
            });
        };
        $scope.go = function(user_id, user_username) {
            $location.path('profile/' + user_id + '/' + user_username);
        };
        //init triggered
        $scope.init();
        //photo model
        $scope.openPhotoModal = function(id, description, index, size, key) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")(description);
            var redirectto = $state.current.name;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/modal_photo_view.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'designerPhotoModalController',
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
                        return $scope.users;
                    },
                    redirect: function() {
                        return redirectto;
                    }
                }
            });
        };
        //flickicity Appending function 
        $scope.current_page = 1;
        $scope.cc = function(index, user, key) {
                $scope.element = angular.element(document.getElementById('user_id' + user.id));
                var index1 = FlickityService.cells('user_id' + user.id)
                    .then(function(cells) {
                        if (index == cells.length - 1) {
                            if (angular.isDefined($scope.users[key].metadata)) {
                                if ($scope.users[key].metadata[0].current_page <= $scope.users[key].metadata[0].last_page) {
                                    $scope.users[key].metadata[0].current_page += 1;
                                }
                            }
                            $scope.UserPhotos(user, index, key);
                            $scope.flickityOptions = {
                                cellSelector: '.user_id' + user.id,
                                contain: true,
                                lazyLoad: true,
                                groupCells: true,
                                prevNextButtons: false,
                                pageDots: false,
                                cellAlign: 'left',
                                imagesLoaded: true,
                                percentPosition: false
                            };
                        }
                    });
            }
            //Adding user photos 
        $scope.UserPhotos = function(user, index, key) {
            var params = {};
            var users = [];
            var flag = "";
            params.userId = user.id;
            params.page = (angular.isDefined($scope.users[key].metadata)) ? $scope.users[key].metadata[0].current_page : 1;
            UserPhotosFactory.get(params, function(response) {
                if (angular.isDefined(response.data)) {
                    $scope.user_photos = response.data;
                    angular.forEach($scope.user_photos, function(userphoto, index) {
                        $scope.user_photos[index].photos_url = 'images/medium_thumb/Photo/' + userphoto.id + '.' + md5.createHash('Photo' + userphoto.id + 'png' + 'medium_thumb') + '.png';
                        if (angular.isDefined(userphoto.photo_like) && userphoto.photo_like.length > 0) {
                            userphoto.is_like = true;
                            angular.forEach(userphoto.photo_like, function(photo_like) {
                                userphoto.like_id = photo_like.id;
                            });
                        } else {
                            userphoto.is_like = false;
                        }
                        if (angular.isDefined(userphoto.flag) && userphoto.flag.length > 0) {
                            userphoto.is_flag = true;
                        } else {
                            userphoto.is_flag = false;
                        }
                        if (angular.isDefined(user.photos)) {
                            var is_found = false;
                            angular.forEach(user.photos, function(photo) {
                                if (photo.id == userphoto.id) {
                                    is_found = true;
                                }
                            });
                            if (is_found) {
                                return;
                            }
                            users = userphoto;
                            $scope.users[key].photos.push(users);
                            FlickityService.selectedIndex('user_id' + user.id)
                                .then(function(index) {
                                    var currentIndex = index;
                                    var newOptions = {
                                        initialIndex: currentIndex,
                                        cellSelector: $scope.element[0].id,
                                        contain: true,
                                        lazyLoad: true,
                                        groupCells: true,
                                        prevNextButtons: false,
                                        pageDots: false,
                                        cellAlign: 'left',
                                        imagesLoaded: true,
                                        percentPosition: false
                                    }
                                    angular.merge(newOptions, $scope.flickityOptions);
                                    FlickityService.destroy($scope.element[0].id)
                                        .then(function(v) {
                                            FlickityService.create($scope.element[0], $scope.element[0].id, newOptions)
                                                .then(function(result) {});
                                        });
                                });
                        }
                    });
                    $scope.users[key].metadata = [];
                    $scope.users[key].metadata.push(response._metadata);
                }
            });
        }
}]);