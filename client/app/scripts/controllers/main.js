'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('MainCtrl', ['$rootScope', '$scope', '$window', '$cookies', 'md5', 'refreshToken', '$location', '$uibModal', 'headerSearchFactory', '$uibModalStack', '$state', '$timeout', 'userSettings', '$filter', function($rootScope, $scope, $window, $cookies, md5, refreshToken, $location, $uibModal, headerSearchFactory, $uibModalStack, $state, $timeout, userSettings, $filter) {
        $rootScope.isAuth = false;
        if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            $rootScope.isAuth = true;
            $rootScope.user = JSON.parse($cookies.get("auth"));
            if (angular.isDefined($rootScope.user.attachment) && $rootScope.user.attachment !== null) {
                $rootScope.user.header_avatar_url = 'images/small_thumb/UserAvatar/' + $rootScope.user.id + '.' + md5.createHash('UserAvatar' + $rootScope.user.id + 'png' + 'small_thumb') + '.png';
            } else {
                $rootScope.user.header_avatar_url = 'images/profile_default_avatar.png';
            }
        }
        $rootScope.$on('updateParent', function(event, args) {
            if (args.isAuth !== undefined) {
                if (args.isAuth === true) {
                    $rootScope.isAuth = true;
                    if (args.auth !== undefined) {
                        $cookies.put('auth', JSON.stringify(args.auth), {
                            path: '/'
                        });
                        $rootScope.user = args.auth;
                        if (angular.isDefined($rootScope.user.attachment) && $rootScope.user.attachment !== null) {
                            $rootScope.user.header_avatar_url = 'images/small_thumb/UserAvatar/' + $rootScope.user.id + '.' + md5.createHash('UserAvatar' + $rootScope.user.id + 'png' + 'small_thumb') + '.png';
                        } else {
                            $rootScope.user.header_avatar_url = 'images/profile_default_avatar.png';
                        }
                    }
                } else {
                    $rootScope.isAuth = false;
                    delete $rootScope.user;
                    $cookies.remove('auth', {
                        path: '/'
                    });
                }
            }
        });
        //jshint unused:false
        $rootScope.$on('profileParent', function(event, args) {
            var params = {};
            params.id = $rootScope.user.id;
            userSettings.get(params, function(response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    if ($scope.response.data.user_follow !== null && angular.isDefined($scope.response.data.user_follow)) {
                        delete $scope.response.data.user_follow;
                    }
                    $scope.$emit('updateParent', {
                        isAuth: true,
                        auth: $scope.response.data
                    });
                }
            });
        });
        var unregisterUseRefreshToken = $rootScope.$on('useRefreshToken', function(event, args) {
            //jshint unused:false
            $rootScope.refresh_token_loading = true;
            var params = {};
            var auth = JSON.parse($cookies.get("auth"));
            params.token = auth.refresh_token;
            refreshToken.get(params, function(response) {
                if (angular.isDefined(response.access_token)) {
                    $rootScope.refresh_token_loading = false;
                    $cookies.put('token', response.access_token, {
                        path: '/'
                    });
                } else {
                    $cookies.remove('auth', {
                        path: '/'
                    });
                    $cookies.remove('token', {
                        path: '/'
                    });
                    var redirectto = $location.absUrl()
                        .split('/');
                    var find_admin = redirectto[0].split('/');
                    if (find_admin[find_admin.length - 1] === 'ag-admin') {
                        redirectto = redirectto[0] + '/ag-admin/users/login';
                    } else {
                        redirectto = redirectto[0] + '/users/login';
                    }
                    $rootScope.refresh_token_loading = false;
                    window.location.href = redirectto;
                    $location.reload(true);
                }
            });
        });
        //trigger the upload model 
        $scope.openPhotoUploadModal = function(size) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Photo Upload");
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/upload.html',
                windowTemplateUrl: 'views/window_modal.html',
                animation: false,
                controller: 'PhotoaddController',
                size: size,
                windowClass: "js-upload-view"
            });
        };
        //header Search Function
        var params = {};
        $scope.taglabel = [];
        $scope.loader = true;
        $scope.usersearch = function(search) {
            if (search === undefined || search === "") {
                angular.element('#js-search')
                    .addClass('hide');
            } else if (search !== "") {
                angular.element('#js-search')
                    .removeClass('hide');
                $scope.usersearchs(search);
            }
        };
        $scope.usersearchs = function(search) {
            params.q = search;
            headerSearchFactory.get(params, function(response) {
                $scope.users = response.data.users;
                $scope.tags = response.data.photoTags;
                $scope.taglabel.push('tag tag-1', 'tag tag-2', 'tag tag-3', 'tag tag-4', 'tag tag-5', 'tag tag-6', 'tag tag-7', 'tag tag-8', 'tag tag-9');
                if (angular.isDefined(response.data.photoTags) && response.data.photoTags !== null) {
                    var j = 0;
                    var count = 1;
                    angular.forEach($scope.tags, function(tag) {
                        tag.label = $scope.taglabel[j];
                        j++;
                        count++;
                        if (count > 6) {
                            j = 0;
                            count = 1;
                        }
                    });
                }
                angular.forEach(response.data.users, function(user) {
                    if (angular.isDefined(user.attachment) && user.attachment !== null) {
                        user.user_avatar_url = 'images/big_normal_thumb/UserAvatar/' + user.id + '.' + md5.createHash('UserAvatar' + user.id + 'png' + 'big_normal_thumb') + '.png';
                    } else {
                        user.user_avatar_url = 'images/profile_default_avatar.png';
                    }
                });
                $scope.loader = false;
            });
        };
        //open Login Modal Function
        $scope.openLoginModal = function(url, fail_url) {
            var redirectto = $location.url();
            if (redirectto !== '/users/login' && redirectto !== '/users/register') {
                if (angular.isDefined(url) && url !== null) {
                    $cookies.put('fail_url', fail_url);
                    $cookies.put("redirect_url", url, {
                        path: '/'
                    });
                } else {
                    $cookies.put("redirect_url", redirectto, {
                        path: '/'
                    });
                }
                $state.go('users_login', {
                    param: ''
                }, {
                    notify: false
                });
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'views/login_model.html',
                    windowClass: 'center-modal',
                    backdrop: 'static',
                });
            }
        };
        $scope.cancel = function() {
            var url = $cookies.get("fail_url");
            if ($cookies.get("redirect_url") === '/designer/following' || $cookies.get("redirect_url") === '/following') {
                $location.path(url);
            } else {
                $location.path($cookies.get("redirect_url"));
            }
            $uibModalStack.dismissAll();
        };
        $scope.switch_tab = function(tab) {
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("login");
            if (tab === 'login') {
                $state.go('users_login', {
                    param: ''
                }, {
                    notify: false
                });
            } else {
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Register");
                $state.go('users_register', {
                    param: ''
                }, {
                    notify: false
                });
            }
        };
            }]);