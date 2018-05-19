<?php
/**
 * Activity
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
 * Activity
*/
class Activity extends AppModel
{
    protected $table = 'activities';
    public $rules = array(
        'is_read' => 'sometimes|required'
    );
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id')->select('id', 'username')->with('attachment');
    }
    public function owner_user()
    {
        return $this->belongsTo('Models\User', 'owner_user_id', 'id')->select('id', 'username');
        ;
    }
    public function photo_comment()
    {
        return $this->belongsTo('Models\PhotoComment', 'foreign_id', 'id');
    }
    public function photo()
    {
        return $this->belongsTo('Models\Photo', 'foreign_id', 'id');
    }    
    public function user_follow()
    {
        return $this->belongsTo('Models\UserFollow', 'foreign_id', 'id');
    }
    public function photo_like()
    {
        return $this->belongsTo('Models\PhotoLike', 'foreign_id', 'id');
    }
    public function updateActivityCount($user_id)
    {

        $unread_activities_count = Activity::where('owner_user_id', $user_id)->where('is_read', 'f')->count();
        $user = User::where('id', $user_id)->update(array(
            'unread_activities_count' => $unread_activities_count
        ));
    }

}
