<?php
/**
 * For SEO Purpose
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
require_once __DIR__ . '/../../config.inc.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once '../lib/vendors/Inflector.php';
require_once '../lib/database.php';
global $_server_domain_url;
$inflector = new Inflector();
$php_path = PHP_BINDIR . DIRECTORY_SEPARATOR . 'php';
$api_url_map = array(
    '/\/photo\/(?P<photo_id>\d+)/' => array(
        'api_url' => '/api/v1/photos/{id}',
    ) ,
    '/\/photos(.*)/' => array(
        'api_url' => '/api/v1/photos',
        'title' => 'Photos'
    ) ,
     '/\/trending(.*)/' => array(
        'api_url' => '/api/v1/photos',
        'title' => 'Photos'
    ) ,
     '/\/following(.*)/' => array(
        'api_url' => '/api/v1/photos',
        'title' => 'Photos'
    ) ,
     '/\/designer\/popular(.*)/' => array(
        'api_url' => '/api/v1/users',
        'title' => 'Users'
    ) ,
     '/\/designer\/following(.*)/' => array(
        'api_url' => '/api/v1/users',
        'title' => 'Users'
    ) ,
     '/\/designer\/recent(.*)/' => array(
        'api_url' => '/api/v1/users',
        'title' => 'Users'
    ) ,
    '/\/profile\/(?P<user_id>\d+)\/(?P<username>.*)/' => array(
        'api_url' => '/api/v1/users/{id}',
    ) ,
    '/^\/users\/login$/' => array(
        'api_url' => null,
        'title' => 'Login'
    ) ,
    '/^\/users\/register$/' => array(
        'api_url' => null,
        'title' => 'Register'
    ) ,
    '/^\/users\/forgot_password$/' => array(
        'api_url' => null,
        'title' => 'Forgot Password'
    ) ,
    '/\/page\/(?P<page_id>\d+)\/(?P<slug>.*)/' => array(
        'api_url' => '/api/v1/pages/{id}',
    ) ,
    '/^\/$/' => array(
        'api_url' => '/api/v1/photos',
        'title' => 'Photos'
    ) ,
);
$meta_keywords = $meta_description = $title = $site_name = '';
$og_image = $_server_domain_url . '/images/no_image_available.png';
$og_type = 'website';
$og_url = $_server_domain_url . '/#!' . $_GET['_escaped_fragment_'];
$res = Models\Setting::whereIn('name', array('META_KEYWORDS','META_DESCRIPTION','SITE_NAME'))->get()->toArray();
foreach ($res as $key => $arr) {
    if ($res[$key]['name'] == 'META_KEYWORDS') {
        $meta_keywords = $res[$key]['value'];
    }
    if ($res[$key]['name'] == 'META_DESCRIPTION') {
        $meta_description = $res[$key]['value'];
    }
    if ($res[$key]['name'] == 'SITE_NAME') {
        $title = $site_name = $res[$key]['value'];
    }
}
if (!empty($_GET['_escaped_fragment_'])) {
    foreach ($api_url_map as $url_pattern => $values) {
        if (preg_match($url_pattern, $_GET['_escaped_fragment_'], $matches)) { // Match _escaped_fragment_ with our api_url_map array; For selecting API call
            if (!empty($values['title'])) { //Default title; We will change title for course and user page below;
                $title = $site_name . ' | ' . $values['title'];
            }
            if (!empty($values['api_url'])) {
                $id = !empty($matches['photo_id']) ? $matches['photo_id'] : (!empty($matches['page_id']) ? $matches['page_id'] : (!empty($matches['user_id']) ? $matches['user_id'] : 0));
                if (!empty($id)) {
                    $api_url = str_replace('{id}', $id, $values['api_url']); // replacing id value
                } else {
                    $api_url = $values['api_url']; // using defined api_url
                }
                $seo_url = $matches[0];
                $query_string = !empty($matches[1]) ? $matches[1] : '';
                $response = json_decode(shell_exec($php_path . " index.php " . $api_url . " GET " . $query_string), true);
                if (!empty($response['data'])) {                    
                     $j= 0;      
                    foreach ($response['data'] as $key => $value) {
                        if ($values['api_url'] == '/api/v1/pages/{id}') {
                            if ($key == 'meta_keywords') {
                                $meta_keywords = !empty($value) ? $value : '';
                            }
                            if ($key == 'meta_description') {
                                $meta_description = !empty($value) ? $value : '';;
                            }
                        }elseif ($values['api_url'] == '/api/v1/users') {
                            $og_type = 'User';
                            $og_url = $_server_domain_url . '/#!/profile/' . $value['id'];
                            if ($key == 'attachment') {
                                $og_image = $_server_domain_url . '/images/big_normal_thumb/UserAvatar/' . $value['id'] . '.' . md5('Photo' . $value['id'] . 'png' . 'big_normal_thumb') . '.' . 'png';
                            }
                            $url = $_server_domain_url . '/#!/profile/' . $value['id'];                                
                            $user_data[$j]['@type'] = 'User';                                
                            $user_data[$j]['name'] =  $value['username'];
                            $user_data[$j]['@id'] = $url;
                            $user_data[$j]['url'] = $url;
                            $user_data[$j]['image'] = $image;    
                        } 
                        elseif (!empty($matches['photo_id'])) {
                            $og_type = 'Image';
                            if ($key == 'description') {
                                $meta_description = !empty($value) ? $value : '';  
                                $title =  !empty($value) ? $value: $title;                             
                            }
                            $og_url = $_server_domain_url . '/#!/photo/' . $matches['photo_id'];
                            if ($key == 'name') {
                                $meta_keywords = !empty($value) ? $value : '';
                            }
                            if ($key == 'attachment') {
                                $og_image = $_server_domain_url . '/images/large_thumb/Photo/' . $value['id'] . '.' . md5('Photo' . $value['id'] . 'png' . 'large_thumb') . '.' . 'png';
                            }                           
                             if ($key == 'photos_photo_tag') {
                                $i = 0;
                                foreach ($response['data'][$key]['photo_tag'] as $photo_tag) {                                    
                                    $photoTagData[$i]['@type'] = "PhotoTag";                                    
                                    $photoTagData[$i]['name'] = $photo_tag['name'];                                                                                                           
                                     $i++;
                                }
                              }
                        } elseif (!empty($matches['user_id'])) {
                            if ($key == 'first_name') {
                                $meta_keywords = !empty($value) ? $value : '';
                            }
                            if ($key == 'last_name') {
                                $meta_keywords = !empty($value) ? $value : '';
                            }
                            if ($key == 'attachment') {
                                $og_image = $_server_domain_url . '/images/large_thumb/UserAvatar/' . $value['id'] . '.' . md5('UserAvatar' . $value['id'] . 'png' . 'large_thumb') . '.' . 'png';
                            }
                            if ($key == 'username') {
                                $og_url = $_server_domain_url . '/#!/profile/' . $matches['user_id'];
                            }
                             if ($key == 'photo') {                                 
                                 $j = 0;
                                 foreach($response['data']['photo'] as $photos){
                                         if (!empty($photos['attachment'])) {
                                                $image = $_server_domain_url . '/images/large_thumb/Photo/' . $photos['id'] . '.' . md5('Photo' . $photos['id'] . 'png' . 'large_thumb') . '.' . 'png';
                                            }                               
                                            $url = $_server_domain_url . '/#!/photo/' . $photos['id'];                                
                                            $photo_data[$j]['@type'] = 'Photo';                                
                                            $photo_data[$j]['name'] =  $photos['description'];
                                            $photo_data[$j]['@id'] = $url;
                                            $photo_data[$j]['url'] = $url;
                                            $photo_data[$j]['image'] = $image;   
                                            $photoTagData = array();                                
                                            if (!empty($photos['photos_photo_tag'])) {                                          
                                                $i = 0;
                                                foreach ($photos['photos_photo_tag'] as  $photosPhotoTag) {                                        
                                                    $photoTagData[$i]['@type'] = "Tag";                                    
                                                    $photoTagData[$i]['name'] = $photosPhotoTag['photo_tag']['name'];                                                                                                           
                                                    $i++;                                        
                                                }
                                            }
                                        if (!empty($photoTagData)) {
                                            $photo_data[$j]['tag'] = $photoTagData;                                        
                                        }
                                         $j++;
                                 }
                             }
                        }else{
                               if (!empty($value['attachment'])) {
                                    $image = $_server_domain_url . '/images/large_thumb/Photo/' . $value['id'] . '.' . md5('Photo' . $value['id'] . 'png' . 'large_thumb') . '.' . 'png';
                                }                               
                                $url = $_server_domain_url . '/#!/photo/' . $value['id'];                                
                                $photo_data[$j]['@type'] = 'Photo';                                
                                $photo_data[$j]['name'] =  $value['description'];
                                $photo_data[$j]['@id'] = $url;
                                $photo_data[$j]['url'] = $url;
                                $photo_data[$j]['image'] = $image;   
                                $photoTagData = array();                                
                                if (!empty($value['photos_photo_tag'])) {                                          
                                    $i = 0;
                                    foreach ($value['photos_photo_tag'] as  $photosPhotoTag) {                                        
                                        $photoTagData[$i]['@type'] = "Tag";                                    
                                        $photoTagData[$i]['name'] = $photosPhotoTag['photo_tag']['name'];                                                                                                           
                                        $i++;                                        
                                    }
                                }
                            if (!empty($photoTagData)) {
                                $photo_data[$j]['tag'] = $photoTagData;                                        
                            }                   
                        }    
                        $j++;                    
                    }
                } else {
                    $isNoRecordFound = 1;
                }
            }
            break;
        }
    }
}
if (!empty($response->error) || !empty($isNoRecordFound) || empty($matches)) { // returning 404, if URL or record not found
    header('Access-Control-Allow-Origin: *');
    header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
    exit;
}
$app_id = Models\Provider::where('name', 'Facebook')->first();
?>
<!DOCTYPE html><html>
<head>
  <title><?php
echo $title; ?></title>
  <meta charset="UTF-8">
  <meta name="description" content="<?php
echo $meta_description; ?>"/>
  <meta name="keywords" content="<?php
echo $meta_keywords; ?>"/>
  <meta property="og:app_id" content="<?php
echo $app_id->api_key; ?>"/>
  <meta property="og:type" content="<?php
echo $og_type; ?>"/>
  <meta property="og:title" content="<?php
echo $title; ?>"/>
  <meta property="og:description" content="<?php
echo $meta_description; ?>"/>
  <meta property="og:type" content="<?php
echo $og_type; ?>"/>
  <meta property="og:image" content="<?php
echo $og_image; ?>"/>
  <meta property="og:site_name" content="<?php
echo $site_name; ?>"/>
  <meta property="og:url" content="<?php
echo $og_url; ?>"/>

<?php
if (!empty($matches['user_id'])){
    $data['@type'] = $og_type;
    $data['description'] = $meta_description;
    $data['name'] = $meta_keywords;
    $data['@id'] = $og_url;
    $data['url'] = $og_url;
    $data['image'] = $og_image;
    $data['app_id'] = $app_id->api_key;
    $data['title'] = $title;
    $data['keywords'] = $meta_keywords;
    if(!empty($photo_data)){  
        $data['numberOfItems'] = count($photo_data);
        $data['itemListElement'] = $photo_data;
    }
}
elseif(empty($photo_data) && !empty($matches['photo_id'])){
    $data['@type'] = $og_type;
    $data['description'] = $meta_description;
    $data['name'] = $meta_keywords;
    $data['@id'] = $og_url;
    $data['url'] = $og_url;
    $data['image'] = $og_image;
    $data['app_id'] = $app_id->api_key;
    $data['title'] = $title;
    $data['keywords'] = $meta_keywords;   
    if (!empty($photoTagData)) {
        $data['tag'] = $photoTagData;
    }
}elseif(!empty($photo_data)){
        $data['@type'] = 'ItemList';
        $data['description'] = $meta_description;
        $data['name'] = $meta_keywords;
        $data['app_id'] = $app_id->api_key;
        $data['title'] = $title;
        $data['keywords'] = $meta_keywords;
        $data['@url'] = $_server_domain_url .'/#!';
        $data['numberOfItems'] = count($photo_data);
        $data['itemListElement'] = $photo_data;
    
}elseif(!empty($user_data)){
        $data['@type'] = 'ItemList';
        $data['description'] = $meta_description;
        $data['name'] = $meta_keywords;
        $data['app_id'] = $app_id->api_key;
        $data['title'] = $title;
        $data['keywords'] = $meta_keywords;
        $data['@url'] = $_server_domain_url .'/#!'.$seo_url;
        $data['numberOfItems'] = count($user_data);
        $data['itemListElement'] = $user_data;
    
}   
    
?>
<script type = "application/ld+json">
        <?php
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
    </script>
</head>    
<body>
<?php
if(!empty($response['data']) && !in_array(array(), $response['data'], true) && !empty($response['data'][0])) { ?>
  <dl>
  <?php
    foreach ($response['data'] as $photo_data) {
       foreach($photo_data as $key => $value ){    
           if(!is_array($value)){
?>
    <dt><?php
        echo $inflector->humanize($key); ?></dt>
	<dd>
	<?php
        if ($key == 'description') {
            $description = $value;
        }
        if ($key == 'photo_comment_count') {
            $photo_comment_count = $value;
        } else if ($key == 'photo_like_count') {
            $photo_like_count = $value;
        } else if ($key == 'photo_flag_count') {
            $photo_flag_count = $value;
        } else {
            echo $value;
        }
        if (isset($photo_comment_count) && isset($photo_like_count) && isset($photo_flag_count) && isset($description) && empty($ratingDisplayed)) {
            $ratingDisplayed = 1; ?>
		<div itemscope itemtype="http://schema.org/Product">
            <h2 itemprop="name"><?php
              echo $title; ?></h2>
			<h2 itemprop="description"><?php
            echo $description; ?></h2>			
			</div>
		</div>
	<?php
        } ?>
	</dd><?php
           }
       }
    } ?>
  </dl><?php
} else if(!empty($response['data'])) { // For pages like login, register, home, contactus - we need to fill something in body... If body content is empty, in facebook lint or google search, it will not works
?>
		  <dl>
  <?php
    foreach ($response['data'] as $key => $value) {
        if(!is_array($value)){
?>
    <dt><?php
        echo $inflector->humanize($key); ?></dt>
	<dd>
	<?php
        if ($key == 'description') {
            $description = $value;
        }
        if ($key == 'photo_comment_count') {
            $photo_comment_count = $value;
        } else if ($key == 'photo_like_count') {
            $photo_like_count = $value;
        } else if ($key == 'photo_flag_count') {
            $photo_flag_count = $value;
        } else {
            echo $value;
        }
        if (isset($photo_comment_count) && isset($photo_like_count) && isset($photo_flag_count) && isset($description) && empty($ratingDisplayed)) {
            $ratingDisplayed = 1; ?>
		<div itemscope itemtype="http://schema.org/Product">
			<h2 itemprop="description"><?php
            echo $description; ?></h2>
			<div itemprop="photoCommentCount"><?php
            echo $photo_comment_count; ?></div>
			<div itemprop="aggregateRating" itemscope="itemscope" itemtype="http://schema.org/AggregateRating">
				<span itemprop="photoLikeCount"><?php
            echo $photo_like_count; ?></span>
				<span itemprop="photoFlagCount"><?php
            echo $photo_flag_count; ?></span>
			</div>
		</div>
	<?php
        } ?>
	</dd><?php
    }
    }   ?>
  </dl><?php
} else { ?>
    <div><?php
    echo $site_name; ?></div>
		<div><?php
    echo $meta_keywords; ?></div>
<?php } ?>
</body>
</html>
