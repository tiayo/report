<?php

namespace Think\Pay\Driver;

class Newpay extends \Think\Pay\Pay {

    protected $gateway = 'https://www.hnapay.com/website/pay.htm';
    public $config = array(
        'version' => '2.6',
        // 'serialID' => $serialID,
        // 'submitTime' => $submitTime,
        'failureTime' => '',
        'customerIP' => '',
        // 'orderDetails' => $orderDetails,
        // 'totalAmount' => $Amount,
        'type' => '1000',//及时支付$pay->type,
        'buyerMarked' => '',
        'payType' => 'BANK_B2C',//'ALL',
        // 'orgCode' => $orgCode,
        'currencyCode' => '',
        'directFlag' => '1', //直连$pay->directFlag,
        'borrowingMarked' => '',
        'couponFlag' => '',
        'platformID' => '',
        // 'returnUrl' => $pay->return_url,
        // 'noticeUrl' => $pay->notify_url,
        // 'partnerID' => $pay->partner,
        'remark' => 'ccc',
        'charset' => '1', //UTF8$pay->charset,
        'signType' => '2' //1：RSA 方式（推荐）,2：MD5 方式 $pay->signType
    );

    public function buildParams(){

        $Amount = (string)(floatval(get_exchange($_POST['Amount']))*100);
        $serialID = $this->createOrderNo();
        $orgCode = $_POST['Bank_Code'];
        $submitTime = (string)(date('YmdHis',time()));
        $orderDetails = (string)($serialID.','.$Amount.',,入金,1');

        $params = array(
            'version' => $this->config['version'],
            'serialID' => $serialID,
            'submitTime' => $submitTime,
            'failureTime' => $this->config['failureTime'],
            'customerIP' => $this->config['customerIP'],
            'orderDetails' => $orderDetails,
            'totalAmount' => $Amount,
            'type' => $this->config['type'],
            'buyerMarked' => $this->config['buyerMarked'],
            'payType' => $this->config['payType'],
            'orgCode' => $orgCode,
            'currencyCode' => $this->config['currencyCode'],
            'directFlag' => $this->config['directFlag'],
            'borrowingMarked' => $this->config['borrowingMarked'],
            'couponFlag' => $this->config['couponFlag'],
            'platformID' => $this->config['platformID'],
            'returnUrl' => $this->config['return_url'],
            'noticeUrl' => $this->config['notify_url'],
            'partnerID' => $this->config['partner'],
            'remark' => '',
            'charset' => $this->config['charset'],
            'signType' => $this->config['signType']
        );
        return array('params'=>$params,'amount'=>$params['totalAmount']);
    }


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("新生支付设置有误！");
        }
        return true;
    }

    public function buildRequestForm($params,$url=null) {
        header("Content-type:text/html;charset=utf8");
        $arg = '';
        foreach ($params as $key => $value) {
            // if ($value) {
                $arg .= "$key=$value&";
            // }
        } 
        // p($arg);die;
        //md5方式
        if(2 == $params['signType']){
            $arg = $arg."pkey=".$this->config['key'];
           
            $params['signMsg'] =  md5($arg);
        }
        $gateway = is_null($url) ?  $this->gateway : $url;
        $sHtml = $this->_buildForm($params, $gateway);

        return $sHtml;
    }

    /**
     * 针对notify_url验证消息是否合法消息
     * @return 验证结果
     */
    public function verifyNotify($notify) {

        $orderID = $notify["orderID"];
        $resultCode = $notify["resultCode"];
        $stateCode = $notify["stateCode"];
        $orderAmount = $notify["orderAmount"];
        $payAmount = $notify["payAmount"];
        $acquiringTime = $notify["acquiringTime"];
        $completeTime = $notify["completeTime"];
        $orderNo = $notify["orderNo"];
        $partnerID = $notify["partnerID"];
        $remark = $notify["remark"];
        $charset = $notify["charset"];
        $signType = $notify["signType"];
        $signMsg = $notify["signMsg"];
        
$src = "orderID=".$orderID
."&resultCode=".$resultCode
."&stateCode=".$stateCode
."&orderAmount=".$orderAmount
."&payAmount=".$payAmount
."&acquiringTime=".$acquiringTime
."&completeTime=".$completeTime
."&orderNo=".$orderNo
."&partnerID=".$partnerID
."&remark=".$remark
."&charset=".$charset
."&signType=".$signType;

        $pkey = $this->config['key'];
        $src = $src."&pkey=".$pkey;

        if ($signMsg == md5($src)) {
            return true;
        } else {
            return false;
        }
        
    }

    /**
     * 针对notify_url验证消息是否合法消息
     * @return 验证结果
     */
    public function verifyNotifys($notify) {

        $sign = $notify['signMsg'];
        unset($notify['signMsg']);
p($notify);
        $prestr = "";
        while (list ($key, $val) = each($notify)) {
            $prestr.=$key . "=" . $val . "&";
        }
p($prestr);
        $pkey = $this->config['key'];
        $prestr = $prestr."pkey=".$pkey;
p($prestr);
        $mysgin = md5($prestr);
p($prestr);
        if ($mysgin == $sign) {
            p(1111111111);
            // return true;
        } else {
            p(22222222222222);
            // return false;
        }
        
    }

    

}
