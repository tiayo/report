<?php

if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

define('APP_DEBUG',true);

// 网站根路径设置
define ( 'SITE_PATH', dirname ( __FILE__ ) );

define('APP_PATH','./Application/');

// 添加第三方库自动加载
require './vendor/autoload.php';

require './Application/helpers.php';

require './ThinkPHP/ThinkPHP.php';



