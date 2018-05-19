<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once '../../config.inc.php';
require_once '../lib/database.php';
require_once '../lib/constants.php';
require_once '../lib/core.php';

$photos = Models\Photo::where('is_video', true)->where('is_video_converting_is_processing', true)->get()->toArray();
error_log("Entering Video Convert cron at " . date('Y-M-d H:i:s') , 3, APP_PATH . DIRECTORY_SEPARATOR . 'tmp' . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . "error.log");
if (!empty($photos)) {
    foreach ($photos as $photo) {
        $attachment = Models\Attachment::where('class', 'Video')->where('foreign_id', $photo['id'])->first();
        $ffmpeg_origin_path = APP_PATH . DIRECTORY_SEPARATOR . 'media' . DIRECTORY_SEPARATOR . $attachment['dir'];
        $ffmpeg_media_dir = APP_PATH . DIRECTORY_SEPARATOR . 'media' . DIRECTORY_SEPARATOR . 'Photo' . DIRECTORY_SEPARATOR . $photo['id'];
        if (!file_exists($ffmpeg_media_dir)) {
            mkdir($ffmpeg_media_dir, 0777, true);
        }
        //ckecking if file already exist
        $file_path = pathinfo($attachment['filename']);
        $file_name = $ffmpeg_media_dir . DIRECTORY_SEPARATOR . $file_path['filename'] . ".mp4";
        if (file_exists($file_name)) {
            @unlink($file_name);
        }
        $ffmpeg_media_source = $ffmpeg_origin_path . DIRECTORY_SEPARATOR . $attachment['filename'];
        $ffmpeg_media_target = $ffmpeg_media_dir . DIRECTORY_SEPARATOR . $attachment['filename'];
        $res = convert_video($ffmpeg_media_source, $ffmpeg_media_target);
        $target_file = pathinfo($ffmpeg_media_target);
        $target_file_name = $target_file['filename'] . ".mp4";
        $Photo = Models\Photo::find($photo['id']);
        if ($res['result'] == 0) {
            $Photo->is_attachment_to_view = true;
            $Photo->is_video_converting_is_processing = false;
            $Photo->save();
            $Attachment = new Models\Attachment;
            $Attachment->filename = $target_file_name;
            $Attachment->dir = 'Photo/' . $Photo->id;
            $Attachment->amazon_s3_thumb_url = '';
            $Attachment->foreign_id = $Photo->id;
            $Attachment->class = 'Photo';
            $Attachment->save();
        } else {
            $Photo->is_attachment_to_view = false;
            $Photo->is_video_converting_is_processing = false; 
            $Photo->save();
        }
    }
}
/**
 * PHP FFMPEG Video Convertion
 *
 * @return boolean
 */
function convert_video($source, $target)
{
    $ffmpeg = '';
    $data = array();
    $file_info = pathinfo($target);
    $source_file = $file_info['dirname'] . DIRECTORY_SEPARATOR . $file_info['filename'] . '.mp4';
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $ffmpeg = '../lib' . DIRECTORY_SEPARATOR . 'vendors' . DIRECTORY_SEPARATOR . 'ffmpeg' . DIRECTORY_SEPARATOR . 'bin' . DIRECTORY_SEPARATOR . 'ffmpeg.exe';
        exec($ffmpeg . ' -i  ' . $source . ' -s 720x540  ' . $source_file, $output, $return);
    } else if (strtoupper(substr(PHP_OS, 0, 3)) === 'LIN') {
        exec('ffmpeg -i  ' . $source . ' -s 720x540 -b 1500k -vcodec libx264 -vpre slow -vpre baseline -g 30 ' . $source_file, $output, $return); // referred from: http://stackoverflow.com/questions/13560852/convert-mp4-to-maximum-mobile-supported-mp4-using-ffmpeg     
    
    }
    $time_slot = shell_exec($ffmpeg . " -i \"{$source}\" 2>&1");
    $search = '/Duration: (.*?),/';
    preg_match($search, $time_slot, $matches);
    $data['duration'] = $matches[1];
    $data['result'] = $return;
    /*$is_keep_original_video_file_in_server = r_query("SELECT value FROM settings WHERE name ='video.is_keep_original_video_file_in_server'");
    if ($is_keep_original_video_file_in_server['value'] === '0') {
        if (file_exists($source)) {
            @unlink($source);
        }
    }*/
    return $data;
}
