var ngapp = angular.module('SnsApp', ['ng-admin', 'http-auth-interceptor', 'angular-md5', 'ui.bootstrap', 'ngResource', 'angular.filter', 'ngCookies']);
var admin_api_url = '/';
var limit_per_page = 20;
var auth;
var $cookies;
var site_settings;
angular.injector(['ngCookies'])
    .invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
}]);
if ($cookies.get('auth') !== undefined && $cookies.get('auth') !== null) {
    auth = JSON.parse($cookies.get('auth'));
}
if ($cookies.get('SETTINGS') !== undefined && $cookies.get('SETTINGS') !== null) {
    site_settings = JSON.parse($cookies.get('SETTINGS'));
}
ngapp.constant('user_types', {
    admin: 1,
    user: 2,
    restaurant: 3,
    supervisor: 4,
    deliveryPerson: 5
});
ngapp.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('interceptor');
        $httpProvider.interceptors.push('oauthTokenInjector');
    }
]);
ngapp.config(function($stateProvider) {
    var getToken = {
        'TokenServiceData': function(adminTokenService, $q) {
            return $q.all({
                AuthServiceData: adminTokenService.promise,
                SettingServiceData: adminTokenService.promiseSettings
            });
        }
    };
    $stateProvider.state('login', {
            url: '/users/login',
            templateUrl: 'views/users_login.html',
            resolve: getToken
        })
        .state('logout', {
            url: '/users/logout',
            controller: 'UsersLogoutCtrl',
            resolve: getToken
        })
});
ngapp.directive('googlePlaces', ['$location', function($location) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        },
        link: function(scope) {
            var inputFrom = document.getElementById('goo-place');
            var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
            google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
                scope.entry()
                    .values['city.name'] = '';
                scope.entry()
                    .values['address'] = '';
                scope.entry()
                    .values['address1'] = '';
                scope.entry()
                    .values['state.name'] = '';
                scope.entry()
                    .values['country.iso_alpha2'] = '';
                scope.entry()
                    .values['zip_code'] = '';
                var place = autocompleteFrom.getPlace();
                scope.entry()
                    .values.latitude = place.geometry.location.lat();
                scope.entry()
                    .values.longitude = place.geometry.location.lng();
                var k = 0;
                angular.forEach(place.address_components, function(value, key) {
                    //jshint unused:false
                    if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                        if (k === 0) {
                            scope.entry()
                                .values['city.name'] = value.long_name;
                        }
                        if (value.types[0] === 'locality') {
                            k = 1;
                        }
                    }
                    if (value.types[0] === 'premise' || value.types[0] === 'route') {
                        if (scope.entry()
                            .values['address'] !== '') {
                            scope.entry()
                                .values['address'] = scope.entry()
                                .values['address'] + ', ' + value.long_name;
                        } else {
                            scope.entry()
                                .values['address'] = value.long_name;
                        }
                    }
                    if (value.types[0] === 'sublocality_level_1' || value.types[0] === 'sublocality_level_2') {
                        if (scope.entry()
                            .values['address1'] !== '') {
                            scope.entry()
                                .values['address1'] = scope.entry()
                                .values['address1'] + ', ' + value.long_name;
                        } else {
                            scope.entry()
                                .values['address1'] = value.long_name;
                        }
                    }
                    if (value.types[0] === 'administrative_area_level_1') {
                        scope.entry()
                            .values['state.name'] = value.long_name;
                    }
                    if (value.types[0] === 'country') {
                        scope.entry()
                            .values['country.iso_alpha2'] = value.short_name;
                    }
                    if (value.types[0] === 'postal_code') {
                        scope.entry()
                            .values.zip_code = parseInt(value.long_name);
                    }
                });
                scope.$apply();
            });
        },
        template: '<input class="form-control" id="goo-place"/><p class="help-text" class="form-text text-muted">You must select address from autocomplete</p>'
    };
}]);
ngapp.directive('inputType', function() {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            elem.bind('change', function() {
                scope.$apply(function() {
                    scope.entry()
                        .values.value = scope.value;
                    if (scope.entry()
                        .values.type === 'checkbox') {
                        scope.entry()
                            .values.value = scope.value ? 1 : 0;
                    }
                });
            });
        },
        controller: function($scope) {
            $scope.text = true;
            $scope.value = $scope.entry()
                .values.value;
            if ($scope.entry()
                .values.type === 'checkbox') {
                $scope.text = false;
                $scope.value = Number($scope.value);
            }
        },
        template: '<textarea ng-model="$parent.value" id="value" name="value" class="form-control" ng-if="text"></textarea><input type="checkbox" ng-model="$parent.value" id="value" name="value" ng-if="!text" ng-true-value="1" ng-false-value="0" ng-checked="$parent.value == 1"/>'
    };
});
ngapp.directive('dashboardSummary', ['$location', '$state', '$http', function($location, $state, $http) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@",
            revenueDetails: "&"
        },
        templateUrl: 'views/dashboardSummary.html',
        link: function(scope) {
            $http.get(admin_api_url + 'api/v1/stats')
                .success(function(response) {
                    scope.adminstats = response;
                });
        }
    };
}]);
ngapp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation === 'getList') {
            // custom pagination params
            if (params._page) {
                params.page = params._page;
                delete params._sortDir;
                delete params._sortField;
                delete params._page;
                delete params._perPage;
            }
            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            var sep = url.indexOf('?') === -1 ? '?' : '&';
            url = url + sep + 'token=' + $cookies.get("token");
        }
        return {
            params: params,
            url: url
        };
    });
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
        if (operation === "getList") {
            var headers = response.headers();
            if (typeof response.data._metadata !== 'undefined' && response.data._metadata.total !== null) {
                response.totalCount = response.data._metadata.total;
            }
        }
        return data;
    });
    //To cutomize single view results, we added setResponseExtractor.
    //Our API Edit view results single array with following data format data[{}], Its not working with ng-admin format
    //so we returned data like data[0];
    RestangularProvider.setResponseExtractor(function(data, operation, what, url) {
        var extractedData;
        // .. to look for getList operations        
        extractedData = data.data;
        return extractedData;
    });
}]);
ngapp.directive('displayImage', function(md5) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.thumb = attrs.thumb;
            //  console.log(scope.entry().values['attachment.id']);
            if (angular.isDefined(scope.entry()
                .values.is_video) && scope.entry()
                .values.is_video === true) {
                    scope.image = '/images/video.png';
            } else if (angular.isDefined(scope.entry()
                    .values['attachment.foreign_id']) && scope.entry()
                .values['attachment.foreign_id'] !== null && scope.entry()
                .values['attachment.foreign_id'] !== 0) {
                var hash = md5.createHash(scope.type + scope.entry()
                    .values['attachment.foreign_id'] + 'png' + scope.thumb);
                scope.image = '/images/' + scope.thumb + '/' + scope.type + '/' + scope.entry()
                    .values['attachment.foreign_id'] + '.' + hash + '.png';
            } else {
                scope.image = '/images/profile_default_avatar.png';
            }
        },
        template: '<img ng-src="{{image}}" height="42" width="42" />'
    };
});
ngapp.directive('userImage', function(md5) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.thumb = attrs.thumb;
            //  console.log(scope.entry().values['attachment.id']);
            if (angular.isDefined(scope.entry()
                    .values['attachment.foreign_id']) && scope.entry()
                .values['attachment.foreign_id'] !== null && scope.entry()
                .values['attachment.foreign_id'] !== 0) {
                var hash = md5.createHash(scope.type + scope.entry()
                    .values['attachment.foreign_id'] + 'png' + scope.thumb);
                scope.image = '/images/' + scope.thumb + '/' + scope.type + '/' + scope.entry()
                    .values['attachment.foreign_id'] + '.' + hash + '.png';
            } else {
                scope.image = '/images/profile_default_avatar.png';
            }
        },
        template: '<img ng-src="{{image}}" height="42" width="42" />'
    };
});
ngapp.directive('displayImages', function(md5) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.thumb = attrs.thumb;
            if (angular.isDefined(scope.entry()
                    .values['photo.attachment.foreign_id']) && scope.entry()
                .values['photo.attachment.foreign_id'] !== null && scope.entry()
                .values['photo.attachment.foreign_id'] !== 0) {
                var hash = md5.createHash(scope.type + scope.entry()
                    .values['photo.attachment.foreign_id'] + 'png' + scope.thumb);
                scope.image = '/images/' + scope.thumb + '/' + scope.type + '/' + scope.entry()
                    .values['photo.attachment.foreign_id'] + '.' + hash + '.png';
            } else {
                scope.image = '/images/no_image_available.png';
            }
        },
        template: '<img ng-src="{{image}}" height="42" width="42" />'
    };
});
ngapp.directive('displaysImage', function(md5) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.thumb = attrs.thumb;
            if (angular.isDefined(scope.entry()
                    .values['photo.attachment.foreign_id']) && scope.entry()
                .values['photo.attachment.foreign_id'] !== null && scope.entry()
                .values['photo.attachment.foreign_id'] !== 0) {
                var hash = md5.createHash(scope.type + scope.entry()
                    .values['photo.attachment.foreign_id'] + 'png' + scope.thumb);
                scope.image = '/images/' + scope.thumb + '/' + scope.type + '/' + scope.entry()
                    .values['photo.attachment.foreign_id'] + '.' + hash + '.png';
            } else {
                //  scope.image = '-';
            }
        },
        template: '<img ng-src="{{image}}" height="42" width="42" />'
    };
});

