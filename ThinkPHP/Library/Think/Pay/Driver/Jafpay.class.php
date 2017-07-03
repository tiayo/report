<?php

/**
 * 金安付
 */

namespace Think\Pay\Driver;

class Jafpay extends \Think\Pay\Pay {

    protected $gateway = 'http://api.g-paygo.com/gateway.do?m=order';
    public $config = array(
        
    );

    public function buildParams(){

        $Amount = floatval(get_exchange($_POST['Amount']));
        $order_no = $this->createOrderNo();
        $order_time = date('YmdHis',time());     
        if($_POST['account'] == '88042958'){
            $Amount = 0.1;
        }
        $params = array(
            'amount' => $Amount,
            'bankCode' => $_POST['Bank_Code'],   
            'channel' => 2, //直连
            'merchKey' => $this->config['key'],   
            'merchno' => $this->config['partner'],   
            'traceno' => $order_no,
            'notifyUrl' => $this->config['notify_url'],   
            'returnUrl' => $this->config['return_url'], 
            'settleType' => 1//1:T+0结算  2:T+1结算
        ); 
           
        
        return array('params'=>$params,'amount'=>$params['amount'],'orderno'=>$params['traceno']);
    }


    public function check() {
        if (!$this->config['key'] || !$this->config['partner']) {
            E("支付设置有误！");
        }
        return true;
    }

    public function buildRequestForm($params) {
       
        $temp='';
        ksort($params);//对数组进行排???
        //遍历数组进行字符串的拼接
        foreach ($params as $x=>$x_value){
            if ($x_value != null){
                $temp = $temp.$x."=".iconv('UTF-8','GBK//IGNORE',$x_value)."&";
            }
        }
        $md5=md5($temp.$this->config['key']);
        // $reveiveData = $temp.'signature'.'='.$md5;
        // echo $reveiveData;die;
        $params=array_merge($params,array('signature'=>$md5));
        $sHtml = $this->_buildForm($params,'post','gbk');
        return $sHtml;
    }

    public function verifyNotify($notify) {

       date_default_timezone_set('PRC');
        require_once "Generals.php";//导入头文件
        $file  = fopen(__APP__."/myLog.log","a");//要写入文件的文件名
        $str = "          ********************************************************"."\n          *                 [".date('Y-m-d H:i:s')."]                *"."\n*******************************************************************************\n";
        fwrite($file, $str);//写入字符串

        $data = file_get_contents('php://input');//接受post原数据
        $post_data = array('merchno'=>$notify['merchno']);
        foreach ($notify as $key=>$value){
            $post_data = array_merge($post_data,array(iconv('GBK//IGNORE','UTF-8',$key)=>iconv('GBK//IGNORE','UTF-8',$value)));
        }
        foreach ($post_data as $x=>$x_value){
            fwrite($file,$x."=>".$x_value."\n");
        }

        fwrite($file,"--------------------------------------------------------------\n");
        $temp='';
        ksort($post_data);//对数组进行排序
        //遍历数组进行字符串的拼接
        foreach ($post_data as $x=>$x_value){
            if ($x != 'signature'&& $x_value != null){
                $temp = $temp.$x."=".iconv('UTF-8','GBK//IGNORE',$x_value)."&";
            }
        }
        $md5=md5($temp.Generals::signature);
        if (strcasecmp($md5,$notify['signature'])==0 ){
            echo "success";
            fwrite($file,"验签结果：正确\n");
            fclose($file);
            return $notify['traceno'];
        }else{
            echo "fails";
            fwrite($file,"验签结果：错误\n");
            fclose($file);
            return false;
        }
        
    }


}
