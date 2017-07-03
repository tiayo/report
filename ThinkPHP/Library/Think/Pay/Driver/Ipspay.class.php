<?php

/**
 * 环迅支付
 */

namespace Think\Pay\Driver;

class Ipspay extends \Think\Pay\Pay {

    protected $gateway = 'https://newpay.ips.com.cn/psfp-entry/gateway/payment.do';
    public $config = array(
        'Account' => '1828290013'
    );

    public function buildParams(){

        $Amount = floatval(get_exchange($_POST['Amount']));
        $order_no = $this->createOrderNo();
        $order_time = date('YmdHis',time());     

        $params = array(
            'Version' => 'v1.0.0',
            'MerCode' => $this->config['partner'], 
            'MerName' => '',
            'Account' => $this->config['Account'],
            'MsgId' => $remark,
            'ReqDate' => $order_time,

            'MerBillNo' => $order_no,
            'GatewayType' => '01',
            'Date' => date('Ymd',time()),   
            'CurrencyType' => 156,
            'Amount' => $Amount,
            'Lang' => 'GB',
            'Merchanturl' => $this->config['return_url'], 
            'FailUrl' => $this->config['return_url'], 
            'Attach' => '',
            'OrderEncodeType' => 5,
            'RetEncodeType' => 17,
            'RetType' => 1,
            'ServerUrl' => $this->config['notify_url'],   
            'BillEXP' => null,
            'GoodsName' => '账户入金',
            'IsCredit' => 1,
            'BankCode' => $_POST['Bank_Code'],   
            'ProductType' => 1
        );
           
        
        return array('params'=>$params,'amount'=>$params['Amount'],'orderno'=>$params['MerBillNo']);
    }


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("智付设置有误！");
        }
        return true;
    }

    public function buildRequestForm($params) {
        header("Content-type:text/html;charset=utf8");
        $str = '<body><MerBillNo>'.$params['MerBillNo'].'</MerBillNo>'.
                '<Amount>'.$params['Amount'].'</Amount>'.
                '<Date>'.$params['Date'].'</Date>'.
                '<CurrencyType>'.$params['CurrencyType'].'</CurrencyType>'.
                '<GatewayType>'.$params['GatewayType'].'</GatewayType>'.
                '<Lang>'.$params['Lang'].'</Lang>'.
                '<Merchanturl><![CDATA['.$params['Merchanturl'].']]></Merchanturl>'.
                '<FailUrl><![CDATA[]]></FailUrl>'.
                '<Attach><![CDATA['.$params['Attach'].']]></Attach>'.
                '<OrderEncodeType>'.$params['OrderEncodeType'].'</OrderEncodeType>'.
                '<RetEncodeType>'.$params['RetEncodeType'].'</RetEncodeType>'.
                '<RetType>'.$params['RetType'].'</RetType>'.
                '<ServerUrl><![CDATA['.$params['ServerUrl'].']]></ServerUrl>'.
                '<BillEXP>'.$params['BillEXP'].'</BillEXP>'.
                '<GoodsName>'.$params['GoodsName'].'</GoodsName>'.
                '<IsCredit>'.$params['IsCredit'].'</IsCredit>'.
                '<BankCode>'.$params['BankCode'].'</BankCode>'.
                '<ProductType>'.$params['ProductType'].'</ProductType></body>';

        $Signature = md5($str.$params['MerCode'].$this->config['key']);
        $gateway = empty($this->config['url']) ?  $this->gateway : $this->config['url'];
        $sHtml = '<form name="MerOrder" id="MerOrder" method="post" action="'.$gateway.'">'.
                    '<input type="hidden" name="pGateWayReq" value="'.
                            '<Ips>'.
                                '<GateWayReq>'.
                                    '<head>'.
                                        '<Version>v1.0.0</Version>'.
                                        '<MerCode>'.$params['MerCode'].'</MerCode>'.
                                        '<MerName></MerName>'.
                                        '<Account>'.$params['Account'].'</Account>'.
                                        '<MsgId></MsgId>'.
                                        '<ReqDate>'.$params['ReqDate'].'</ReqDate>'.
                                        '<Signature>'.$Signature.'</Signature>'.
                                    '</head>'.$str.
                                '</GateWayReq>'.
                            '</Ips>"/>'.
                '</form><script>document.forms["MerOrder"].submit();</script>';

        return $sHtml;
    }

    public function verifyNotify($notify) {

        // $notify = array(
        //     'paymentResult' => '<Ips><GateWayRsp><head><ReferenceID></ReferenceID><RspCode>000000</RspCode><RspMsg><![CDATA[交易成功！]]></RspMsg><ReqDate>20170109132708</ReqDate><RspDate>20170109132928</RspDate><Signature>556092734f855de0d5f36adced0fe499</Signature></head><body><MerBillNo>H1093962571677d</MerBillNo><CurrencyType>156</CurrencyType><Amount>0.01</Amount><Date>20170109</Date><Status>Y</Status><Msg><![CDATA[支付成功！]]></Msg><IpsBillNo>BO2017010913270862369</IpsBillNo><IpsTradeNo>2017010913270842514</IpsTradeNo><RetEncodeType>17</RetEncodeType><BankBillNo>70021150000066924</BankBillNo><ResultType>0</ResultType><IpsBillTime>20170109132927</IpsBillTime></body></GateWayRsp></Ips>'
        // );


        //商户号
        $mercode = $this->config['partner'];
        //MD5证书
        $md5key = $this->config['key'];
        //获取返回的参数
        $paymentResult  = $notify['paymentResult'];

        //记录LOG
        //xml对象载入
        $xml=simplexml_load_string($paymentResult,'SimpleXMLElement', LIBXML_NOCDATA);
        $head = get_object_vars($xml->GateWayRsp->head);
        $body = get_object_vars($xml->GateWayRsp->body);
        //响应编码
        // $RspCodes = $xml->xpath('GateWayRsp/head/RspCode');
        $RspCode = $head['RspCode'];
        //返回数字签名
        // $Signatures = $xml->xpath('GateWayRsp/head/Signature');
        $Signature = $head['Signature'];
        //订单号
        // $MerBillNos = $xml->xpath('GateWayRsp/body/MerBillNo');
        $MerBillNo = $body['MerBillNo'];
        //订单金额
        // $Amounts = $xml->xpath('GateWayRsp/body/Amount');
        // $Amount = $Amounts[0];
         //判断状态码
        if ($RspCode  == '000000'){
            //本地数字签名明文
            $org = substr($paymentResult,strpos($paymentResult,"<body>"),strpos($paymentResult,"</GateWayRsp>")-strpos($paymentResult,"<body>"));
            //本地数字签名
            $localmd5 = MD5($org.$mercode.$md5key);
            //判断订单签名
            if ($localmd5==$Signature){

                return $MerBillNo;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }


    

}
