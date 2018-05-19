<?php
/**
 * Photo
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
 * Photo
*/
class Photo extends AppModel
{
    protected $table = 'photos';
    public $rules = array(
        'title' => 'sometimes|required',
        'description' => 'sometimes|required'
    );
    public $qSearchFields = array(
        'description'
    );
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id')->with('attachment');
    }
    public function attachment()
    {
        return $this->hasOne('Models\Attachment', 'foreign_id', 'id')->where('class', 'Photo');
    }
    public function photo_like()
    {
        if (!empty($_GET['token'])) {
            $authuser = getUserDetails($_GET['token']);
            if (!empty($authuser)) {
                return $this->hasMany('Models\PhotoLike', 'photo_id', 'id')->where('user_id', $authuser['id']);
            }
        }
    }
    public function flag()
    {
        if (!empty($_GET['token'])) {
            $authuser = getUserDetails($_GET['token']);
            if (!empty($authuser)) {
                return $this->hasMany('Models\Flag', 'photo_id', 'id')->where('user_id', $authuser['id'])->where('type','photo');
            }
        }
    }
    public function photo_comment()
    {
        return $this->hasMany('Models\PhotoComment', 'photo_id', 'id');
    }
    public function photos_photo_tag()
    {
        return $this->hasMany('Models\PhotosPhotoTag', 'photo_id', 'id')->with('photo_tag')->where('is_indirect_tag',0);
    }
    public function save($user_id)
    {
        // before save code
        parent::save();
        // after save code
        $photo_count = Photo::where('user_id', $user_id)->count();
        $user = User::where('id', $user_id)->update(array(
            'photo_count' => $photo_count
        ));
    }
    public function delete($user_id)
    {
        // before delete code
        parent::delete();
        // after delete code
        $photo_count = Photo::where('user_id', $user_id)->count();
        $user = User::where('id', $user_id)->update(array(
            'photo_count' => $photo_count
        ));
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
    public function user_follow()
    {
         return $this->hasMany('Models\UserFollow', 'other_user_id','id')->with('user');
    }    
}
