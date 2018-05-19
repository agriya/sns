<?php
/**
 * SNS API
 *
 * PHP version 5
 *
* @category   PHP
* @package    SNS
* @subpackage Core
* @author     Agriya <info@agriya.com>
* @copyright  2018 Agriya Infoway Private Ltd
* @license    http://www.agriya.com/ Agriya Infoway Licence
* @link       http://www.agriya.com
 */
require_once __DIR__ . '/../../config.inc.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once '../lib/database.php';
require_once '../lib/vendors/Inflector.php';
require_once '../lib/core.php';
require_once '../lib/constants.php';
require_once '../lib/vendors/OAuth2/Autoloader.php';
//Settings define
require_once '../lib/settings.php';
use Illuminate\Pagination\Paginator;
use Carbon\Carbon;

Paginator::currentPageResolver(function ($pageName) {

    return empty($_GET[$pageName]) ? 1 : $_GET[$pageName];
});
$config = ['settings' => ['displayErrorDetails' => R_DEBUG]];
$app = new Slim\App($config);
$app->add(new \pavlakis\cli\CliRequest());
//ACL
require_once '../lib/acl.php';
/**
 * GET oauthGet
 * Summary: Get site token
 * Notes: oauth
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/oauth/token', function ($request, $response, $args) {

    $post_val = array(
        'grant_type' => 'client_credentials',
        'client_id' => OAUTH_CLIENT_ID,
        'client_secret' => OAUTH_CLIENT_SECRET
    );
    $response = getToken($post_val);
    return renderWithJson($response);
});
/**
 * GET oauthRefreshTokenGet
 * Summary: Get site refresh token
 * Notes: oauth
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/oauth/refresh_token', function ($request, $response, $args) {

    $post_val = array(
        'grant_type' => 'refresh_token',
        'refresh_token' => $_GET['token'],
        'client_id' => OAUTH_CLIENT_ID,
        'client_secret' => OAUTH_CLIENT_SECRET
    );
    $response = getToken($post_val);
    return renderWithJson($response);
});
/**
 * GET usersLogoutGet
 * Summary: User Logout
 * Notes: oauth
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users/logout', function ($request, $response, $args) {

    if (!empty($_GET['token'])) {
        try {
            $oauth = Models\OauthAccessToken::where('access_token', $_GET['token'])->delete();
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson(array(), 'Please verify in your token', '', 1);
        }
    }
});
/**
 * POST userSocialLoginPost
 * Summary: User Social Login
 * Notes:  Social Login
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/users/social_login', function ($request, $response, $args) {

    $body = $request->getParsedBody();
    $result = array();
    if (!empty($_GET['type'])) {
        $response = social_auth_login($_GET['type'], $body);
        return renderWithJson($response);
    } else {
        return renderWithJson($result, 'Please choose one provider.', '', 1);
    }
});
/**
 * Get userSocialLoginGet
 * Summary: Social Login for twitter
 * Notes: Social Login for twitter
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users/social_login', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    if (!empty($queryParams['type'])) {
        $response = social_auth_login($queryParams['type']);
        return renderWithJson($response);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
});
/**
 * DELETE ContactsContactIdDelete
 * Summary: DELETE contact Id by admin
 * Notes: DELETE contact Id by admin
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/contacts/{contactId}', function ($request, $response, $args) {

    $result = array();
    $contact = Models\Contact::find($request->getAttribute('contactId'));
    try {
        $contact->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Contact could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteContact'));
/**
 * GET ContactsGet
 * Summary: Get  contact lists
 * Notes: Get contact lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/contacts', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $contacts = Models\Contact::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $contacts['data'];
        unset($contacts['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $contacts
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canListContact'));
/**
 * GET ContactscontactIdGet
 * Summary: get particular contact details
 * Notes: get particular contact details
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/contacts/{contactId}', function ($request, $response, $args) {

    $result = array();
    $contact = Models\Contact::find($request->getAttribute('contactId'));
    if (!empty($contact)) {
        $result['data'] = $contact->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewContact'));
/**
 * POST contactPost
 * Summary: add contact
 * Notes: add contact
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/contacts', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $contact = new Models\Contact;
    $validationErrorFields = $contact->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $contact->{$key} = $arg;
        }
        $contact->ip_id = saveIp();
        try {
            $contact->save();
            $contact_list = Models\Contact::with('ip')->where('id', $contact->id)->first();
            $emailFindReplace = array(
                '##FIRST_NAME##' => $contact_list['first_name'],
                '##LAST_NAME##' => $contact_list['last_name'],
                '##FROM_EMAIL##' => $contact_list['email'],
                '##IP##' => $contact_list['ip']['ip'],
                '##TELEPHONE##' => $contact_list['phone'],
                '##MESSAGE##' => $contact_list['message'],
                '##SUBJECT##' => $contact_list['subject']
            );
            sendMail('contactus', $emailFindReplace, SITE_CONTACT_EMAIL);
            $result['data'] = $contact->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Contact user could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Contact could not be added. Please, try again.', $validationErrorFields, 1);
    }
});
/**
 * POST LanguagePost
 * Summary: add language
 * Notes: add language
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/languages', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $language = new Models\Language;
    $validationErrorFields = $language->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $language->{$key} = $arg;
        }
        try {            
            $language->save();            
            $result['data'] = $language->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {           
            return renderWithJson($result, 'Language user could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Language could not be added. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canCreateLanguage'));
/**
 * DELETE LanguageLanguageIdDelete
 * Summary: DELETE language by its id
 * Notes: DELETE language.
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/languages/{languageId}', function ($request, $response, $args) {

    $result = array();
    $language = Models\Language::find($request->getAttribute('languageId'));
    try {
        $language->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Language could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteLanguage'));
/**
 * GET LanguageGet
 * Summary: Filter  language
 * Notes: Filter language.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/languages', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }            
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
                $result['data'] =  Models\Language::get()->toArray();

        }else{
        $language = Models\Language::Filter($queryParams)->where('is_active', 1)->paginate($count)->toArray();
        $data = $language['data'];
        unset($language['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $language
        );
        }
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT LanguagelanguageIdPut
 * Summary: Update language by admin
 * Notes: Update language by admin
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/languages/{languageId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $language = Models\Language::find($request->getAttribute('languageId'));
    $validationErrorFields = $language->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $language->{$key} = $arg;
        }
        try {
            $language->save();
            $result['data'] = $language->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Language could not be updated. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Language could not be added. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateLanguage'));
/**
 * GET LanguagelanguageIdGet
 * Summary: Get particular language
 * Notes: Get particular language.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/languages/{languageId}', function ($request, $response, $args) {

    $result = array();
    $language = Models\Language::find($request->getAttribute('languageId'));
    if (!empty($language)) {
        $result['data'] = $language->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'Language not found', '', 1);
    }
})->add(new ACL('canViewLanguage'));
/**
 * POST pagePost
 * Summary: Create New page
 * Notes: Create page.
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/pages', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $page = new Models\Page;
    $validationErrorFields = $page->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $page->{$key} = $arg;
        }
        $page->slug = Inflector::slug(strtolower($page->title), '-');
        try {
            $page->save();
            $result['data'] = $page->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Page user could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Page could not be added. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canCreatePage'));
/**
 * DELETE PagepageIdDelete
 * Summary: DELETE page by admin
 * Notes: DELETE page by admin
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/pages/{pageId}', function ($request, $response, $args) {

    $result = array();
    $page = Models\Page::find($request->getAttribute('pageId'));
    try {
        $page->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Page could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeletePage'));
/**
 * GET PagesGet
 * Summary: Filter  pages
 * Notes: Filter pages.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/pages', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $pages = Models\Page::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $pages['data'];
        unset($pages['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $pages
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT PagepageIdPut
 * Summary: Update page by admin
 * Notes: Update page by admin
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/pages/{pageId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $page = Models\Page::find($request->getAttribute('pageId'));
    $validationErrorFields = $page->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $page->{$key} = $arg;
        }
        $page->slug = Inflector::slug(strtolower($page->title), '-');
        try {
            $page->save();
            $result['data'] = $page->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Page could not be updated. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Page could not be updated. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdatePage'));
/**
 * GET PagePageIdGet.
 * Summary: Get page.
 * Notes: Get page.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/pages/{pageId}', function ($request, $response, $args) {

    $result = array();
    $page = Models\Page::find($request->getAttribute('pageId'));
    if (!empty($page)) {
        $result['data'] = $page->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'Language not found', '', 1);
    }
});
/**
 * POST citiesPost
 * Summary: create new city
 * Notes: create new city
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/cities', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $city = new Models\City;
    $validationErrorFields = $city->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $city->{$key} = $arg;
        }
        $city->slug = Inflector::slug(strtolower($city->name), '-');
        try {
            $city->save();
            $result['data'] = $city->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'City could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'city could not be added. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canCreateCity'));
/**
 * DELETE CitiesCityIdDelete
 * Summary: DELETE city by admin
 * Notes: DELETE city by admin
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/cities/{cityId}', function ($request, $response, $args) {

    $result = array();
    $city = Models\City::find($request->getAttribute('cityId'));
    try {
        $city->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'City could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteCity'));
/**
 * GET CitiesGet
 * Summary: Filter  cities
 * Notes: Filter cities.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/cities', function ($request, $response, $args) {
    global $authUser;
    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        if (!isset($queryParams['limit']) || ($queryParams['limit'] == 'all')) {
           $queryParams['limit']=Models\City::count();
        }
        if (!isset($queryParams['filter']) || ($queryParams['filter'] == 'active') || empty($authUser) || (!empty($authUser) && $authUser['role_id'] == 2)) {
            $cities = Models\City::with('country', 'state')->Filter($queryParams)->where('is_active', 1)->paginate($queryParams['limit'])->toArray();
        } else {
            // Active and inactive filte are handled through AppModel scopeFilter function
            $cities = Models\City::with('country', 'state')->Filter($queryParams)->paginate($queryParams['limit'])->toArray();            
        }            
            $data = $cities['data'];
            unset($cities['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $cities
            );
        
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT CitiesCityIdPut
 * Summary: Update city by admin
 * Notes: Update city by admin
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/cities/{cityId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $city = Models\City::find($request->getAttribute('cityId'));
    $validationErrorFields = $city->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $city->{$key} = $arg;
        }
        $city->slug = Inflector::slug(strtolower($city->name), '-');
        try {
            $city->save();
            $result['data'] = $city->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'City could not be updated. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'City could not be updated. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateCity'));
/**
 * GET CitiesGet
 * Summary: Get  particular city
 * Notes: Get  particular city
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/cities/{cityId}', function ($request, $response, $args) {

    $result = array();
    $city = Models\City::find($request->getAttribute('cityId'));
    if (!empty($city)) {
        $result['data'] = $city->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
});
/**
 * POST countriesPost
 * Summary: Create New countries
 * Notes: Create countries.
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/countries', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $country = new Models\Country;
    $validationErrorFields = $country->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $country->{$key} = $arg;
        }
        try {
            $country->save();
            $result['data'] = $country->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Country could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Country could not be added. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canCreateCountry'));
/**
 * DELETE countrycountryIdDelete
 * Summary: DELETE country by admin
 * Notes: DELETE country.
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/countries/{countryId}', function ($request, $response, $args) {

    $result = array();
    $country = Models\Country::find($request->getAttribute('countryId'));
    try {
        $country->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Country could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteCountry'));
/**
 * GET countriesGet
 * Summary: Filter  countries
 * Notes: Filter countries.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/countries', function ($request, $response, $args) use ($app) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }            
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
                $result['data'] =  Models\Country::get()->toArray();

        }else{        
            $countries = Models\Country::Filter($queryParams)->paginate($count)->toArray();
            $data = $countries['data'];
            unset($countries['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $countries
            );
        }
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT countriesCountryIdPut
 * Summary: Update countries by admin
 * Notes: Update countries.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/countries/{countryId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $country = Models\Country::find($request->getAttribute('countryId'));
    $validationErrorFields = $country->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $country->{$key} = $arg;
        }
        try {
            $country->save();
            $result['data'] = $country->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Country could not be updated. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Country could not be updated. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateCountry'));
/**
 * GET countriescountryIdGet
 * Summary: Get countries
 * Notes: Get countries.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/countries/{countryId}', function ($request, $response, $args) {

    $result = array();
    $country = Models\Country::find($request->getAttribute('countryId'));
    if (!empty($country)) {
        $result['data'] = $country->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewCountry'));
/**
 * PUT SettingsSettingIdPut
 * Summary: Update setting by admin
 * Notes: Update setting by admin
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/settings/{settingId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $setting = Models\Setting::find($request->getAttribute('settingId'));
    foreach ($args as $key => $arg) {
        $setting->{$key} = $arg;
    }
    try {
        $setting->save();
        $result['data'] = $setting->toArray();
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Setting could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdateSetting'));
/**
 * GET SettingGet .
 * Summary: Get settings.
 * Notes: GEt settings.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/settings', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
            $result['data'] = Models\Setting::get();
        } else {
            $Settings = Models\Setting::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
            $data = $Settings['data'];
            unset($Settings['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $Settings
            );
        }
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET settingssettingIdGet
 * Summary: GET particular Setting.
 * Notes: Get setting.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/settings/{settingId}', function ($request, $response, $args) {

    $result = array();
    $setting = Models\Setting::find($request->getAttribute('settingId'));
    if (!empty($setting)) {
        $result['data'] = $setting->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewSetting'));
/**
 * GET SettingcategoriesGet
 * Summary: Filter  Setting categories
 * Notes: Filter Setting categories.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/setting_categories', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $settingCategories = Models\SettingCategory::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $settingCategories['data'];
        unset($settingCategories['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $settingCategories
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListSettingCategory'));
/**
 * GET SettingcategoriesSettingCategoryIdGet
 * Summary: Get setting categories.
 * Notes: GEt setting categories.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/setting_categories/{settingCategoryId}', function ($request, $response, $args) {

    $result = array();
    $settingCategory = Models\SettingCategory::find($request->getAttribute('settingCategoryId'));
    if (!empty($settingCategory)) {
        $result['data'] = $settingCategory->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canListSettingCategory'));
/**
 * POST UserPost
 * Summary: Create New user by admin
 * Notes: Create New user by admin
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/users', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $user = new Models\User;
    $validationErrorFields = $user->validate($args);    
    if (checkAlreadyUsernameExists($args['username'])) {
        $validationErrorFields['username'] = 'Already this username exists.';
    } elseif (checkAlreadyEmailExists($args['email'])) {
        $validationErrorFields['email'] = 'Already this email exists.';
    }
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            if ($key == 'password') {
                $user->{$key} = getCryptHash($arg);
            } else {
                $user->{$key} = $arg;
            }
        }
        try {
            if (USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER == 0 || USER_IS_AUTO_LOGIN_AFTER_REGISTER == 1) {
                $user->is_active = 1;
                $user->is_email_confirmed = 1;
            }
            unset($user->location);
            unset($user->city);
            unset($user->state);
            unset($user->country);
            $user->save();
            if (USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER == 0 || USER_IS_AUTO_LOGIN_AFTER_REGISTER == 1) {
                $emailFindReplace = array(
                    '##USERNAME##' => $user->username,
                    '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                );
                if (USER_IS_WELCOME_MAIL_AFTER_REGISTER == 1) {
                    sendMail('welcomemail', $emailFindReplace, $user->email);
                }
            } elseif (USER_IS_EMAIL_VERIFICATION_FOR_REGISTER == 1) {
                $emailFindReplace = array(
                    '##USERNAME##' => $user->username,
                    '##ACTIVATION_URL##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/users/activation/' . $user->id . '/' . md5($user->username)
                );
                sendMail('activationrequest', $emailFindReplace, $user->email);
            } else {
            }
            $result['data'] = $user->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'User could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'User could not be added. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canCreateUser'));
/**
 * DELETE UseruserId Delete
 * Summary: DELETE user by admin
 * Notes: DELETE user by admin
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/users/{userId}', function ($request, $response, $args) {

    global $authUser;
    $result = array();
    $user = Models\User::find($request->getAttribute('userId'))->toArray();
    $data['data'] = $user;
    $emailFindReplace = array(
        '##USERNAME##' => $data['data']['username']
    );
    sendMail('adminuserdelete', $emailFindReplace, $data['data']['email']);
    if (!empty($user)) {
        try {
            if (!empty($authUser['role_id'] == '2')) {
                if ($authUser['id'] == $request->getAttribute('userId')) {
                    Models\User::destroy($authUser['id']);
                }
            } else {
                Models\User::destroy($request->getAttribute('userId'));
            }
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'User could not be deleted. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Invalid User details.', '', 1);
    }
})->add(new ACL('canDeleteUser'));
/**
 * GET UsersGet
 * Summary: Filter  users
 * Notes: Filter users.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users', function ($request, $response, $args) {
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    $count = PAGE_LIMIT;    
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
    if(!empty($authUser)) {
        $getRelationData = array('user_follow','city','state','country','attachment','cover_photo','photo','flag');
    } else {
        $getRelationData = array('city','state','country','attachment','cover_photo','photo');        
    }
    $queryParams = $request->getQueryParams();
    $result = array();
    
    try {
        if (!empty($queryParams['limit']) && ($queryParams['limit'] == 'all')) {
          $count = Models\Message::count();
        }        
        $users = Models\User::with($getRelationData);               
        if(!empty($queryParams['filter']) && ($queryParams['filter']) == 'popular') {            
            $users = $users->Filter($queryParams)->where('photo_count', '>', 0)->orderBy('user_following_count', 'desc')->paginate($count);
        } else if(!empty($queryParams['filter']) && ($queryParams['filter']) == 'following') {
            $myFollowings = array();
            if(!empty($authUser)) {
                $myFollowings = Models\UserFollow::where('user_id', $authUser->id)->select('other_user_id')->get();
            }            
            $users = $users->whereIn('id', $myFollowings)->Filter($queryParams)->paginate($count);
        } else if(!empty($queryParams['filter']) && ($queryParams['filter']) == 'recent'){            
                $users = $users->Filter($queryParams)->where('photo_count', '>', 0)->orderBy('id', 'desc')->paginate($count);
        } else {
            if(!empty($authUser) && $authUser['role_id'] == 1) {
                $users = $users->Filter($queryParams)->paginate($count);                
            } else {
                $users = $users->where('role_id', '!=' , 1)
                                    ->Filter($queryParams)->paginate($count);
            }
        }              
        $usersnew = $users;               
        $users = $users->map(function($user) {                                       
                    $user->photos = $user->photo->take(5)->toArray();
                    unset($user->photo);
                    $usersnew = $user;    
                    return $user;
                });                                        
        $usersnew = $usersnew->toArray() ;                       
        $data = $usersnew['data'];
        unset($usersnew['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $usersnew
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT UsersuserIdPut
 * Summary: Update user
 * Notes: Update user
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/users/{userId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $user = Models\User::find($request->getAttribute('userId'));
    $validationErrorFields = $user->validate($args);
    if (!empty($user) && empty($validationErrorFields)) {
        if (!empty($args['email']) && $user->email != $args['email']) {
            $user->is_email_confirmed = 0;
            $emailFindReplace = array(
                '##USERNAME##' => $user->username,
                '##ACTIVATION_URL##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/users/activation/' . $user->id . '/' . md5($user->username)
            );
            sendMail('activationrequest', $emailFindReplace, $args['email']);
            $oauth = Models\OauthAccessToken::where('access_token', $_GET['token'])->delete();
        }
        foreach ($args as $key => $arg) {
            if ($key != 'image' && $key != 'cover_photo' && $key != 'city_name' && $key != 'state_name' && $key != 'country_iso2') {
                $user->{$key} = $arg;
            }
        }
        unset($user->location);
        unset($user->city);
        unset($user->state);
        unset($user->country);
        unset($user->photo);
        //get country, state and city ids
        if (!empty($args['country']['iso_alpha2'])) {
            $user->country_id = findCountryIdFromIso2($args['country']['iso_alpha2']);
            $user->state_id = findOrSaveAndGetStateId($args['state']['name'], $user->country_id);
            $user->city_id = findOrSaveAndGetCityId($args['city']['name'], $user->country_id, $user->state_id);
        }
        try {           
            unset($user->attachment);
            unset($user->user_follow);
            $user->save();         
            if ((!empty($args['image'])) && (file_exists(APP_PATH . '/media/tmp/' . $args['image']))) {                
            //Removing and ree inserting new image
            $userAvatarImg = Models\Attachment::where('foreign_id', $request->getAttribute('userId'))->where('class', 'UserAvatar')->first();
            if (!empty($userAvatarImg)) {
                if (file_exists(APP_PATH . '/media/UserAvatar/' . $request->getAttribute('userId') . '/' . $userAvatarImg['filename'])) {
                    unlink(APP_PATH . '/media/UserAvatar/' . $request->getAttribute('userId') . '/' . $userAvatarImg['filename']);
                    $userAvatarImg->delete();
                }
            }                   
                // Removing Thumb folder images
                $mediadir = APP_PATH . '/client/app/images/';
                $whitelist = array(
                    '127.0.0.1',
                    '::1'
                );
                if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
                    $mediadir = APP_PATH . '/client/images/';
                }
                foreach (THUMB_SIZES as $key => $value) {
                    $list = glob($mediadir . $key . '/' . 'UserAvatar' . '/' . $request->getAttribute('userId') . '.*');
                    if($list){
                        @unlink($list[0]);
                    }
                }
                $attachment = new Models\Attachment;                
                if (!file_exists(APP_PATH . '/media/UserAvatar/' . $user->id)) {
                    mkdir(APP_PATH . '/media/UserAvatar/' . $user->id, 0777, true);
                }
                $src = APP_PATH . '/media/tmp/' . $args['image'];
                $dest = APP_PATH . '/media/UserAvatar/' . $user->id . '/' . $args['image'];
                copy($src, $dest);
                unlink($src);
                list($width, $height) = getimagesize($dest);
                $attachment->filename = $args['image'];
                if (!empty($width)) {
                    $attachment->width = $width;
                    $attachment->height = $height;
                }
                $attachment->dir = 'UserAvatar/' . $user->id;
                $attachment->amazon_s3_thumb_url = '';
                $attachment->foreign_id = $user->id;
                $attachment->class = 'UserAvatar';
                $attachment->save();
            }
            if ((!empty($args['cover_photo'])) && (file_exists(APP_PATH . '/media/tmp/' . $args['cover_photo']))) {
            //Removing and ree inserting new image
            $userCoverAvatarImg = Models\Attachment::where('foreign_id', $request->getAttribute('userId'))->where('class', 'UserCoverPhoto')->first();
            if (!empty($userCoverAvatarImg)) {
                if (file_exists(APP_PATH . '/media/UserCoverPhoto/' . $request->getAttribute('userId') . '/' . $userCoverAvatarImg['filename'])) {
                    unlink(APP_PATH . '/media/UserCoverPhoto/' . $request->getAttribute('userId') . '/' . $userCoverAvatarImg['filename']);
                    $userCoverAvatarImg->delete();
                }
            }                   
                // Removing Thumb folder images
                $mediadir = APP_PATH . '/client/app/images/';
                $whitelist = array(
                    '127.0.0.1',
                    '::1'
                );
                if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
                    $mediadir = APP_PATH . '/client/images/';
                }
                foreach (THUMB_SIZES as $key => $value) {
                    $list = glob($mediadir . $key . '/' . 'UserCoverPhoto' . '/' . $request->getAttribute('userId') . '.*');
                    if($list){
                        @unlink($list[0]);
                    }
                }                
                $attachment = new Models\Attachment;
                if (!file_exists(APP_PATH . '/media/UserCoverPhoto/' . $user->id)) {
                    mkdir(APP_PATH . '/media/UserCoverPhoto/' . $user->id, 0777, true);
                }
                $src = APP_PATH . '/media/tmp/' . $args['cover_photo'];
                $dest = APP_PATH . '/media/UserCoverPhoto/' . $user->id . '/' . $args['cover_photo'];
                copy($src, $dest);
                unlink($src);
                list($width, $height) = getimagesize($dest);
                $attachment->filename = $args['cover_photo'];
                if (!empty($width)) {
                    $attachment->width = $width;
                    $attachment->height = $height;
                }
                $attachment->dir = 'UserCoverPhoto/' . $user->id;
                $attachment->amazon_s3_thumb_url = '';
                $attachment->foreign_id = $user->id;
                $attachment->class = 'UserCoverPhoto';
                $attachment->save();
            }
            $user = Models\User::with('attachment', 'cover_photo')->find($user->id);
            $result['data'] = $user->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'User could not be updated. Please, try again.', $e->getMessage(), 1);
        }
    } else {
        return renderWithJson($result, 'Invalid user Details, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateUser'));
/**
 * GET UseruserIdGet
 * Summary: Get particular user details
 * Notes: Get particular user details
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users/{userId}', function ($request, $response, $args) {  
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    $queryParams = $request->getQueryParams();
    $result = array();
    if (!empty($queryParams['fields'])) {
        $fieldvalue = explode(',', $queryParams['fields']);
    } else {
        $fieldvalue = '*';
    }
    if(!empty($authUser)) { 
        $user = Models\User::with('city', 'state', 'country', 'attachment', 'cover_photo','user_follow')->where('id', $request->getAttribute('userId'))->select($fieldvalue)->first();
    } else {
        $user = Models\User::with('city', 'state', 'country', 'attachment', 'cover_photo','photo')->where('id', $request->getAttribute('userId'))->select($fieldvalue)->first();
    }
        
    if (!empty($user)) {
        $result['data'] = $user;
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
});
/**
 * PUT UsersuserIdChangePasswordPut .
 * Summary: update change password
 * Notes: update change password
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/users/{userId}/change_password', function ($request, $response, $args) {

    global $authUser;
    $result = array();
    $args = $request->getParsedBody();
    $user = Models\User::find($request->getAttribute('userId'));
    $validationErrorFields = $user->validate($args);
    $password = crypt($args['password'], $user['password']);
    if (empty($validationErrorFields)) {
        if ($password == $user['password']) {
            $change_password = $args['new_password'];
            $user->password = getCryptHash($change_password);
            try {
                $user->save();
                $emailFindReplace = array(
                    '##PASSWORD##' => $args['new_password'],
                    '##USERNAME##' => $user['username']
                );
                if ($authUser['role_id'] == \Constants\ConstUserTypes::Admin) {
                    sendMail('adminchangepassword', $emailFindReplace, $user->email);
                } else {
                    sendMail('changepassword', $emailFindReplace, $user['email']);
                }
                $result['data'] = $user->toArray();
                return renderWithJson($result);
            } catch (Exception $e) {
                return renderWithJson($result, 'User Password could not be updated. Please, try again', '', 1);
            }
        } else {
            return renderWithJson($result, 'Password is invalid . Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'User Password could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateUser'));
/**
 * POST StatesPost
 * Summary: Create New states
 * Notes: Create states.
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/states', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $state = new Models\State;
    $validationErrorFields = $state->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $state->{$key} = $arg;
        }
        $state->slug = Inflector::slug(strtolower($state->name), '-');
        try {
            $state->save();
            $result['data'] = $state->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'State could not be added. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'State could not be added. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canCreateState'));
/**
 * DELETE StatesStateIdDelete
 * Summary: DELETE states by admin
 * Notes: DELETE states by admin
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/states/{stateId}', function ($request, $response, $args) {

    $result = array();
    $state = Models\State::find($request->getAttribute('stateId'));
    try {
        $state->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'State could not be added. Please, try again', '', 1);
    }
})->add(new ACL('canDeleteState'));
/**
 * GET StatesGet
 * Summary: Filter  states
 * Notes: Filter states.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/states', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
            if (!isset($queryParams['limit']) || ($queryParams['limit'] == 'all')) {
                $queryParams['limit']=Models\State::count();
            }
            $states = Models\State::with('country')->Filter($queryParams)->where('is_active', 1)->paginate($queryParams['limit'])->toArray();
            $data = $states['data'];
            unset($states['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $states
            );
        
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT StatesStateIdPut
 * Summary: Update states by admin
 * Notes: Update states.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/states/{stateId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $state = Models\State::find($request->getAttribute('stateId'));
    $validationErrorFields = $state->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $state->{$key} = $arg;
        }
        $state->slug = Inflector::slug(strtolower($state->name), '-');
        try {
            $state->save();
            $result['data'] = $state->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'State could not be updated. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'State could not be updated. Please, try again.', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateState'));
/**
 * GET StatesstateIdGet
 * Summary: Get  particular state
 * Notes: Get  particular state
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/states/{stateId}', function ($request, $response, $args) {

    $result = array();
    $state = Models\State::find($request->getAttribute('stateId'));
    if (!empty($state)) {
        $result['data'] = $state->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewState'));
/**
 * POST usersForgotPasswordPost
 * Summary: User forgot password
 * Notes: User forgot password
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/users/forgot_password', function ($request, $response, $args) {

    $result = array();
    $args = $request->getParsedBody();
    $user = Models\User::where('email', $args['email'])->first();
    if (!empty($user)) {
        $validationErrorFields = $user->validate($args);
        if (empty($validationErrorFields) && !empty($user)) {
            $password = uniqid();
            $user->password = getCryptHash($password);
            try {
                $user->save();
                $emailFindReplace = array(
                    '##USERNAME##' => $user['username'],
                    '##PASSWORD##' => $password,
                );
                sendMail('forgotpassword', $emailFindReplace, $user['email']);
                return renderWithJson($result, 'An email has been sent with your new password', '', 0);
            } catch (Exception $e) {
                return renderWithJson($result, 'Email Not found', '', 1);
            }
        } else {
            return renderWithJson($result, 'Process could not be found', $validationErrorFields, 1);
        }
    } else {
        return renderWithJson($result, 'No data found', '', 1);
    }
});
/**
 * POST usersLoginPost
 * Summary: User login
 * Notes: User login information post
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/users/login', function ($request, $response, $args) {

    $body = $request->getParsedBody();
    $result = array();
    $user = new Models\User;
    if (USER_USING_TO_LOGIN == 'username') {
        $log_user = $user->with('city','state','country','attachment')->where('username', $body['username'])->where('is_active', 1)->where('is_email_confirmed', 1)->first();
    } else {
        $log_user = $user->with('city','state','country','attachment')->where('email', $body['email'])->where('is_active', 1)->where('is_email_confirmed', 1)->first();
    }
    $password = crypt($body['password'], $log_user['password']);
    $validationErrorFields = $user->validate($body);
    if (empty($validationErrorFields) && !empty($log_user) && ($password == $log_user['password'])) {
        $scopes = '';
        if (!empty($log_user['scopes_' . $log_user['role_id']])) {
            $scopes = implode(' ', $log_user['scopes_' . $log_user['role_id']]);
        }
        $post_val = array(
            'grant_type' => 'password',
            'username' => $log_user['username'],
            'password' => $password,
            'client_id' => OAUTH_CLIENT_ID,
            'client_secret' => OAUTH_CLIENT_SECRET,
            'scope' => $scopes
        );
        $response = getToken($post_val);
        if (!empty($response['refresh_token'])) {
            insertUserLogin($log_user['id']);
            $user = Models\User::where('id', $log_user['id'])->first();
            $user->last_logged_in_time = date('Y-m-d h:i:s');
            $user->last_login_ip_id = saveIp();
            $user->save();
            $result = $response + $log_user->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Your login credentials are invalid.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Your login credentials are invalid.', $validationErrorFields, 1);
    }
});
/**
 * POST usersRegisterPost
 * Summary: new user
 * Notes: Post new user.
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/users/register', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $user = new Models\User;
    $validationErrorFields = $user->validate($args);
    if (checkAlreadyUsernameExists($args['username'])) {
        $validationErrorFields['username'] = 'Already this username exists.';
    } elseif (checkAlreadyEmailExists($args['email'])) {
        $validationErrorFields['email'] = 'Already this email exists.';
    }
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            if ($key == 'password') {
                $user->{$key} = getCryptHash($arg);
            } else {
                $user->{$key} = $arg;
            }
        }
        try {
            if (USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER == 0 || USER_IS_AUTO_LOGIN_AFTER_REGISTER == 1) {
                $user->is_active = 1;
                $user->is_email_confirmed = 1;
            }
            $user->save();
           updateNotificationSettings($user->id);
            if (USER_IS_ADMIN_MAIL_AFTER_REGISTER == 1) {
                $emailFindReplace = array(
                    '##USERNAME##' => $user->username,
                    '##USEREMAIL##' => $user->email
                );
                sendMail('newuserjoin', $emailFindReplace, SITE_CONTACT_EMAIL);
            }
            if (USER_IS_WELCOME_MAIL_AFTER_REGISTER == 1) {
                $emailFindReplace = array(
                    '##USERNAME##' => $user->username,
                    '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                );
                sendMail('welcomemail', $emailFindReplace, $user->email);
            }
            if (USER_IS_EMAIL_VERIFICATION_FOR_REGISTER == 1) {
                $emailFindReplace = array(
                    '##USERNAME##' => $user->username,
                    '##ACTIVATION_URL##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/users/activation/' . $user->id . '/' . md5($user->username)
                );
                sendMail('activationrequest', $emailFindReplace, $user->email);
            }
            if (USER_IS_AUTO_LOGIN_AFTER_REGISTER == 1) {
                $scopes = '';
                if (isset($user->role_id) && $user->role_id == \Constants\ConstUserTypes::User) {
                    $scopes = implode(' ', $user['user_scopes']);
                } else {
                    $scopes = '';
                }
                $post_val = array(
                    'grant_type' => 'password',
                    'username' => $user->username,
                    'password' => $user->password,
                    'client_id' => OAUTH_CLIENT_ID,
                    'client_secret' => OAUTH_CLIENT_SECRET,
                    'scope' => $scopes
                );
                $response = getToken($post_val);
                $result = $response + $user->toArray();
            } else {
                $result['data'] = $user->toArray();
            }
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'User could not be added. Please, try again.', '', 1);
        }
    } else {
        return renderWithJson($result, 'User could not be added. Please, try again.', $validationErrorFields, 1);
    }
});
/**
 * PUT usersUserIdActivationHashPut
 * Summary: User activation
 * Notes: Send activation hash code to user for activation. \n
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/users/{userId}/activation/{hash}', function ($request, $response, $args) {

    $result = array();
    $user = Models\User::where('id', $args['userId'])->first();
    if (!empty($user)) {
        if (md5($user['username']) == $args['hash']) {
            $user->is_active = 1;
            $user->is_agree_terms_conditions = 1;
            $user->is_email_confirmed = 1;
            $user->save();
            $result['data'] = $user->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Invalid user deatails.', '', 1);
        }
    } else {
        return renderWithJson($result, 'Invalid user deatails.', '', 1);
    }
});
/**
 * GET ProvidersGet
 * Summary: all providers lists
 * Notes: all providers lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/providers', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $providers = Models\Provider::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $providers['data'];
        unset($providers['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $providers
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * PUT ProvidersProviderIdPut
 * Summary: Update provider details
 * Notes: Update provider details.
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/providers/{providerId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $provider = Models\Provider::find($request->getAttribute('providerId'));
    $validationErrorFields = $provider->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $provider->{$key} = $arg;
        }
        try {
            $provider->save();
            $result['data'] = $provider->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Provider could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Provider could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateProvider'));
/**
 * GET  ProvidersProviderIdGet
 * Summary: Get  particular provider details
 * Notes: GEt particular provider details.
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/providers/{providerId}', function ($request, $response, $args) {

    $result = array();
    $provider = Models\Provider::find($request->getAttribute('providerId'));
    if (!empty($provider)) {
        $result['data'] = $provider->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewProvider'));
/**
 * GET EmailTemplateGet
 * Summary: Get email templates lists
 * Notes: Get email templates lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/email_templates', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $emailTemplates = Models\EmailTemplate::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $emailTemplates['data'];
        unset($emailTemplates['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $emailTemplates
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListEmailTemplate'));
/**
 * GET EmailTemplateemailTemplateIdGet
 * Summary: Get paticular email templates
 * Notes: Get paticular email templates
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/email_templates/{emailTemplateId}', function ($request, $response, $args) {

    $result = array();
    $emailTemplate = Models\EmailTemplate::find($request->getAttribute('emailTemplateId'));
    if (!empty($emailTemplate)) {
        $result['data'] = $emailTemplate->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
})->add(new ACL('canViewEmailTemplate'));
/**
 * PUT EmailTemplateemailTemplateIdPut
 * Summary: Put paticular email templates
 * Notes: Put paticular email templates
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/email_templates/{emailTemplateId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $result = array();
    $emailTemplate = Models\EmailTemplate::find($request->getAttribute('emailTemplateId'));
    $validationErrorFields = $emailTemplate->validate($args);
    if (empty($validationErrorFields)) {
        foreach ($args as $key => $arg) {
            $emailTemplate->{$key} = $arg;
        }
        try {
            $emailTemplate->save();
            $result['data'] = $emailTemplate->toArray();
            return renderWithJson($result);
        } catch (Exception $e) {
            return renderWithJson($result, 'Email template could not be updated. Please, try again', '', 1);
        }
    } else {
        return renderWithJson($result, 'Email template could not be updated. Please, try again', $validationErrorFields, 1);
    }
})->add(new ACL('canUpdateEmailTemplate'));
/**
 * GET RoleGet
 * Summary: Get roles lists
 * Notes: Get roles lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/roles', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $result = array();
    try {
        $roles = Models\Role::Filter($queryParams)->paginate(PAGE_LIMIT)->toArray();
        $data = $roles['data'];
        unset($roles['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $roles
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET RolesIdGet
 * Summary: Get paticular email templates
 * Notes: Get paticular email templates
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/roles/{roleId}', function ($request, $response, $args) {

    $result = array();
    $role = Models\Role::find($request->getAttribute('roleId'));
    if (!empty($role)) {
        $result = $role->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'No record found', '', 1);
    }
});
/**
 * GET StatsGet
 * Summary: Get site stats lists
 * Notes: Get site stats lists
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/stats', function ($request, $response, $args) {

    global $authUser;
    global $capsule;
    $today = date('Y-m-d');
    $week = date('Y-m-d', strtotime('-7 days'));
    $month = date('Y-m-d', strtotime('-1 month'));
    $year = date('Y-m-d', strtotime('-1 year'));
    $result = array();
    
    //Fetch total stats
    $result['users'] = Models\User::where('is_active', 1)->where('role_id', 2)->count();
    $result['photos'] = Models\Photo::count();    
    $result['comments'] = Models\PhotoComment::count();    
    $result['favorites'] = Models\PhotoLike::count();
    $result['follows'] = Models\UserFollow::count();
    $result['user_logins'] =  Models\UserLogin::count();
    $result['photo_views'] =  Models\PhotoView::count();

    //Fetch today stats
    $result['today']['users'] =  Models\User::where('is_active', 1)->where('role_id', 2)->whereDate('created_at', $today)->count();
    $result['today']['photos'] =  Models\Photo::whereDate('created_at', $today)->count();
    $result['today']['photo_comments'] =  Models\PhotoComment::whereDate('created_at', $today)->count();
    $result['today']['photo_views'] =  Models\PhotoView::whereDate('created_at', $today)->count();
    $result['today']['photo_likes'] =  Models\PhotoLike::whereDate('created_at', $today)->count();
    $result['today']['user_follows'] =  Models\UserFollow::whereDate('created_at', $today)->count();
    $result['today']['user_logins'] =  Models\UserLogin::whereDate('created_at', $today)->count();

    //Fetch 1 week(last 7 days) stats
    $last_week_users = $capsule::select("SELECT COUNT(*) FROM users WHERE (is_active = '1' AND role_id = '2' AND (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."'))");
    $last_week_photos = $capsule::select("SELECT COUNT(*) FROM photos WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."')");
    $last_week_comments = $capsule::select("SELECT COUNT(*) FROM photo_comments WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."')");
    $last_week_photo_views = $capsule::select("SELECT COUNT(*) FROM photo_views WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."')");
    $last_week_photo_likes = $capsule::select("SELECT COUNT(*) FROM photo_likes WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."')");
    $last_week_user_follows = $capsule::select("SELECT COUNT(*) FROM user_follows WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."')");
    $last_week_user_logins = $capsule::select("SELECT COUNT(*) FROM user_logins WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$week."')");

    $result['last 7 days']['users'] =  $last_week_users[0]->count;
    $result['last 7 days']['photos'] =  $last_week_photos[0]->count;
    $result['last 7 days']['photo_comments'] = $last_week_comments[0]->count;
    $result['last 7 days']['photo_views'] =  $last_week_photo_views[0]->count;
    $result['last 7 days']['photo_likes'] =  $last_week_photo_likes[0]->count;
    $result['last 7 days']['user_follows'] =  $last_week_user_follows[0]->count;
    $result['last 7 days']['user_logins'] =  $last_week_user_logins[0]->count;

    //Fetch last month (last 30 days) stats
    $last_month_users = $capsule::select("SELECT COUNT(*) FROM users WHERE (is_active = '1'  AND role_id = '2'  AND (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."'))");
    $last_month_photos = $capsule::select("SELECT COUNT(*) FROM photos WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."')");
    $last_month_comments = $capsule::select("SELECT COUNT(*) FROM photo_comments WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."')");
    $last_month_photo_views = $capsule::select("SELECT COUNT(*) FROM photo_views WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."')");
    $last_month_photo_likes = $capsule::select("SELECT COUNT(*) FROM photo_likes WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."')");
    $last_month_user_follows = $capsule::select("SELECT COUNT(*) FROM user_follows WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."')");
    $last_month_user_logins = $capsule::select("SELECT COUNT(*) FROM user_logins WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$month."')");

    $result['last 30 days']['users'] =  $last_month_users[0]->count;
    $result['last 30 days']['photos'] =  $last_month_photos[0]->count;
    $result['last 30 days']['photo_comments'] = $last_month_comments[0]->count;
    $result['last 30 days']['photo_views'] =  $last_month_photo_views[0]->count;
    $result['last 30 days']['photo_likes'] =  $last_month_photo_likes[0]->count;
    $result['last 30 days']['user_follows'] =  $last_month_user_follows[0]->count;
    $result['last 30 days']['user_logins'] =  $last_month_user_logins[0]->count;   

    //Fetch last year (last year) stats
    $last_year_users = $capsule::select("SELECT COUNT(*) FROM users WHERE (is_active = '1'  AND role_id = '2'  AND (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."'))");
    $last_year_photos = $capsule::select("SELECT COUNT(*) FROM photos WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."')");
    $last_year_comments = $capsule::select("SELECT COUNT(*) FROM photo_comments WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."')");
    $last_year_photo_views = $capsule::select("SELECT COUNT(*) FROM photo_views WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."')");
    $last_year_photo_likes = $capsule::select("SELECT COUNT(*) FROM photo_likes WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."')");
    $last_year_user_follows = $capsule::select("SELECT COUNT(*) FROM user_follows WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."')");
    $last_year_user_logins = $capsule::select("SELECT COUNT(*) FROM user_logins WHERE (DATE(created_at) <= '".$today."' AND DATE(created_at) >= '".$year."')");

    $result['last 1 year']['users'] =  $last_year_users[0]->count;
    $result['last 1 year']['photos'] =  $last_year_photos[0]->count;
    $result['last 1 year']['photo_comments'] = $last_year_comments[0]->count;
    $result['last 1 year']['photo_views'] =  $last_year_photo_views[0]->count;
    $result['last 1 year']['photo_likes'] =  $last_year_photo_likes[0]->count;
    $result['last 1 year']['user_follows'] =  $last_year_user_follows[0]->count;
    $result['last 1 year']['user_logins'] =  $last_year_user_logins[0]->count;     
    return renderWithJson($result);   
})->add(new ACL('canViewStats'));
/**
 * POST AttachmentPost
 * Summary: Add attachment
 * Notes: Add attachment.
 * Output-Formats: [application/json]
 */
