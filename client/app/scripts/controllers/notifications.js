 'use strict';
 /**
  * @ngdoc function
  * @name Sns.controller:notificationController
  * @description
  * # notificationController
  * Controller of the Sns
  */
 angular.module('SnsApp')
     .controller('notificationController', ['$scope', '$rootScope', '$location', '$window', '$filter', 'md5', 'notificationFactory', 'flash', 'userSettings', function($scope, $rootScope, $location, $window, $filter, md5, notificationFactory, flash, userSettings) {
         //variable declaration
         $scope.enabled = true;
         $scope.noRecord = null;
         $scope.loader = true;
         $scope.notifications = {};
         $scope.currentpage = 1;
         $scope.scroll_flag = true;
         $scope.lastpage = 2;
         //init Function
         $scope.init = function() {
             $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Notification");
             $scope.getNotify();
         };
         //Mark all Function
         $scope.getNotify = function() {
             var params = {};
             var cur_time;
             var current_date = new Date();
             var current_month = current_date.getMonth();
             var current_year = current_date.getFullYear();
             //var current_day = current_date.getDate();
             params.page = $scope.currentpage;
             notificationFactory.get(params, function(response) {
                 $scope.scroll_flag = true;
                 if (angular.isDefined(response._metadata)) {
                     $scope.lastpage = response._metadata.last_page;
                     $scope.currentpage = response._metadata.current_page;
                 }
                 if ($scope.noRecord === null && response.data.length === 0) {
                     $scope.noRecord = true;
                 } else {
                     $scope.noRecord = false;
                 }
                 if (angular.isDefined(response.data)) {
                     angular.forEach(response.data, function(notify) {
                         var notify_date = new Date(notify.created_at);
                         var notify_month = notify_date.getMonth();
                         var notify_year = notify_date.getFullYear();
                         var notify_day = notify_date.getDate();
                         notify.user_avatar_url = 'images/profile_default_avatar.png';
                         if (angular.isDefined(notify.user.attachment) && notify.user.attachment !== null) {
                             notify.user_avatar_url = 'images/small_thumb/UserAvatar/' + notify.user.id + '.' + md5.createHash('UserAvatar' + notify.user.id + 'png' + 'small_thumb') + '.png';
                         }
                         if (current_year !== notify_year) {
                             cur_time = new Date('1,1,' + notify_year)
                                 .getTime();
                             if (!angular.isDefined($scope.notifications[cur_time])) {
                                 $scope.notifications[cur_time] = [];
                             }
                             notify.group_type = "YYYY";
                             $scope.notifications[cur_time].push(notify);
                         } else if (current_year === notify_year && current_month !== notify_month) {
                             cur_time = new Date(notify_month + ',1,' + notify_year)
                                 .getTime();
                             if (!angular.isDefined($scope.notifications[cur_time])) {
                                 $scope.notifications[cur_time] = [];
                             }
                             notify.group_type = "MMM YYYY";
                             $scope.notifications[cur_time].push(notify);
                         } else {
                             cur_time = new Date(notify_month + ',' + notify_day + ',' + notify_year)
                                 .getTime();
                             if (!angular.isDefined($scope.notifications[cur_time])) {
                                 $scope.notifications[cur_time] = [];
                             }
                             notify.group_type = "D MMM YYYY";
                             $scope.notifications[cur_time].push(notify);
                         }
                     });
                     $scope.loader = false;
                 }
             }, function(error) {
                 $scope.scroll_flag = true;
             });
         };
         //Mark all Function
         $scope.MarkAll = function(created_at, group_type) {
             notificationFactory.get(function(response) {
                 $scope.mark = response.data;
                 angular.forEach($scope.mark, function() {
                     $scope.read = {};
                     $scope.read.is_read = 1;
                     if (group_type === "YYYY") {
                         $scope.read.date = $filter('date')(Date.parse(created_at), 'yyyy');
                         $scope.read.type = 'year';
                     } else if (group_type === "MMM YYYY") {
                         $scope.read.date = $filter('date')(Date.parse(created_at), 'yyyy-MM');
                         $scope.read.type = 'month';
                     } else {
                         $scope.read.date = $filter('date')(Date.parse(created_at), "yyyy-MM-dd");
                         $scope.read.type = 'date';
                     }
                 });
                 notificationFactory.put($scope.read, function(response) {
                     if (response.error.code === 0) {
                         $scope.currentpage = 1;
                         $scope.notifications = {};
                         $scope.getNotify();
                         $scope.ProfileUpdate();
                         var flashMessage = $filter("translate")("Marked all As read");
                         flash.set(flashMessage, 'success', false);
                     }
                 });
             });
         };
         //pagination Function
         $scope.pagination = function() {
             if ($scope.enabled === true && $scope.scroll_flag === true) {
                 if ($scope.currentpage <= $scope.lastpage) {
                     $scope.currentpage += 1;
                     $scope.scroll_flag = false;
                     $scope.getNotify();
                 } else {
                     $scope.enabled = false;
                 }
             }
         };
         //Profile update function
         $scope.ProfileUpdate = function() {
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
         };
         //init Triggered
         $scope.init();
     }]);