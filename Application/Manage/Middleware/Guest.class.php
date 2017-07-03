<?php

namespace Manage\Middleware;

class Guest
{
    public static function check()
    {
        //获取会员数据
        $user = session('user');

        //判断登录状态
        if (!empty($user) && $user['status'] == 1) {
            return false;
        }

        return true;
    }
}
