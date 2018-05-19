<?php
/**
 * AppModel
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
use Illuminate\Translation\FileLoader;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Translation\Translator;

class AppModel extends \Illuminate\Database\Eloquent\Model
{
    //Validation
    public function validate($data)
    {
        $translation_file_loader = new FileLoader(new Filesystem, __DIR__ . '../lang');
        $translator = new Translator($translation_file_loader, 'en');
        $factory = new ValidatorFactory($translator);
        $v = $factory->make($data, $this->rules);
        $v->passes();
        return $v->failed();
    }
    public function scopeFilter($query, $params = array(),$issearchq=true)
    {
        $sortby = (!empty($params['sortby'])) ? $params['sortby'] : 'desc';
        if (!empty($params['fields'])) {
            $fields = explode(',', $params['fields']);
            $query->select($fields);
        }
        if($issearchq){
            if (!empty($params['q']) && $this->qSearchFields) {
                foreach ($this->qSearchFields as $field) {
                    $search = $params['q'];
                    $query->orWhere($field, 'ilike', "%$search%");
                }
            }
        }
        if (!empty($params['sort'])) {
            $query->orderBy($params['sort'], $sortby);
        } else {
            $query->orderBy('id', $sortby);
        }
        if (!empty($params['page'])) {
            $offset = ($params['page'] - 1) * PAGE_LIMIT + 1;
            $query->skip($offset)->take(PAGE_LIMIT);
        }
        if (!empty($params['is_active'])) {
            $query->where('is_active', $params['is_active']);
        }
        if (!empty($params['filter']) && $params['filter'] == 'inactive') {
            $query->where('is_active', 0);
        }
        if (!empty($params['filter']) && $params['filter'] == 'active') {
            $query->where('is_active', 1);
        }
        if (!empty($params['filter']) && $params['filter'] == 'inactive') {
            $query->where('is_active', 0);
        }
        if (!empty($params['filter']) && $params['filter'] == 'all') {
            $query->whereIn('is_active', array(
                0,
                1
            ));
        }
        if (!empty($params['setting_category_id'])) {
            $query->where('setting_category_id', $params['setting_category_id']);
        }
        if (!empty($params['parent_message_id'])) {
            $query->where('parent_message_id', $params['parent_message_id']);
        }
        return $query;
    }
}
