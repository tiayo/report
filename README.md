# 异常信息查询系统

## 配置

拉代码：`git clone https://github.com/tiayo/report.git`  

安装依赖：`composer install`

配置Common/conf/config.php
````
<?php

return array(
		// 数据库配置
		'DB_TYPE' => 'mysql', // 数据库类型		
		'DB_HOST' => ', // 服务器地址
		'DB_NAME' => '', // 数据库名
		'DB_USER' => '', // 用户名
		'DB_PWD' => '', // 密码
		
		'DB_PORT' => '3306', // 端口
		'DB_PREFIX' => 'star_', // 数据库表前缀

        'DEFAULT_MODULE' =>  'Manage',  // 默认模块
        'DEFAULT_CONTROLLER' =>  'Logs',  // 默认模块
        'MODULE_ALLOW_LIST'    =>  array('Manage'),
		
		// 调试配置
		'SHOW_PAGE_TRACE' => false,
		'URL_MODEL'            => 2, //URL模式
	    'VAR_URL_PARAMS'       => '', // PATHINFO URL参数变量
	    'URL_PATHINFO_DEPR'    => '/', //PATHINFO URL分割符
);

````