function truncate(value) {
    if (!value) {
        return '';
    }
    return value.length > 50 ? value.substr(0, 50) + '...' : value;
}
ngapp.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider, userTypes) {
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('Admin')
        .baseApiUrl(admin_api_url + 'api/v1/'); // main API endpoint;
    if (typeof auth !== 'undefined') {
        var role = nga.entity('roles');
        admin.addEntity(role);
        var setting_category = nga.entity('setting_categories');
        admin.addEntity(setting_category);
        var settings = nga.entity('settings');
        admin.addEntity(settings);
        var country = nga.entity('countries');
        admin.addEntity(country);
        var state = nga.entity('states');
        admin.addEntity(state);
        var city = nga.entity('cities');
        admin.addEntity(city);
        var page = nga.entity('pages');
        admin.addEntity(page);
        var email_template = nga.entity('email_templates');
        admin.addEntity(email_template);
        var provider = nga.entity('providers');
        admin.addEntity(provider);
        var language = nga.entity('languages');
        admin.addEntity(language);
        var contact = nga.entity('contacts');
        admin.addEntity(contact);
        var user = nga.entity('users');
        admin.addEntity(user);
        var myaccount = nga.entity('users');
        admin.addEntity(myaccount);
        var user_follow = nga.entity('user_follows');
        admin.addEntity(user_follow);
        var user_login = nga.entity('user_logins');
        admin.addEntity(user_login);
        var user_notification_setting = nga.entity('user_notification_settings');
        admin.addEntity(user_notification_setting);
        var photo = nga.entity('photos');
        admin.addEntity(photo);
        var photo_comment = nga.entity('photo_comments');
        admin.addEntity(photo_comment);
        var flag_category = nga.entity('flag_categories');
        admin.addEntity(flag_category);
        // var photo_flag = nga.entity('photo_flags');
        // admin.addEntity(photo_flag);
        var photo_like = nga.entity('photo_likes');
        admin.addEntity(photo_like);
        var flag = nga.entity('flags');
        admin.addEntity(flag);
        var photo_tag = nga.entity('photo_tags');
        admin.addEntity(photo_tag);
        var photo_view = nga.entity('photo_views');
        admin.addEntity(photo_view);
        var activity = nga.entity('activities');
        admin.addEntity(activity);
        var message = nga.entity('messages');
        admin.addEntity(message);
        //Menu configuration
        admin.menu(nga.menu()
            .addChild(nga.menu()
                .title('Dashboard')
                .icon('<span class="	glyphicon glyphicon-home"></span>'))
            .addChild(nga.menu(user)
                .title('Users')
                .icon('<span class="glyphicon glyphicon-user"></span>')
                .addChild(nga.menu(user)
                    .title('Users')
                    .icon('<span class="glyphicon glyphicon-user"></span>')))
            .addChild(nga.menu()
                .title('Lists')
                .icon('<span class="glyphicon glyphicon-list-alt"></span>')
                .addChild(nga.menu(photo)
                    .title('Photos')
                    .icon('<span class="glyphicon glyphicon-camera"></span>')))
            .addChild(nga.menu()
                .title('Activities')
                .icon('<span class="fa fa-users"></span>')
                /*  .addChild(nga.menu(activity)
                      .title('Activities')
                      .icon('<span class="fa fa-users"></span>'))*/
                .addChild(nga.menu(user_follow)
                    .title('User Follows')
                    .icon('<span class="glyphicon glyphicon-user"></span>'))
                .addChild(nga.menu(user_login)
                    .title('User Logins')
                    .icon('<span class="glyphicon glyphicon-user"></span>'))
                .addChild(nga.menu(photo_comment)
                    .title('Photo Comments')
                    .icon('<span class="glyphicon glyphicon-camera"></span>'))
                // .addChild(nga.menu(flag)
                //     .title('Photo Flags')
                //     .icon('<span class="glyphicon glyphicon-camera"></span>'))
                .addChild(nga.menu(photo_like)
                    .title('Photo Likes')
                    .icon('<span class="glyphicon glyphicon-camera"></span>'))
                .addChild(nga.menu(photo_view)
                    .title('Photo Views')
                    .icon('<span class="glyphicon glyphicon-camera"></span>')))
            /*.addChild(nga.menu(message)
                .title('Messages')
                .icon('<span class="glyphicon glyphicon-envelope"></span>'))*/
            .addChild(nga.menu()
                .title('Reports')
                .icon('<span class="glyphicon glyphicon-list-alt"></span>')
                .addChild(nga.menu(flag)
                    .title('Flags')
                    .icon('<span class="glyphicon glyphicon-camera"></span>')))
            .addChild(nga.menu()
                .title('Settings')
                .icon('<span class="glyphicon glyphicon-cog"></span>')
                .addChild(nga.menu(setting_category)
                    .title('Site Settings')
                    .icon('<span class="fa fa-cog"></span>')))
            .addChild(nga.menu()
                .title('Master')
                .icon('<span class="fa fa-user"></span>')
                // .addChild(nga.menu(city)
                //     .title('Cities')
                //     .icon('<span class="glyphicon glyphicon-map-marker"></span>'))
                // .addChild(nga.menu(state)
                //     .title('States')
                //     .icon('<span class="glyphicon glyphicon-map-marker"></span>'))
                // .addChild(nga.menu(country)
                //     .title('Countries')
                //     .icon('<span class="glyphicon glyphicon-map-marker"></span>'))
                .addChild(nga.menu(page)
                    .title('Pages')
                    .icon('<span class="glyphicon glyphicon-file"></span>'))
                // .addChild(nga.menu(language)
                //     .title('Languages')
                //     .icon('<span class="glyphicon glyphicon-file"></span>'))
                .addChild(nga.menu(contact)
                    .title('Contacts')
                    .icon('<span class="glyphicon glyphicon-earphone"></span>'))
                // .addChild(nga.menu(provider)
                //     .title('Providers')
                //     .icon('<span class="fa fa-users"></span>'))
                .addChild(nga.menu(email_template)
                    .title('Email Templates')
                    .icon('<span class="glyphicon glyphicon-envelope"></span>'))
                .addChild(nga.menu(photo_tag)
                    .title(' Tags')
                    .icon('<span class="glyphicon glyphicon-camera"></span>'))
                .addChild(nga.menu(flag_category)
                    .title(' Flag Categories')
                    .icon('<span class="glyphicon glyphicon-camera"></span>')))
            .addChild(nga.menu()
                .title('My account')
                .icon('<span class="glyphicon glyphicon-scale"></span>')
                .link('/users/edit/' + auth.id))
            .addChild(nga.menu()
                .title('Logout')
                .icon('<span class="glyphicon glyphicon-log-out"></span>')
                .link('/users/logout')));
        // setting
        var setting_category_list_tpl = '<ma-edit-button entry="entry" entity="entity" size="sm" label="Configure" ></ma-edit-button>';
        var setting_category_action_tpl = '<ma-filter-button filters="filters()" enabled-filters="enabledFilters" enable-filter="enableFilter()"></ma-filter-button>';
        setting_category.listView()
            .title('Site Settings')
            .fields([
                nga.field('id')
                .label('ID'),
                nga.field('name')
                .label('Name'),
                nga.field('description')
                .label('Description'),
            ])
            .batchActions([])
            .perPage(limit_per_page)
            .actions(setting_category_action_tpl)
            .listActions(setting_category_list_tpl)
        settings_category_edit_template = '<ma-list-button entry="entry" entity="entity" size="sm"></ma-list-button>';
        setting_category.editionView()
            .title('Edit Settings')
            .fields([
                nga.field('name')
                .editable(false)
                .label('Name'),
                nga.field('description')
                .editable(false)
                .label('Description'),
                nga.field('Related Settings', 'referenced_list') // display list of related settings
                .targetEntity(nga.entity('settings'))
                .targetReferenceField('setting_category_id')
                .targetFields([
                    nga.field('label')
                    .label('Name'),
                    nga.field('value')
                    .label('Value')
                ])
                .listActions(['edit']),
                nga.field('', 'template')
                .label('')
                .template('<add-sync entry="entry" entity="entity" size="sm" label="Synchronize with SudoPay" ></add-sync>'),
                nga.field('', 'template')
                .label('')
                .template('<mooc-sync entry="entry" entity="entity" size="sm" label="Synchronize with Mooc Affliate" ></mooc-sync>'),
            ])
            .actions(settings_category_edit_template);
        var setting_edit_template = '<ma-back-button></ma-back-button>';
        settings.editionView()
            .title('Edit - {{entry.values.label}}')
            .fields([
                nga.field('label')
                .editable(false)
                .label('Name'),
                nga.field('description')
                .editable(false)
                .label('Description'),
                nga.field('value', 'text')
                .template('<input-type entry="entry" entity="entity"></input-type>')
                .validation({
                    validator: function(value, entry) {
                        if (entry.name === "payment.is_live_mode" || entry.name === "paypal.is_live_mode" || entry.name === "course.is_auto_approval_enabled" || entry.name === "facebook.is_enabled_facebook_comment" || entry.name === "disqus.is_enabled_disqus_comment" || entry.name === "analytics.is_enabled_facebook_pixel" || entry.name === "analytics.is_enabled_google_analytics" || entry.name === "paypal.is_paypal_enabled_for_payments" || entry.name === "payment.is_sudopay_enabled_for_payments" || entry.name === "video.is_enabled_promo_video" || entry.name === "video.is_keep_original_video_file_in_server") {
                            if (value !== "0" && value !== "1") {
                                throw new Error('Value must be either 0 or 1');
                            }
                        } else if (entry.name === "course.max_course_fee") {
                            if (isNaN(value)) {
                                throw new Error('Value must be numeric');
                            }
                        } else if (entry.name === "video.max_size_to_allow_video_file") {
                            if (isNaN(value)) {
                                throw new Error('Value must be numeric');
                            }
                        }
                    }
                })
            ])
            .actions(setting_edit_template);
        /* photos */
        photo.listView()
            .title('Photos')
            .fields([nga.field('id')
                .label('Id'),
            nga.field('created_at')
                .label('Created'),
                nga.field('user.username')
                .label('User'),
                nga.field('attachment.filename')
                        .template('<display-image entry="entry" type="Photo" thumb="small_thumb" entity="entity"></display-image>')
                        .label('Photo'),
nga.field('description', 'wysiwyg')
                .label('Description'),
nga.field('tags', 'reference_many')
                    .targetEntity(nga.entity('photo_tags'))
                    .targetField(nga.field('name'))
                    .cssClasses('hidden-xs')
                    .singleApiCall(function(ids) {
                    return {
                        'id[]': ids
                    };
                }),
                nga.field('photo_like_count', 'number')
                .template('<a href="#/photo_likes/list?search=%7B%22photo_id%22:{{entry.values.id}}%7D">{{entry.values.photo_like_count}}</a>')
                .label('Likes'),
                nga.field('photo_comment_count', 'number')
                 .template('<a href="#/photo_comments/list?search=%7B%22photo_id%22:{{entry.values.id}}%7D">{{entry.values.photo_comment_count}}</a>')
                .label('Comments'),
                nga.field('photo_flag_count', 'number')
                .template('<a class="blackc" href="#/flags/list?search=%7B%22photo_id%22:{{entry.values.id}}%7D">{{entry.values.photo_flag_count}}</a>')
                .label('Flags'),
                nga.field('is_video', 'boolean')
                .label('Video?'),
                nga.field('is_attachment_to_view', 'boolean')
                .label('Attachment To View?'),
                nga.field('is_video_converting_is_processing', 'boolean')
                .label('Video Converting Is Processing?')                                                
            ])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
                    nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
            nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        /* photo_comments */
        photo_comment.listView()
            .title('Photo Comments')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
                nga.field('photo.attachment.filename')
            .template('<display-images entry="entry" type="Photo" thumb="medium_thumb" entity="entity"></display-images>')
            .label('Photo'),
nga.field('user.username')
                .label('User'),
nga.field('comment', 'wysiwyg')
                .map(truncate)
                .label('Comment')
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
                    nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
                  nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                }),
                 nga.field('photo_id', 'reference')
                        .targetEntity(photo)
                        .targetField(nga.field('id'))
                        .label('photo')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        photo_comment.creationView()
            .title('Photo Comments')
            .fields([nga.field('photo_id', 'number')
                .label('Photo Id'),

nga.field('comment', 'wysiwyg')
                .validation({
                    required: true
                })
                .attributes({
                    placeholder: 'Comment'
                })
                .label('Comment'),
]);
        photo_comment.editionView()
            .fields(photo_comment.creationView()
                .fields());
        /* photo_flag_categories */
        flag_category.listView()
            .title('Flag Categories')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),

