<?php

namespace Think\Pay\Driver;

class Huichao extends \Think\Pay\Pay {

    protected $gateway = 'https://gwapi.yemadai.com/pay/sslpayment';
    public $config = array(
        
    );


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("汇潮设置有误！");
        }
        return true;
    }


    public function buildParams(){

        $Amount = floatval(get_exchange($_POST['Amount']));
        $order_no = $this->createOrderNo();
        $order_time = date('YmdHis',time());     

        $params = array(
            'MerNo' => $this->config['partner'], 
            'BillNo' => $order_no,
            'Amount' => $Amount,
            'ReturnURL' => $this->config['return_url'],
            'AdviceURL' => $this->config['notify_url'],  
            'OrderTime' => $order_time,
            'defaultBankNumber' => $_POST['Bank_Code'],
            'payType' => 'B2CCredit', 
            'Remark' => '',
            'products' => ''
        ); 
        return array('params'=>$params,'amount'=>$params['Amount'],'orderno'=>$params['BillNo']);
    }

    public function buildRequestForm($params) {
        header("Content-type:text/html;charset=utf8");

        $md5src = "MerNo=".$params['MerNo']."&BillNo=".$params['BillNo']."&Amount=".$params['Amount']."&OrderTime=".$params['OrderTime']."&ReturnURL=".$params['ReturnURL']."&AdviceURL=".$params['AdviceURL']."&".$this->config['key'];        //校验源字符串

   
        $SignInfo = strtoupper(md5($md5src));       //MD5检验结果
        
        $params['SignInfo'] = $SignInfo;

        $gateway = empty($this->config['url']) ?  $this->gateway : $this->config['url'];

        $sHtml = $this->_buildForm($params, $gateway);
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

            //MD5私钥
        $MD5key = $this->config['key'];
        //订单号
        $BillNo = $notify["BillNo"];
        //金额
        $Amount = $notify["Amount"];
        //支付状态
        $Succeed = $notify["Succeed"];
        //支付结果
        $Result = $notify["Result"];
        //取得的MD5校验信息
        $SignInfo = $notify["SignInfo"]; 
        //备注
        $Remark = $notify["Remark"];
        //校验源字符串
        $md5src = "MerNo=".$this->config['partner']."&BillNo=".$BillNo."&OrderNo=".$notify['OrderNo']."&Amount=".$Amount."&Succeed=".$Succeed."&".$MD5key;
        //MD5检验结果
        $md5sign = strtoupper(md5($md5src));

        if ($SignInfo==$md5sign){
            if ($Succeed=="88") {
                return $BillNo;
            }
        }else{
            return false;
        }
    }

    

}
