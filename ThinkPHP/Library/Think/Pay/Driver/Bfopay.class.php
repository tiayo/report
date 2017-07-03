<?php

namespace Think\Pay\Driver;

class Bfopay extends \Think\Pay\Pay {

    protected $gateway = 'http://tgw.bfopay.com/payindex';
    public $config = array(
        'TerminalID' => '10000001'
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

        $params = array(
            'TerminalID' => $this->config['TerminalID'], 
            'InterfaceVersion' => "4.0",
            'KeyType' => "1",

            'MemberID'  =>  $this->config['partner'],//商户号
            'TransID'  => $order_no,//流水号
            'PayID'  =>  $_POST['Bank_Code'],//支付方式
            'TradeDate'  => date("Ymdhis"),//交易时间
            'OrderMoney'  =>  $Amount*100,//订单金额
            'ProductName'  =>  '账户入金',//产品名称
            'Amount'  =>  1,//商品数量
            'Username'  =>  '',//支付用户名
            'AdditionalInfo'  =>  '',//订单附加消息
            'PageUrl'  =>  $this->config['return_url'],//通知商户页面端地址
            'ReturnUrl'  =>  $this->config['notify_url'],//服务器底层通知地址
            'NoticeType'  =>  1,//通知类型 
            'Md5key' => $this->config['key']//md5密钥（KEY）
        );

        return array('params'=>$params,'amount'=>$Amount,'orderno'=>$params['TransID']);
            
    }

    public function buildRequestForm($params) {


        $MemberID = $params['MemberID'];//商户号
        $TransID =$params['TransID'];//流水号
        $PayID = $params['PayID'];//支付方式
        $TradeDate = $params['TradeDate'];//交易时间
        $OrderMoney = $params['OrderMoney'];//订单金额
        $ProductName = $params['ProductName'];//产品名称
        $Amount = $params['Amount'];//商品数量
        $Username = $params['Username'];//支付用户名
        $AdditionalInfo = $params['AdditionalInfo'];//订单附加消息
        $PageUrl = $params['PageUrl'];//通知商户页面端地址
        $ReturnUrl = $params['ReturnUrl'];//服务器底层通知地址
        $NoticeType = $params['NoticeType'];//通知类型 
        $Md5key=$params['Md5key'];//md5密钥（KEY）
        $MARK = "|";
        //MD5签名格式
        $params['Signature']=md5($MemberID.$MARK.$PayID.$MARK.$TradeDate.$MARK.$TransID.$MARK.$OrderMoney.$MARK.$PageUrl.$MARK.$ReturnUrl.$MARK.$NoticeType.$MARK.$Md5key);
        

        $sHtml = $this->_buildForm($params);
        return $sHtml;
    }


    Public function verifyNotify($notify){

        $MemberID=$this->config['partner'];//商户号
        $TerminalID =$notify['TerminalID'];//商户终端号
        $TransID =$notify['TransID'];//流水号
        $Result=$notify['Result'];//支付结果
        $ResultDesc=$notify['ResultDesc'];//支付结果描述
        $FactMoney=$notify['FactMoney'];//实际成功金额
        $AdditionalInfo=$notify['AdditionalInfo'];//订单附加消息
        $SuccTime=$notify['SuccTime'];//支付完成时间
        $Md5Sign=$notify['Md5Sign'];//md5签名
        $Md5key = $this->config['key'];
        $MARK = "~|~";
        //MD5签名格式
        $WaitSign=md5('MemberID='.$MemberID.$MARK.'TerminalID='.$TerminalID.$MARK.'TransID='.$TransID.$MARK.'Result='.$Result.$MARK.'ResultDesc='.$ResultDesc.$MARK.'FactMoney='.$FactMoney.$MARK.'AdditionalInfo='.$AdditionalInfo.$MARK.'SuccTime='.$SuccTime.$MARK.'Md5Sign='.$Md5key);
        if ($Md5Sign == $WaitSign) {
            return $TransID;
        } else {
           return false;
        } 
    }

    

}
