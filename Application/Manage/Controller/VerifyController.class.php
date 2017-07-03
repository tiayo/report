<?php

namespace Manage\Controller;

use Think\Controller;

class VerifyController extends Controller
{
    /**
     * 生成验证码
     */
    public function generate(){
        //清除缓存
        ob_clean();

        $Verify = new \Think\Verify();

        //验证码字体大小
        $Verify->fontSize = 20;

        //验证码位数
        $Verify->length = 4;

        $Verify->useNoise = false;

        $Verify->useCurve = false;

        $Verify->codeSet = '0123456789';

        $Verify->entry();
    }

    /**
     * 检验验证码
     */
    public function check_code($code){
        //实例化
        $verify = new \Think\Verify();

        //验证
        if($verify->check($code)){
            return true;
        }else{
            return false;
        }
    }
}