<?php
/**
 * MessageContent
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
 * MessageContent
*/
class MessageContent extends AppModel
{
    protected $table = 'message_contents';
    public $rules = array(
        'message' => 'sometimes|required'
    );
    public function message()
    {
        return $this->hasMany('Models\Message', 'message_content_id');
    }
}