nga.field('name')
                .label('Name'),
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template('')
]);
        flag_category.creationView()
            .title('Flag Categories')
            .fields([nga.field('name')
                .validation({
                    required: true
                })
                .attributes({
                    placeholder: 'Name'
                })
                .label('Name')
]);
        flag_category.showView()
            .title('Flag Categories')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),

nga.field('name')
                .label('Name')
]);
        flag_category.editionView()
            .fields(flag_category.creationView()
                .fields());
        /* photo_likes */
        photo_like.listView()
            .title('Photo Likes')
            .fields([nga.field('id')
                .label('Id'),
                nga.field('created_at')
                .label('Created'),
                 nga.field('photo.attachment.filename')
                        .template('<display-images entry="entry" type="Photo" thumb="medium_thumb" entity="entity"></display-images>')
                        .label('Photo'),
nga.field('user.username')
                .label('User')
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
                  nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                }),
                   nga.field('photo_id', 'reference')
                        .targetEntity(photo)
                        .targetField(nga.field('id'))
                        .label('photo')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        /**photo_views */
        photo_view.listView()
            .title('Photo Views')
            .fields([nga.field('id')
                .label('ID'),
nga.field('created_at')
                .label('Created At'),

                 nga.field('photo.attachment.filename')
                        .template('<display-images entry="entry" type="Photo" thumb="medium_thumb" entity="entity"></display-images>')
                        .label('Photo'), ,
nga.field('user.username')
                .label('User'),
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
                  nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        //photo_flag
        flag.listView()
            .title('Flags')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
 nga.field('photo.attachment.filename')
                        .template('<displays-image entry="entry" type="Photo" thumb="medium_thumb" entity="entity"></displays-image>')
                        .label('Image'),
// nga.field('flagged_user.username')
//                 .label('Flagged User'),

nga.field('user.username')
                .label('User'),
nga.field('flag_category.name')
                .label('Flag Category')
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
                   nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                }),
                 nga.field('photo_id', 'reference')
                        .targetEntity(photo)
                        .targetField(nga.field('id'))
                        .label('photo')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        flag.creationView()
            .title('Flags')
            .fields([nga.field('flagged_user_id', 'number')
                .attributes({
                    placeholder: 'Flagged User Id'
                })
                .label('Flagged User Id'),
nga.field('user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User')
                .remoteComplete(true),
nga.field('photo_id')
                .label('Photo Id'),
nga.field('flag_category_id', 'number')
                .validation({
                    required: true
                })
                .attributes({
                    placeholder: 'Flag Category Id'
                })
                .label('Flag Category Id'),
nga.field('type')
                .attributes({
                    placeholder: 'Type'
                })
                .label('Type'),
]);
        flag.showView()
            .title('Flags')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),

