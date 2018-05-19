<?php
/**
 * UserNotificationSetting
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
 * UserNotificationSetting
*/
class UserNotificationSetting extends AppModel
{
    protected $table = 'user_notification_settings';
    public $rules = array(
        'is_enable_email_when_someone_follow_me' => 'sometimes|required|boolean'
    );
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id')->select('email', 'username', 'id', 'first_name', 'last_name');
    }
}
