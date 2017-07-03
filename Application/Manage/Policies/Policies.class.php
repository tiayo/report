<?php

namespace Manage\Policies;


use Manage\Model\UsersModel;

class Policies
{
    protected $user;
    protected $policies;

    public function __construct()
    {
        //实例化用户表model
        $this->user = new UsersModel();

        //获取权限表设置
        $this->policies = C('POLICISE');
    }


    /**
     * 判断用户激活状态
     *
     * @param $user_id
     */
    public function status($user_id)
    {
        //获取status
        $status = $this->user->field('status')->where('id = %d', $user_id)->find()['status'] ? : 0;

        if ($status === 1) {
            return true;
        }

        return false;
    }

    /**
     * 判断是否为超级管理员
     *
     * @param $user_id
     * @return bool
     */
    public function isAdmin($user_id)
    {
        //获取超级管理员配置
        $super_admin = $this->policies['SUPER_ADMIN_ID'];

        foreach ($super_admin as $value) {
            if ($value == $user_id) {
                return true;
            }
        }

        return false;
    }

    public function can($user_id, $option)
    {
        //获取用户组
        $group = $this->user->field('group')->where('id = %d', $user_id)->find()['group'] ? : 0;

        //超级管理员跳过验证
        if ($this->isAdmin($user_id)) {
            return true;
        }

        //获取权限组名
        $type = $this->policies['LIST'][$group];

        //权限组
        $can = $this->policies[$type];

        foreach ($can as $item) {
            if ($item == $option) {
                return true;
            }
        }

        return false;
    }
}