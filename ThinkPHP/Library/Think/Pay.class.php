<?php

/**
 * 通用支付接口类
 * @author 喵碧咪<729479553@qq.com>
 */

namespace Think;

class Pay {

    /**
     * 支付驱动实例
     * @var Object
     */
    private $payer;

    /**
     * 配置参数
     * @var type 
     */
    private $config;

    /**
     * 构造方法，用于构造上传实例
     * @param string $driver 要使用的支付驱动
     * @param array  $config 配置
     */
    public function __construct($driver, $config = array()) {
        /* 配置 */
        $pos = strrpos($driver, '\\');
        $pos = $pos === false ? 0 : $pos + 1;
        $apitype = strtolower(substr($driver, $pos));
        $this->config['notify_url'] = U("Home/Public/notifyurl", array('apitype'=>$driver), false, true);
        $this->config['return_url'] = U("Home/Public/returnurl", array('apitype'=>$driver), false, true);

        $config = array_merge($this->config, $config);

        /* 设置支付驱动 */
        $class = strpos($driver, '\\') ? $driver : 'Think\\Pay\\Driver\\' . ucfirst(strtolower($driver));
        
        $this->setDriver($class, $config);
    }


    public function __get($key){
        // if (array_key_exists($key, $this->payer->config)) {
            return $this->payer->config[$key];
        // }
    }


    public function buildRequestForm($params,$url) {
        $check = $this->payer->check();
        if ($check ===true) {
            return $this->payer->buildRequestForm($params,$url);
        }
    }

    /**
     * 设置支付驱动
     * @param string $class 驱动类名称
     */
    private function setDriver($class, $config) {

        $this->payer = new $class($config);
        if (!$this->payer) {
            E("不存在支付驱动：{$class}");
        }
    }

    public function __call($method, $arguments) {
        if (method_exists($this, $method)) {
            return call_user_func_array(array(&$this, $method), $arguments);
        } elseif (!empty($this->payer) && $this->payer instanceof Pay\Pay && method_exists($this->payer, $method)) {
            return call_user_func_array(array(&$this->payer, $method), $arguments);
        }
    }

}
