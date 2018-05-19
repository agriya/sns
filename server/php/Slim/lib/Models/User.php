<?php
/**
 * User
 *
 * PHP version 5
 *
* @category   PHP
* @package    SNS
* @subpackage Core
* @author     Agriya <info@agriya.com>
* @copyright  2018 Agriya Infoway Private Ltd
* @license    http://www.agriya.com/ Agriya Infoway Licence
* @link       http://www.agriya.comm
 */
namespace Models;

class User extends AppModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';
    //Search Filter
    public $qSearchFields = array(
        'first_name',
        'last_name',
        'username',
        'email',
    );
    public $rules = array(
        'first_name' => 'sometimes|required',
        'last_name' => 'sometimes|required',
        'username' => 'sometimes|required|alpha_num',
        'email' => 'sometimes|required|email',
        'password' => 'sometimes|required'
    );
    //Admin Scope
    protected $scopes_1 = array();
    //user scope
    protected $scopes_2 = array(
        'canUpdateUser',
        'canDeleteUser',
        'canListUserTransactions',
        'canUserCreateUserCashWithdrawals',
        'canUserViewUserCashWithdrawals',
        'canUserListUserCashWithdrawals',
        'canUserCreateMoneyTransferAccount',
        'canUserUpdateMoneyTransferAccount',
        'canUserViewMoneyTransferAccount',
        'canUserListMoneyTransferAccount',
        'canUserDeleteMoneyTransferAccount',
        'canCreateMessage',
        'canUpdateMessage',
        'canCreatePhoto',
        'canListActivity',
        'canListMessage',
        'canCreatePhotoLike',
        'canCreateFlag',
        'canDeletePhotoLike',
        'canDeletePhoto',
        'canUpdatePhoto',
        'canDeleteUserFollow',
        'canDeleteFlag',
        'canCreateUserFollow',
        'canViewUserNotificationSetting',
        'canUpdateUserNotificationSetting',
        'canDeleteActivity',
        'canDeletePhotoComment',
        'canUpdateActivity',
        'canUpdatePhotoComment',
        'canViewMessage'
       
    );
    public function scopeFilter($query, $params = array(),$issearchq=true)
    {    
        parent::scopeFilter($query, $params,$issearchq);   
        if (!empty($params['role_id'])) {
             $query->where('role_id', $params['role_id']);
        }
    }    
    /**
     * To check if username already exist in user table, if so generate new username with append number
     *
     * @param string $username User name which want to check if already exsist
     *
     * @return mixed
     */
    public function checkUserName($username)
    {
        $userExist = User::where('username', $username)->first();
        if (count($userExist) > 0) {
            $org_username = $username;
            $i = 1;
            do {
                $username = $org_username . $i;
                $userExist = User::where('username', $username)->first();
                if (count($userExist) < 0) {
                    break;
                }
                $i++;
            } while ($i < 1000);
        }
        return $username;
    }
    //city relation
    public function city()
    {
        return $this->belongsTo('Models\City', 'city_id', 'id')->select('id', 'name');
    }
    //state relation
    public function state()
    {
        return $this->belongsTo('Models\State', 'state_id', 'id')->select('id', 'name');
    }
    //country relation
    public function country()
    {
        return $this->belongsTo('Models\Country', 'country_id', 'id')->select('id', 'iso_alpha2','name');
    }
    public function attachment()
    {
        return $this->hasOne('Models\Attachment', 'foreign_id', 'id')->where('class', 'UserAvatar');
    }
    public function photo()
    {
         if (!empty($_GET['token'])) {
            $authuser = getUserDetails($_GET['token']);
        }
         if (!empty($authuser)) {
        return $this->hasMany('Models\Photo', 'user_id','id')->with('attachment','photo_like','photos_photo_tag','flag');
         }
         else{
        return $this->hasMany('Models\Photo', 'user_id','id')->with('attachment','photos_photo_tag');     
         }
    }
    public function cover_photo()
    {
        return $this->hasOne('Models\Attachment', 'foreign_id', 'id')->where('class', 'UserCoverPhoto');
    }
    public function user_follow()
    {
        if (!empty($_GET['token'])) {
            $authuser = getUserDetails($_GET['token']);
            if (!empty($authuser)) {
                return $this->hasMany('Models\UserFollow', 'other_user_id','id')->where('user_id', $authuser['id'])->with('user');
            }
        }
    }
    public function flag()
    {
        if (!empty($_GET['token'])) {
            $authuser = getUserDetails($_GET['token']);
            if (!empty($authuser)) {
                return $this->hasMany('Models\Flag', 'flagged_user_id', 'id')->where('user_id', $authuser['id'])->where('type','user');
            }
        }
    }    
}
