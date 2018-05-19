<?php
/**
 * FlagCategory
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
 * FlagCategory
*/
class FlagCategory extends AppModel
{
    protected $table = 'flag_categories';
    public $rules = array(
        'name' => 'sometimes|required',
    );
}
