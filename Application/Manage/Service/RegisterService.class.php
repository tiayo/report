<?php

namespace Manage\Service;

use Manage\Controller\VerifyController;
use Manage\Model\UsersModel;
use Phpass\Hash;
use Phpass\Hash\Adapter\Pbkdf2;

class RegisterService
{
    protected $register;
    protected $verify;

    public function __construct()
    {
        $this->register = new UsersModel();
        $this->verify = new VerifyController();
    }

    /**
     * 注册处理
     *
     * @param $value
     * @return mixed
     * @throws \Exception
     */
    public function register($value)
    {
        //记录历史输入
        session('old_input', $value);

        //验证验证码
        if (!$this->verify->check_code($value['verify'])) {
            throw new \Exception('验证码错误');
        }

        //自动验证
        if (!$this->register->create($value, 4)) {
            throw new \Exception($this
                ->register->getError());
        }

        //实例化加密密码的类
        $adapter = new Pbkdf2(array ('iterationCount' => 15000));
        $phpassHash = new Hash($adapter);

        //写入数据库数组
        $map['name'] = $value['name'];
        $map['password'] = $phpassHash->hashPassword($value['password']);
        $map['created_at'] = date('Y-m-d H:i:s');
        $map['updated_at'] = date('Y-m-d H:i:s');

        //返回执行结果
        return $this->register->add($map);
    }
}