<?php

namespace Think\Pay\Driver;

class Caiyifu extends \Think\Pay\Pay {

    protected $gateway = 'http://testpay.cai1pay.com/gateway.aspx';//测试环境
    // protected $gateway = 'https://payment.cai1pay.com/gateway.aspx';
    public $config = array(
        // 'MerCode' => '', //交易账户号
        // 'MerOrderNo' => '', //商户订单编号
        // 'Amount' => '', //订单金额
        // 'OrderDate' => '', //订单日期 YYYYMMDD
        'Currency' => 'RMB',//币种 RMB:人民币 HKD:港币 USD:usd
        'GatewayType' => '01', //01:人民币借记卡,02:国际信用卡
        'Language' => 'GB', //GB中文 EN英语
        // 'Merchanturl' => '', //支付结果成功返回的商户URL
        'OrderEncodeType' => '2',//订单支付加密方式 2:md5摘要 9:错误
        'RetEncodeType' => '12',//交易返回加密方式  12:md5摘要  11:Rsa  9:错误
        'Rettype' => '1', //该字段存放商户是否选择Server to Server返回方式0：不选 1：选择
        // 'ServerUrl' => '', //商户使用Server to Server返回时可将返回地址存于此字段当 RetType=1 时,本字段有效
        // 'SignMD5' => '',
        'DoCredit' => 1, //直连方式
        // 'BankCode' => '',
        // 'GoodsInfo' => ''//商户附加数据包
    );


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("新生支付设置有误！");
        }
        return true;
    }

    public function buildRequestForm($params,$url=null) {
        header("Content-type:text/html;charset=utf8");
        
        $gateway = is_null($url) ?  $this->gateway : $url;
        $sHtml = $this->_buildForm($params, $gateway);

        return $sHtml;
    }

    /**
     * 针对notify_url验证消息是否合法消息
     * @return 验证结果
     */
    Public function verifyNotify($notify) {

        $sign = $notify['signMsg'];
        unset($notify['signMsg']);

        $billno = $notify['MerOrderNo'];
        $amount = $notify['Amount'];
        $mydate = $notify['OrderDate'];
        $succ = $notify['Succ'];
        $msg = $notify['Msg'];
        $attach = $notify['GoodsInfo'];
        $ipsbillno = $notify['SysOrderNo'];
        $retEncodeType = $notify['RetencodeType'];
        $currency_type = $notify['Currency'];
        $signature = $notify['Signature'];

        $content = $billno . $amount . $mydate . $succ . $ipsbillno . $currency_type;
        $cert = $this->config['key'];
        $signature_1ocal = md5($content . $cert);

        if ($signature_1ocal == $signature){
            if ($succ == 'Y'){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    

}
