<?php
/**
 * Core configurations
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
/**
 * sendmail
 *
 * @param string $template    template name
 * @param array  $replace_content   replace content
 * @param string  $to  to email address
 * @param string  $reply_to_mail  reply email address
 *
 * @return true or false
 */
function sendMail($template, $replace_content, $to, $reply_to_mail = '')
{
    global $_server_domain_url;
    // Create Transport
    $transport = Swift_MailTransport::newInstance();
    // Create Mailer with our Transport.
    $mailer = Swift_Mailer::newInstance($transport);
    $default_content = array(
        '##SITE_NAME##' => SITE_NAME,
        '##SITE_URL##' => $_server_domain_url,
        '##FROM_EMAIL##' => SITE_FROM_EMAIL,
        '##CONTACT_EMAIL##' => SITE_CONTACT_EMAIL
    );
    $emailFindReplace = array_merge($default_content, $replace_content);
    $email_templates = Models\EmailTemplate::where('name', $template)->first();
    if (count($email_templates) > 0) {
        $message = strtr($email_templates['email_content'], $emailFindReplace);
        $subject = strtr($email_templates['subject'], $emailFindReplace);
        $from_email = strtr($email_templates['from'], $emailFindReplace);
        $message = Swift_Message::newInstance($subject)->setFrom(array(
            $from_email => SITE_NAME
        ))->setTo(array(
            $to => $to
        ))->setBody($message)->setContentType("text/plain");
        // Send the message
        //1 - Sent, 0 - Failure
        return $mailer->send($message);
    }
    return false;
}
/**
 * Insert current access ip address into IPs table
 *
 * @return int IP id
 */
function saveIp()
{
    $ip = new Models\Ip;
    $ips = $ip->where('ip', $_SERVER['REMOTE_ADDR'])->first();
    if (!empty($ips)) {
        return $ips['id'];
    } else {
        $save_ip = new Models\Ip;
        $save_ip->ip = $_SERVER['REMOTE_ADDR'];
        $save_ip->host = gethostbyaddr($_SERVER['REMOTE_ADDR']);
        $save_ip->save();
        return $save_ip->id;
    }
}
/**
 * Checking already username is exists in users table
 *
 * @return true or false
 */
function checkAlreadyUsernameExists($username)
{
    $user = Models\User::where('username', $username)->first();
    if (!empty($user)) {
        return true;
    }
    return false;
}
/**
 * Checking already email is exists in users table
 *
 * @return true or false
 */
function checkAlreadyEmailExists($email)
{
    $user = Models\User::where('email', $email)->first();
    if (!empty($user)) {
        return true;
    }
    return false;
}
/**
 * Checking already mobile is exists in users profile table
 *
 * @return true or false
 */
function checkAlreadyMobileExists($mobile)
{
    $user = Models\User::where('mobile', $mobile)->first();
    if (!empty($user)) {
        return true;
    }
    return false;
}
/**
 * Returns an OAuth2 access token to the client
 *
 * @param array $post Post data
 *
 * @return mixed
 */
function getToken($post)
{
    $old_server_method = $_SERVER['REQUEST_METHOD'];
    if (!empty($_SERVER['CONTENT_TYPE'])) {
        $old_content_type = $_SERVER['CONTENT_TYPE'];
    }
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $_SERVER['CONTENT_TYPE'] = 'application/x-www-form-urlencoded';
    $_POST = $post;
    OAuth2\Autoloader::register();
    $oauth_config = array(
        'user_table' => 'users'
    );
    $val_array = array(
        'dsn' => 'pgsql:host=' . R_DB_HOST . ';dbname=' . R_DB_NAME . ';port=' . R_DB_PORT,
        'username' => R_DB_USER,
        'password' => R_DB_PASSWORD
    );
    $storage = new OAuth2\Storage\Pdo($val_array, $oauth_config);
    $server = new OAuth2\Server($storage);
    if (isset($_POST['grant_type']) && $_POST['grant_type'] == 'password') {
        $val_array = array(
            'password' => $_POST['password']
        );
        $users = array(
            $_POST['username'] => $val_array
        );
        $user_credentials = array(
            'user_credentials' => $users
        );
        $storage = new OAuth2\Storage\Memory($user_credentials);
        $server->addGrantType(new OAuth2\GrantType\UserCredentials($storage));
    } elseif (isset($_POST['grant_type']) && $_POST['grant_type'] == 'refresh_token') {
        $always_issue_new_refresh_token = array(
            'always_issue_new_refresh_token' => true
        );
        $server->addGrantType(new OAuth2\GrantType\RefreshToken($storage, $always_issue_new_refresh_token));
    } elseif (isset($_POST['grant_type']) && $_POST['grant_type'] == 'authorization_code') {
        $server->addGrantType(new OAuth2\GrantType\AuthorizationCode($storage));
    } else {
        $val_array = array(
            'client_secret' => OAUTH_CLIENT_SECRET
        );
        $clients = array(
            OAUTH_CLIENT_ID => $val_array
        );
        $credentials = array(
            'client_credentials' => $clients
        );
        $storage = new OAuth2\Storage\Memory($credentials);
        $server->addGrantType(new OAuth2\GrantType\ClientCredentials($storage));
    }
    $response = $server->handleTokenRequest(OAuth2\Request::createFromGlobals())->send('return');
    $_SERVER['REQUEST_METHOD'] = $old_server_method;
    if (!empty($old_content_type)) {
        $_SERVER['CONTENT_TYPE'] = $old_content_type;
    }
    return json_decode($response, true);
}
/**
 * To generate random string
 *
 * @param array  $arr_characters Random string options
 * @param string $length         Length of the random string
 *
 * @return string
 */
