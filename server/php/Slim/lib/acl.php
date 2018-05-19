<?php
/**
 * Roles configurations
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
class ACL
{
    public function __construct($scope)
    {
        $this->scope = $scope;
    }
    public function __invoke($request, $response, $next)
    {
        global $authUser;
        if (!empty($_GET['token'])) {
            // Checking provided access token is available/not expired
            $oauthAccessToken = Models\OauthAccessToken::where('access_token', $_GET['token'])->first();
            if (!empty($oauthAccessToken['user_id'])) {
                $authUser = Models\User::select('id', 'role_id')->where('username', $oauthAccessToken['user_id'])->where('is_active', 1)->where('is_email_confirmed', 1)->first();
            }
            $expires = !empty($oauthAccessToken['expires']) ? strtotime($oauthAccessToken['expires']) : 0;
            if (empty($oauthAccessToken['access_token']) || ($expires > 0 && $expires < time()) || ((empty($authUser) || (!empty($authUser['role_id']) && $authUser['role_id'] != \Constants\ConstUserTypes::Admin)) && !in_array($this->scope, explode(' ', $oauthAccessToken['scope'])))) {
                $response = renderWithJson(array(), 'Authorization Failed', '', 1, 401);
            } else {
                $response = $next($request, $response);
            }
        } else {
            $response = renderWithJson(array(), 'Authorization Failed', '', 1, 401);
        }
        return $response;
    }
}
