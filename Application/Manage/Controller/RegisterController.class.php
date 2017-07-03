<?php

namespace Manage\Controller;

use Manage\Middleware\Guest;
use Manage\Service\RegisterService;
use Think\Controller;

class RegisterController extends Controller
{
    protected $register;

    public function __construct()
    {
        parent::__construct();

        //实例化业务
        $this->register = new RegisterService();

        //中间件
        if (!Guest::check()) {
            redirect('/');
        }
    }

    public function index()
    {
        //传入历史输入
        $this->assign('old_input', session('old_input'));

        //传入错误session
        $this->assign('register_error', session('register.error') ? : null);

        //删除session
        session('register.error', null);
        session('old_input', null);

        $this->display();
    }

    public function register()
    {
        $post = I('post.');

        try{
            $user = $this->register->register($post);
        } catch (\Exception $e) {
            session('register.error', $e->getMessage());
            redirect('/manage/register');
        }

        //直接登录
        session('user', $user);
        session('user.status', 1);

        //跳转
        redirect('/');
    }
}