function getRandomStr($arr_characters, $length)
{
    $rand_str = '';
    $characters_length = count($arr_characters);
    for ($i = 0; $i < $length; ++$i) {
        $rand_str.= $arr_characters[rand(0, $characters_length - 1) ];
    }
    return $rand_str;
}
/**
 * To generate the encrypted password
 *
 * @param string $str String to be encrypted
 *
 * @return string
 */
function getCryptHash($str)
{
    $salt = '';
    if (CRYPT_BLOWFISH) {
        if (version_compare(PHP_VERSION, '5.3.7') >= 0) { // http://www.php.net/security/crypt_blowfish.php
            $algo_selector = '$2y$';
        } else {
            $algo_selector = '$2a$';
        }
        $workload_factor = '12$'; // (around 300ms on Core i7 machine)
        $val_arr = array(
            '.',
            '/'
        );
        $range1 = range('0', '9');
        $range2 = range('a', 'z');
        $range3 = range('A', 'Z');
        $res_arr = array_merge($val_arr, $range1, $range2, $range3);
        $salt = $algo_selector . $workload_factor . getRandomStr($res_arr, 22); // './0-9A-Za-z'
    } elseif (CRYPT_MD5) {
        $algo_selector = '$1$';
        $char1 = chr(33);
        $char2 = chr(127);
        $range = range($char1, $char2);
        $salt = $algo_selector . getRandomStr($range, 12); // actually chr(0) - chr(255), but used ASCII only
    } elseif (CRYPT_SHA512) {
        $algo_selector = '$6$';
        $workload_factor = 'rounds=5000$';
        $char1 = chr(33);
        $char2 = chr(127);
        $range = range($char1, $char2);
        $salt = $algo_selector . $workload_factor . getRandomStr($range, 16); // actually chr(0) - chr(255)
    } elseif (CRYPT_SHA256) {
        $algo_selector = '$5$';
        $workload_factor = 'rounds=5000$';
        $char1 = chr(33);
        $char2 = chr(127);
        $range = range($char1, $char2);
        $salt = $algo_selector . $workload_factor . getRandomStr($range, 16); // actually chr(0) - chr(255)
    } elseif (CRYPT_EXT_DES) {
        $algo_selector = '_';
        $val_arr = array(
            '.',
            '/'
        );
        $range1 = range('0', '9');
        $range2 = range('a', 'z');
        $range3 = range('A', 'Z');
        $res_arr = array_merge($val_arr, $range1, $range2, $range3);
        $salt = $algo_selector . getRandomStr($res_arr, 8); // './0-9A-Za-z'.
    } elseif (CRYPT_STD_DES) {
        $algo_selector = '';
        $val_arr = array(
            '.',
            '/'
        );
        $range1 = range('0', '9');
        $range2 = range('a', 'z');
        $range3 = range('A', 'Z');
        $res_arr = array_merge($val_arr, $range1, $range2, $range3);
        $salt = $algo_selector . getRandomStr($res_arr, 2); // './0-9A-Za-z'
    }
    return crypt($str, $salt);
}
/**
 * To login using social networking site accounts
 *
 * @params $profile
 * @params $provider_id
 * @params $provider
 * @params $adapter
 * @return array
 */
