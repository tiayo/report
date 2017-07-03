<?php

namespace Manage\Model;

use Think\Model;

class LogsModel extends Model
{
	protected $tableName = 'logs';

    protected $_validate = array(
        array('name', 'require', '被举报人姓名必须填写！', 1),
        array('remark', 'require', '被举报备注(行为)必须填写！', 1),
        array('publisher_id', 'require', '缺少发布平台id', 1),
        array('publisher_id', 'number', '发布平台id格式错误', 1),
        array('user_type', array('customer', 'employees'), '用户类型超出范围！', 0, 'in'),
    );
}
