<?php
/**
 * State
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

class State extends AppModel
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'states';
    //Rules
    public $rules = array(
        'name' => 'sometimes|required'
    );
    //Search Filter
    public $qSearchFields = array(
        'name'
    );
    //country relation
    public function country()
    {
        return $this->belongsTo('Models\Country', 'country_id', 'id')->select('id', 'iso_alpha2', 'name');
    }
    public function scopeFilter($query, $params = array())
    {
        parent::scopeFilter($query, $params);
        if (!empty($params['q'])) {
            $query->orWhereHas('country', function ($q) use ($params) {
            
                $q->orWhere('name', 'like', '%' . ucfirst($params['q']) . '%');
                $q->orWhere('iso_alpha2', 'like', '%' . strtoupper($params['q']) . '%');
            });
        }
    }
}