function social_login($profile, $provider_id, $provider, $adapter)
{
    $bool = false;
    $provider_details = Models\Provider::where('name', ucfirst($provider))->first();
    $profile_picture_url = !empty($profile->photoURL) ? $profile->photoURL : '';
    $access_token = $profile->access_token;
    $response = $profile->access_token;
    $access_token_secret = $profile->access_token_secret;
    if ($provider_id == \Constants\ConstSocialLogins::Twitter) {
        $access_token_arr = (array)$profile->access_token;
        $access_token = $access_token_arr['oauth_token'];
        $access_token_secret = $access_token_arr['oauth_token_secret'];
    }
    $checkProviderUser = Models\ProviderUser::where('provider_id', $provider_id)->where('foreign_id', $profile->identifier)->where('is_connected', true)->first();
    if (!empty($checkProviderUser)) {
        $isAlreadyExistingUser = Models\User::where('id', $checkProviderUser['user_id'])->first();
        $checkProviderUser->access_token = $access_token;
        $checkProviderUser->update();
        $ip_id = saveIp();
        $profile->last_logged_in_time = date('Y-m-d H:i:s');
        if (!empty($ip_id)) {
            $isAlreadyExistingUser->last_login_ip_id = $ip_id;
        }
        $isAlreadyExistingUser->update();
        // Storing user_logins data
        $user_logins_data['user_agent'] = !empty($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        $user_logins_data['user_id'] = $isAlreadyExistingUser['id'];
        if ($isAlreadyExistingUser['is_active']) {
            $bool = true;
            $current_user_id = $checkProviderUser['user_id'];
            $response = array(
                'error' => array(
                    'code' => 0,
                    'message' => 'Already Connected. So just login'
                )
            );
        }
    } else {
        if (!empty($profile->email)) {
            $isAlreadyExistingUser = Models\User::where('email', $profile->email)->first();
            if (!empty($isAlreadyExistingUser)) {
                $bool = true;
                $provider_user = Models\ProviderUser::where('user_id', $isAlreadyExistingUser['id'])->where('provider_id', $provider_id)->first();
                if(!empty($provider_user)){
                    $provider_user->delete();
                }
                $provider_user_ins = new Models\ProviderUser;
                $provider_user_ins->user_id = $isAlreadyExistingUser['id'];
                $provider_user_ins->provider_id = $provider_id;
                $provider_user_ins->foreign_id = $profile->identifier;
                $provider_user_ins->access_token = $access_token;
                $provider_user_ins->access_token_secret = $access_token_secret;
                $provider_user_ins->is_connected = true;
                $provider_user_ins->profile_picture_url = $profile_picture_url;                
                $provider_user_ins->save();
                $current_user_id = $isAlreadyExistingUser['id'];
                $response = array(
                    'error' => array(
                        'code' => 0,
                        'message' => 'Connected succesfully'
                    )
                );
            } else {
                $user_data = new Models\User;
                $provider_users_data = new Models\ProviderUser;
                $username = strtolower(str_replace(' ', '', $profile->displayName));
                $username = $user_data->checkUserName($username);
                $ip_id = saveIp();
                $user_data->username = Inflector::slug($username, '-');
                $user_data->email = (property_exists($profile, 'email')) ? $profile->email : "";
                $user_data->password = getCryptHash('default'); // dummy password
                $user_data->is_email_confirmed = true;
                $user_data->is_active = true;
                $user_data->last_logged_in_time = date('Y-m-d H:i:s');
                $user_data->provider_id = $provider_id;
                if (!empty($ip_id)) {
                    $user_data->last_login_ip_id = $ip_id;
                }
                $user_data->save();
                $current_user_id = $user_data->id;
                $provider_users_data->user_id = $user_data->id;
                $provider_users_data->provider_id = $provider_id;
                $provider_users_data->foreign_id = $profile->identifier;
                $provider_users_data->access_token = $access_token;
                $provider_users_data->access_token_secret = $access_token_secret;
                $provider_users_data->is_connected = true;
                $provider_users_data->profile_picture_url = $profile_picture_url;
                $provider_users_data->save();
                $response = array(
                    'error' => array(
                        'code' => 0,
                        'message' => 'Registered and connected succesfully'
                    )
                );
            }
        } else {
            $response['thrid_party_login_no_email'] = 1;
            $profile->provider_id = $provider_id;
            $profile->provider = $provider;
            $response['thrid_party_profile'] = $profile;
        }
    }
    if (!empty($current_user_id)) {
        $user = Models\User::where('id', $current_user_id)->first();
        $scopes = '';
        if (!empty($user['scopes_' . $user['role_id']])) {
            $scopes = implode(' ', $user['scopes_' . $user['role_id']]);
        }
        $post_val = array(
            'grant_type' => 'password',
            'username' => $user['username'],
            'password' => $user['password'],
            'client_id' => OAUTH_CLIENT_ID,
            'client_secret' => OAUTH_CLIENT_SECRET,
            'scope' => $scopes
        );
        $response = getToken($post_val);
        $authUser = $user;
        $response['error']['code'] = 0;
        $response['user'] = $user;
        $response['already_register'] = ($bool) ? '1' : '0';
    }
    $response['thrid_party_login'] = 1;
    return $response;
}
/**
 * To login using social networking site accounts
 *
 * @params $provider
 * @params $pass_value
 * @return array
 */
function social_auth_login($provider, $pass_value = array())
{
    include 'vendors/Providers/' . $provider . '.php';
    $provider_details = Models\Provider::where('name', ucfirst($provider))->first();
    $provider_id = $provider_details['id'];
    $pass_value['secret_key'] = $provider_details['secret_key'];
    $pass_value['api_key'] = $provider_details['api_key'];
    $class_name = "Providers_" . $provider;
    if(!empty($pass_value['thrid_party_login'])){
        return social_email_login($pass_value,$adapter);
    }
    $adapter = new $class_name();
    if(!empty($pass_value['access_token'])){
        $access_token =$pass_value['access_token'];        
    }else{
        $access_token = $adapter->getAccessToken($pass_value);
    }
    $profile = $adapter->getUserProfile($access_token, $provider_details);
    $profile->access_token = $profile->access_token_secret = '';
    $profile->access_token = $access_token;
    $response = social_login($profile, $provider_id, $provider, $adapter);
    return $response;
}
function social_email_login($data,$adapter)
{
    $profile = (object)$data['thrid_party_profile'];
    $profile->email = $data['email'];
    $provider_id = $profile->provider_id;
    $provider = $profile->provider;
    $isAlreadyRegisteredUser = Models\ProviderUser::where('provider_id', $provider_id)->where('foreign_id', $profile->identifier)->where('is_connected', true)->first();
    $checkUser= Models\User::where('email',$data['email'])->first();
    if (!($isAlreadyRegisteredUser && $checkUser)) {
    //To login using social networking site accounts
        $response = social_login($profile, $provider_id, $provider, $adapter);
    } else {
    $response['thrid_party_login'] = 1;
    $response['error']['code'] = 1;
    $response['error']['message'] = 'Already registered email';
    }
    return $response;
}
/**
 * Curl _execute
 *
 * @params string $url
 * @params string $method
 * @params array $method
 * @params string $format
 *
 * @return array
 */
function _execute($url, $method = 'get', $post = array(), $format = 'plain')
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    if ($method == 'get') {
        curl_setopt($ch, CURLOPT_POST, false);
    } elseif ($method == 'post') {
        if ($format == 'json') {
            $post_string = json_encode($post);
            $header = array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($post_string)
            );
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        } else {
            $post_string = http_build_query($post, '', '&');
        }
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
    } elseif ($method == 'put') {
        if ($format == 'json') {
            $post_string = json_encode($post);
            $header = array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($post_string)
            );
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        } else {
            $post_string = http_build_query($post, '', '&');
        }
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
    } elseif ($method == 'delete') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    // Note: timeout also falls here...
    if (curl_errno($ch)) {
        $return['error']['message'] = curl_error($ch);
        curl_close($ch);
        return $return;
    }
    switch ($http_code) {
        case 201:
        case 200:
            if (isJson($response)) {
                $return = safe_json_decode($response);
            } else {
                $return = $response;
            }
            break;

        case 401:
            $return['error']['code'] = 1;
            $return['error']['message'] = 'Unauthorized';
            break;

        default:
            $return['error']['code'] = 1;
            $return['error']['message'] = 'Not Found';
    }
    curl_close($ch);
    return $return;
}
/**
 * To check whether it is json or not
 *
 * @param json $string To check string is a JSON or not
 *
 * @return mixed
 */
