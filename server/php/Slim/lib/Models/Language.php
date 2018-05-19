<?php
/**
 * Language
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

class Language extends AppModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'languages';
    //Rules
    public $rules = array(
        'name' => 'sometimes|required',
        'iso2' => 'sometimes|required|max:2',
        'iso3' => 'sometimes|required|max:3'
    );
    //Search Filter
    public $qSearchFields = array(
        'name'
    );
}
