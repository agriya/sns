'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('userFollowerController', ['$rootScope', '$scope', 'md5', 'user', 'UserfollowerFactory', 'UserFollowFactory', 'UserUnfollowFactory', function($rootScope, $scope, md5, user, UserfollowerFactory, UserFollowFactory, UserUnfollowFactory) {
        var params = {};        
            params.userId = user.id;
            UserfollowerFactory.get(params, function(response) {
                $scope.user_followers = response.data; 
                angular.forEach($scope.user_followers, function(photo) {                                 
                    if (angular.isDefined(photo.user.attachment) && photo.user.attachment !== null) {
                        photo.user_avatar_url = 'images/small_thumb/UserAvatar/' + photo.user.id + '.' + md5.createHash('UserAvatar' + photo.user.id + 'png' + 'small_thumb') + '.png';
                    } else {
                        photo.user_avatar_url = 'images/profile_default_avatar.png';
                    } 
                    if (angular.isDefined(photo.user.user_follow) && photo.user.user_follow !== null) {
                            angular.forEach(photo.user.user_follow, function(follow) {                                
                               {
                                    photo.user.follow_id = follow.id;
                                    photo.user.isfollow = true;
                                }
                            });
                        } else {
                        photo.user.isfollow = false;
                    }                                  
                });       
            });    
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
          //user follow function
             $scope.user_follow = function(follow,index) { 
                $scope.user_followers.user = [];                  
                $scope.follow = {};                        
                $scope.follow.other_user_id = follow.user.id;                
                UserFollowFactory.create($scope.follow, function(response) {                           
                    if (response.error.code === 0) {                                            
                        $scope.user_followers[index].user.user_follow = response.data;
                        $scope.user_followers[index].user.follow_id = response.data.id;                         
                        $scope.user_followers[index].user.isfollow = true;                                           
                    }
                });
            };
            //user unfollow function
            $scope.user_unfollow = function(follow,index) {
                $scope.user_followers.user = [];                                            
                var params = {};               
                params.id = follow.user.follow_id;
                UserUnfollowFactory.update(params, function(response) {                   
                if (response.error.code === 0) {                               
                    $scope.user_followers[index].user.isfollow = false;               
                }
            });
            };
        }]);