function isJson($string)
{
    json_decode($string);
    //check last json error
    return (json_last_error() == JSON_ERROR_NONE);
}
/**
 * safe Json code
 *
 * @param json $json   json data
 *
 * @return array
 */
function safe_json_decode($json)
{
    $return = json_decode($json, true);
    if ($return === null) {
        $error['error']['code'] = 1;
        $error['error']['message'] = 'Syntax error, malformed JSON';
        return $error;
    }
    return $return;
}
/**
 * Get request by using CURL
 *
 * @param string $url    URL to execute
 *
 * @return mixed
 */
function _doGet($url)
{
    $return = _execute($url);
    return $return;
}
/**
 * Post request by using CURL
 *
 * @param string $url    URL to execute
 * @param array  $post   Post data
 * @param string $format To differentiate post data in plain or json format
 *
 * @return mixed
 */
function _doPost($url, $post = array(), $format = 'plain')
{
    return _execute($url, 'post', $post, $format);
}
/**
 * Render Json Response
 *
 * @param array $response    response
 * @param string  $message  Messgae
 * @param string  $fields  fields
 * @param int  $isError  isError
 * @param int  $statusCode  Status code
 *
 * @return json response
 */
function renderWithJson($response, $message = '', $fields = '', $isError = 0, $statusCode = 200)
{
    global $app;
    $appResponse = $app->getContainer()->get('response');
    if (!empty($fields)) {
        $statusCode = 422;
    }
    $error = array(
        'error' => array(
            'code' => $isError,
            'message' => $message,
            'fields' => $fields
        )
    );
    return $appResponse->withJson($response + $error, $statusCode);
}
/**
 * Findorsave city details
 *
 * @params string $data
 * @params int $country_id
 * @params int $state_id
 *
 * @return int IP id
 */
