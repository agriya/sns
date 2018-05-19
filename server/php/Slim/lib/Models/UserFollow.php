<?php
/**
 * UserFollow
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
 * UserFollow
*/
class UserFollow extends AppModel
{
    protected $table = 'user_follows';
    public $rules = array(
        'other_user_id' => 'sometimes|required'
    );
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id')->with('user_follow', 'attachment');
    }
    public function following_user()
    {
        return $this->belongsTo('Models\User', 'other_user_id', 'id')->with('user_follow', 'attachment');
    }
    public function activity()
    {
        return $this->hasOne('Models\Activity', 'foreign_id', 'id')->where('class', 'UserFollow');
    }
    public function save($user_id, $following_id)
    {
        // before save code
        parent::save();
        // after save code
        $user_follower_count = UserFollow::where('other_user_id', $user_id)->count();
        $user_following_count = UserFollow::where('user_id', $user_id)->count();
        $user = User::where('id', $user_id)->update(array(
            'user_follower_count' => $user_follower_count,
            'user_following_count' => $user_following_count
        ));
        $user_follower_count = UserFollow::where('other_user_id', $following_id)->count();
        $user_following_count = UserFollow::where('user_id', $following_id)->count();
        $user = User::where('id', $following_id)->update(array(
            'user_follower_count' => $user_follower_count,
            'user_following_count' => $user_following_count
        ));
    }
    public function delete($user_id, $following_id)
    {
        // before delete code
        parent::delete();
        // after delete code
        $user_follower_count = UserFollow::where('other_user_id', $user_id)->count();
        $user_following_count = UserFollow::where('user_id', $user_id)->count();
        $user = User::where('id', $user_id)->update(array(
            'user_follower_count' => $user_follower_count,
            'user_following_count' => $user_following_count
        ));
        $user_follower_count = UserFollow::where('other_user_id', $following_id)->count();
        $user_following_count = UserFollow::where('user_id', $following_id)->count();
        $user = User::where('id', $following_id)->update(array(
            'user_follower_count' => $user_follower_count,
            'user_following_count' => $user_following_count
        ));
    }
    public function scopeFilter($query, $params = array())
    {
         parent::scopeFilter($query, $params);
         if (!empty($params['q'])) {
            $query->orWhereHas('user', function ($q) use ($params) {
                return $q->where('username', 'like', '%' . $params['q'] . '%');
            });
            $query->orWhereHas('following_user', function ($q) use ($params) {
                return $q->where('username', 'like', '%' . $params['q'] . '%');
            });
         }
         if (!empty($params['user_id'])) {
            $query->where('user_id',$params['user_id']);
         }
         if (!empty($params['other_user_id'])) {
            $query->where('other_user_id',$params['other_user_id']);
         }
         if (!empty($params['following_user'])) {
            $query->where('other_user_id',$params['following_user']);
         }
         return $query;
    }
}
