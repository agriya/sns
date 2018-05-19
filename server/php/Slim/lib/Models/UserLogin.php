<?php
/**
 * UserLogin
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

/*
 * UserLogin
*/
class UserLogin extends AppModel
{
    protected $table = 'user_logins';
    public function save($user_id)
    {
        // before save code
        parent::save();
        // after save codes
        $user_login_count = UserLogin::where('user_id', $user_id)->count();
        $user = User::where('id', $user_id)->update(array(
            'user_login_count' => $user_login_count
        ));
    }
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id')->select('username', 'id', 'first_name', 'last_name');
    }
    public function ip()
    {
        return $this->belongsTo('Models\Ip', 'ip_id', 'id');
    }
    public function scopeFilter($query, $params = array())
    {  
        parent::scopeFilter($query, $params);
        if (!empty($params['q'])) {
            $query->orWhereHas('user', function ($q) use ($params) {
                return $q->where('username', 'like', '%' . $params['q'] . '%');
            });
        }
        if (!empty($params['user_id'])) {
            $query->where('user_id',$params['user_id']);
        }
        return $query;
    }
}
