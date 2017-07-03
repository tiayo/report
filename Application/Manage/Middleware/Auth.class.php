<?php

namespace Manage\Middleware;

class Auth
{
    public static function check()
    {
        //获取会员数据
        $user = session('user');

        //判断登录状态
        if (empty($user) || $user['status'] != 1) {
            redirect('/Manage/login');
        }

        return true;
    }
}
