<?php
/**
 * Database configurations
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
use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$capsule->addConnection(array(
    'driver' => R_DB_DRIVER,
    'host' => R_DB_HOST,
    'database' => R_DB_NAME,
    'username' => R_DB_USER,
    'password' => R_DB_PASSWORD,
    'port' => R_DB_PORT,
    'charset' => 'utf8',
    'collation' => 'utf8_general_ci',
    'prefix' => ''
));
$capsule->setAsGlobal();
$capsule->bootEloquent();
