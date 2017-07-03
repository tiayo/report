<?php

namespace Think\Pay\Driver;

class Zhifupay extends \Think\Pay\Pay {

    protected $gateway = 'https://pay.dinpay.com/gateway?input_charset=UTF-8';
    public $config = array(
        // 'sign' => '',
        'merchant_code' => '',
        'bank_code' => '',   
        'order_no' => '',     
        'order_amount' => '', 
        'service_type' => '', 
        'input_charset' => '',
        'notify_url' => '',   
        'interface_version' => '',
        'sign_type' => '',    
        'order_time' => '',   
        'product_name' => '', 
        'client_ip'  => '',
        'extend_param' => '',
        // 'extra_return_param' => '', 
        // 'pay_type' => '', 
        'product_code' => '',
        // 'product_desc' => '',
        'product_num' => '',
        // 'return_url' => '',
        'show_url' => '',
        'redo_flag' => 1
    );


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("智付设置有误！");
        }
        return true;
    }

    public function buildParams(){
        $Amount = floatval(get_exchange($_POST['Amount']));
        $order_no = $this->createOrderNo();
        $order_time = date('Y-m-d H:i:s',time());     

        $params = array(
            'bank_code' => $_POST['Bank_Code'],   
            'extra_return_param' => '',
            'input_charset' => 'UTF-8',
            'interface_version' => 'V3.0',
            'merchant_code' => $this->config['partner'], 
            'notify_url' => $this->config['notify_url'],  
            'order_amount' => $Amount, 
            'order_no' => $order_no,     
            'order_time' => $order_time,   
            'pay_type' => 'b2c',  
            'product_desc' => '在线入金',
            'product_name' => '在线入金', 
            'redo_flag' => 1,
            'return_url' => $this->config['return_url'],  
            'service_type' => 'direct_pay', 
            
            'sign_type' => 'MD5',    
            'show_url' => '',
            'product_num' => '',
            'product_code' => '',
            'client_ip'  => '',
            'extend_param' => ''
        );
        
        return array('params'=>$params,'amount'=>$Amount);
    }

    public function buildRequestForm($params) {
        header("Content-type:text/html;charset=utf8");
        $arg = '';
        foreach ($params as $key => $value) {
            if($key=='sign_type'){
                continue;
            }
            if ($value !='') {
                $arg .= "$key=$value&";
            }
        } 

        $signStr = $arg."key=".$this->config['key'];
        // p($signStr);die;
        $params['sign'] = md5($signStr);

        $sHtml = $this->_buildForm($params);
        return $sHtml;
    }

    /**
     * 针对notify_url验证消息是否合法消息
     * // 签名规则定义如下：
     * （1）参数列表中，除去sign_type、sign两个参数外，其它所有非空的参数都要参与签名，值为空的参数不用参与签名；
     * （2）签名顺序按照参数名a到z的顺序排序，若遇到相同首字母，则看第二个字母，以此类推，
     *  同时将商家支付密钥key放在最后参与签名，组成规则如下：
     *  参数名1=参数值1&参数名2=参数值2&……&参数名n=参数值n&key=key值
     * @return 验证结果
     */
    public function verifyNotify($notify) {

        $merchant_code  = $notify["merchant_code"];  
        $interface_version = $notify["interface_version"];
        $sign_type = $notify["sign_type"];
        $dinpaySign = $notify["sign"];
        $notify_type = $notify["notify_type"];
        $notify_id = $notify["notify_id"];
        $order_no = $notify["order_no"];
        $order_time = $notify["order_time"]; 
        $order_amount = $notify["order_amount"];
        $trade_status = $notify["trade_status"];
        $trade_time = $notify["trade_time"];
        $trade_no = $notify["trade_no"];
        $bank_seq_no = $notify["bank_seq_no"];
        $extra_return_param = $notify["extra_return_param"];
        
        $signStr = "";
        if($bank_seq_no != ""){
            $signStr = $signStr."bank_seq_no=".$bank_seq_no."&";
        }
        if($extra_return_param != ""){
            $signStr = $signStr."extra_return_param=".$extra_return_param."&";
        }   
        $signStr = $signStr."interface_version=".$interface_version."&";    
        $signStr = $signStr."merchant_code=".$merchant_code."&";
        $signStr = $signStr."notify_id=".$notify_id."&";
        $signStr = $signStr."notify_type=".$notify_type."&";
        $signStr = $signStr."order_amount=".$order_amount."&";  
        $signStr = $signStr."order_no=".$order_no."&";  
        $signStr = $signStr."order_time=".$order_time."&";  
        $signStr = $signStr."trade_no=".$trade_no."&";  
        $signStr = $signStr."trade_status=".$trade_status."&";
        if($trade_time != ""){
            $signStr = $signStr."trade_time=".$trade_time."&";
        }


        $pkey = $this->config['key'];
        $signStr = $signStr."key=".$pkey;

        $mysign = md5($signStr);

        if ($mysign == $dinpaySign) {
            return $order_no;
        } else {
            return false;
        }
        
    }

    

}