nga.field('flagged_user_id')
                .label('Flagged User Id'),
nga.field('user.username')
                .label('User'),

nga.field('ip.ip')
                .label('Ip'),
nga.field('flag_category_id')
                .label('Flag Category Id'),
nga.field('type')
                .label('Type'),
]);
        flag.editionView()
            .fields(flag.creationView()
                .fields());
        /* photo_tags */
        photo_tag.listView()
            .title('Photo Tags')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('name')
                .label('Name'),
nga.field('photo_count', 'number')
                .label('Photos'),
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template('')
]);
        /*activites*/
        activity.listView()
            .title('Activities')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('owner_user.username')
                .label('Owner User'),
nga.field('user.username')
                .label('User'),
nga.field('class')
                .label('Class'),
nga.field('type')
                .label('Type'),
nga.field('is_read', 'boolean')
                .label('Read?'),
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
nga.field('filter', 'choice')
                .choices([{
                    label: 'Active?',
                    value: true
                }, {
                    label: 'Inactive?',
                    value: false
                }])
]);
        /*message*/
        message.listView()
            .title('Messages')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User'),
nga.field('other_user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('Other User'),
nga.field('is_sender', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('Sender?'),
nga.field('is_read', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('Read?'),
nga.field('parent_message_id')
                .label('Parent Message Id'),
nga.field('message', 'wysiwyg')
                .map(truncate)
                .label('Message'),
nga.field('message_content_id')
                .label('Message Content Id'),
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['show', 'edit', 'delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
nga.field('filter', 'choice')
                .label('Status')
                .attributes({
                    placeholder: 'Status?'
                })
                .choices([{
                    label: 'Active?',
                    value: true
                }, {
                    label: 'Inactive',
                    value: false
                }])
]);
        message.creationView()
            .fields([nga.field('user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User')
                .remoteComplete(true),
            nga.field('other_user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('Other User')
                .remoteComplete(true),
nga.field('is_sender')
                .attributes({
                    placeholder: 'Sender?'
                })
                .label('Sender?'),
nga.field('is_read')
                .attributes({
                    placeholder: 'Read?'
                })
                .label('Read?'),
nga.field('parent_message_id', 'number')
                .attributes({
                    placeholder: 'Parent Message Id'
                })
                .label('Parent Message Id'),
nga.field('message', 'wysiwyg')
                .attributes({
                    placeholder: 'Message'
                })
                .label('Message'),
nga.field('message_content_id', 'number')
                .validation({
                    required: true
                })
                .attributes({
                    placeholder: 'Message Content Id'
                })
                .label('Message Content Id')
]);
        message.showView()
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('user_id')
                .label('User Id'),
nga.field('other_user_id')
                .label('Other User Id'),
nga.field('is_sender')
                .label('Sender?'),
nga.field('is_read')
                .label('Read?'),
nga.field('parent_message_id')
                .label('Parent Message Id'),
nga.field('message')
                .label('Message'),
nga.field('message_content_id')
                .label('Message Content Id')
]);
        message.editionView()
            .fields(message.creationView()
                .fields());
        /* country */
        country.listView()
            .title('Countries')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('name')
                        .label('Name'),
                nga.field('fips_code')
                        .label('Fips code'),
                nga.field('iso_alpha2')
                        .label('Iso2'),
                nga.field('iso_alpha3')
                        .label('Iso3'),
                ])
            .listActions(['show', 'edit', 'delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),

                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        country.creationView()
            .fields([nga.field('name')
                        .validation({
                    required: true
                })
                        .label('Name'),
                nga.field('fips_code')
                        .validation({
                    required: true
                })
                        .label('Fips code'),
                nga.field('iso_alpha2')
                        .validation({
                    required: true
                })
                        .label('Iso2'),
                nga.field('iso_alpha3')
                        .validation({
                    required: true
                })
                        .label('Iso3'),
                nga.field('iso_numeric', 'number')
                        .validation({
                    required: true
                })
                        .label('Ison'),
                nga.field('capital')
                        .label('Capital'),
                nga.field('population', 'number')
                        .label('Population'),
                nga.field('continent')
                        .label('Continent'),
                nga.field('tld')
                        .label('Tld'),
                nga.field('currency')
                        .label('Currency'),
                nga.field('currencyname')
                        .label('Currency Name'),
                nga.field('phone', 'number')
                        .label('Phone'),
                nga.field('postalcodeformat')
                        .label('Postal Code Format'),
                nga.field('postalcoderegex')
                        .label('Postal Code Regex'),
                nga.field('languages')
                        .label('Languages'),
                nga.field('geonameid', 'number')
                        .label('Geo Name Id'),
                nga.field('neighbours')
                        .label('Neighbours'),
                nga.field('equivalentfipscode')
                        .label('Equivalent Fips Code')
                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        country.showView()
            .fields([nga.field('iso_alpha2')
                            .label('Iso Alpha2'),
            nga.field('iso_alpha3')
                            .label('Iso Alpha3'),
            nga.field('iso_numeric')
                            .label('Iso Numeric'),
            nga.field('fips_code')
                            .label('Fips Code'),
            nga.field('name')
                            .label('Name'),
            nga.field('capital')
                            .label('Capital'),
            nga.field('population')
                            .label('Population'),
            nga.field('continent')
                            .label('Continent'),
            nga.field('tld')
                            .label('Tld'),
            nga.field('currency')
                            .label('Currency'),
            nga.field('currencyname')
                            .label('Currencyname'),
            nga.field('phone')
                            .label('Phone'),
            nga.field('postalcodeformat')
                            .label('Postalcodeformat'),
            nga.field('postalcoderegex')
                            .label('Postalcoderegex'),
            nga.field('languages')
                            .label('Languages'),
            nga.field('geonameid')
                            .label('Geonameid'),
            nga.field('neighbours')
                            .label('Neighbours'),
            nga.field('equivalentfipscode')
                            .label('Equivalentfipscode'),
            nga.field('created_at')
                            .label('Created')

            ]);
        country.editionView()
            .fields(country.creationView()
                .fields());
        /* state */
        state.listView()
            .title('States')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('country_id', 'reference')
                        .targetEntity(country)
                        .targetField(nga.field('name'))
                        .label('Country')
                        .isDetailLink(false)
                        .singleApiCall(function(countryIds) {
                    return {
                        'country_id[]': countryIds
                    };
                }),
                nga.field('name')
                        .label('Name'),
                nga.field('state_code')
                        .label('State Code'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ])
            .listActions(['show', 'edit', 'delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),

                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        state.creationView()
            .fields([nga.field('country_id', 'reference')
                        .targetEntity(country)
                        .targetField(nga.field('name'))
                        .label('Country')
                        .remoteComplete(true),
                nga.field('name')
                        .label('Name'),
                nga.field('state_code')
                        .label('State Code'),
                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        state.showView()
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('country_id', 'reference')
                        .targetEntity(country)
                        .targetField(nga.field('name'))
                        .label('Country Name'),
                nga.field('name')
                        .label('Name'),
                nga.field('state_code')
                        .label('State Code'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ]);
        state.editionView()
            .fields(state.creationView()
                .fields());
        /* city */
        city.listView()
            .title('Cities')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('country_id', 'reference')
                        .targetEntity(country)
                        .targetField(nga.field('name'))
                        .label('Country name')
                        .isDetailLink(false)
                        .singleApiCall(function(countryIds) {
                    return {
                        'country_id[]': countryIds
                    };
                }),
                nga.field('state_id', 'reference')
                        .targetEntity(state)
                        .targetField(nga.field('name'))
                        .label('State')
                        .isDetailLink(false)
                        .singleApiCall(function(stateIds) {
                    return {
                        'state_id[]': stateIds
                    };
                }),
                nga.field('name')
                        .label('Name'),
                nga.field('city_code')
                        .label('City Code'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ])
            .filters([nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ])
            .listActions(['show', 'edit', 'delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),

                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        city.creationView()
            .fields([nga.field('country_id', 'reference')
                        .targetEntity(country)
                        .targetField(nga.field('name'))
                        .label('Country')
                        .remoteComplete(true),
                nga.field('state_id', 'reference')
                        .targetEntity(state)
                        .targetField(nga.field('name'))
                        .label('State')
                        .remoteComplete(true),
                nga.field('name')
                        .validation({
                    required: true
                })
                        .label('Name'),
                nga.field('city_code')
                        .validation({
                    required: true
                })
                        .label('City Code'),
                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }]),
                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        city.showView()
            .fields([nga.field('created_at')
                        .label('Created'),
                 nga.field('country_id', 'reference')
                        .targetEntity(country)
                        .targetField(nga.field('name'))
                        .label('Country name')
                        .isDetailLink(false),
                nga.field('state_id', 'reference')
                        .targetEntity(state)
                        .targetField(nga.field('name'))
                        .label('State')
                        .isDetailLink(false),
                nga.field('name')
                        .label('Name'),
                nga.field('city_code')
                        .label('City Code'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ]);
        city.editionView()
            .fields(city.creationView()
                .fields());
        /* page */
        page.listView()
            .title('Pages')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('title')
                        .label('Title'),
                nga.field('content', 'wysiwyg')
                        .stripTags(true)
                        .label('Content'),
                nga.field('is_active', 'boolean')
                        .label('Active?'),
                ])
            .listActions(['show', 'edit', 'delete'])
            .actions(['batch', 'filter', 'create'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),

                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        page.creationView()
            .fields([nga.field('title')
                        .validation({
                    required: true
                })
                        .label('Title'),
                nga.field('content', 'wysiwyg')
                        .validation({
                    required: true
                })
                        .label('Content'),
                nga.field('meta_keywords')
                        .label('Meta Keywords'),
                nga.field('meta_description', 'text')
                        .label('Meta Description'),
                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        page.showView()
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('title')
                        .label('Title'),
                nga.field('content')
                        .label('Content'),
                nga.field('meta_keywords')
                        .label('Meta Keywords'),
                nga.field('meta_description')
                        .label('Meta Description'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ]);
        page.editionView()
            .fields(page.creationView()
                .fields());
        /* email templates */
        email_template.listView()
            .title('Email Templates')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('display_label')
                        .label('Name'),
                nga.field('from')
                        .label('From Name'),
                nga.field('subject')
                        .label('Subject'),
                nga.field('email_content')
                        .label('Content')
                ])
            .listActions(['edit'])
            .actions(['batch'])
            .batchActions([])
            //             .filters([
            // nga.field('q')
            //                 .label('Search', 'template')
            //                 .pinned(true)
            //                 .template(''),
            //                 nga.field('is_active', 'choice')
            //                         .label('Active?')
            //                         .choices([{
            //                     label: 'Yes',
            //                     value: true
            //                         }, {
            //                     label: 'No',
            //                     value: false
            //                         }])
            //                         ]);
        email_template.editionView()
            .fields([nga.field('display_label')
                        .editable(false)
                        .label('Name'),
                nga.field('from')
                        .validation({
                    required: true
                })
                        .label('From Name'),
                nga.field('subject')
                        .validation({
                    required: true
                })
                        .label('Subject'),
                nga.field('email_content', 'text')
                        .validation({
                    required: true
                })
                        .label('Content'),
                nga.field('email_variables')
                        .editable(false)
                        .label('Constant for Subject and Content'),
                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        /* providers */
        provider.listView()
            .title('Providers')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('name')
                        .label('Name'),
                nga.field('api_key')
                        .label('Client ID'),
                nga.field('secret_key')
                        .label('Secret Key'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ])
            .batchActions([])
            .listActions(['edit'])
            .filters([nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        provider.editionView()
            .fields([nga.field('name')
                        .validation({
                    required: true
                })
                        .label('Name'),
                nga.field('api_key')
                        .validation({
                    required: true
                })
                        .label('Client ID'),
                nga.field('secret_key')
                        .validation({
                    required: true
                })
                        .label('Secret Key'),
                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                ]);
        /* language */
        language.listView()
            .title('Languages')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('name')
                        .label('Name'),
                nga.field('iso2')
                        .label('Iso2'),
                nga.field('iso3')
                        .label('Iso3'),
                nga.field('is_active', 'boolean')
                        .label('Active?'),
                ])
            .listActions(['show', 'edit', 'delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),

                nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        language.creationView()
            .fields([nga.field('name')
                        .validation({
                    required: true
                })
                        .label('Name'),
                nga.field('iso2')
                        .validation({
                    required: true
                })
                        .label('Iso2'),
                nga.field('iso3')
                        .validation({
                    required: true
                })
                        .label('Iso3'),
                nga.field('is_active', 'choice')
                .label('Active?')
                .choices([{
                    label: 'Yes',
                    value: true
                }, {
                    label: 'No',
                    value: false
                }]),
                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        language.showView()
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('name')
                        .label('Name'),
                nga.field('iso2')
                        .label('Iso2'),
                nga.field('iso3')
                        .label('Iso3'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ]);
        language.editionView()
            .fields(language.creationView()
                .fields());
        /* contact */
        contact.listView()
            .title('Contacts')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('first_name')
                        .label('First Name'),
                nga.field('last_name')
                        .label('Last Name'),
                nga.field('email')
                        .label('Email'),
                nga.field('phone')
                        .label('Phone'),
                nga.field('subject')
                        .label('Subject'),
                nga.field('message')
                        .label('Message'),
                ])
            .listActions(['show', 'delete'])
            .actions(['batch'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
                        ]);
        contact.showView()
            .fields([nga.field('created_at')
                        .label('Created'),
                nga.field('first_name')
                        .label('First Name'),
                nga.field('last_name')
                        .label('Last Name'),
                nga.field('email')
                        .label('Email'),
                nga.field('phone')
                        .label('Phone'),
                nga.field('subject')
                        .label('Subject'),
                nga.field('message')
                        .label('Message'),
                ]);
        /** users **/
        user.listView()
            .title('Users')
            .infinitePagination(false)
            .perPage(limit_per_page)
            .fields([nga.field('id')
                .label('Id'),
              nga.field('created_at')
                .label('Created'),
                    nga.field('username')
                        .label('User'),
                        nga.field('attachment.filename')
                        .template('<user-image entry="entry" type="UserAvatar" thumb="medium_thumb" entity="entity"></user-image>')
                        .label('UserAvatar'),
                nga.field('role_id', 'reference')
                        .targetEntity(role)
                        .targetField(nga.field('name'))
                        .label('Role')
                        .isDetailLink(false)
                        .singleApiCall(function(roleIds) {
                    return {
                        'role_id[]': roleIds
                    };
                }),
                nga.field('email')
                        .label('Email'),
                        nga.field('photo_count', 'number')
                        .template('<a href="#/photos/list?search=%7B%22user_id%22:{{entry.values.id}}%7D">{{entry.values.photo_count}}</a>')
                .label('Photos'),
                nga.field('user_following_count', 'number')
                .template('<a href="#/user_follows/list?search=%7B%22user_id%22:{{entry.values.id}}%7D">{{entry.values.user_following_count}}</a>')
                .label(' Followings'),
                nga.field('user_follower_count', 'number')
                .template('<a href="#/user_follows/list?search=%7B%22following_user%22:{{entry.values.id}}%7D">{{entry.values.user_follower_count}}</a>')
                .label(' Followers'),
                nga.field('user_login_count', 'number')
                 .template('<a href="#/user_logins/list?search=%7B%22user_id%22:{{entry.values.id}}%7D">{{entry.values.user_login_count}}</a>')
                .label(' Logins'),
                nga.field('is_active', 'boolean')
                        .label('Active?')
                ])
            .listActions(['show', 'edit', 'delete'])
            .actions(['batch', , 'filter', 'create'])
            .filters([nga.field('role_id', 'reference')
                        .targetEntity(role)
                        .targetField(nga.field('name'))
                        .label('Role')
                        .remoteComplete(true),
                        nga.field('is_active', 'choice')
                        .label('Active?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])
                        ]);
        user.creationView()
            .fields([nga.field('role_id', 'reference')
                        .targetEntity(role)
                        .targetField(nga.field('name'))
                        .label('Role')
                        .validation({
                    required: true
                })
                        .remoteComplete(true),

                          nga.field('first_name')
                    .label('First Name'),
                     nga.field('middle_name')
                    .label('Middle Name'),
                nga.field('last_name')
                    .label('Last Name'),
                nga.field('email', 'email')
                        .validation({
                    required: true
                })
                        .label('Email'),
                         nga.field('mobile')
                    .label('Mobile'),
                      nga.field('username')
                        .validation({
                    required: true
                })
                        .label('Username'),
                        nga.field('password', 'password')
                        .validation({
                    required: true
                })
                        .label('Password'),
                nga.field('is_active', 'choice')
                    .label('Active?')
                    .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }]),
                nga.field('is_agree_terms_conditions', 'choice')
                        .label('Agree Terms Conditions?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])

                ])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }])
            .onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
                angular.forEach(error.data.errors, function(value, key) {
                    if (this[key]) {
                        this[key].$valid = false;
                    }
                }, form);
                progression.done();
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
                return false;
                }]);
        user.showView()
            .fields([nga.field('created_at')
                        .label('Created'),
                 nga.field('role_id', 'reference')
                        .targetEntity(role)
                        .targetField(nga.field('name'))
                        .label('Role')
                        .isDetailLink(false)
                        .singleApiCall(function(roleIds) {
                    return {
                        'role_id[]': roleIds
                    };
                }),
                nga.field('first_name')
                    .label('First Name'),
                nga.field('middle_name')
                    .label('Middle Name'),
                nga.field('last_name')
                    .label('Last Name'),
                nga.field('email')
                        .label('Email Address'),
                nga.field('full_address')
                        .label('Location'),
                 nga.field('website')
                    .label('Website'),
                nga.field('about_me')
                    .label('Bio'),
                    nga.field('educations')
                    .label('Education'),
                     nga.field('brands')
                    .label('Brands'),
                //     nga.field('user_following_count', 'number')
                // .label(' Followings'),
                //     nga.field('user_follower_count', 'number')
                // .label('Followers'),
                // nga.field('user_login_count', 'number')
                // .label(' Logins'),
                // nga.field('photo_count', 'number')
                // .label('Photos'),
                nga.field('is_active', 'boolean')
                    .label('Active?'),
                 nga.field('is_email_confirmed')
                .label('Email Confirmed?'),
                nga.field('is_agree_terms_conditions')
                .label('Agree Terms Conditions?'),
                ]);
        user.editionView()
            .fields([nga.field('role_id', 'reference')
                        .targetEntity(role)
                        .targetField(nga.field('name'))
                        .label('Role')
                        .validation({
                    required: true
                }),
                  nga.field('first_name')
                    .label('First Name'),
                nga.field('middle_name')
                .label('Middle Name'),
                nga.field('last_name')
                    .label('Last Name'),
                        nga.field('email')
                .label('Email Address'),
              //   nga.field('username')
                // .label('Username'),
                //    nga.field('password')
                // .label('Password'),
                 nga.field('location')
                        .template('<google-places entry="entry" entity="entity"></google-places>')
                        .validation({
                    required: true
                })
                        .label('Location'),
                nga.field('address')
                    .validation({
                    required: true,
                })
                    .label('Address'),
                nga.field('address1')
                    .validation({
                    required: true,
                })
                    .label('Area'),
                nga.field('city.name')
                    .validation({
                    required: true,
                })
                    .label('City'),
                nga.field('state.name')
                    .validation({
                    required: true,
                })
                    .label('State'),
                nga.field('country.iso_alpha2')
                    .validation({
                    required: true,
                })
                    .label('Country'),
                nga.field('zip_code')
                    .validation({
                    required: true,
                })
                    .label('Zip Code'),
                nga.field('website')
                .label('Website'),
                  nga.field('about_me', 'text')
                    .label('Bio'),
                  nga.field('educations', 'text')
                .map(truncate)
                .label('Education'),
                 nga.field('recognitions', 'text')
                .map(truncate)
                .label('Recognitions'),
                nga.field('brands', 'text')
                .map(truncate)
                .label('Brands'),
                nga.field('is_active', 'choice')
                    .label('Active?')
                    .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }]),
                 nga.field('is_agree_terms_conditions', 'choice')
                        .label('Agree Terms Conditions?')
                        .choices([{
                    label: 'Yes',
                    value: true
                        }, {
                    label: 'No',
                    value: false
                        }])

                ])
            .actions(['batch'])
            .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                $state.go($state.get('list'), {
                    entity: entity.name()
                });
                return false;
                }]);
        /* user_follows */
        user_follow.listView()
            .title('User follows')
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('user.username')
                .label('User'),
