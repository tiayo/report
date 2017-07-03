<?php

namespace Think\Pay\Driver;

class ZhifuForWechatpay extends \Think\Pay\Pay {

    protected $gateway = 'https://api.dinpay.com/gateway/api/scanpay';
    public $config = array(
        // 'sign' => '',
        'merchant_code' => '',
        'order_no' => '',     
        'order_amount' => '', 
        'service_type' => '', 
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
        'product_num' => ''
    );


    public function check() {
        if (!$this->config['partner']) {
            E("智付设置有误！");
        }
        return true;
    }

    public function buildParams(){
        $Amount = floatval(get_exchange($_POST['Amount']));
        $order_no = $this->createOrderNo();
        $order_time = date('Y-m-d H:i:s',time());     

        $params = array(
            'extra_return_param' => '',
            'interface_version' => 'V3.1',
            'merchant_code' => '1111110166', 
            'notify_url' => 'http://www.xxx.com/dinpay/offline.php',   
            'order_amount' => $Amount, 
            'order_no' => $order_no,     
            'order_time' => $order_time,   
            'product_desc' => '在线入金',
            'product_name' => '在线入金', 
            'service_type' => 'weixin_scan', 
            
            'sign_type' => 'RSA-S',    
            'product_num' => '',
            'product_code' => '',
            'client_ip'  => '',
            'extend_param' => ''
        );

        return array('params'=>$params,'amount'=>$Amount);
            
    }

    public function buildRequestForm($params) {
        $signStr = "";
    
        $signStr = $signStr."client_ip=".$params['client_ip']."&";    
        if($params['extend_param'] != ""){
            $signStr = $signStr."extend_param=".$params['extend_param']."&";
        }

        if($params['extra_return_param'] != ""){
            $signStr = $signStr."extra_return_param=".$params['extra_return_param']."&";
        }

        $signStr = $signStr."interface_version=".$params['interface_version']."&";    

        $signStr = $signStr."merchant_code=".$params['merchant_code']."&";    

        $signStr = $signStr."notify_url=".$params['notify_url']."&";      

        $signStr = $signStr."order_amount=".$params['order_amount']."&";      

        $signStr = $signStr."order_no=".$params['order_no']."&";      

        $signStr = $signStr."order_time=".$params['order_time']."&";  

        if($params['product_code'] != ""){
            $signStr = $signStr."product_code=".$params['product_code']."&";
        }   

        if($params['product_desc'] != ""){
            $signStr = $signStr."product_desc=".$params['product_desc']."&";
        }

        $signStr = $signStr."product_name=".$params['product_name']."&";

        if($params['product_num'] != ""){
            $signStr = $signStr."product_num=".$params['product_num']."&";
        }   

        $signStr = $signStr."service_type=".$params['service_type'];

        require_once(__ROOT__.'/Pay/merchant.php');
    
        $priKey= openssl_get_privatekey($priKey);

        openssl_sign($signStr,$sign_info,$priKey,OPENSSL_ALGO_MD5);

        $params['sign'] = base64_encode($sign_info);

        $sHtml = $this->_buildForm($params);
        return $sHtml;
    }


    Public function verifyNotify($notify){
        require_once(__ROOT__.'/Pay/merchant.php');
        $pubKey = openssl_get_publickey($pubKey);
        $merchant_code  = $notify["merchant_code"];  
        $interface_version = $notify["interface_version"];
        $sign_type = $notify["sign_type"];
        $dinpaySign = base64_decode($notify["sign"]);
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
        $signStr = $signStr."trade_time=".$trade_time;

        if(openssl_verify($signStr,$dinpaySign,$pubKey,OPENSSL_ALGO_MD5)){  
            return $order_no;
        }else{
            return false;
        }
    }

    

}
