'use strict';
/**
 * @ngdoc function
 * @name SnsApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
StatsCtrl * Controller of the SnsApp
 */
angular.module('SnsApp')
    .controller('StatsCtrl', function($scope, StatFactory) {
        $scope.index = function() {
            StatFactory.get(function(response) {
                $scope.statistic = response;
                $scope.week_Stats = $scope.statistic['last 7 days'];
                $scope.month_Stats = $scope.statistic['last 30 days'];
                $scope.year_Stats = $scope.statistic['last 1 year'];
            });
        };
        $scope.index();
    });