<?php

namespace Manage\Model;

use Think\Model;

class UsersModel extends Model
{
	protected $tableName = 'users';

    protected $_validate = array(
        //注册时验证
        array('name', 'require', '用户名必须填写！', 1 , '', 4),
        array('name', '', '用户名已经存在！', 1,'unique', 4),
        array('password', 'require', '密码不能为空!', 1, '', 4),
        array('password', '6, 100', '密码必须大于6位!', 1, 'length', 4),
        array('repassword', 'password', '确认密码不一致!', 1, 'confirm', 4)
    );
}
