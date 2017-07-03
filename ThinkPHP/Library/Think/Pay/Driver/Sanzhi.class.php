<?php

namespace Think\Pay\Driver;

class Sanzhi extends \Think\Pay\Pay {

    protected $gateway = 'https://pay.dinpay.com/gateway?input_charset=UTF-8';
    public $config = array(
        
    );

    
    public function check() {
        if (!$this->config['partner']) {
            E("支付设置有误！");
        }
        return true;
    }

    public function buildParams(){
        $Amount = floatval(get_exchange($_POST['Amount']));
        $order_no = $this->createOrderNo();

        $params = array(
            "merchantNo" => "CENM38000RNPV",
            "outTradeNo" => $order_no,     
            "currency" => "CNY",
            "amount" => $Amount*100, 
            "payType" => "ALIPAY_QRCODE_PAY",
            "content" => "PHP SDK",
            "callbackURL" => $this->config['notify_url']
        );

        return array('params'=>$params,'amount'=>$Amount,'orderno' => $order_no);
            
    }

    public function buildRequestForm($params) {
        require("/sanzhi/easypay-api-sdk-php.php");
        $parameters = array(
            "merchantNo" => $params['merchantNo'], 
            "outTradeNo" => $params['outTradeNo'], 
            "currency" => $params['currency'],
            "amount" => $params['amount'],
            "payType" => $params['payType'],
            "content" => $params['content'],
            "callbackURL" => $params['callbackURL']
        );
        $response = request("com.opentech.cloud.easypay.trade.create", "0.0.1", $parameters);

        //print_r($response);
       /* print_r(json_decode($response['data'])->paymentInfo);*/
    }


    Public function verifyNotify($notify){

        require("/sanzhi/easypay-api-sdk-php.php");

        /**
         *
         *
         */
        function callback4trade($data) {

            // demo 您的处理逻辑
            print_r($data);
        }

        //
        process_callback4trade("callback4trade");
    }

    

}
