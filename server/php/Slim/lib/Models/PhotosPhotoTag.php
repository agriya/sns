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
class PhotosPhotoTag extends AppModel
{
    protected $table = 'photos_photo_tags';
    public $rules = array(
        'name' => 'sometimes|required'
    );
    public function photo()
    {
        return $this->belongsTo('Models\Photo', 'photo_id', 'id')->with('user', 'attachment');
    }
    public function photo_tag()
    {
        return $this->belongsTo('Models\PhotoTag', 'photo_tag_id', 'id');
    }
    public function updatePhototagcount($photoTagId)
    {
        $postCount =  PhotosPhotoTag::where('photo_tag_id',$photoTagId)->count();
        PhotoTag::where('id',$photoTagId)->update(array("photo_count" =>$postCount));

    }
}
