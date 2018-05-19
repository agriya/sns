<?php
/**
 * PhotoView
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

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Validation\Factory as ValidatorFactory;
use Symfony\Component\Translation\Translator;

/*
 * PhotoView
 */
class PhotoView extends \Illuminate\Database\Eloquent\Model
{
    protected $table = 'photo_views';
    private $rules = array(
    'photo_id' => 'sometimes|required', 
    );
    public function validate($data)
    {
        $factory = new ValidatorFactory(new Translator('en'));
        $v = $factory->make($data, $this->rules);
        $v->passes();
        return $v->failed();
    }
    public function scopeFilter($query, $params = array())
    {
        if (!empty($params['fields'])) {
            $fields = explode(',', $params['fields']);
            $query->select($fields);
        }
        if (!empty($params['q'])) {
            $query->orWhereHas('user', function ($q) use ($params) {
                return $q->where('username', 'like', '%' . $params['q'] . '%');
            });
        }
        if (!empty($params['photo_id'])) {  
            $query->where('photo_id',$params['photo_id']);
        }
        $sortby = (!empty($params['sortby'])) ? $params['sortby'] : 'asc';
        if (!empty($params['sort'])) {
            $query->orderBy($params['sort'], $sortby);
        } else {
            $query->orderBy('id', $sortby);
        }
        return $query;
    }
    public function photo()
    {
        return $this->belongsTo('Models\Photo', 'photo_id', 'id')->with('attachment');
    }
    public function user()
    {
        return $this->belongsTo('Models\User', 'user_id', 'id')->with('attachment');
    }
    public function ip()
    {
        return $this->belongsTo('Models\Ip', 'ip_id', 'id');
    }
}
