<?php
/**
 * OauthAccessToken
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
namespace Models;

class OauthAccessToken extends AppModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'oauth_access_tokens';
    //User relation
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'username')->select('id', 'role_id');
    }
}
