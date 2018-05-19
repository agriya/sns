<?php
/**
 * Page
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

class Page extends AppModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'pages';
    //Rules
    public $rules = array(
        'title' => 'sometimes|required',
        'content' => 'sometimes|required'
    );
    //Search Filter
    public $qSearchFields = array(
        'title'
    );
}
