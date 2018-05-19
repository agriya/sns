<?php
/**
 * Flag
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
 * Flag
*/
class Flag extends AppModel
{
    protected $table = 'flags';
    public $rules = array(
        'flag_category_id' => 'sometimes|required',
    );
    public function photo()
    {
        return $this->belongsTo('Models\Photo', 'photo_id', 'id')->with('user', 'attachment');
    }
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id');
    }
    public function flagged_user()
    {
        return $this->belongsTo('Models\User', 'flagged_user_id', 'id');
    }    
    public function flag_category()
    {
        return $this->belongsTo('Models\FlagCategory', 'flag_category_id', 'id');
    }
    public function ip()
    {
        return $this->belongsTo('Models\Ip', 'ip_id', 'id');
    }
    public function attachment()
    {
        return $this->hasMany('Models\Attachment', 'foreign_id', 'photo_id');
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
         if (!empty($params['photo_id'])) {  
            $query->where('photo_id',$params['photo_id']);
         }
         return $query;
    }
}
