<?php
/**
 * Country
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

class Country extends AppModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'countries';
    //Rules
    public $rules = array(
        'name' => 'sometimes|required',
        'fips104' => 'sometimes|max:2',
        'iso2' => 'sometimes|max:2',
        'iso3' => 'sometimes|max:3',
        'ison' => 'sometimes|max:4',
        'internet' => 'sometimes|max:2',
        'capital' => 'sometimes|alpha',
        'currency_code' => 'sometimes|max:3'
    );
    //Search Filter
    public $qSearchFields = array(
        'name'
    );
}
