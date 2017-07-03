<?php
return array(
	'URL_CASE_INSENSITIVE'  =>  true,   // 默认false 表示URL区分大小写 true则表示不区分大小写
	'DEFAULT_THEME' => 'default', //默认主题
    
	/* 模板相关配置 */
    'TMPL_PARSE_STRING' => array(
        '__COMMON__' => __ROOT__ . '/Public/Common',
        '__IMG__'    => __ROOT__ . '/Public/' . MODULE_NAME . '/images',
        '__CSS__'    => __ROOT__ . '/Public/' . MODULE_NAME . '/css',
        '__JS__'     => __ROOT__ . '/Public/' . MODULE_NAME . '/js',
        '__STATIC__' => __ROOT__ . '/Public/Static',
        '__UPLOADS__' => __ROOT__ . '/Uploads',
        '__MEDIA__' => __ROOT__ . '/Public/' . MODULE_NAME . '/media'
    ),
    /* SESSION 和 COOKIE 配置 */
    'SESSION_PREFIX' => 'mt_manage', //session前缀
    'COOKIE_PREFIX'  => 'mt_manage_', // Cookie前缀 避免冲突
    'VAR_SESSION_ID' => 'session_id',   //修复uploadify插件无法传递session_id的bug

    'TMPL_ACTION_ERROR'     =>  MODULE_PATH.'View/default/Public/dispatch_jump.html', // 默认错误跳转对应的模板文件
    'TMPL_ACTION_SUCCESS'   =>  MODULE_PATH.'View/default/Public/dispatch_jump.html', // 默认成功跳转对应的模板文件
    'TMPL_EXCEPTION_FILE'   =>  MODULE_PATH.'View/default/Public/think_exception.html',// 异常页面的模板文件

    // token生成相关
    'JWT_URL' => 'http://192.168.0.69:8885',
    'JWT_KEY' => '9sgoaZQzhXA8fJfFsUCqzBkeZHQ7gAuVC3ye8TV66uILd6Rw44vzURNAs2MqA1dN',

    // 加载扩展配置文件
    'LOAD_EXT_CONFIG' => ['POLICISE' => 'policies'],

    //分页数
    'PAGE_NUM' => 10,

    //是否开启创建异常接口(true为开放)
    'API_CREATE' => false,
);