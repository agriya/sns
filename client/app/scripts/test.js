/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name SnsApp
 * @description
 * # SnsApp
 *
 * Main module of the application.
 */
angular.module('SnsApp', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ui.router',
    'angular-growl',
    'google.places',
    'angular.filter',
    'ngCookies',
    'angular-md5',
    'ui.select2',
    'http-auth-interceptor',
    'angulartics',
    'pascalprecht.translate',
    'angulartics.google.analytics',
    'tmh.dynamicLocale'
  ])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {
        $urlRouterProvider.otherwise('/');
        //$translateProvider.translations('en', translations).preferredLanguage('en');
        $translateProvider.useStaticFilesLoader({
            prefix: 'scripts/l10n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage(); // saves selected language to localStorage
        // Enable escaping of HTML
        $translateProvider.useSanitizeValueStrategy('escape');
        //	$translateProvider.useCookieStorage();
    }])
    .config(['$authProvider', function($authProvider) {
        var url = '/api/v1/providers';
        var params = {};
        // var token = '$cookies'.get("token");
        params.fields = 'api_key,slug';
        // params.token = token;
        $.get(url, params, function(response) {
            var credentials = {};
            var redirect_url = '';
            var providers = JSON.parse(response);
            angular.forEach(providers.data, function(res, i) {
                //jshint unused:false
                redirect_url = window.location.protocol + '//' + window.location.host + '/api/v1/users/social_login?type=' + res.slug;
                credentials = {
                    clientId: res.api_key,
                    redirectUri: redirect_url,
                    url: window.location.protocol + '//' + window.location.host + '/api/v1/users/social_login?type=' + res.slug
                };
                if (res.slug === 'facebook') {
                    $authProvider.facebook(credentials);
                }
                if (res.slug === 'google') {
                    $authProvider.google(credentials);
                }
                if (res.slug === 'twitter') {
                    $authProvider.twitter(credentials);
                }
            });
        });
    }])
    .config(function($stateProvider, $urlRouterProvider) {
        var getToken = {
            'TokenServiceData': function(TokenService, $q) {
                return $q.all({
                    AuthServiceData: TokenService.promise,
                    SettingServiceData: TokenService.promiseSettings
                });
            }
        };
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                resolve: getToken
            })
            .state('users_settings', {
                url: '/users/settings',
                templateUrl: 'views/users_settings.html',
                resolve: getToken
            })
            .state('users_addresses', {
                url: '/users/addresses',
                templateUrl: 'views/users_addresses.html',
                resolve: getToken
            })
            .state('users_change_password', {
                url: '/users/change_password',
                templateUrl: 'views/users_change_password.html',
                resolve: getToken
            })
            .state('users_login', {
                url: '/users/login',
                templateUrl: 'views/users_login.html',
                resolve: getToken
            })
            .state('users_register', {
                url: '/users/register',
                templateUrl: 'views/users_register.html',
                resolve: getToken
            })
            .state('users_logout', {
                url: '/users/logout',
                controller: 'UsersLogoutCtrl',
                resolve: getToken
            })
            .state('users_forgot_password', {
                url: '/users/forgot_password',
                templateUrl: 'views/users_forgot_password.html',
                resolve: getToken
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'views/contact.html',
                resolve: getToken
            })
            .state('users_address_add', {
                url: '/users/addresses/add',
                templateUrl: 'views/users_address_add.html',
                resolve: getToken
            })
            .state('pages_view', {
                url: '/pages/:id/:slug',
                templateUrl: 'views/pages_view.html',
                resolve: getToken
            })
            .state('users_activation', {
                url: '/users/activation/:user_id/:hash',
                templateUrl: 'views/users_activation.html',
                resolve: getToken
            });
    })
    .config(['growlProvider', function(growlProvider) {
        growlProvider.onlyUniqueMessages(true);
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalPosition('top-center');
        growlProvider.globalDisableCountDown(true);
    }])
    .run(function($rootScope, $location, $window, $cookies) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            //jshint unused:false
            var url = toState.name;
            var exception_arr = ['home', 'users_login', 'users_register', 'users_forgot_password', 'pages_view', 'contact'];
            if (url !== undefined) {
                if (exception_arr.indexOf(url) === -1 && ($cookies.get("auth") === null || $cookies.get("auth") === undefined)) {
                    $location.path('/users/login');
                }
            }
        });
    })
    .config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('interceptor');
            $httpProvider.interceptors.push('oauthTokenInjector');
		}
	])
    .factory('interceptor', ['$q', '$location', 'flash', '$window', '$timeout', '$rootScope', '$cookies', function($q, $location, flash, $window, $timeout, $rootScope, $cookies) {
        return {
            // On response success
            response: function(response) {
                if (angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data.thrid_party_login)) {
                        if (angular.isDefined(response.data.error)) {
                            if (angular.isDefined(response.data.error.code) && parseInt(response.data.error.code) === 0) {
                                $cookies.put('auth', JSON.stringify(response.data.user), {
                                    path: '/'
                                });
                                $timeout(function() {
                                    location.reload(true);
                                });
                            } else {
                                flash.set(response.data.error.message, 'error', false);
                            }
                        }
                    }
                }
                // Return the response or promise.
                return response || $q.when(response);
            },
            // On response failture
            responseError: function(response) {
                // Return the promise rejection.
                if (response.status === 401) {
                    if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
                        var auth = JSON.parse($cookies.get("auth"));
                        var refresh_token = auth.refresh_token;
                        if (refresh_token === null || refresh_token === '' || refresh_token === undefined) {
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
                        } else {
                            if ($rootScope.refresh_token_loading !== true) {
                                $rootScope.$broadcast('useRefreshToken');
                            }
                        }
                    }
                }
                return $q.reject(response);
            }
        };
    }])
    .filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });