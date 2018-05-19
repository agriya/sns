<?php
/**
 * Message
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
 * Message
*/
class Message extends AppModel
{
    protected $table = 'messages';
    public $rules = array(
        'otherUserId' => 'sometimes|required',
        'message' => 'sometimes|required',
        'message_content_id' => 'sometimes|required',
    );
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id');
    }
    public function other_user()
    {
        return $this->belongsTo('Models\User', 'other_user_id', 'id');
    }
    public function message_content()
    {
        return $this->belongsTo('Models\MessageContent', 'message_content_id', 'id');
    }
    public function save($user_id = '')
    {
        // before save code
        parent::save();
        // after save code
        if (!empty($user_id)) {
            $message_count = Message::where('other_user_id', $user_id)->where('is_read', 0)->where(function ($query) {
            
                return $query->where('parent_message_id', null)->orWhere('parent_message_id', 0);
            })->count();
            $user = User::where('id', $user_id)->update(array(
                'unread_messages_count' => $message_count
            ));
        }
    }
    public function delete($user_id)
    {
        // before delete code
        parent::delete();
        // after delete code
        $message_count = Message::where('other_user_id', $user_id)->where('is_read', 0)->where(function ($query) {
        
            return $query->where('parent_message_id', null)->orWhere('parent_message_id', 0);
        })->count();
        $user = User::where('id', $user_id)->update(array(
            'unread_messages_count' => $message_count
        ));
    }
    public function attachment()
    {
        return $this->hasOne('Models\Attachment', 'foreign_id', 'id')->where('class', 'Message');
    }
    public function scopeFilter($query, $params = array())
    {
        parent::scopeFilter($query, $params);
        if (!empty($params['q'])) {
            $query->orWhereHas('user', function ($q) use ($params) {
            
                $q->orWhere('username', 'like', '%' . $params['q'] . '%');
            });
            $query->orWhereHas('other_user', function ($q) use ($params) {
            
                $q->orWhere('username', 'like', '%' . $params['q'] . '%');
            });
        }
    }
}