/**
 * DELETE activitiesActivityIdDelete
 * Summary: Delete Activity
 * Notes: Deletes a single Activity based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/activities/{activityId}', function ($request, $response, $args) {

    $activity = Models\Activity::find($request->getAttribute('activityId'));
    try {
        if (!empty($activity)) {
            $activity->delete();
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            $result = array();
            return renderWithJson($result, 'Activity could not be deleted. Record not exists.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Activity could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteActivity'));
/**
 * DELETE activitiesDelete
 * Summary: Clear all activities
 * Notes: DELETE activities.
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/activities', function ($request, $response, $args) {

    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    $activity = Models\Activity::where('owner_user_id', $authUser['id'])->get();
    try {
        $activity->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Activity could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteActivity'));
/**
 * GET activitiesGet
 * Summary: Fetch all Activities
 * Notes: Returns all Activities from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/activities', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    try {
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
            $activities['data'] = Models\Activity::with('user', 'owner_user', 'photo_like', 'photo_comment', 'user_follow')->get()->toArray();
            $data = $activities['data'];
        } else {
            $count = PAGE_LIMIT;
            if (!empty($queryParams['limit'])) {
                $count = $queryParams['limit'];
            }
            $activities = Models\Activity::with('user', 'owner_user', 'photo', 'photo_like', 'photo_comment', 'user_follow')->Filter($queryParams)->where('owner_user_id', $authUser['id'])->paginate($count)->toArray();
            $data = $activities['data'];
            unset($activities['data']);
        }
        $results = array(
            'data' => $data,
            '_metadata' => $activities
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListActivity'));
/**
 * PUT activitiesPut
 * Summary: Update Activity Status
 * Notes: Update Activity Status
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/activities', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    $result = array();
    try {
        if (!empty($args['is_read']) && !empty($args['date']) && !empty($args['type'])) {
            if(!empty($args['type']) && $args['type'] == 'date') {
                $startDate = date('Y-m-d', strtotime($args['date'])) . ' 00:00:00';
                $endDate = date('Y-m-d', strtotime($args['date']))  . ' 23:59:59';
            } else if($args['type'] == 'month') {
                $startDate = date('Y-m-d', strtotime($args['date'])) . ' 00:00:00';
                $endDate = date('Y-m-d', strtotime($startDate . ' + ' . date('t', strtotime($startDate)) . ' days - 1 day'))  . ' 23:59:59';                
            } else if($args['type'] == 'year') {
                $startDate = $args['date'] . '-01-01 00:00:00';
                $endDate = $args['date'] . '-12-31 23:59:59';                
            }
            $activity = Models\Activity::where('owner_user_id', $authUser['id'])->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)->update(array(
                'is_read' => $args['is_read']
            ));
            $activityobj = new Models\Activity;
            $activityobj->updateActivityCount($authUser['id']);
        }
        return renderWithJson($result, 'Activity succefully updated');
    } catch (Exception $e) {
        return renderWithJson($result, 'Activity could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdateActivity'));
/**
 * DELETE photoCommentsPhotoCommentIdDelete
 * Summary: Delete Photo Comment
 * Notes: Deletes a single Photo Comment based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/photo_comments/{photoCommentId}', function ($request, $response, $args) {

    $photoComment = Models\PhotoComment::find($request->getAttribute('photoCommentId'));
    try {
        $photoComment->delete($photoComment->photo_id);
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo comment could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeletePhotoComment'));
/**
 * GET photoCommentsPhotoCommentIdGet
 * Summary: Fetch Photo Comment
 * Notes: Returns a Photo Comment based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photo_comments/{photoCommentId}', function ($request, $response, $args) {

    $photoComment = Models\PhotoComment::find($request->getAttribute('photoCommentId'));
    $result['data'] = $photoComment->toArray();
    return renderWithJson($result);
});
/**
 * PUT photoCommentsPhotoCommentIdPut
 * Summary: Update Photo Comment by its id
 * Notes: Update Photo Comment by its id
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/photo_comments/{photoCommentId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $photoComment = Models\PhotoComment::find($request->getAttribute('photoCommentId'));
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    foreach ($args as $key => $arg) {
        $photoComment->{$key} = $arg;
        $photoComment->user_id = $authUser['id'];
        $photoComment->ip_id = saveIp();
    }
    $result = array();
    try {
        $validationErrorFields = $photoComment->validate($args);
        if (empty($validationErrorFields)) {
            $photoComment->save($photoComment->{'photo_id'});
            $result['data'] = $photoComment->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Photo comment could not be updated. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo comment could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdatePhotoComment'));
/**
 * POST photoCommentsPost
 * Summary: Creates a new Photo Comment
 * Notes: Creates a new Photo Comment
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/photo_comments', function ($request, $response, $args) {
    $args = $request->getParsedBody();
    $photoComment = new Models\PhotoComment;
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    foreach ($args as $key => $arg) {
        $photoComment->{$key} = $arg;
        $photoComment->user_id = $authUser['id'];
        $photoComment->ip_id = saveIp();
    }
    $result = array();
    try {
        $validationErrorFields = $photoComment->validate($args);
        if (empty($validationErrorFields)) {
            $photoComment->save($photoComment->photo_id);
            //Add activities
            $photo = Models\Photo::where('id', $args['photo_id'])->first();
            $activity = new Models\Activity;
            $activity->owner_user_id = $photo->user_id;
            $activity->user_id = $authUser['id'];
            $activity->type = 'Comment';
            $activity->foreign_id = $photo->id;
            $activity->class = 'PhotoComment';
            $activity->is_read = 0;
            $activity->save();
            $activity->updateActivityCount($photo->user_id);
            $result = $photoComment->toArray();
            // Updating @mention      
            if(preg_match_all('/@([^\\s]*)/', $args['comment'], $name_mentioned)) {
                foreach($name_mentioned[1] as $username) {
                    $username=trim($username);
                    $user = Models\User::where('username', $username)->first();
                    if(!empty($user)) {
                        //Add activities
                        $activity = new Models\Activity;
                        $activity->owner_user_id = $user['id'];
                        $activity->user_id = $authUser['id'];
                        $activity->type = 'Mentioned';
                        $activity->foreign_id = $photo->id;
                        $activity->class = 'User';
                        $activity->is_read = 0;
                        $activity->save();
                        $activity->updateActivityCount($activity->user_id);
                        $userNotification = Models\UserNotificationSetting::with('user')->where('user_id', $user['id'])->first();            
                        if (!empty($userNotification) && $userNotification['is_enable_email_when_someone_mentioned_me'] == 1) {
                            $owner = Models\User::find($authUser['id'])->toArray();
                            $to_mail = $user['email'];
                            $emailFindReplace = array(
                                '##MENTIONUSER##' => $owner['username'],
                                '##USERNAME##' => $user['username'],
                                '##POST##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/photo/' . $photo->id,
                                '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                            );
                            sendMail('mentioneduser', $emailFindReplace, $to_mail);
                        }
                    }
                }
            }
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Photo comment could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo comment could not be added. Please, try again.', '', 1);
    }
});
/**
 * DELETE photoFlagsPhotoFlagIdDelete
 * Summary: Delete Photo Flag
 * Notes: Deletes a single Photo Flag based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/flags/{flagId}', function ($request, $response, $args) {

    global $authUser;
    $flag = Models\Flag::find($request->getAttribute('flagId'));
    try {
        if (($authUser['id'] == $flag['user_id']) || ($authUser['role_id'] == 1)) {           
            if($flag->delete()){
                if(!empty($flag->photo_id))
                {
	              Models\Photo::find($flag->photo_id)->decrement('photo_flag_count',1); 
                }
                if(!empty($flag->flagged_user_id))
                {
                  Models\User::find($flag->flagged_user_id)->decrement('flag_count',1); 
                }
            }               
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            $result = array();
            return renderWithJson($result, ' flag could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, ' flag could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteFlag'));
/**
 * POST photoFlagsPost
 * Summary: Creates a new Photo Flag
 * Notes: Creates a new Photo Flag
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/flags', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $flag = new Models\Flag;
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    foreach ($args as $key => $arg) {
        $flag->{$key} = $arg;
    }
    $flag->user_id = $authUser['id'];
    $flag->ip_id = saveIp();    
    $result = array();
    try {
        $validationErrorFields = $flag->validate($args);
        if (empty($validationErrorFields)) {
         if($flag->save()){           
             if(!empty($flag->photo_id))
             {
                  Models\Photo::find($flag->photo_id)->increment('photo_flag_count',1); 
             }
             if(!empty($flag->flagged_user_id))
             {
                  Models\User::find($flag->flagged_user_id)->increment('flag_count',1); 
             }
            }            
            $result['data'] = $flag->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, ' flag could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, ' flag could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateFlag'));
/**
 * GET photoFlagCategoriesGet
 * Summary: Fetch all Photo Flag Categories
 * Notes: Returns all Photo Flag Categories from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/flag_categories', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        if (!empty($queryParams['limit']) && ($queryParams['limit'] == 'all')) {
            $results['data'] = Models\FlagCategory::get()->toArray();
        }
        else{
    $count = PAGE_LIMIT;    
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }
        $flagCategories = Models\FlagCategory::Filter($queryParams)->paginate($count)->toArray();
        $data = $flagCategories['data'];
        unset($flagCategories['data']);
        $results = array(
            'data' => $data,
            '_metadata' => $flagCategories
        );
        }       
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET photoFlagCategoriesIdGet
 * Summary: Fetch photoFlagCategory
 * Notes: Returns a photoFlagCategory based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/flag_categories/{flagCategoryId}', function($request, $response, $args) {
	$result['data'] = array();
    $flagCategory = Models\FlagCategory::find($request->getAttribute('flagCategoryId'));
	if(!empty($flagCategory)) {
        $result['data'] = $flagCategory->toArray();
        return renderWithJson($result);
    } else {
        return renderWithJson($result, 'Photo Flag Category could not be found. Please, try again.', '', 1);
    }
})->add(new ACL('canViewFlagCategory'));

/**
 * DELETE photoFlagCategoriesPhotoFlagCategoryIdDelete
 * Summary: Delete Photo Flag Category
 * Notes: Deletes a single Photo Flag Category based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/flag_categories/{flagCategoryId}', function ($request, $response, $args) {

    $flagCategory = Models\FlagCategory::find($request->getAttribute('flagCategoryId'));
    try {
        $flagCategory->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo flag category could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteFlagCategory'));
/**
 * PUT photoFlagCategoriesPhotoFlagCategoryIdPut
 * Summary: Update Photo Flag Category by its id
 * Notes: Update Photo Flag Category by its id
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/flag_categories/{flagCategoryId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $flagCategory = Models\FlagCategory::find($request->getAttribute('flagCategoryId'));
    foreach ($args as $key => $arg) {
        $flagCategory->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $flagCategory->validate($args);
        if (empty($validationErrorFields)) {
            $flagCategory->save();
            $result['data'] = $flagCategory->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Photo flag category could not be updated. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo flag category could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdateFlagCategory'));
/**
 * POST photoFlagCategoriesPost
 * Summary: Creates a new Photo Flag Category
 * Notes: Creates a new Photo Flag Category
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/flag_categories', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $flagCategory = new Models\FlagCategory;
    foreach ($args as $key => $arg) {
        $flagCategory->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $flagCategory->validate($args);
        if (empty($validationErrorFields)) {
            $flagCategory->save();
            $result['data'] = $flagCategory->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Photo flag category could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo flag category could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateFlagCategory'));
/**
 * DELETE photoLikesPhotoLikeIdDelete
 * Summary: Delete Photo Like
 * Notes: Deletes a single Photo Like based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/photo_likes/{photoLikeId}', function ($request, $response, $args) {

    global $authUser;
    $photoLike = Models\PhotoLike::find($request->getAttribute('photoLikeId'));
    try {
        if (($authUser['id'] == $photoLike['user_id']) || ($authUser['role_id'] == 1)) {
            $photoLike->delete($photoLike->photo_id);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            $result = array();
            return renderWithJson($result, 'Photo like could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo like could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeletePhotoLike'));
/**
 * GET photoLikesPhotoLikeId
 * Summary: Fetch a Photo Like based on a user Id
 * Notes: Returns a Photo Like from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photo_likes/{photoLikeId}', function ($request, $response, $args) {

     $photoLike = Models\PhotoLike::with('photo','user','ip')->find($request->getAttribute('photoLikeId'));
    $result['data'] =  $photoLike->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewPhotoLike'));
/**
 * POST photoLikesPost
 * Summary: Creates a new Photo Like
 * Notes: Creates a new Photo Like
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/photo_likes', function ($request, $response, $args) {

    global $authUser;
    $args = $request->getParsedBody();
    $photo_like = Models\PhotoLike::where('user_id', $authUser->id)->where('photo_id', $args['photo_id'])->first();
    $photoLike = new Models\PhotoLike;
    foreach ($args as $key => $arg) {
        $photoLike->{$key} = $arg;
        $photoLike->user_id = $authUser['id'];
        $photoLike->ip_id = saveIp();
    }
    $result = array();
    try {
        if (empty($photo_like)) {
            $validationErrorFields = $photoLike->validate($args);
            if (empty($validationErrorFields)) {
                $photoLike->save($photoLike->photo_id);
                //Add activities
                $photo = Models\Photo::where('id', $args['photo_id'])->first();
                $activity = new Models\Activity;
                $activity->owner_user_id = $photo->user_id;
                $activity->user_id = $authUser['id'];
                $activity->type = 'Likes';
                $activity->foreign_id = $photo->id;
                $activity->class = 'PhotoLike';
                $activity->is_read = 0;
                $activity->save();
                $activity->updateActivityCount($photo->user_id);
                $result['data'] = $photoLike->toArray();
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'Photo like could not be added. Please, try again.', $validationErrorFields, 1);
            }
        } else {
            return renderWithJson($result, 'Photo like already added. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo like could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreatePhotoLike'));
/**
 * GET photoTagsGet
 * Summary: Fetch all Photo Tags
 * Notes: Returns all Photo Tags from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photo_tags', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $count = PAGE_LIMIT;
        $photoTags = new Models\PhotoTag();
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        if($queryParams['id']) {
            $photoTags = $photoTags->whereIn('id',$queryParams['id']);
            $count = $photoTags->count();
        }            
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
                $results['data'] =  $photoTags->get()->toArray();
        }else{
                $photoTags = $photoTags->Filter($queryParams)->paginate($count)->toArray();
                $data = $photoTags['data'];
                unset($photoTags['data']);
                $results = array(
                    'data' => $data,
                    '_metadata' => $photoTags
                );
        }
       
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET photoViewsGet
 * Summary: Fetch all photo views
 * Notes: Returns all photo views from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photo_views', function($request, $response, $args) {
	$queryParams = $request->getQueryParams();
	$results = array();
	try {
        $photoViews = Models\PhotoView::with('user', 'photo');
		$photoViews = $photoViews->Filter($queryParams)->paginate(20)->toArray();
		$data = $photoViews['data'];
		unset($photoViews['data']);
		$results = array(
			'data' => $data,
			'_metadata' => $photoViews
		);
		renderWithJson($results);
	}
	catch(Exception $e) {
		renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
	}
})->add(new ACL('canListPhotoView'));


/**
 * DELETE photoViewsPhotoViewIdDelete
 * Summary: Delete photo view
 * Notes: Deletes a single photo view based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/photo_views/{photoViewId}', function($request, $response, $args) {
	$photoView = Models\PhotoView::find($request->getAttribute('photoViewId'));
	try {
		$photoView->delete();
        Models\Photo::find($photoView->photo_id)->decrement('photo_view_count',1); 
		$result ['data']= array(
			'status' => 'success',
		);
		renderWithJson($result);
	}
	catch(Exception $e) {
		renderWithJson($result, 'Photo view could not be deleted. Please, try again.', '', 1);
	}
})->add(new ACL('canDeletePhotoView'));


/**
 * GET photoViewsPhotoViewIdGet
 * Summary: Fetch photo view
 * Notes: Returns a photo view based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photo_views/{photoViewId}', function($request, $response, $args) {
	$photoView = Models\PhotoView::find($request->getAttribute('photoViewId'));
	$result ['data']= $photoView->toArray();
	renderWithJson($result);
})->add(new ACL('canViewPhotoView'));


/**
 * POST photoViewsPost
 * Summary: Creates a new photo view
 * Notes: Creates a new photo view
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/photo_views', function($request, $response, $args) {
	$args = $request->getParsedBody();
	$photoView = new Models\PhotoView;
    $authUser = array();
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
	foreach ($args as $key => $arg) {
		$photoView->{$key} = $arg;
	}
    if(!empty($authUser)) {
        $photoView->user_id = $authUser['id'];
    }
    $photoView->ip_id = saveIp();
	$result = array();
	try {
		$validationErrorFields = $photoView->validate($args);
		if (empty($validationErrorFields)) {
			$photoView->save();
			$result = $photoView->toArray();
            Models\Photo::find($photoView->photo_id)->increment('photo_view_count',1);
			renderWithJson($result);
		} else {
			renderWithJson($result, 'Photo view could not be added. Please, try again.', $validationErrorFields, 1);
		}
	}
	catch(Exception $e) {
     
		renderWithJson($result, 'Photo view could not be added. Please, try again.', '', 1);
	}
});


/**
 * GET messagesGet
 * Summary: Fetch all Messages
 * Notes: Returns all Messages from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/messages', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        if (!empty($_GET['token'])) {
            $authUser = getUserDetails($_GET['token']);
        }
        if (!isset($queryParams['limit']) || ($queryParams['limit'] == 'all')) {
           $queryParams['limit']=Models\Message::count();
        }
            if (!empty($queryParams['parent_message_id'])) {
                $messages = Models\Message::with('user', 'other_user', 'attachment', 'message_content')->where('parent_message_id', $queryParams['parent_message_id'])->where('is_sender', 0)->Filter($queryParams)->paginate($queryParams['limit'])->toArray();
                $data = $messages['data'];
            } else {
                if ($authUser['role_id'] == '1') {
                    $messages = Models\Message::with('user', 'other_user', 'attachment')->Filter($queryParams)->where('is_sender', 1)->paginate($queryParams['limit'])->toArray();
                } else {
                    $messages = Models\Message::with('user', 'other_user', 'attachment')->Filter($queryParams)->where('is_sender', 1)->where('other_user_id', $authUser['id'])->paginate($queryParams['limit'])->toArray();
                }
                $data = $messages['data'];
            }
            unset($messages['data']);
        
        $results = array(
            'data' => $data,
            '_metadata' => $messages
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListMessage'));
/**
 * DELETE messagesMessageIdDelete
 * Summary: Delete Message
 * Notes: Deletes a single Message based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/messages/{messageId}', function ($request, $response, $args) {

    $message = Models\Message::find($request->getAttribute('messageId'));
    try {
        $message->delete($message->other_user_id);
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'Message could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteMessage'));
/**
 * GET messagesMessageIdGet
 * Summary: Fetch Message
 * Notes: Returns a Message based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/messages/{messageId}', function ($request, $response, $args) {

    $message = Models\Message::with('user', 'other_user', 'attachment')->find($request->getAttribute('messageId'));
    $result['data'] = $message->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewMessage'));
/**
 * POST messagesPost
 * Summary: Creates a new Message
 * Notes: Creates a new Message
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/messages', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $parent_message = new Models\Message;
    $sender_message = new Models\Message;
    $receiver_message = new Models\Message;
    $message_content = new Models\MessageContent;
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    if ($args['parent_message_id'] == 0) {
        $args['parent_message_id'] = null;
    }
    foreach ($args as $key => $arg) {
        $parent_message->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $parent_message->validate($args);
        if (empty($validationErrorFields)) {
            if (!empty($args['message'])) {
                $message_content->message = $args['message'];
                $message_content->save();
            }
            if ((!empty($args['image'])) && (file_exists(APP_PATH . '/media/tmp/' . $args['image']))) {
                $attachment = new Models\Attachment;
                if (!file_exists(APP_PATH . '/media/Message/' . $message_content->id)) {
                    mkdir(APP_PATH . '/media/Message/' . $message_content->id, 0777, true);
                }
                // Removing Thumb folder images
                $mediadir = APP_PATH . '/client/app/images/';
                $whitelist = array(
                    '127.0.0.1',
                    '::1'
                );
                if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
                    $mediadir = APP_PATH . '/client/images/';
                }
                foreach (THUMB_SIZES as $key => $value) {
                    $list = glob($mediadir . $key . '/' . 'Message' . '/' . $message_content->id . '.*');
                    if($list){
                        @unlink($list[0]);
                    }
                }
                $src = APP_PATH . '/media/tmp/' . $args['image'];
                $dest = APP_PATH . '/media/Message/' . $message_content->id . '/' . $args['image'];
                copy($src, $dest);
                unlink($src);
                list($width, $height) = getimagesize($dest);
                $attachment->filename = $args['image'];
                if (!empty($width)) {
                    $attachment->width = $width;
                    $attachment->height = $height;
                }
                $attachment->dir = 'Message/' . $message_content->id;
                $attachment->amazon_s3_thumb_url = '';
                $attachment->foreign_id = $message_content->id;
                $attachment->class = 'Message';
                $attachment->save();
            }
            unset($parent_message->image);
            if (empty($parent_message->parent_message_id)) {
                $parent_message->message = $args['message'];
                $parent_message->message_content_id = $message_content->id;
                $parent_message->user_id = null;
                $parent_message->other_user_id = null;
                $parent_message->save();
                $parent_message_id = $parent_message->id;
            } else {
                $parent_message_id = $args['parent_message_id'];
            }
            $sender_message->user_id = $authUser['id'];
            $sender_message->other_user_id = $args['other_user_id'];
            $sender_message->parent_message_id = $parent_message_id;
            $sender_message->is_sender = 1;
            $sender_message->is_read = 1;
            $sender_message->message = $args['message'];
            $sender_message->message_content_id = $message_content->id;
            $sender_message->save();
            $receiver_message->user_id = $authUser['id'];
            $receiver_message->other_user_id = $args['other_user_id'];
            $receiver_message->parent_message_id = $parent_message_id;
            $receiver_message->is_sender = 0;
            $receiver_message->message = $args['message'];
            $receiver_message->message_content_id = $message_content->id;
            $receiver_message->save($args['other_user_id']);
            $result['data'] = $receiver_message->toArray();
            $name_mentioned = explode('@', $args['message']);
            $userNotification = Models\UserNotificationSetting::with('user')->where('user_id', $authUser['id'])->first();
            if (!empty($name_mentioned[1])) {
                $names = explode(' ', $name_mentioned[1]);
                if (!empty($names[0])) {
                    $user = Models\User::where('username', $names[0])->first();
                    if (!empty($user)) {
                        //Add activities
                        $activity = new Models\Activity;
                        $activity->owner_user_id = $user['id'];
                        $activity->user_id = $authUser['id'];
                        $activity->type = 'Mentioned';
                        $activity->foreign_id = $sender_message->id;
                        $activity->class = 'User';
                        $activity->is_read = 0;
                        $activity->save();
                        $activity->updateActivityCount($activity->user_id);
                        if (!empty($userNotification)) {
                            $userNotification = $userNotification->toArray();
                            if ($userNotification['is_enable_email_when_someone_mentioned_me'] == 1) {
                                $owner = Models\User::find($authUser['id'])->toArray();
                                $to_mail = $user['email'];
                                $emailFindReplace = array(
                                    '##MENTIONUSER##' => $owner['username'],
                                    '##USERNAME##' => $user['username'],
                                    '##POST##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/messages/' . $sender_message->id,
                                    '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                                );
                                sendMail('mentioneduser', $emailFindReplace, $to_mail);
                            }
                        }
                    }
                }
            }
            if ($userNotification['is_enable_email_when_someone_message_me'] == 1) {
                $user = Models\User::find($args['other_user_id'])->toArray();
                $to_mail = $user['email'];
                $emailFindReplace = array(
                    '##OTHER_USER###' => $userNotification['user']['username'],
                    '##USERNAME##' => $user['username'],
                    '##MESSAGE_URL##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/messages/' . $sender_message->id,
                    '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                );
                sendMail('messagereceived', $emailFindReplace, $to_mail);
            }
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Message could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Message could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateMessage'));
/**
 * PUT MessagesbyItID
 * Summary: Update message by its id
 * Notes: Update message by its id
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/messages/{messageId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    $result = array();
    try {
        $messages = Models\Message::where('parent_message_id', $request->getAttribute('messageId'))->where('other_user_id', $authUser['id'])->update(array(
            'is_read' => $args['is_read']
        ));
        return renderWithJson($result, 'Message succefully updated');
    } catch (Exception $e) {
        return renderWithJson($result, 'Message could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdateMessage'));
/**
 * GET photosGet
 * Summary: Fetch all Photos
 * Notes: Returns all Photos from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photos', '_getPhotos');
/**
 * DELETE photosPhotoIdDelete
 * Summary: Delete Photo
 * Notes: Deletes a single Photo based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/photos/{photoId}', function ($request, $response, $args) {

    global $authUser;
    $photo = Models\Photo::find($request->getAttribute('photoId'));
    if(!empty($photo->id)) {
        $photosPhotoTag =  Models\PhotosPhotoTag::where('photo_id',$photo->id)->select('photo_tag_id')->get()->toArray();
    }    
    try {
        if (($authUser['id'] == $photo['user_id']) || ($authUser['role_id'] == 1)) {
        $photo->delete($photo->id);   
            foreach($photosPhotoTag as $photosPhotoTagValue)
            {
                $photoTagId = $photosPhotoTagValue['photo_tag_id'];
                $photos_photo_tag = new Models\PhotosPhotoTag;
                $photos_photo_tag->updatePhototagcount($photoTagId);
            }
           $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            $result = array();
            return renderWithJson($result, 'Photo could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeletePhoto'));
/**
 * GET photosPhotoIdGet
 * Summary: Fetch Photo
 * Notes: Returns a Photo based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/photos/{photoId}', '_getPhotos');
/**
 * PUT photosPhotoIdPut
 * Summary: Update Photo by its id
 * Notes: Update Photo by its id
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/photos/{photoId}', function ($request, $response, $args) {

    global $authUser;
    $args = $request->getParsedBody();
    $photo = Models\Photo::find($request->getAttribute('photoId'));
    $result = array();
    $user_id = $photo['user_id'];
    if (($authUser['id'] == $user_id) || ($authUser['role_id'] == 1)) {    
    foreach ($args as $key => $arg) {
        if ($key != 'tags') {
            $photo->{$key} = $arg;
        }
        $photo->user_id = $authUser['id'];        
    }
    try {
            $validationErrorFields = $photo->validate($args);
            if (empty($validationErrorFields)) {
                $photo->save($photo['user_id']);
                // Updating #tag      
                preg_match_all('/#([^\\s]*)/', $args['description'], $name_mentioned);
                $photoTagId = Models\PhotosPhotoTag::where('photo_id', $request->getAttribute('photoId'))->select('photo_tag_id')->get();                           
                $photosPhotoTag = Models\PhotosPhotoTag::where('photo_id', $request->getAttribute('photoId'))->delete(); 
                    if(!empty($photoTagId))
                    {
                        foreach($photoTagId as $photoTagIdValue)
                        {
                            $phototagsId =$photoTagIdValue->photo_tag_id;
                            $photos_photo_tag = new Models\PhotosPhotoTag;
                            $photos_photo_tag->updatePhototagcount($phototagsId);
                        }                           
                    }
                                             
                if(!empty($name_mentioned)) {                  
                    foreach($name_mentioned[1] as $tag) {
                        $tag = trim($tag);
                        if(!empty($tag)) {
                            $photos_photo_tag = new Models\PhotosPhotoTag;
                            $photo_tag_id = findAndSavePhotoTag($tag);
                            $photos_photo_tag->photo_id = $photo->id;
                            $photos_photo_tag->photo_tag_id = $photo_tag_id;
                            $photos_photo_tag->is_indirect_tag = 1;
                            $photos_photo_tag->save(); 
                            $photos_photo_tag->updatePhototagcount($photo_tag_id);                              
                        }                
                    }
                }          
                if (!empty($args['tags'])) {
                    $tags = explode(',', $args['tags']);
                    foreach ($tags as $tag) {
                        $tag = trim($tag);
                        if(!empty($tag)) {
                            $photos_photo_tag = new Models\PhotosPhotoTag;
                            $photo_tag_id = findAndSavePhotoTag($tag);
                            $photos_photo_tag->photo_id = $photo->id;
                            $photos_photo_tag->photo_tag_id = $photo_tag_id;
                            $photos_photo_tag->save();
                            $photos_photo_tag->updatePhototagcount($photo_tag_id);                               
                        }
                    }              
                }
                $photo = Models\Photo::with('attachment')->find($photo->id);
                $result['data'] = $photo->toArray();
                return renderWithJson($result);
            } else {
                return renderWithJson($result, 'Photo could not be updated. Please, try again.', $validationErrorFields, 1);
            }
    } catch (Exception $e) {
        return renderWithJson($result, 'Photo could not be updated. Please, try again.', '', 1);
    }
    }
    else{
        return renderWithJson($result, 'Your are not authorized person to update.', '', 1);
    }
})->add(new ACL('canUpdatePhoto'));
/**
 * POST photosPost
 * Summary: Creates a new Photo
 * Notes: Creates a new Photo
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/photos', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $photo = new Models\Photo;
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    foreach ($args as $key => $arg) {
        if ($key != 'image' && $key != 'tags') {
            $photo->{$key} = $arg;
        }
        $photo->user_id = $authUser['id'];
    }
    $ext = pathinfo($args['image'], PATHINFO_EXTENSION);
    $exts = array("webm","mkv","flv","vob","ogg","ogv","avi","mov","wmv","mp4","mpg","mpeg","3gp");
    if (in_array($ext, $exts)) {
        $photo->is_video = 1;
        $photo->is_attachment_to_view = 0;
        $photo->is_video_converting_is_processing = 1;
    }
    $result = array();
    try {
        $validationErrorFields = $photo->validate($args); 
        if (empty($validationErrorFields)) {
            $photo->save($photo->user_id);
            if(!empty($args['description'])) {
                // Updating @mentioned
                preg_match_all('/@([^\\s]*)/', $args['description'], $name_mentioned); 
                if(!empty($name_mentioned)) {
                    foreach($name_mentioned[1] as $username) {
                        $username=trim($username);
                        $user = Models\User::where('username', $username)->first();
                        if(!empty($user)) {
                            //Add activities
                            $activity = new Models\Activity;
                            $activity->owner_user_id = $user['id'];
                            $activity->user_id = $authUser['id'];
                            $activity->type = 'Mentioned';
                            $activity->foreign_id = $photo->id;
                            $activity->class = 'User';
                            $activity->is_read = 0;
                            $activity->save();
                            $activity->updateActivityCount($activity->owner_user_id);
                            $userNotification = Models\UserNotificationSetting::with('user')->where('user_id', $user['id'])->first();
                            if (!empty($userNotification) && $userNotification['is_enable_email_when_someone_mentioned_me'] == 1) {
                                $owner = Models\User::find($authUser['id'])->toArray();
                                $to_mail = $user['email'];
                                $emailFindReplace = array(
                                    '##MENTIONUSER##' =>$owner['username'],
                                    '##USERNAME##' => $user['username'],
                                    '##POST##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#/photos/' . $photo->id,
                                    '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                                );
                                sendMail('mentioneduser', $emailFindReplace, $to_mail);
                            }
                        }
                    }
                }
                if(!empty($photo->user_id)){
                    $result = Models\UserFollow::where('other_user_id', $photo->user_id)->get();
                    $userfollows = $result->toArray();
                    foreach($userfollows as $userfollow) {
                        $activity = new Models\Activity;
                        $activity->owner_user_id = $userfollow['user_id'];
                        $activity->user_id = $photo->user_id;
                        $activity->type = 'Post';
                        $activity->foreign_id = $photo->id;
                        $activity->class = 'Photo';
                        $activity->is_read = 0;
                        $activity->save();
                        $activity->updateActivityCount($userfollow['user_id']);
                        $userNotification = Models\UserNotificationSetting::with('user')->where('user_id', $userfollow['user_id'])->first();                                    
                        if (!empty($userNotification) && $userNotification['is_enable_email_when_follow_post'] == 1) {
                            $user = Models\User::find($userfollow['user_id'])->toArray(); 
                            $photo_user =Models\User::find($photo->user_id)->toArray();                         
                            $to_mail = $user['email'];                            
                            $emailFindReplace = array(
                                '##POSTUSER##' => $photo_user['username'],
                                '##USERNAME##' => $user['username'],
                                '##POST##' => 'http://' . $_SERVER['HTTP_HOST'] . '/#!/photo/' . $photo->id,
                                '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                            );
                            sendMail('photopost', $emailFindReplace, $to_mail);
                        }
                    }                    
                }
                // Updating #tag      
                preg_match_all('/#([^\\s]*)/', $args['description'], $name_mentioned);
                if(!empty($name_mentioned)) {
                    foreach($name_mentioned[1] as $tag) {
                        $tag = trim($tag);
                        if(!empty($tag)) {
                            $photos_photo_tag = new Models\PhotosPhotoTag;
                            $photo_tag_id = findAndSavePhotoTag($tag);
                            $photos_photo_tag->photo_id = $photo->id;
                            $photos_photo_tag->photo_tag_id = $photo_tag_id;
                            $photos_photo_tag->is_indirect_tag = 1;
                            $photos_photo_tag->save();    
                            $photos_photo_tag->updatePhototagcount($photo_tag_id);                                                    
                        }                
                    }
                }          
            }
            if (!empty($args['tags'])) {
                $tags = explode(',', $args['tags']);
                foreach ($tags as $tag) {
                    $tag = trim($tag);
                    if(!empty($tag)) {
                        $photos_photo_tag = new Models\PhotosPhotoTag;
                        $photo_tag_id = findAndSavePhotoTag($tag);
                        $photos_photo_tag->photo_id = $photo->id;
                        $photos_photo_tag->photo_tag_id = $photo_tag_id;
                        $photos_photo_tag->save();
                         $photos_photo_tag->updatePhototagcount($photo_tag_id);                        
                    }
                }
            }
            if ((!empty($args['image'])) && (file_exists(APP_PATH . '/media/tmp/' . $args['image']))) {
                if (!empty($photo->is_video)) {
                    $class = 'Video';
                } else {
                    $class = 'Photo';
                }
                $attachment = new Models\Attachment;
                if (!file_exists(APP_PATH . '/media/'.$class.'/' . $photo->id)) {
                    mkdir(APP_PATH . '/media/'.$class.'/' . $photo->id, 0777, true);
                }
                // Removing Thumb folder images
                $mediadir = APP_PATH . '/client/app/images/';
                $whitelist = array(
                    '127.0.0.1',
                    '::1'
                );
                if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
                    $mediadir = APP_PATH . '/client/images/';
                }
                foreach (THUMB_SIZES as $key => $value) {
                    $list = glob($mediadir . $key . '/' . $class . '/' . $photo->id . '.*');
                    if($list){
                        @unlink($list[0]);
                    }
                }
                $src = APP_PATH . '/media/tmp/' . $args['image'];
                $dest = APP_PATH . '/media/'.$class.'/' . $photo->id . '/' . $args['image'];
                copy($src, $dest);
                unlink($src);
                list($width, $height) = getimagesize($dest);
                $attachment->filename = $args['image'];
                if (!empty($width)) {
                    $attachment->width = $width;
                    $attachment->height = $height;
                }
                $attachment->dir = $class.'/' . $photo->id;
                $attachment->amazon_s3_thumb_url = '';
                $attachment->foreign_id = $photo->id;
                $attachment->class = $class;
                $attachment->save();
            }
            $photo = Models\Photo::with('attachment')->find($photo->id);
            $result = $photo->toArray();        
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'Photo could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {        
        return renderWithJson($result, 'Photo could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreatePhoto'));
/**
 * GET userPhotoTags
 * Summary: Fetch all User and PhotoTags
 * Notes: Returns all User and PhotoTags
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/search', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $q = $queryParams['q'];        
        $users = Models\User::with('attachment','city','state','country')
                             ->where(function ($query) use ($q)  {
                                    $query->orWhere('first_name','ilike', "$q%")
                                        ->orWhere('last_name','ilike', "$q%")
                                        ->orWhere('username','ilike', "$q%")
                                        ->orWhere('email','ilike', "$q%");
                                        })->Filter($queryParams,$searchq = false)->get()->toArray(); 
        unset($users['data']);
        $photos = Models\PhotoTag::where(function ($query) use ($q)  {
                                    $query->orWhere('name','ilike', "$q%");
                                        })->Filter($queryParams,$searchq = false)->get()->toArray();
        unset($photos['data']);
        $searchresult['users'] = $users;
        $searchresult['photoTags'] = $photos;
        $results = array(
            'data' => $searchresult
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET userFollowsGet
 * Summary: Fetch all User Follows
 * Notes: Returns all User Follows from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/user_follows', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $userFollows = Models\UserFollow::with('user','following_user')->Filter($queryParams)->paginate(20)->toArray();
        $data = $userFollows['data'];
        unset($userFollows['data']);
        $results = array(
            'data' => $data,
            '_metadata' => $userFollows
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET userFollowsGet
 * Summary: Fetch all User Follows
 * Notes: Returns all User Follows from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users/{userId}/user_follows', '_getUserFollows');
/**
 * GET userFollowsUserFollowId
 * Summary: Fetch a User Follow based on a user Id
 * Notes: Returns a User Follow from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/user_follows/{userFollowId}', function ($request, $response, $args) {

    $userFollow = Models\UserFollow::with('user', 'following_user')->find($request->getAttribute('userFollowId'));
    $result['data'] = $userFollow->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewUserFollow'));
/**
 * GET userFollowsGet
 * Summary: Fetch all User Follows
 * Notes: Returns all User Follows from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/users/{userFollowingId}/user_followings', '_getUserFollows');
/**
 * POST userFollowsPost
 * Summary: Creates a new User Follow
 * Notes: Creates a new User Follow
 * Output-Formats: [application/json]
 */
