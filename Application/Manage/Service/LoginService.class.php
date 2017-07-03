<?php

namespace Manage\Service;

use Manage\Controller\VerifyController;
use Manage\Model\UsersModel;
use Phpass\Hash;
use Phpass\Hash\Adapter\Pbkdf2;

class LoginService
{
    protected $users;
    protected $verify;

    public function __construct()
    {
        $this->users = new UsersModel();
        $this->verify = new VerifyController();
    }

    public function login($value)
    {
        //验证验证码
        if (!$this->verify->check_code($value['verify'])) {
            throw new \Exception('验证码错误');
        }

        //记录用户输入
        session('old_input', $value);

        //取出数据
        $username = $value['username'];
        $password = $value['password'];

        //取出会员信息
        $user = $this->users
            ->where("name = '%s'", $username)
            ->find();

        //找不到密码
        if (empty($user)) {
            throw new \Exception('平台商不存在或输入错误!');
        }

        //数据库存储密码
        $origin_password = $user['password'];

        //密码核验(失败抛错)
        $adapter = new Pbkdf2(array ('iterationCount' => 15000));
        $phpassHash = new Hash($adapter);
        if (!$phpassHash->checkPassword($password, $origin_password)) {
            throw new \Exception('密码错误!');
        }

        //登录记录
        session('user', $user);
        session('user.status', 1);

        //跳转到首页
        redirect('/');
    }
}