function findOrSaveAndGetCityId($data, $country_id, $state_id)
{
    $city = new Models\City;
    $city_list = $city->where('name', $data)->where('state_id', $state_id)->where('country_id', $country_id)->select('id')->first();
    if (!empty($city_list)) {
        return $city_list['id'];
    } else {
        $city->name = $data;
        $city->slug = Inflector::slug(strtolower($data), '-');
        $city->country_id = $country_id;
        $city->state_id = $state_id;
        $city->save();
        return $city->id;
    }
}
/**
 * Findorsave state details
 *
 * @params string $data
 * @params int $country_id
 *
 * @return int IP id
 */
function findOrSaveAndGetStateId($data, $country_id)
{
    $state = new Models\State;
    $state_list = $state->where('name', $data)->where('country_id', $country_id)->select('id')->first();
    if (!empty($state_list)) {
        return $state_list['id'];
    } else {
        $state->name = $data;
        $state->slug = Inflector::slug(strtolower($data), '-');
        $state->country_id = $country_id;
        $state->save();
        return $state->id;
    }
}
/**
 * Get country id
 *
 * @param int $iso2  ISO2
 *
 * @return int country Id
 */
function findCountryIdFromIso2($iso2)
{
    $country = Models\Country::where('iso_alpha2', $iso2)->select('id')->first();
    if (!empty($country)) {
        return $country['id'];
    }
}
/**
 * Get user details
 *
 * @params string $token
 *
 * @return array
 */
function getUserDetails($token)
{
    $oauthAccessToken = Models\OauthAccessToken::where('access_token', $token)->first();
    $user = array();
    if (!empty($oauthAccessToken)) {
        if (!empty($oauthAccessToken['user_id'])) {
            $user = Models\User::select('id', 'role_id')->where('username', $oauthAccessToken['user_id'])->first();
        }
    }
    return $user;
}
function findAndSavePhotoTag($tag)
{
    $photo_tag = Models\PhotoTag::where('name', 'ilike', $tag)->select('id')->first();
    if (!empty($photo_tag)) {
        return $photo_tag['id'];
    } else {
        $photo_tag = new Models\PhotoTag;
        $photo_tag->name = strtolower($tag);
        $photo_tag->slug = Inflector::slug(strtolower($tag), '-');
        $photo_tag->save();
        return $photo_tag->id;
    }
}
function updateNotificationSettings($userId)
{
    $user_notification_setting = new Models\UserNotificationSetting;
    $user_notification_setting->user_id = $userId;
    $user_notification_setting->is_enable_email_when_someone_follow_me = 1;
    $user_notification_setting->is_enable_email_when_someone_mentioned_me = 1;
    $user_notification_setting->is_enable_email_when_someone_message_me = 1;
    $user_notification_setting->is_enable_subscribe_me_for_newsletter = 1;
    $user_notification_setting->is_enable_subscribe_me_for_weeky_replay = 1;
    $user_notification_setting->save();
    $user = Models\User::where('id', $userId)->first();
    $user->user_notification_setting_id = $user_notification_setting->id;
    $user->save();
}
function insertUserLogin($user_id)
{
    $user_login = new Models\UserLogin;
    $user_login->user_id = $user_id;
    $user_login->ip_id = saveIp();
    $user_login->user_agent = $_SERVER['HTTP_USER_AGENT'];
    $user_login->save($user_id);
}
function checkAlreadyUserFollowed($following_user_id, $auth_user_id)
{
    $userFollow = false;
    $user = Models\UserFollow::select('id')->where('user_id', $auth_user_id)->where('other_user_id', $following_user_id)->first();
    if (!empty($user)) {
        $userFollow = true;
    }
    return $userFollow;
}