$app->POST('/api/v1/user_follows', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $userFollow = new Models\UserFollow;
    if (!empty($_GET['token'])) {
        $authUser = getUserDetails($_GET['token']);
    }
    $userFollow->user_id = $authUser['id'];
    foreach ($args as $key => $arg) {
        $userFollow->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $userFollow->validate($args);
        if (empty($validationErrorFields)) {
            if (!checkAlreadyUserFollowed($args['other_user_id'], $authUser['id'])) {
                $userFollow->save($userFollow->user_id, $args['other_user_id']);
                //Add activities
                $activity = new Models\Activity;
                $activity->owner_user_id = $args['other_user_id'];
                $activity->user_id = $authUser['id'];
                $activity->type = 'Following';
                $activity->foreign_id = $userFollow->id;
                $activity->class = 'UserFollow';
                $activity->is_read = 0;
                $activity->save();
                $activity->updateActivityCount($args['other_user_id']);
                $result['data'] = $userFollow->toArray();
                $userNotification = Models\UserNotificationSetting::with('user')->where('user_id', $authUser['id'])->first();
                if (!empty($userNotification)) {
                    $userNotification = $userNotification->toArray();
                    if ($userNotification['is_enable_email_when_someone_follow_me'] == 1) {
                        $user = Models\User::find($args['other_user_id'])->toArray();
                        $to_mail = $user['email'];
                        $emailFindReplace = array(
                            '##FOLLOWERUSER##' => $userNotification['user']['username'],
                            '##USERNAME##' => $user['username'],
                            '##SUPPORT_EMAIL##' => SUPPORT_EMAIL
                        );
                        sendMail('followinguser', $emailFindReplace, $to_mail);
                    }
                }
                return renderWithJson($result);
            } else {
                return renderWithJson(array(), 'User follow already added. Please, try again.', '', 1);
            }
        } else {
            return renderWithJson($result, 'User follow could not be added. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'User follow could not be added. Please, try again.', '', 1);
    }
})->add(new ACL('canCreateUserFollow'));
/**
 * DELETE userFollowsUserFollowIdDelete
 * Summary: Delete User Follow
 * Notes: Deletes a single User Follow based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/user_follows/{userFollowId}', function ($request, $response, $args) {

    global $authUser;
    $userFollow = Models\UserFollow::find($request->getAttribute('userFollowId'));
    try {
        if (($authUser['id'] == $userFollow['user_id']) || ($authUser['role_id'] == 1)) {
            $userFollow->delete($userFollow->user_id, $userFollow->other_user_id);
            $result = array(
                'status' => 'success',
            );
            return renderWithJson($result);
        } else {
            $result = array();
            return renderWithJson($result, 'User follow could not be deleted. Please, try again.', '', 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'User follow could not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteUserFollow'));
/**
 * GET userNotificationSettingsGet
 * Summary: Fetch all User Notification Settings
 * Notes: Returns all User Notification Settings from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/user_notification_settings', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $userNotificationSettings = Models\UserNotificationSetting::with('user')->Filter($queryParams)->paginate(20)->toArray();
        $data = $userNotificationSettings['data'];
        unset($userNotificationSettings['data']);
        $results = array(
            'data' => $data,
            '_metadata' => $userNotificationSettings
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
});
/**
 * GET userNotificationSettingsUserNotificationSettingIdGet
 * Summary: Fetch User Notification Setting
 * Notes: Returns a User Notification Setting based on a single ID
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/user_notification_settings/{userNotificationSettingId}', function ($request, $response, $args) {

    $userNotificationSetting = Models\UserNotificationSetting::with('user')->find($request->getAttribute('userNotificationSettingId'));
    $result['data'] = $userNotificationSetting->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewUserNotificationSetting'));
/**
 * PUT userNotificationSettingsUserNotificationSettingIdPut
 * Summary: Update User Notification Setting by its id
 * Notes: Update User Notification Setting by its id
 * Output-Formats: [application/json]
 */
$app->PUT('/api/v1/user_notification_settings/{userNotificationSettingId}', function ($request, $response, $args) {

    $args = $request->getParsedBody();
    $userNotificationSetting = Models\UserNotificationSetting::with('user')->find($request->getAttribute('userNotificationSettingId'));
    foreach ($args as $key => $arg) {
        $userNotificationSetting->{$key} = $arg;
    }
    $result = array();
    try {
        $validationErrorFields = $userNotificationSetting->validate($args);
        if (empty($validationErrorFields)) {
            $userNotificationSetting->save();
            $result['data'] = $userNotificationSetting->toArray();
            return renderWithJson($result);
        } else {
            return renderWithJson($result, 'User notification setting could not be updated. Please, try again.', $validationErrorFields, 1);
        }
    } catch (Exception $e) {
        return renderWithJson($result, 'User notification setting could not be updated. Please, try again.', '', 1);
    }
})->add(new ACL('canUpdateUserNotificationSetting'));
/**
 * GET UserLogin
 * Summary: Fetch all User Notification Settings
 * Notes: Returns all User Notification Settings from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/user_logins', function ($request, $response, $args) {

    $queryParams = $request->getQueryParams();
    $results = array();
    try {
        $userLogin = Models\UserLogin::with('user', 'ip')->Filter($queryParams)->paginate(20)->toArray();
        $data = $userLogin['data'];
        unset($userLogin['data']);
        $results = array(
            'data' => $data,
            '_metadata' => $userLogin
        );
        return renderWithJson($results);
    } catch (Exception $e) {
        return renderWithJson($results, $message = 'No record found', $fields = '', $isError = 1);
    }
})->add(new ACL('canListUserLogin'));
/**
 * GET UserLogin
 * Summary: Fetch a User login details based on a user Id
 * Notes: Returns a User login details from the system
 * Output-Formats: [application/json]
 */
$app->GET('/api/v1/user_logins/{userLoginId}', function ($request, $response, $args) {

    $userLogin = Models\UserLogin::with('user','ip')->find($request->getAttribute('userLoginId'));
    $result['data'] = $userLogin->toArray();
    return renderWithJson($result);
})->add(new ACL('canViewUserLogin'));
/**
 * DELETE userFollowsUserFollowIdDelete
 * Summary: Delete User Follow
 * Notes: Deletes a single User Follow based on the ID supplied
 * Output-Formats: [application/json]
 */
$app->DELETE('/api/v1/user_logins/{userLoginId}', function ($request, $response, $args) {

    $userLogin = Models\UserLogin::find($request->getAttribute('userLoginId'));
    try {
        $userLogin->delete();
        $result = array(
            'status' => 'success',
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, 'User login not be deleted. Please, try again.', '', 1);
    }
})->add(new ACL('canDeleteUserLogin'));
$app->POST('/api/v1/attachments', function ($request, $response, $args) {
    $args = $request->getQueryParams();
    $file = $request->getUploadedFiles();
    $newfile = $file['file'];
    $type = pathinfo($newfile->getClientFilename(), PATHINFO_EXTENSION);
    $name = md5(time());
    list($width, $height) = getimagesize($file['file']->file);
    if (!file_exists(APP_PATH . '/media/tmp/')) {
        mkdir(APP_PATH . '/media/tmp/', 0777, true);
    }
    $response = array();
    $attachment = new Models\Attachment;
    if (empty($validationErrorFields) && move_uploaded_file($newfile->file, APP_PATH . '/media/tmp/' . $name . '.' . $type) === true) {
        $attachment->filename = $name . '.' . $type;
        $response = array(
            'attachment' => $attachment->filename,
            'error' => array(
                'code' => 0,
                'message' => ''
            )
        );
        return renderWithJson($response);
    } else {
        return renderWithJson($response, 'Image not uploaded', $validationErrorFields, 1);
    }
});
$app->GET('/api/v1/users/{userId}/photos', '_getPhotos');
$app->GET('/api/v1/photo_tags/{photoTagId}/photos', '_getPhotos');
$app->GET('/api/v1/photos/{photoId}/photo_comments', '_getPhotoComments');
$app->GET('/api/v1/photo_comments', '_getPhotoComments');
$app->GET('/api/v1/photo/{photoId}/photo_likes', '_getPhotoLikes');
$app->GET('/api/v1/photo_likes', '_getPhotoLikes');
$app->GET('/api/v1/flags', '_getFlags')->add(new ACL('canListFlag'));
$app->GET('/api/v1/flags/{flagId}', '_getFlags')->add(new ACL('canViewFlag'));
$app->GET('/api/v1/photo/{photoId}/flags', '_getFlags');
$app->run();
//Get photos
function _getPhotos($request, $response, $args)
{
    global $authUser;
    $result = array();
    $count = PAGE_LIMIT;    
    $queryParams = $request->getQueryParams();    
    if (!empty($queryParams['limit'])) {
        $count = $queryParams['limit'];
    }else{
         $count = 21;
    }
    $queryParams = $request->getQueryParams();
    if (!empty($queryParams['fields'])) {
        $fieldvalue = explode(',', $queryParams['fields']);
    } else {
        $fieldvalue = '*';
    }
    try {
        if (!empty($queryParams['limit']) && ($queryParams['limit'] == 'all')) {
            $count =Models\Photo::count();
        }        
        if (!empty($_GET['token'])) {
            $authUser = getUserDetails($_GET['token']);
        }
        $photo_flags = array();
        $photo_comments = array();
        if (!empty($request->getAttribute('userId'))) {
            if (!empty($authUser)) {
                $photos = Models\Photo::with('photo_like', 'flag', 'attachment', 'photos_photo_tag')->with(array('user' => function($q) use ($authUser){
                    $q->with(array('user_follow' => function($q) use ($authUser){
                            $q->where('user_id', $authUser->id);
                          }
                      ));
                    }
                ))->Filter($queryParams)->where('user_id', $request->getAttribute('userId'))->where('is_attachment_to_view', true)->paginate($count)->toArray();          
            } else {
                $photos = Models\Photo::with('attachment', 'photos_photo_tag','user')->Filter($queryParams)->where('user_id', $request->getAttribute('userId'))->where('is_attachment_to_view', true)->paginate($count)->toArray();
            }
        } elseif (!empty($request->getAttribute('photoTagId'))) {
            $photos_photo_tags = Models\PhotosPhotoTag::Filter($queryParams)->where('photo_tag_id', $request->getAttribute('photoTagId'))->select('photo_id')->get()->toArray();
            $photo_id = array();
            foreach ($photos_photo_tags as $photos_photo_tag) {
                $photo_id[] = $photos_photo_tag['photo_id'];
            }
            if (!empty($authUser)) {            
                $photos = Models\Photo::with('photo_like', 'flag', 'attachment', 'photos_photo_tag')->with(array('user' => function($q) use ($authUser){
                        $q->with(array('user_follow' => function($q) use ($authUser){
                                $q->where('user_id', $authUser->id);
                            }
                        ));
                        }
                    ))->where('is_attachment_to_view', true)->Filter($queryParams)->whereIn('id', $photo_id)->paginate($count)->toArray();
            } else {
                $photos = Models\Photo::with('attachment', 'photos_photo_tag','user')->where('is_attachment_to_view', true)->Filter($queryParams)->whereIn('id', $photo_id)->paginate($count)->toArray();
            }
        } elseif (!empty($request->getAttribute('photoId'))) {
            if (!empty($authUser)) {
               $photos = Models\Photo::with('photo_like', 'flag', 'attachment', 'photos_photo_tag')->with(array('user' => function($q) use ($authUser){
                    $q->with(array('user_follow' => function($q) use ($authUser){
                            $q->where('user_id', $authUser->id);
                          }
                      ));
                    }
                ))->where('id', $request->getAttribute('photoId'))->where('is_attachment_to_view', true)->select($fieldvalue)->first();  
            } else {
                $photos = Models\Photo::with('attachment', 'photos_photo_tag','user')->where('id', $request->getAttribute('photoId'))->where('is_attachment_to_view', true)->select($fieldvalue)->first();
            }
        } elseif (!empty($queryParams['filter']) && $queryParams['filter'] == 'following') {
            $ids = $myFollowings = array();
            if(!empty($authUser)) {
                $myFollowings = Models\UserFollow::where('user_id', $authUser['id'])->get()->toArray();
            }
            foreach ($myFollowings as $key => $value) {
                $ids[] = $value['other_user_id'];
            }
            if(!empty($authUser)) {
                $photos = Models\Photo::with('photo_like', 'flag', 'attachment', 'photos_photo_tag')->with(array('user' => function($q) use ($authUser){
                        $q->with(array('user_follow' => function($q) use ($authUser){
                                $q->where('user_id', $authUser->id);
                            }
                        ));
                        }
                    ))->whereIn('user_id', $ids)->where('is_attachment_to_view', true)->Filter($queryParams)->paginate($count)->toArray();
            } else {
                $photos = Models\Photo::with('attachment', 'photos_photo_tag','user')->whereIn('user_id', $ids)->where('is_attachment_to_view', true)->Filter($queryParams)->paginate($count)->toArray();                    
            }
        } else {            
            if (!empty($authUser)) {
                $photos = Models\Photo::with('photo_like', 'flag', 'attachment', 'photos_photo_tag')->with(array('user' => function($q) use ($authUser){
                    $q->with(array('user_follow' => function($q) use ($authUser){                           
                            $q->where('user_id', $authUser->id);
                          }
                      ));
                    }
                ))->where('is_attachment_to_view', true)->Filter($queryParams)->paginate($count)->toArray();
                $i = 0;
            foreach($photos['data'] as $value)
            {
                foreach($value['photos_photo_tag'] as $phototagid)
                {
                  $photos['data'][$i]['tags'][] = (int)$phototagid['photo_tag_id'];
                }
                $i++;
            }                                       
            } else {
                $photos = Models\Photo::with('attachment', 'photos_photo_tag','user')->where('is_attachment_to_view', true)->Filter($queryParams)->paginate($count)->toArray();
            }
        }
        if (!empty($request->getAttribute('photoId'))) {
            if ($photos['is_video'] == true && $photos['is_attachment_to_view'] == true) {
                $timestamp = time() + 3600; // one hour valid
                $hash = md5('Photo' . $photos['attachment']['id'] . $timestamp);                
                $photos['video_url'] = '/video/Photo/' . $photos['attachment']['id'] . '/' . $hash . '/' . $timestamp; 
            }
            $result = array(
                'data' => $photos
            );
        } else {
            $photo_data = array();
            foreach ($photos['data'] as $photo) {
                if ($photo['is_video'] == true && $photo['is_attachment_to_view'] == true) {
                    $timestamp = time() + 3600; // one hour valid
                    $hash = md5('Photo' . $photo['attachment']['id'] . $timestamp);                
                    $photo['video_url'] = '/video/Photo/' . $photo['attachment']['id'] . '/' . $hash . '/' . $timestamp; 
                    $photo_data[] = $photo;
                } else {
                    $photo_data[] = $photo; 
                }                
            }
            $data = $photo_data;
            unset($photos['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $photos
            );
        }
        return renderWithJson($result);
    } catch (Exception $e) {

        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
      }
}
//Get photo comments
function _getPhotoComments($request, $response, $args)
{
    $result = array();
    $queryParams = $request->getQueryParams();
    try {
             $count = PAGE_LIMIT;
            if (!empty($queryParams['limit'])) {
                $count = $queryParams['limit'];
            }
            $photoComments = Models\PhotoComment::with('user', 'photo');
            if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
                $result['data'] = $photoComments->get()->toArray();
                return renderWithJson($result);
            }
            elseif (!empty($request->getAttribute('photoId'))) {
                $photoComments = $photoComments->Filter($queryParams)->where('photo_id', $request->getAttribute('photoId'))->paginate($count)->toArray();
            } else {
                $photoComments = $photoComments->Filter($queryParams)->paginate($count)->toArray();
            }
            $data = $photoComments['data'];
            unset($photoComments['data']);
            $result = array(
                'data' => $data,
                '_metadata' => $photoComments
            );
        
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
}
//Get photo flags
function _getFlags($request, $response, $args)
{
    $result = array();
    $queryParams = $request->getQueryParams();
    try {
        $count = PAGE_LIMIT;
        if (!empty($queryParams['limit'])) {
            $count = $queryParams['limit'];
        }
        $flags = Models\Flag::with('photo', 'user', 'attachment', 'flag_category','flagged_user');
        if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
            $result['data'] = $flags->get()->toArray();
            return renderWithJson($result);
        }                
        elseif (!empty($request->getAttribute('photoId'))) {
            $flags = $flags->Filter($queryParams)->where('photo_id', $request->getAttribute('photoId'))->paginate($count)->toArray();
        } elseif (!empty($request->getAttribute('flagId'))) {
            $result['data'] = $flags->Filter($queryParams)->where('id', $request->getAttribute('flagId'))->get()->toArray();
            return renderWithJson($result);
        } else {
            $flags = $flags->Filter($queryParams)->paginate($count)->toArray();
        }
        $data = $flags['data'];
        unset($flags['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $flags
        );
        return renderWithJson($result);
    } catch (Exception $e) {        
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
}
//Get photo likes
function _getPhotoLikes($request, $response, $args)
{
    $result = array();
    $queryParams = $request->getQueryParams();
    try {
         $count = PAGE_LIMIT;
            if (!empty($queryParams['limit'])) {
                $count = $queryParams['limit'];
            }
            $photoLikes = Models\PhotoLike::with('user', 'photo');
            if (!empty($queryParams['limit']) && $queryParams['limit'] == 'all') {
                $result['data'] = $photoLikes->get()->toArray();
                return renderWithJson($result);
            }elseif (!empty($request->getAttribute('photoId'))) {
                    $photoLikes = $photoLikes->Filter($queryParams)->where('photo_id', $request->getAttribute('photoId'))->paginate($count)->toArray();
            } else {
                    $photoLikes = $photoLikes->Filter($queryParams)->paginate($count)->toArray();
                }
                $data = $photoLikes['data'];
                unset($photoLikes['data']);
                $result = array(
                    'data' => $data,
                    '_metadata' => $photoLikes
                );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
}
//Get photos
function _getUserFollows($request, $response, $args)
{
    $result = array();
    $queryParams = $request->getQueryParams();
    try {
        if (!isset($queryParams['limit']) || ($queryParams['limit'] == 'all')) {
           $queryParams['limit']=Models\UserFollow::count();
        }
        if (!empty($request->getAttribute('userId'))) {
            $userFollows = Models\UserFollow::with('user', 'following_user')->Filter($queryParams)->where('user_id', $request->getAttribute('userId'))->paginate($queryParams['limit'])->toArray();
        } elseif (!empty($request->getAttribute('userFollowingId'))) {
            $userFollows = Models\UserFollow::with('user', 'following_user')->Filter($queryParams)->where('other_user_id', $request->getAttribute('userFollowingId'))->paginate($queryParams['limit'])->toArray();
        } else {
            $userFollows = Models\UserFollow::with('user', 'following_user')->Filter($queryParams)->paginate($queryParams['limit'])->toArray();
        }
        $data = $userFollows['data'];
        unset($userFollows['data']);
        $result = array(
            'data' => $data,
            '_metadata' => $userFollows
        );
        return renderWithJson($result);
    } catch (Exception $e) {
        return renderWithJson($result, $message = 'No record found', $fields = '', $isError = 1);
    }
}