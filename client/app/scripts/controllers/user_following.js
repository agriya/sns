'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:SnsApp
 * @description
 * # MainCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('userFollowingController', ['$rootScope', '$scope', '$filter', 'md5', 'user', 'UserfollowingFactory', 'UserFollowFactory', 'UserUnfollowFactory', function($rootScope, $scope, $filter, md5, user, UserfollowingFactory, UserFollowFactory, UserUnfollowFactory) {
        $scope.follow = [];
        var params = {};        
            params.userId = user.id;
            UserfollowingFactory.get(params, function(response) {
                $scope.user_following = response.data;  
                 angular.forEach($scope.user_following, function(user) {                        
                    if (angular.isDefined(user.following_user.attachment) && user.following_user.attachment !== null) {
                        user.user_avatar_url = 'images/small_thumb/UserAvatar/' + user.following_user.id + '.' + md5.createHash('UserAvatar' + user.following_user.id + 'png' + 'small_thumb') + '.png';
                    } else {
                        user.user_avatar_url = 'images/profile_default_avatar.png';
                    }  
                    if (angular.isDefined(user.following_user.user_follow) && user.following_user.user_follow !== null) {
                            angular.forEach(user.following_user.user_follow, function(follow) {                                
                                {
                                    user.following_user.follow_id = follow.id;
                                    user.following_user.isfollow = true;
                                }
                            });
                        } else {
                    user.following_user.isfollow = false;
                }                  
                });                 
            }); 
            //Text_following 
            $scope.followings = function(index) {                
                angular.element('#following-' + index)
                    .html('unfollow');
            };
            //Text_ unfollow 
            $scope.unfollow = function(index) {                
                angular.element('#following-' + index)
                    .html('following');
            };     
            //user follow function
             $scope.user_follow = function(user,index) {
                $scope.user_following.following_user = [];               
                $scope.follow = {};                                 
                $scope.follow.other_user_id = user.following_user.id;                     
                UserFollowFactory.create($scope.follow, function(response) {         
                    if (response.error.code === 0) { 
                        $scope.user_following[index].following_user.user_follow = response.data;
                        $scope.user_following[index].following_user.follow_id = response.data.id;                         
                        $scope.user_following[index].following_user.isfollow = true;                                           
                    }
                });
            };
            //user unfollow function
            $scope.user_unfollow = function(user,index) { 
                $scope.user_following.following_user = [];                           
                var params = {};
                params.id = user.following_user.follow_id;
                UserUnfollowFactory.update(params, function(response) {
                if (response.error.code === 0) {                     
                    $scope.user_following[index].following_user.isfollow = false;                    
                }
            });
            };
        }]);