<?php
/**
 * Constants configurations
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
namespace Constants;

class ConstUserTypes
{
    const Admin = 1;
    const User = 2;
}
class UserCashWithdrawStatus
{
    const Pending = 0;
    const Approved = 1;
    const Rejected = 2;
}
class TransactionKeys
{
    const Order = 'Order';
    const Wallet = 'Wallet';
}
class ConstSocialLogins
{
    const Facebook = 1;
    const Twitter = 2;
    const GooglePlus = 3;
}