nga.field('following_user.username')
                .label('Follows')
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
                  nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                }),
                 nga.field('following_user', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('Follows')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        /* user_logins */
        user_login.listView()
            .title('User Logins')
            .fields([nga.field('id')
                .label('Id'),
            nga.field('created_at')
                .label('Created'),
        nga.field('user.username')
                .label('User'),
                // nga.field('ip.ip')
                // .label('IP'),
        nga.field('user_agent', 'wysiwyg')
                .map(truncate)
                .label('User Agent')
        ])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['delete'])
            .actions(['batch', 'filter'])
            .filters([
                  nga.field('user_id', 'reference')
                        .targetEntity(user)
                        .targetField(nga.field('username'))
                        .label('User')
                        .remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                })
]);
        /* user_notification_settings */
        user_notification_setting.listView()
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User'),
nga.field('is_enable_email_when_someone_follow_me', 'boolean')
                .label('Enable Email When Someone Follow Me?'),
nga.field('is_enable_email_when_someone_mentioned_me', 'boolean')
                .label('Enable Email When Someone Mentioned Me?'),
nga.field('is_enable_email_when_someone_message_me', 'boolean')
                .label('Enable Email When Someone Message Me?'),
nga.field('is_enable_subscribe_me_for_newsletter', 'boolean')
                .label('Enable Subscribe Me For Newsletter?'),
