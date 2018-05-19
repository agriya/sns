<?php
/**
 * PhotoTag
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
 * PhotoTag
*/
class PhotoTag extends AppModel
{
    protected $table = 'photo_tags';
    public $rules = array(
        'name' => 'sometimes|required'
    );
    public $qSearchFields = array(
        'name'
    );
}
