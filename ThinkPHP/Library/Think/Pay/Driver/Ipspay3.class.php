<?php

/**
 * 环迅支付
 */

namespace Think\Pay\Driver;

class Ipspay3 extends \Think\Pay\Pay {

    protected $gateway = 'https://pay.ips.com.cn/ipayment.aspx';
    public $config = array(
        
    );

    public function buildParams(){

        $Amount = number_format(floatval(get_exchange($_POST['Amount'])), 2, '.', '');
        $order_no = $this->createOrderNo();

        $params = array(
            'Mer_code' => $this->config['partner'], 
            'Billno' => $order_no,
            'Amount' => $Amount,
            'Date' => date('Ymd',time()),   
            'Currency_Type' => 'RMB',
            'Gateway_Type' => '01',
            'Lang' => 'GB',
            'Merchanturl' => $this->config['return_url'], 
            'FailUrl' => $this->config['return_url'], 
            'Attach' => '',
            'OrderEncodeType' => 5,
            'RetEncodeType' => 17,
            'Rettype' => 1,
            'ServerUrl' => $this->config['notify_url'], 
            'DoCredit' => 1,
            'Bankco' => $_POST['Bank_Code']   
        );
           
        
        return array('params'=>$params,'amount'=>$params['Amount'],'orderno'=>$params['Billno']);
    }


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("智付设置有误！");
        }
        return true;
    }

    public function buildRequestForm($params) {

        $orge = 'billno'.$params['Billno'].'currencytype'.$params['Currency_Type'].'amount'.$params['Amount'].'date'.$params['Date'].'orderencodetype'.$params['OrderEncodeType'].$this->config['key'] ;
        $params['SignMD5'] = md5($orge) ;
       
        $sHtml = $this->_buildForm($params);

        return $sHtml;
    }

    public function verifyNotify($notify) {

        $billno = $notify['billno'];
        $amount = $notify['amount'];
        $mydate = $notify['date'];
        $succ = $notify['succ'];
        $msg = $notify['msg'];
        $attach = $notify['attach'];
        $ipsbillno = $notify['ipsbillno'];
        $retEncodeType = $notify['retencodetype'];
        $currency_type = $notify['Currency_type'];
        $signature = $notify['signature'];

        //'----------------------------------------------------
        //'   Md5摘要认证
        //'   verify  md5
        //'----------------------------------------------------

        //RetEncodeType设置为17（MD5摘要数字签名方式）
        //交易返回接口MD5摘要认证的明文信息如下：
        //billno+【订单编号】+currencytype+【币种】+amount+【订单金额】+date+【订单日期】+succ+【成功标志】+ipsbillno+【IPS订单编号】+retencodetype +【交易返回签名方式】+【商户内部证书】
        //例:(billno000001000123currencytypeRMBamount13.45date20031205succYipsbillnoNT2012082781196443retencodetype17GDgLwwdK270Qj1w4xho8lyTpRQZV9Jm5x4NwWOTThUa4fMhEBK9jOXFrKRT6xhlJuU2FEa89ov0ryyjfJuuPkcGzO5CeVx5ZIrkkt1aBlZV36ySvHOMcNv8rncRiy3DQ)

        //返回参数的次序为：
        //billno + mercode + amount + date + succ + msg + ipsbillno + Currecny_type + retencodetype + attach + signature + bankbillno
        //注2：当RetEncodeType=17时，摘要内容已全转成小写字符，请在验证的时将您生成的Md5摘要先转成小写后再做比较
        $content = 'billno'.$billno.'currencytype'.$currency_type.'amount'.$amount.'date'.$mydate.'succ'.$succ.'ipsbillno'.$ipsbillno.'retencodetype'.$retEncodeType;
        //请在该字段中放置商户登陆merchant.ips.com.cn下载的证书
        $cert = $this->config['key'];
        $signature_1ocal = md5($content . $cert);

        if ($signature_1ocal == $signature){
            if ($succ == 'Y'){
                return  $billno;
            }else{
                return false;
            }
        }else{
            echo '签名不正确！';
            exit;
        }
    }

    

}