nga.field('is_enable_subscribe_me_for_weeky_replay', 'boolean')
                .label('Enable Subscribe Me For Weeky Replay?'),
])
            .infinitePagination(false)
            .perPage(limit_per_page)
            .listActions(['show', 'edit', 'delete'])
            .filters([
nga.field('q')
                .label('Search', 'template')
                .pinned(true)
                .template(''),
nga.field('filter', 'choice')
                .label('Status')
                .attributes({
                    placeholder: 'Status?'
                })
                .choices([{
                    label: 'Active?',
                    value: true
                }, {
                    label: 'Inactive',
                    value: false
                }])
]);
        user_notification_setting.creationView()
            .fields([nga.field('user_id', 'reference')
                .targetEntity(user)
                .targetField(nga.field('username'))
                .label('User')
                .remoteComplete(true),
nga.field('is_enable_email_when_someone_follow_me', 'boolean')
                .attributes({
                    placeholder: 'Is Enable Email When Someone Follow Me'
                })
                .label('Is Enable Email When Someone Follow Me'),
nga.field('is_enable_email_when_someone_mentioned_me', 'boolean')
                .attributes({
                    placeholder: 'Is Enable Email When Someone Mentioned Me'
                })
                .label('Is Enable Email When Someone Mentioned Me'),
nga.field('is_enable_email_when_someone_message_me', 'boolean')
                .attributes({
                    placeholder: 'Is Enable Email When Someone Message Me'
                })
                .label('Is Enable Email When Someone Message Me'),
nga.field('is_enable_subscribe_me_for_newsletter', 'boolean')
                .attributes({
                    placeholder: 'Is Enable Subscribe Me For Newsletter'
                })
                .label('Is Enable Subscribe Me For Newsletter'),
nga.field('is_enable_subscribe_me_for_weeky_replay', 'boolean')
                .attributes({
                    placeholder: 'Is Enable Subscribe Me For Weeky Replay'
                })
                .label('Is Enable Subscribe Me For Weeky Replay')
]);
        user_notification_setting.showView()
            .fields([nga.field('id')
                .label('Id'),
nga.field('created_at')
                .label('Created'),
nga.field('user_id')
                .label('User Id'),
nga.field('is_enable_email_when_someone_follow_me')
                .label('Is Enable Email When Someone Follow Me'),
nga.field('is_enable_email_when_someone_mentioned_me')
                .label('Is Enable Email When Someone Mentioned Me'),
nga.field('is_enable_email_when_someone_message_me')
                .label('Is Enable Email When Someone Message Me'),
nga.field('is_enable_subscribe_me_for_newsletter')
                .label('Is Enable Subscribe Me For Newsletter'),
nga.field('is_enable_subscribe_me_for_weeky_replay')
                .label('Is Enable Subscribe Me For Weeky Replay')
]);
        user_notification_setting.editionView()
            .fields(user_notification_setting.creationView()
                .fields());
        // customize dashboard
        var dashboardTpl = '<div class="row list-header"><div class="col-lg-12"><div class="page-header">' + '<h4><span>Dashboard</span></h4></div></div></div>' + '<dashboard-summary></dashboard-summary>' + '<div class="row dashboard-content"><div class="col-lg-12"><div class="panel panel-default"><ma-dashboard-panel collection="dashboardController.collections.recent_users" entries="dashboardController.entries.recent_users" datastore="dashboardController.datastore"></div></div>';
        admin.dashboard(nga.dashboard()
            .addCollection(nga.collection(user)
                .name('recent_users')
                .title('Recent Users')
                .perPage(10)
                .fields([
                        nga.field('username')
                                .label('Username'),
                        nga.field('email')
                                .label('Email address'),
                       nga.field('role_id', 'reference')
                        .targetEntity(role)
                        .targetField(nga.field('name'))
                        .label('Role')
                        .isDetailLink(false)
                        .singleApiCall(function(roleIds) {
                        return {
                            'role_id[]': roleIds
                        };
                    }),
                    ])
                .order(1))
            .template(dashboardTpl));
    }
    nga.configure(admin);
}]);
ngapp.run(['$rootScope', '$location', '$window', '$state', '$cookies', function($rootScope, $location, $window, $state, $cookies) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var url = toState.name;
        var exception_arr = ['login', 'logout'];
        if (($cookies.get("auth") === null || $cookies.get("auth") === undefined) && exception_arr.indexOf(url) === -1) {
            $location.path('/users/login');
        }
        if (exception_arr.indexOf(url) === 0 && $cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            $location.path('/dashboard');
        }
        if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            var auth = JSON.parse($cookies.get("auth"));
            if (auth.role_id === 2) {
                $location.path('/users/logout');
            }
        }
    });
}]);